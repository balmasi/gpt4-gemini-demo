export function makeTextToSpeechOpenai(apiKey: string) {
  return async function (text: string) {
    const audio = new Audio()
    const body = {
      model: 'tts-1',
      input: text,
      voice: 'nova'
    }

    console.info('TTS: Sending audio to OpenAI TTS endpoint.')
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    console.info('TTS: Received audio from OpenAI TTS endpoint.')
    const blob = await response.blob()
    const audioUrl = URL.createObjectURL(blob) // Creates a URL for the blob
    if (audioUrl) {
      audio.src = audioUrl
      return new Promise((resolve) => {
        audio.onended = resolve
        audio.play()
      })
    }
  }
}

export function makeTextToSpeechBrowser(lang = 'en') {
  return async function (text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      speechSynthesis.speak(utterance)

      return new Promise((resolve) => {
        utterance.onend = () => resolve()
      })
    } else {
      console.error('This browser does not support text-to-speech.')
      return Promise.reject('Text-to-speech not supported')
    }
  }
}
