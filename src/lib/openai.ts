const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

function makePrompt(template, valueMap) {
  return template.replace(/\{([^}]+)\}/g, (match, key) => valueMap[key] || match)
}

export async function computeTextFromImageMock(text) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`RESPONSE TO: ${text}`), 3000)
  })
}

export async function computeTextFromImage(text: string, imageUrl: string, apiKey: string) {
  const SYSTEM_PROMPT = `
RULES:
- User is sharing visual prompts through a camera. Up to 10 frames from left to right (old to new).
- Respond concisely, avoid commenting on appearance or background.
- Focus only on their gestures and questions asked.
- Use "you" for the main person in images.
- Avoid mentioning the image sequence, the background of the images, or the emotions/facial expressions.
- Respond with a friendly personality, and keep things light and amable.
- Again, it's critical to be concise. Don't forget.
`

  const USER_PROMPT_TEMPLATE = '{user_query}'

  const messages = [
    {
      role: 'system',
      content: SYSTEM_PROMPT
    },
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: makePrompt(USER_PROMPT_TEMPLATE, { user_query: text })
        },
        {
          type: 'image_url',
          image_url: {
            url: imageUrl
          }
        }
      ]
    }
  ]

  const body = {
    model: 'gpt-4-vision-preview',
    max_tokens: 4096,
    temperature: 0,
    messages
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    })
    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error(error)
  }
}
