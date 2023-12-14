<template>
  <p>{{ recognizedText }}</p>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps(['disabled', 'lang'])
const emit = defineEmits(['final-speech'])

const recognizedText = ref('Press Start and start asking questions.')

let recognition = null

function initializeRecognition() {
  const recognitionService = new webkitSpeechRecognition()
  recognitionService.continuous = true
  recognitionService.lang = props.lang || 'en'

  recognitionService.addEventListener('result', (event) => {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        recognizedText.value = event.results[i][0].transcript
        emit('final-speech', recognizedText.value)
      }
    }
  })

  recognitionService.addEventListener('result', (event) =>
    console.debug('Result: Speech recognition result', event)
  )
  recognitionService.onaudiostart = () => console.info('Audio Start: Audio capturing started')
  recognitionService.onaudioend = () => console.info('Audio End: Audio capturing ended')
  recognitionService.onstart = () =>
    console.info(
      `Start: Speech recognition service has started with language: ${recognitionService.lang}`
    )
  recognitionService.onend = () => console.info('End: Speech recognition service disconnected')
  recognitionService.onerror = (event) =>
    console.error('Error: Error occurred in recognition: ', event.error)
  recognitionService.onnomatch = () => console.info('No Match: No matching recognition')
  recognitionService.onsoundstart = () => console.info('Sound Start: Some sound is being received')
  recognitionService.onsoundend = () => console.info('Sound End: Sound has stopped being received')
  recognitionService.onspeechstart = () => console.info('Speech Start: Speech has been detected')
  recognitionService.onspeechend = () =>
    console.info('Speech End: Speech has stopped being detected')

  return recognitionService
}

function startRecognition() {
  if (!props.disabled && recognition) {
    recognition.start()
  }
}

function restartRecognition() {
  if (recognition) {
    recognition.stop()
    recognition = initializeRecognition()
  }

  startRecognition()
}

watch(
  () => props.disabled,
  (newDisabledStatus) => {
    if (!newDisabledStatus) {
      startRecognition()
    } else if (recognition) {
      // Not Disabled -> Disabled
      recognition.abort()
    }
  }
)

watch(
  () => props.lang, restartRecognition
)

onMounted(() => {
  if ('webkitSpeechRecognition' in window) {
    recognition = initializeRecognition(startRecognition)
    recognition.onend = () => restartRecognition()
  } else {
    console.warn('Speech recognition not supported in this browser.')
  }
})

onBeforeUnmount(() => {
  if (recognition) {
    recognition.abort()
  }
})
</script>

<style scoped>
p {
  margin: 10px 0;
}
</style>
