import { ref } from 'vue';

export function useWebcamCapture(videoElement, SCALE_FACTOR = 1) {
  const MAX_FRAMES = 9

  const images = ref([]);
    let captureInterval: number | null = null;

    const captureImage = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.value.videoWidth * SCALE_FACTOR;
        canvas.height = videoElement.value.videoHeight * SCALE_FACTOR;
        const context = canvas.getContext('2d');
        context.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height);

        const image = new Image();
        image.src = canvas.toDataURL('image/png');
        images.value.push(image);
        if (images.value.length > MAX_FRAMES) {
            images.value.shift();
        }
    };

    const startCapture = () => {
        captureInterval = setInterval(captureImage, 500);
    };

    const stopCapture = () => {
        if (captureInterval) {
            clearInterval(captureInterval);
        }
    };

    const getCompositeImage = (maxColumns = 3) => {
      if (images.value.length === 0) {
          return;
      }

      const numRows = Math.ceil(images.value.length / maxColumns);
      const imageWidth = images.value[0].width;
      const imageHeight = Math.max(...images.value.map(img => img.height), 0);

      const finalRowImageCount = images.value.length % maxColumns;
      const canvasWidth = (finalRowImageCount > 0 && numRows === 1) ? finalRowImageCount * imageWidth : maxColumns * imageWidth;

      const compositeCanvas = document.createElement('canvas');
      compositeCanvas.width = canvasWidth;
      compositeCanvas.height = numRows * imageHeight;

      const compositeContext = compositeCanvas.getContext('2d');
      images.value.forEach((img, index) => {
        const row = Math.floor(index / maxColumns);
        const col = index % maxColumns;
        compositeContext.drawImage(img, col * imageWidth, row * imageHeight, img.width, img.height);
      });

      return compositeCanvas.toDataURL('image/jpeg');
    };

    return { images, startCapture, stopCapture, getCompositeImage };
}