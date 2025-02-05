/*
To do:
- More Colors?
- Scale Factoring
- Tidy UI
- Threshold Slider
- Dark Canvas
- Opaticy Slider
- Clean Up Code
  - Seperate files for things
- make it so the frame isn't super tiny when loaded
- Documentation
*/
let video;
let objectDetector;
let vida;

let blobs = [];
let points = [];
let canvas;

let activeXPos;
let activeWPos;
let activeYPos;
let activeHPos;

window.addEventListener('message', function(event) {
  const data = event.data;
  if (Object.keys(data).length === 1) {
    console.log("single data", data);
    if (data['captureBtn']) {
      console.log("loaded capture");
      startCapture();
    } else if (data['stopBtn']) {
      blobs = [];
    } else if (data['clearBtn']) {
      blobs = [];
      points = [];
    } else if (data['activeX'] || data['activeY'] || data['activeW'] || data['activeH']) {
      window.activeX = data.activeX;
      window.activeY = data.activeY;
      window.activeW = data.activeW;
      window.activeH = data.activeH;
      resizeArena();
    } else if (data.key) {
      console.log("loaded other keys", data.key, data.value);
      window[data.key] = data.value;
    }
  } else {
    console.log("loaded data");
      window.activeX = data.activeX;
      window.activeY = data.activeY;
      window.activeW = data.activeW;
      window.activeH = data.activeH;
      window.pointillismMode = data.pointillismMode;
      window.drawingMode = data.drawingMode;
      window.layerFlags = data.layerFlags;
      window.color1 = data.color1;
      window.color2 = data.color2;
      window.color3 = data.color3;
      window.swiggleCheck = data.swiggleCheck;
      window.swiggleValue = data.swiggleValue;
      window.rainbowMode = data.rainbowMode;
      window.showDrawBlobsFlag = data.showDrawBlobsFlag;
      window.showActiveFlag = data.showActiveFlag;
  }
});

// Setup function runs once at the beginning
function setup() {
  frameRate(60);
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('p5canvas');
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // objectDetector = ml5.objectDetector('cocossd', video, modelLoaded);
  vida = new Vida(this);
  vida.imageFilterThreshold = 0.17;
  vida.handleBlobsFlag = true;
  // vida.progressiveBackgroundFlag = true;
  //vida.normalMinBlobMass = 0.00002;
  //vida.normalMaxBlobMass = 0.0001;
  //vida.normalMinBlobArea = 0.00002;
  //vida.normalMaxBlobArea = 0.0001;
  vida.trackBlobsFlag = true;
  vida.trackBlobsMaxNormDist = 1;
  vida.rejectBlobsMethod = vida.REJECT_NONE_BLOBS;
  vida.handleActiveZonesFlag = true;
  vida.addActiveZone("arena", float(activeX), float(activeY), float(activeW), float(activeH));
  vida.setActiveZonesNormFillThreshold(0.5);
  setActivePoints();
}

// captureBtn.onclick = () => {
//   if (video !== null && video !== undefined) { // safety first
//     vida.setBackgroundImage(video);
//     points = [];
//     blobs = vida.getBlobs();
//   }
// };

// stopBtn.onclick = () => {
//   blobs = [];
// };

// clearBtn.onclick = () => {
//   blobs = [];
//   points = [];
// };

// let pointillismMode = true;
// let drawingMode = false;

// let artMenu = document.getElementById('artMenu');

// artMenu.oninput = () => {
//   if (artMenu.value == "point") {
//     pointillismMode = true;
//     drawingMode = false;
//   }
//   else if (artMenu.value == "draw") {
//     pointillismMode = false;
//     drawingMode = true;
//   }
// };

// let layerFlags = {
//   thresholdFlag: false,
//   videoFlag: true,
//   canvasFlag: false
// };

// let backgroundMenu = document.getElementById('backgroundMenu');

// backgroundMenu.oninput = () => {
//   if (video !== null && video !== undefined) {
//     if (backgroundMenu.value == "threshold") {
//       layerFlags.thresholdFlag = true;
//       layerFlags.videoFlag = false;
//       layerFlags.canvasFlag = false;
//     }
//     else if (backgroundMenu.value == "canvas") {
//       layerFlags.thresholdFlag = false;
//       layerFlags.videoFlag = false;
//       layerFlags.canvasFlag = true;
//     }
//     else if (backgroundMenu.value == "camera") {
//       layerFlags.thresholdFlag = false;
//       layerFlags.videoFlag = true;
//       layerFlags.canvasFlag = false;
//     }
//   }
// }

// let color1 = document.getElementById('color1');
// let color2 = document.getElementById('color2');
// let color3 = document.getElementById('color3');

// let swiggleCheck = document.getElementById('swiggleCheck');
// let swiggleValue = document.getElementById('swiggleValue');
// let raindbowMode = document.getElementById('rainbowMode');

// let showDrawBlobsFlag = false;
// let showActiveFlag = false;

// let drawBlobsCheck = document.getElementById('drawBlobsCheck');
// let activeAreaCheck = document.getElementById('activeAreaCheck');

// drawBlobsCheck.oninput = () => {
//   if (drawBlobsCheck.checked)
//     showDrawBlobsFlag = true;
//   else
//     showDrawBlobsFlag = false;
// }

// activeAreaCheck.oninput = () => {
//   if (activeAreaCheck.checked)
//     showActiveFlag = true;
//   else
//     showActiveFlag = false;
// }

function preload() { 
   canvas = loadImage('canvas.jpg')
}

function resizeArena() {
  vida.removeActiveZone("arena");
  vida.addActiveZone("arena", float(activeX), float(activeY), float(activeW), float(activeH));
  vida.setActiveZonesNormFillThreshold(0.05);
  setActivePoints();
}

