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

let canvasWindow;

function sendUpdate(key, value) {
    if (canvasWindow) {
        canvasWindow.postMessage({ [key] : value }, '*');
    }
}

let activeX = document.getElementById('activeX');
let activeY = document.getElementById('activeY');
let activeW = document.getElementById('activeW');
let activeH = document.getElementById('activeH');

activeX.oninput = () => {
    sendUpdate('activeX', activeX.value);
}

activeY.oninput = () => {
    sendUpdate('activeY', activeY.value);
}

activeW.oninput = () => {
    sendUpdate('activeW', activeW.value);
}

activeH.oninput = () => {
    sendUpdate('activeH', activeH.value);
}

let captureBtn = document.getElementById('captureBtn');
let stopBtn = document.getElementById('stopBtn');
let clearBtn = document.getElementById('clearBtn');

captureBtn.onclick = () => {
    sendUpdate('captureBtn', true);
};

stopBtn.onclick = () => {
    sendUpdate('stopBtn', true);
};

clearBtn.onclick = () => {
    sendUpdate('clearBtn', true);
};

let pointillismMode = true;
let drawingMode = false;

let artMenu = document.getElementById('artMenu');

artMenu.oninput = () => {
    if (artMenu.value == "point") {
        pointillismMode = true;
        drawingMode = false;
    }
    else if (artMenu.value == "draw") {
        pointillismMode = false;
        drawingMode = true;
    }
    sendUpdate('pointillismMode', pointillismMode);
    sendUpdate('drawingMode', drawingMode);
};

let layerFlags = {
    thresholdFlag: false,
    videoFlag: true,
    canvasFlag: false
};

let backgroundMenu = document.getElementById('backgroundMenu');

backgroundMenu.oninput = () => {
    if (backgroundMenu.value == "threshold") {
        layerFlags.thresholdFlag = true;
        layerFlags.videoFlag = false;
        layerFlags.canvasFlag = false;
    }
    else if (backgroundMenu.value == "canvas") {
        layerFlags.thresholdFlag = false;
        layerFlags.videoFlag = false;
        layerFlags.canvasFlag = true;
    }
    else if (backgroundMenu.value == "camera") {
        layerFlags.thresholdFlag = false;
        layerFlags.videoFlag = true;
        layerFlags.canvasFlag = false;
    }
    sendUpdate('layerFlags', layerFlags);
}

let color1 = document.getElementById('color1');
let color2 = document.getElementById('color2');
let color3 = document.getElementById('color3');

color1.oninput = () => {
    sendUpdate('color1', color1.value);
}

color2.oninput = () => {
    sendUpdate('color2', color2.value);
}

color3.oninput = () => {
    sendUpdate('color3', color3.value);
}

let swiggleCheck = document.getElementById('swiggleCheck');
let swiggleValue = document.getElementById('swiggleValue');
let raindbowMode = document.getElementById('rainbowMode');

swiggleCheck.oninput = () => {
    sendUpdate('swiggleCheck', swiggleCheck.checked);
}
swiggleValue.oninput = () => {
    sendUpdate('swiggleValue', swiggleValue.value);
}
rainbowMode.oninput = () => {
    sendUpdate('rainbowMode', rainbowMode.checked);
}

let showDrawBlobsFlag = false;
let showActiveFlag = false;

let drawBlobsCheck = document.getElementById('drawBlobsCheck');
let activeAreaCheck = document.getElementById('activeAreaCheck');

drawBlobsCheck.oninput = () => {
    if (drawBlobsCheck.checked)
        showDrawBlobsFlag = true;
    else
        showDrawBlobsFlag = false;
    sendUpdate('showDrawBlobsFlag', showDrawBlobsFlag);
}

activeAreaCheck.oninput = () => {
    if (activeAreaCheck.checked)
        showActiveFlag = true;
    else
        showActiveFlag = false;
    sendUpdate('showActiveFlag', showActiveFlag);
}
// Setup function runs once at the beginning
window.onload = () => {
    canvasWindow = window.open('canvas.html', 'canvasWindow', 'width=800, height=800');
    canvasWindow.onload = () => {
        canvasWindow.postMessage({
            activeX: activeX.value,
            activeY: activeY.value,
            activeW: activeW.value,
            activeH: activeH.value,
            captureBtn: false,
            stopBtn: false,
            clearBtn: false,
            pointillismMode: pointillismMode,
            drawingMode: drawingMode,
            layerFlags: layerFlags,
            color1: color1.value,
            color2: color2.value,
            color3: color3.value,
            swiggleCheck: swiggleCheck.checked,
            swiggleValue: swiggleValue.value,
            rainbowMode: rainbowMode.checked,
            showDrawBlobsFlag: showDrawBlobsFlag,
            showActiveFlag: showActiveFlag,
        }, '*');
    };
}