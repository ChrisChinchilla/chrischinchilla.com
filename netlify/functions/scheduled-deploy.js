const fetch = require('node-fetch')
import {schedule} from '@netlify/functions'

// This is sample build hook
const BUILD_HOOK = 'https://api.netlify.com/build_hooks/643144652e231e02fcc8c4f2'

const handler = schedule('0 0 * * 2,4,6', async () => {
    await fetch(BUILD_HOOK, {
    method: 'POST'
  }).then((response) => {
    console.log('Build hook response:', response.json())
  })

  return {
    statusCode: 200
  }
});

export {
  handler
}