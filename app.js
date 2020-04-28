const webcamFeed = document.getElementById('webcamFeed');
const container = document.getElementById('container');
let canvas;
const width = 640;
const height = 480;

// Initial model settings for hand tracking
const modelParamsHand = {
  flipHorizontal: false,
  imageScaleFactor: 0.4,
  maxNumBoxes: 5,
  iouThreshold: 0.5,
  scoreThreshold: 0.79,
};
let faceTouched = 0;

// Counter to count number of times face touched
let numberOfTimes = document.getElementById('numberOfTimes');

// Load model of handtrack
handTrack.load(modelParamsHand).then((model) => (handTrackModel = model));

// Load model of tinyfacedetector
faceapi.nets.tinyFaceDetector
  .loadFromUri('http://localhost:8000/weights')
  .then(getWebcamFeed());

async function getWebcamFeed() {
  let stream = null;
  try {
    // Get webcam feed
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        height: height,
        width: width,
        facingMode: 'user',
      },
    });
    webcamFeed.srcObject = stream;
    await webcamFeed.play();

    canvas = faceapi.createCanvasFromMedia(webcamFeed);
    // Show webcam feed
    container.appendChild(canvas);
    setInterval(detectHandOnFace, 1000);
  } catch (err) {
    console.log(err);
  }
}

async function detectHandOnFace() {
  let handPredictions;
  const displaySize = { width: width, height: height };
  // Match the output dimensions to canvas dimensions
  faceapi.matchDimensions(canvas, displaySize);
  // Detect faces in the video
  const facePredictions = await faceapi.detectAllFaces(
    webcamFeed,
    new faceapi.TinyFaceDetectorOptions()
  );
  // Detect hand
  await handTrackModel
    .detect(webcamFeed)
    .then((predictions) => (handPredictions = predictions));
  if (facePredictions && handPredictions)
    // Calculate intersection
    checkNumberOfTimesTouched(facePredictions, handPredictions);
}
// Function for Intersection
function checkNumberOfTimesTouched(facePredictions, handPredictions) {
  if (
    !facePredictions &&
    !handPredictions &&
    !facePredictions[0] &&
    !handPredictions[0]
  ) {
    return;
  }
  let facePredictionBoundingBox = {
    x: facePredictions[0]._box._x,
    y: facePredictions[0]._box._y,
    width: facePredictions[0]._box._width,
    height: facePredictions[0]._box._height,
  };
  let handPredictionBoundingBox = {
    x: handPredictions[0].bbox[0],
    y: handPredictions[0].bbox[1],
    width: handPredictions[0].bbox[2],
    height: handPredictions[0].bbox[3],
  };
  const handDrawOptions = {
    label: 'Hand',
    lineWidth: 2,
  };
  const faceDrawOptions = {
    label: 'Face',
    lineWidth: 2,
  };
  let drawBox = new faceapi.draw.DrawBox(
    facePredictionBoundingBox,
    faceDrawOptions
  );
  drawBox.draw(canvas);
  drawBox = new faceapi.draw.DrawBox(
    handPredictionBoundingBox,
    handDrawOptions
  );
  drawBox.draw(canvas);
  x_left = Math.max(
    facePredictionBoundingBox['x'],
    handPredictionBoundingBox['x']
  );
  y_top = Math.max(
    facePredictionBoundingBox['y'],
    handPredictionBoundingBox['y']
  );
  x_right = Math.min(
    facePredictionBoundingBox['x'] + facePredictionBoundingBox['width'],
    handPredictionBoundingBox['y'] + handPredictionBoundingBox['width']
  );
  y_bottom = Math.min(
    facePredictionBoundingBox['y'] + facePredictionBoundingBox['height'],
    handPredictionBoundingBox['y'] + handPredictionBoundingBox['height']
  );
  if (x_right < x_left || y_bottom < y_top) return;

  faceTouched++;
  updateFaceTouched();
}
function updateFaceTouched() {
  numberOfTimes.textContent = faceTouched;
}
