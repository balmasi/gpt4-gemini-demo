<template>
  <video autoplay="true" ref="videoElement"></video>
  <img
    v-if="props.debug"
    v-show="debugImageAvailable"
    class="debug-image"
    :src="compositeImageUrl"
    alt="Composite Image"
  />
  <!-- Error Snackbar -->
  <v-snackbar v-model="errorSnackbar" color="error" location="top">
    {{ errorMessage }}
    <template v-slot:actions>
      <v-btn color="white" text @click="errorSnackbar = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script  lang="ts">
import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue'
import { useWebcamCapture } from './webcam'

export default {
  name: 'SMTD-Webcam',
  props: ['debug'],
  setup(props) {
    const SCALE_FACTOR = 0.5 // You can adjust the scale factor as needed
    const videoElement = ref(null)
    const compositeImageUrl = ref('')
    const debugImageAvailable = ref(false)
    const errorMessage = ref('')
    const errorSnackbar = ref(false)
    const { startCapture, stopCapture, getCompositeImage } = useWebcamCapture(
      videoElement,
      SCALE_FACTOR
    )

    const updateCompositeImage = () => {
      compositeImageUrl.value = getCompositeImage()
      if (compositeImageUrl.value) {
        debugImageAvailable.value = true
      }
    }

    onMounted(async () => {
      if (navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true })
          videoElement.value.srcObject = stream
          startCapture()
        } catch (error) {
          errorMessage.value = 'Error accessing the webcam.'
          errorSnackbar.value = true
        }
      }
    })

    onBeforeUnmount(() => {
      stopCapture()
    })

    watchEffect(() => {
      // This will be called whenever the images array changes
      updateCompositeImage()
    })

    return {
      videoElement,
      getCompositeImage,
      compositeImageUrl,
      debugImageAvailable,
      props,
      errorMessage,
      errorSnackbar
    }
  }
}
</script>

<style>
video {
  border-radius: 30px;
  max-width: 500px;
}

.debug-image {
  display: block;
  margin: 20px auto;
  height: 30px;
  margin-top: 15px;
}
</style>
