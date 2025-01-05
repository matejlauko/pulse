import { Post, type IPost } from '@/post'
import { postsStore } from '@/posts'
import { runInAction } from 'mobx'
import { sleep } from './utils'

const posts = [
  {
    id: 'f751e954-efb4-46e6-84fe-5694ec89a507',
    title: 'Linear &lt;-&gt; Asana sync?',
    text: 'We are a software development agency and use Linear internally throughout our organization. We have a client who uses Asana and wants us to keep their Asana project up to date with the information that\'s in our Linear. That will require us to manage two systems, and the client is not willing to pay for extra management time.\n\nBefore we tell them we cannot use Asana, I wanted to see if there might be a way to sync Asana and Linear, with Linear being the "master" system to override any conflicts that might occur.\n\nZaiper or [Relay.app](http://Relay.app) might work. Has anyone used either of these? Any other options?',
    authorName: 'sixpsllc',
    source: 'reddit',
    sourceCreatedAt: '2025-01-01T16:56:36.000Z',
    sourceUrl: 'https://www.reddit.com/r/Linear/comments/1hr6wde/linear_asana_sync/',
    sourceId: '1hr6wde',
  },
  {
    id: '18d2c055-2eed-43f6-bce1-64da258ad55f',
    title: 'I made a linux port of Linear for the community!',
    text: "Hey i've just tried Linear yesterday (on my mac) and i loved it! But i like to transfer my productivity across multiple devices. And i wanted it on my linux machine as well. Sadly Linear didn't come with a linux version of it. And they mentioned on a tweet they don't plan to.\n\nBut i made a very simple electron app that just runs the website.  \nHere is the Repo: [https://github.com/kleo-dev/linear-linux](https://github.com/kleo-dev/linear-linux)",
    authorName: 'KlestiSelimaj',
    source: 'reddit',
    sourceCreatedAt: '2024-12-30T10:43:28.000Z',
    sourceUrl:
      'https://www.reddit.com/r/Linear/comments/1hpkmxh/i_made_a_linux_port_of_linear_for_the_community/',
    sourceId: '1hpkmxh',
  },
  {
    id: '3d7b7238-33e9-4040-962b-fc742d81c6ad',
    title: 'Email verification not sending (to my icloud email)',
    text: "currently i'm using gmail but i want to switch to my icloud email, i need to verify it, i'm checking my inbox, nothing",
    authorName: 'KlestiSelimaj',
    source: 'reddit',
    sourceCreatedAt: '2024-12-29T20:52:25.000Z',
    sourceUrl:
      'https://www.reddit.com/r/Linear/comments/1hp5it9/email_verification_not_sending_to_my_icloud_email/',
    sourceId: '1hp5it9',
  },
  {
    id: '25fda5bd-07b3-4f7b-9c85-535399212e47',
    title: 'Anyone using Linear for a development agency?',
    text: 'Our company is using ClickUp right now for managing everything (tasks, docs, wiki, etc.). But as many of you might know, it can often feel laggy, slow, and… well, frustrating to use at times. So, we’re looking for something better.\n\nI’ve been checking out Linear for a while. I really like how it looks, their changelog is quite active, and I’ve heard a lot of good things about it—especially from SaaS companies. It seems really impressive!\n\nBut here’s the thing: we’re a web and mobile development studio. We work with a lot of different customers and run many projects every year. I’m not sure how well Linear works for a service company like ours, and I was hoping to get some advice.\n\n- Has anyone here used Linear for managing client projects?\n- How do you organize it for multiple clients and tasks?\n- Are you happy with it for this kind of work?\n\nI’d love to hear your thoughts, especially if you’ve faced similar challenges and found ways to make it work. \n\nThanks so much! And Merry Christmas 🎄 ',
    authorName: 'vrybakk',
    source: 'reddit',
    sourceCreatedAt: '2024-12-26T08:50:23.000Z',
    sourceUrl:
      'https://www.reddit.com/r/Linear/comments/1hmkhfn/anyone_using_linear_for_a_development_agency/',
    sourceId: '1hmkhfn',
  },
  {
    id: '36d36032-a0ad-4bc5-aa89-de210da34225',
    title: 'Can I hide specific members from cycles?',
    text: 'We have some contractors using Linear, but they aren\'t participating in the "cycles" and aren\'t in the meetings where we do sprint planning. How can I hide them from the Cycles so that we can see a more accurate cycle completion percentage?',
    authorName: 'CultureExpensive4245',
    source: 'reddit',
    sourceCreatedAt: '2024-12-19T04:23:57.000Z',
    sourceUrl:
      'https://www.reddit.com/r/Linear/comments/1hhkpcw/can_i_hide_specific_members_from_cycles/',
    sourceId: '1hhkpcw',
  },
  {
    id: '6f93e4a7-0163-4418-b3a0-b22fabad80eb',
    title: 'Anyone built a (g)mail integration yet?',
    text: 'thinking very simple feature\n\n- Button to "create task from email" which pops up team selector &amp; then sends to linear\n- also adds link to email so user can click back directly into thread from linear',
    authorName: 'dutchfire-cadu',
    source: 'reddit',
    sourceCreatedAt: '2024-12-18T16:47:15.000Z',
    sourceUrl:
      'https://www.reddit.com/r/Linear/comments/1hh5rio/anyone_built_a_gmail_integration_yet/',
    sourceId: '1hh5rio',
  },
  {
    id: 'ea9225df-a8c2-4729-b427-05be3454cd15',
    title: 'How to plan cooldowns?',
    text: 'Our team works in three-week cycles, followed by a one-week cooldown period. During this cooldown, we typically focus on lower-priority tasks, experimentation, or cleanup activities that didn’t quite fit into the main cycle. It’s a critical part of our workflow, giving us space to recharge, address lingering issues, and explore ideas that wouldn’t otherwise make the cut.\n\nHowever, we’ve run into a frustrating limitation: it doesn’t seem possible to assign issues specifically to a cooldown. This makes tracking and planning for these periods much harder than it needs to be, and honestly, makes the feature unusable for us. Ideally, we’d love a feature that allows us to tag or assign tasks directly to cooldowns, similar to how we handle cycles.\n\nAs a workaround, we’ve resorted to using four-week cycles and adding a “cooldown” label to tasks we want to tackle during that week. While this technically gets the job done, it makes our planning process more cumbersome and less intuitive.\n\nDoes anyone else work in a similar cadence? How do you manage planning for cooldowns or off-cycle work? I’d love to hear your thoughts or suggestions!',
    authorName: 'sineandsaw',
    source: 'reddit',
    sourceCreatedAt: '2024-12-18T15:18:09.000Z',
    sourceUrl: 'https://www.reddit.com/r/Linear/comments/1hh3s41/how_to_plan_cooldowns/',
    sourceId: '1hh3s41',
  },
  {
    id: '4337efba-00d1-4e64-b006-b010aede45ec',
    title: 'Any thoughts on creating the typing interface to be more like Notion?',
    text: "My team and I use Linear pretty religiously but there are a few things that we think would make our experience better.\n\nFor example, I've noticed that the arrows don't always render properly. Sometimes typing `-&gt;` will render to a right arrow nicely, but other times it doesn't.\n\nAnother thing is that I've noticed that we're unable to create bullet lists within to-do lists. We often right explanations or comments about to-do list points as bullet lists.\n\nIs there any more demand for this kind of thing?",
    authorName: 'Seankala',
    source: 'reddit',
    sourceCreatedAt: '2024-12-18T07:01:00.000Z',
    sourceUrl:
      'https://www.reddit.com/r/Linear/comments/1hgw4cf/any_thoughts_on_creating_the_typing_interface_to/',
    sourceId: '1hgw4cf',
  },
  {
    id: '63243063-9bee-47b1-9597-a8fbc430d2ba',
    title: 'Difficulty with selecting text that requires scrolling in a code block',
    text: 'I absolutely love how slick Linear is in its design. The user interface is clean and ergonomic.\n\nHowever, I\'m running into particular usability issues with the editor (especially when formatting content) and also a major issue selecting text to copy out of a code block when the text is wider than the box.\n\nThis is beyond aggravating, as it is not obvious how to copy content with the intention of pasting it into a terminal.\n\nThe expected behavior is that it would let you scroll all the way to the right or the left as you\'re selecting the text that you need (like on GitHub, for example).\n\nIn this case, I was only able to select as far as: `experimental/android-dev git@`\n\nScreenshot: https://ibb.co/hRMgSpX\n\nLinear version: `{ BUILD_REVISION: "33593", CLIENT_VERSION_HASH: "eaa370d626f29f3ed2df", DEPLOYED_AT: "2024-12-17T06:32:29+0000", SHORT_SHA: "683d599d" }`',
    authorName: '[deleted]',
    source: 'reddit',
    sourceCreatedAt: '2024-12-17T07:09:21.000Z',
    sourceUrl:
      'https://www.reddit.com/r/Linear/comments/1hg57m0/difficulty_with_selecting_text_that_requires/',
    sourceId: '1hg57m0',
  },
  {
    id: 'e6266624-beb1-41b6-afd8-b7b977f8102f',
    title: 'Feature Request: Copy ID as link',
    text: 'Hi guys!\n\nOur team just moved from Jira to Linear. Great UX, love it!\n\nI\'m missing a single feature: **Copying a linked issue ID**, I\'m using this a lot all over the place in docs, comments, threads, daily/weekly reports, to reference an issue.\n\nYou can "Copy ID" (`CMD + .`, no link), you can "Copy title as link" (`CMD + C`, links to the issue), but you can\'t "Copy ID as link".\n\nIn Jira I was using a hack: Right click on the issue ID in the breadcrumb at the top (this would select the entire linked issue ID, this is a MacOS system feature), ignore the contextual menu, and use `CMD + C` \\\\-&gt; this would give me an Issue ID with a link on it, that would maintain the link when posted anywhere (eg: Slack, docs, etc).\n\nIn Linear, right click won\'t select me the issue ID, it would only open the custom Linear-made contextual menu. (which is cool BTW)\n\nTemporarily, I\'m using "Copy title as link" and just deleting the issue title that\'s appended at the end, but it\'s as annoying as long the title is. :D\n\nThanks in advance, really appreciated!',
    authorName: 'artur99',
    source: 'reddit',
    sourceCreatedAt: '2024-12-16T14:01:20.000Z',
    sourceUrl: 'https://www.reddit.com/r/Linear/comments/1hfjq7v/feature_request_copy_id_as_link/',
    sourceId: '1hfjq7v',
  },
] as const satisfies IPost[]

