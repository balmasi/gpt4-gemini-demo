import { ref } from 'vue'

export function useWebcamCapture(videoElement, SCALE_FACTOR = 1) {
  const images = ref([])
  let captureInterval: number | null = null

  const captureImage = () => {
    const canvas = document.createElement('canvas')
    canvas.width = videoElement.value.videoWidth * SCALE_FACTOR
    canvas.height = videoElement.value.videoHeight * SCALE_FACTOR
    const context = canvas.getContext('2d')
    context.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height)

    const image = new Image()
    image.src = canvas.toDataURL('image/png')
    images.value.push(image)
    if (images.value.length > 10) {
      images.value.shift()
    }
  }

  const startCapture = () => {
    captureInterval = setInterval(captureImage, 500)
  }

  const stopCapture = () => {
    if (captureInterval) {
      clearInterval(captureInterval)
    }
  }

  const getCompositeImage = () => {
    if (images.value.length == 0) {
      return
    }

    const totalWidth = images.value.reduce((sum, img) => sum + img.width, 0)
    const maxHeight = Math.max(...images.value.map((img) => img.height), 0)

    const compositeCanvas = document.createElement('canvas')
    compositeCanvas.width = totalWidth
    compositeCanvas.height = maxHeight

    const compositeContext = compositeCanvas.getContext('2d')
    let x = 0
    images.value.forEach((img) => {
      compositeContext.drawImage(img, x, 0, img.width, img.height)
      x += img.width
    })
    return compositeCanvas.toDataURL('image/jpeg')
  }

  return { images, startCapture, stopCapture, getCompositeImage }
}
