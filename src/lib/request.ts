import { getLogger } from './logger'
import { sleep } from './utils'

const { log, captureError } = getLogger('request')

const MAX_RETRIES = 5
const BASE_DELAY_MS = 2000

class RequestError extends Error {
  status: number
  statusText: string
  headers: Record<string, string>
  url: string
  method: string
  requestBody?: BodyInit | null
  responseBody?: string

  constructor(
    message: string,
    opts: {
      status: number
      statusText: string
      headers: Record<string, string>
      url: string
      method: string
      requestBody?: BodyInit | null
      responseBody?: string
    }
  ) {
    super(`HTTP Error ${opts.status}: ${message}`)
    this.name = 'HttpError'
    this.status = opts.status
    this.statusText = opts.statusText
    this.headers = opts.headers
    this.url = opts.url
    this.method = opts.method
    this.requestBody = opts.requestBody
    this.responseBody = opts.responseBody
  }
}

export async function request<T = unknown>(
  url: string,
  {
    method = 'GET',
    data,
    authToken,
    includeCredentials = false,
    headers: headersInit,
  }: {
    method?: Request['method']
    data?: object
    authToken?: string
    includeCredentials?: boolean
    headers?: Record<string, string>
  } = {}
): Promise<T> {
  const headers = new Headers(headersInit)

  headers.set('Accept', 'application/json')

  if (data) {
    headers.set('Content-Type', 'application/json')
  }
  if (authToken) {
    // headers.set('Authorization', `Bearer ${authToken}`)
    headers.set('Authorization', `${authToken}`)
  }

  const opts: RequestInit = {
    headers,
    method,
    credentials: includeCredentials ? 'include' : 'same-origin',
  }

  if (data) {
    opts.body = JSON.stringify(data)
  }

  log('request', { url, opts })

  const response = await fetch(url, opts)

  if (response.ok && response.status >= 200 && response.status < 300) {
    return await response.json()
  }

  const errorBody = await response.text()
  let errorMessage = response.statusText || 'Unknown error occurred'

  try {
    const errorJson = JSON.parse(errorBody)
    if (errorJson.error) {
      errorMessage = errorJson.error
    }
  } catch {
    if (errorBody) {
      errorMessage = errorBody
    }
  }

  const customError = new RequestError(errorMessage, {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(
      [...response.headers.keys()].map((key) => [
        key.toLowerCase(),
        response.headers.get(key) ?? '',
      ])
    ),
    url: response.url,
    method: method,
    requestBody: opts.body,
    responseBody: errorBody,
  })

  captureError(customError)

  throw customError
}

export interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  getRetryDelay?: (
    error: RequestError,
    retryCount: number,
    baseDelay: number
  ) => number | null | undefined
  rateLimitResetHeader?: string
}

/**
 * Wraps a request function with retry logic.
 * Can be used to retry after hitting rate limits.
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const {
    maxRetries = MAX_RETRIES,
    baseDelay = BASE_DELAY_MS,
    getRetryDelay,
    rateLimitResetHeader = 'retry-after',
  } = options

  let retries = 0

  const calculateDelay = (error: RequestError): number | null => {
    // Handle rate limit responses
    if (error?.status === 429 && error?.headers) {
      const retryAfter = error.headers[rateLimitResetHeader]

      console.log('retryAfter', { retryAfter, error })
      if (retryAfter) {
        return parseInt(retryAfter, 10) * 1000
      }
    }

    const calcDelay = getRetryDelay?.(error, retries, baseDelay)

    // If getRetryDelay returns undefined (or isn't provided), use the default exponential backoff
    if (calcDelay === undefined) {
      return baseDelay * Math.pow(2, retries)
    }

    return calcDelay
  }

  while (true) {
    try {
      return await fn()
    } catch (error) {
      if (retries >= maxRetries || !(error instanceof RequestError)) {
        throw error
      }

      const delayMs = calculateDelay(error as RequestError)
      if (delayMs === null) {
        throw error
      }

      log('request retry', { retries, delayMs, error })

      await sleep(delayMs)
      retries++
    }
  }
}