const categories = [
  ['f751e954-efb4-46e6-84fe-5694ec89a507', 'request'],
  ['18d2c055-2eed-43f6-bce1-64da258ad55f', 'other'],
  ['3d7b7238-33e9-4040-962b-fc742d81c6ad', 'bug'],
  ['25fda5bd-07b3-4f7b-9c85-535399212e47', 'other'],
  ['36d36032-a0ad-4bc5-aa89-de210da34225', 'question'],
  ['6f93e4a7-0163-4418-b3a0-b22fabad80eb', 'request'],
  ['ea9225df-a8c2-4729-b427-05be3454cd15', 'other'],
  ['4337efba-00d1-4e64-b006-b010aede45ec', 'request'],
  ['63243063-9bee-47b1-9597-a8fbc430d2ba', 'request'],
  ['e6266624-beb1-41b6-afd8-b7b977f8102f', 'request'],
]

const priorities = [
  ['f751e954-efb4-46e6-84fe-5694ec89a507', 'high'],
  ['18d2c055-2eed-43f6-bce1-64da258ad55f', 'low'],
  ['3d7b7238-33e9-4040-962b-fc742d81c6ad', 'high'],
  ['25fda5bd-07b3-4f7b-9c85-535399212e47', 'normal'],
  ['36d36032-a0ad-4bc5-aa89-de210da34225', 'normal'],
  ['6f93e4a7-0163-4418-b3a0-b22fabad80eb', 'high'],
  ['ea9225df-a8c2-4729-b427-05be3454cd15', 'low'],
  ['4337efba-00d1-4e64-b006-b010aede45ec', 'low'],
  ['63243063-9bee-47b1-9597-a8fbc430d2ba', 'normal'],
  ['e6266624-beb1-41b6-afd8-b7b977f8102f', 'normal'],
]

