import { schedule } from '@netlify/functions'

// Forces a rebuild three times a week so time-sensitive content stays fresh. The hook URL is a
// secret (anyone who has it can start builds), so it lives in the BUILD_HOOK_URL environment
// variable in Netlify, not in the repo.
const handler = schedule('0 0 * * 2,4,6', async () => {
  const hook = process.env.BUILD_HOOK_URL
  if (!hook) {
    console.error('BUILD_HOOK_URL is not set; no build was triggered.')
    return { statusCode: 500 }
  }

  const response = await fetch(hook, { method: 'POST' })
  console.log('Build hook response:', response.status)

  return { statusCode: response.ok ? 200 : 502 }
})

export { handler }
