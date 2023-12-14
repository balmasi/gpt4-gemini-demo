const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'


function makePrompt(template, valueMap) {
    return template.replace(/\{([^}]+)\}/g, (match, key) => valueMap[key] || match);
}

export async function computeTextFromImageMock(text) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(`RESPONSE TO: ${text}`), 3000);
    })
}

export async function computeTextFromImage(
    text: string,
    imageUrl: string,
    apiKey: string
    ) {


    const SYSTEM_PROMPT = `
CONTEXT:
- The user is sharing visual prompts through a video camera. The image frames (up to 9) are placed side-by-side from left to right, and top to bottom. e.g:
    1 2 3
    4 5 6
    7 8 9
- There can be any number of images
- The user will ask you questions and expect a very concise response.

RULES:
- Respond concisely, avoid commenting on appearance or background.
- Focus only on the questions asked.
- Refer to the main person (if any) in the image sequence as "You", rather than "The person" or "The man/woman".
- Avoid mentioning the image sequence at all cost. These are just frames of the video. Do not mention them.
- Do not comment on the background of the images, or the emotions/facial expressions.
- Respond with a friendly personality, and keep things light and amable.
- Again, it's CRITICAL to be concise and KEEP YOUR RESPONSE SHORT.
- VERY IMPORTANT: Never, ever, mention that you see a sequence of images.These are just frames of the video.
`;

    const USER_PROMPT_TEMPLATE = '{user_query}'

    const messages = [
        {
            role: "system",
            content: SYSTEM_PROMPT
        },
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: makePrompt(USER_PROMPT_TEMPLATE, { user_query: text }),
                },
                {
                    type: "image_url",
                    image_url: {
                        url: imageUrl,
                    },
                },
                ],
        },
        ];

    const body = {
        model: "gpt-4-vision-preview",
        max_tokens: 4096,
        temperature: 0,
        messages,
    };


    const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    if (data?.error?.message) {
        throw new Error(data.error.message)
    }
    return data.choices[0].message.content;

}
