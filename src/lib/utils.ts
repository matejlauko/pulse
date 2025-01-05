export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function decodeHTMLEntities(str: string) {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
}