const insights = [
  [
    'f751e954-efb4-46e6-84fe-5694ec89a507',
    'Integration between Linear and Asana for seamless project synchronization across different project management tools',
  ],
  [
    '18d2c055-2eed-43f6-bce1-64da258ad55f',
    'Linux version of the application requested by a user wanting cross-platform productivity',
  ],
  [
    '3d7b7238-33e9-4040-962b-fc742d81c6ad',
    'Email verification emails not being sent or received when changing email address',
  ],
  [
    '25fda5bd-07b3-4f7b-9c85-535399212e47',
    'Performance and UX issues with current project management tool, seeking more efficient alternative',
  ],
  [
    '36d36032-a0ad-4bc5-aa89-de210da34225',
    'User needs ability to selectively exclude team members (like contractors) from project cycles/sprint planning views',
  ],
  [
    '6f93e4a7-0163-4418-b3a0-b22fabad80eb',
    'Gmail/email task creation integration with direct email thread linking',
  ],
  [
    'ea9225df-a8c2-4729-b427-05be3454cd15',
    'Process guidance for team sprint cycles and cooldown periods',
  ],
  [
    '4337efba-00d1-4e64-b006-b010aede45ec',
    "Improve text editor rendering and interaction, similar to Notion's interface",
  ],
  [
    '63243063-9bee-47b1-9597-a8fbc430d2ba',
    'Improve text selection usability in code blocks with scrolling',
  ],
  [
    'e6266624-beb1-41b6-afd8-b7b977f8102f',
    'Add functionality to easily copy issue/project ID as a hyperlink',
  ],
]

const categoryMap = Object.fromEntries(categories)
const priorityMap = Object.fromEntries(priorities)
const insightMap = Object.fromEntries(insights)

async function load(setData: () => void, setState: (state: 'loading' | 'done') => void) {
  runInAction(() => setState('loading'))

  await sleep(3000)

  runInAction(() => {
    setState('done')
    setData()
  })
}

export async function demo() {
  await load(
    () => {
      postsStore.posts = posts.map((post) => {
        const p = new Post(postsStore, post)
        p.categorizationState = 'done'
        p.insightState = 'done'
        return p
      })
    },
    (s) => {
      postsStore.extractionState = s
    }
  )

  for (const post of postsStore.posts) {
    load(
      () => (post.category = categoryMap[post.id]),
      (s) => {
        post.categorizationState = s
      }
    )
    await sleep(100)
    load(
      () => {
        post.insight = insightMap[post.id]
        post.priority = priorityMap[post.id]
      },
      (s) => {
        post.insightState = s
      }
    )
    await sleep(100)
  }
}