function setActivePoints() {
    activeXPos = {
      'x': video.width * activeX,
      'y': video.height * activeY
    };
    activeWPos = {
      'x': (video.width * activeX) + (video.width * activeW),
      'y': video.height * activeY
    };
    activeHPos = {
     'x': (video.width * activeX) + (video.width * activeW),
     'y': (video.height * activeY) + (video.height * activeH)
    };
    activeYPos = {
      'x': video.width * activeX,
      'y': (video.height * activeY) + (video.height * activeH)
    };
}

function draw() {
    // image(video, 0, 0, width, height, 0, 0, video.width, video.height, CONTAIN);
  vida.update(video);
  if (layerFlags.videoFlag)
    image(vida.currentImage, 0, 0);
  if (layerFlags.thresholdFlag)
    image(vida.thresholdImage, 0, 0);
  if (showDrawBlobsFlag)
    vida.drawBlobs(0, 0, video.width, video.height);
  if (layerFlags.canvasFlag) {
    canvas.resize(video.width, video.height)
    image(canvas, 0, 0);
  }
  try {
    for (let i = 0; i < blobs.length; i++) {
      if (inActiveZone(blobs[i].normMassCenterX * video.width, blobs[i].normMassCenterY * video.height)) {
        let colorValue;
        if (i % 3 <= 0) {
          colorValue = hexToRgb(color1.value);
        }
        else if (i % 3 > 0 && i % 3 <= 1) {
          colorValue = hexToRgb(color2.value);
        }
        else {
          colorValue = hexToRgb(color3.value);
        }
        points.push({
          x: blobs[i].normMassCenterX * video.width, 
          y: blobs[i].normMassCenterY * video.height,
          colorRGB: colorValue,
          sizeVariance: Math.floor(random(4, 12)),
        });
      }
    }
  } catch {}
  
  if (pointillismMode && points.length > 0) {
    noStroke();
    for (let i = 0; i < points.length; i++) {
      if (rainbowMode.checked) {
        colorMode(HSB);
        fill(Math.floor((Date.now() / 10) + i) % 361, 50, 100, 20);
        colorMode(RGB);
      }
      else {
        fill(points[i].colorRGB.r, points[i].colorRGB.g, points[i].colorRGB.b, 92);
      }
      if (swiggleCheck.checked)
        circle(points[i].x + random(-int(swiggleValue.value), swiggleValue.value), points[i].y + random(-int(swiggleValue.value), swiggleValue.value), points[i].sizeVariance);
      else
        circle(points[i].x, points[i].y, points[i].sizeVariance);
    }
  }
  
  if (drawingMode && points.length > 0) {
    noFill();
    for (let i = 0; i < points.length; i++) {
      if (i % 4 == 0) {
        beginShape();
      }
      if (rainbowMode.checked) {
        colorMode(HSB);
        stroke(Math.floor((Date.now() / 10) + i) % 361, 50, 100, 92);
        colorMode(RGB);
      }
      else
        stroke(points[i].colorRGB.r, points[i].colorRGB.g, points[i].colorRGB.b, 92);
      strokeWeight(points[i].sizeVariance - 3);
      if (swiggleCheck.checked)
        curveVertex(points[i].x + random(-int(swiggleValue.value), swiggleValue.value), points[i].y + random(-int(swiggleValue.value), swiggleValue.value));
      else
        curveVertex(points[i].x, points[i].y);
      if (i % 4 == 3) {
        endShape();
      }
    }
    endShape();
  }

  if (showActiveFlag) {
    vida.drawActiveZones(0,0);
  }
  createFrame();
}

function inActiveZone(x, y) {
  return (x >= activeXPos.x && x <= activeWPos.x &&
          y >= activeXPos.y && y <= activeYPos.y);
}

function createFrame() {
  strokeWeight(3);
  stroke(179, 149, 29);
  
  // top frame
  fill(255, 204, 0);
  beginShape();
  vertex(0, 0);
  vertex(video.width, 0);
  vertex(activeWPos.x, activeWPos.y)
  vertex(activeXPos.x, activeXPos.y);
  endShape(CLOSE);

  //right frame
  beginShape();
  vertex(video.width, 0);
  vertex(video.width, video.height);
  vertex(activeHPos.x, activeHPos.y);
  vertex(activeWPos.x, activeWPos.y);
  endShape(CLOSE);
  
  //bottom frame
  beginShape();
  vertex(activeYPos.x, activeYPos.y);
  vertex(activeHPos.x, activeHPos.y);
  vertex(video.width, video.height);
  vertex(0, video.height);
  endShape(CLOSE);
  
  //left frame
  vertex(0, 0);
  vertex(activeXPos.x, activeXPos.y);
  vertex(activeYPos.x, activeYPos.y);
  vertex(0, video.height);
  endShape(CLOSE);
  
  noStroke();
}

function startCapture() {
  if (video !== null && video !== undefined) {
    vida.setBackgroundImage(video);
    points = [];
    blobs = vida.getBlobs();
  }
}

function findScaleFactor(aWidth, aHeight, bWidth, bHeight) {
  const screenRatio = aWidth / aHeight;
  const imageRatio = bWidth / bHeight;
  let scaleFactor;
  if (screenRatio > imageRatio) {
    scaleFactor = aHeight / bHeight;
    return { "scaleFactor": scaleFactor, "xOffset": (aWidth - (bWidth * scaleFactor)) / 2, "yOffset": 0 };
  }
  else {
    scaleFactor = aWidth / bWidth;
    return { "scaleFactor": scaleFactor, "xOffset": 0, "yOffset": (aHeight - (bHeight * scaleFactor)) / 2 };
  }
}

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)  
    } : null;
}
