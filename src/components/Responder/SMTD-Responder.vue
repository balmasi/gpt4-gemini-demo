<template>
  <!-- Error Snackbar -->
  <v-snackbar v-model="errorSnackbar" color="error" location="top">
    {{ errorMessage }}
    <template v-slot:actions>
      <v-btn color="white" text @click="errorSnackbar = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script  lang="ts">
import { ref, watch } from 'vue'
import { computeTextFromImage } from '@/lib/openai'
import { makeTextToSpeechOpenai, makeTextToSpeechBrowser } from '@/lib/tts'

export default {
  name: 'SMTD-Responder',
  props: {
    finalSpeechText: String,
    compositeImageUrl: String,
    useOpenaiTts: Boolean,
    apiKey: String,
    lang: String
  },
  setup(props, { emit }) {
    const responseText = ref('')
    const errorMessage = ref('')
    const errorSnackbar = ref(false)

    const callOpenAI = async () => {
      const tts = props.useOpenaiTts
        ? makeTextToSpeechOpenai(props.apiKey)
        : makeTextToSpeechBrowser(props.lang)

      if (props.finalSpeechText && props.compositeImageUrl) {
        responseText.value = await computeTextFromImage(
          props.finalSpeechText,
          props.compositeImageUrl,
          props.apiKey
        )
        console.log('OpenAI Response:', responseText.value)
        try {
          await tts(responseText.value)
        } catch (err) {
          errorSnackbar.value = true
          errorMessage.value =
            'Text to speech failed.' +
            (props.useOpenaiTts ? ' Are you using the right OpenAI Key?' : '')
        }
        emit('tts-finished')
      }
    }

    watch(() => [props.finalSpeechText, props.compositeImageUrl], callOpenAI, { immediate: true })

    return {
      responseText,
      errorSnackbar,
      errorMessage
    }
  }
}
</script>
