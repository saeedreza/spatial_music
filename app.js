const videoElement = document.getElementById('video');
const audioElement = document.getElementById('audio');

// Get user media
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        videoElement.srcObject = stream;
    });

// Initialize MediaPipe Hands
const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

hands.onResults(handleGesture);

// Add MediaPipe pipeline here
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 1280,
    height: 720
});
camera.start();

function handleGesture(results) {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0]; // Get landmarks for the first hand
      
      // Example: Detect if thumb and index finger are close together
      const thumbTip = landmarks[4]; // Thumb tip index
      const indexFingerTip = landmarks[8]; // Index finger tip index
      
      // Calculate distance between thumb tip and index finger tip
      const distance = Math.sqrt(
          Math.pow(thumbTip.x - indexFingerTip.x, 2) +
          Math.pow(thumbTip.y - indexFingerTip.y, 2)
      );
      
      // Determine if distance is within "play/pause" threshold
      if (distance < 10) {
          // Play or pause the audio
          if (audioElement.paused) {
              audioElement.play();
          } else {
              audioElement.pause();
          }
      }
  }
}
