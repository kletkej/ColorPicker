"use strict";

var intToHex = (number) => Number(number).toString(16).padStart(2, "0");

class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.count = 1;
    }

    get toHex() {
        return "#" + intToHex(this.r) + intToHex(this.g) + intToHex(this.b);
    }

    toString() {
        return this.r + "," + this.g + "," + this.b;
    }
}

var canvas = document.createElement('canvas');
var screenshot = document.getElementById("screenshot");
var selectedAreaDiv = document.getElementById('screenshot-selected-area');

//when tab opens, get screenshot from storage
chrome.storage.local.get('screenshot', function (result) {
    //create canvas to extract colors
    var drawContext = canvas.getContext("2d");
    screenshot.onload = function () {
        canvas.height = screenshot.naturalHeight;
        canvas.width = screenshot.naturalWidth;
        drawContext.drawImage(screenshot, 0, 0);
    };

    //set screenshot as img src
    screenshot.src = result.screenshot ?? '../static/placeholder.jpg';

    //to save a little bit of space and for privacy reasons, remove the image from storage
    chrome.storage.local.remove('screenshot')
});

var selection = {
    start: { x: 0, y: 0 },
    stop: { x: 0, y: 0 }
}

const startImageSelection = (e) => {
    selectedAreaDiv.hidden = false;

    selection.start.x = e.clientX;
    selection.start.y = e.clientY;
    selection.stop.x = 0;
    selection.stop.y = 0;

    //trigger mouse up on same click
    e.preventDefault();
}

const moveImageSelection = (e) => {
    if (selection.stop.x == 0 && selection.start.x != 0) {
        //depending on direction we have to switch start/end positions
        var startX = Math.min(selection.start.x, e.clientX);
        var stopX = Math.max(selection.start.x, e.clientX);
        var startY = Math.min(selection.start.y, e.clientY);
        var stopY = Math.max(selection.start.y, e.clientY);

        selectedAreaDiv.style.left = startX + 'px';
        selectedAreaDiv.style.top = startY + 'px';
        selectedAreaDiv.style.width = stopX - startX + 'px';
        selectedAreaDiv.style.height = stopY - startY + 'px';
    }
}

const stopImageSelection = (e) => {
    //reset if points equal
    if (selection.start.x == e.clientX && selection.start.y == e.clientY) {
        selectedAreaDiv.hidden = true;

        resetSelection();
    }
    else {
        selection.stop.x = e.clientX;
        selection.stop.y = e.clientY;

        switchSelectionDirection();
        getProminentColors();
    }
}

const resetSelection = () => {
    selection.start.x = 0;
    selection.start.y = 0;
    selection.stop.x = 0;
    selection.stop.y = 0;
}

const switchSelectionDirection = () => {
    //if necessary switch start and stop (should be left to right)
    if (selection.start.x > selection.stop.x) {
        var tmpX = selection.start.x;
        var tmpY = selection.start.y;

        selection.start.x = selection.stop.x;
        selection.start.y = selection.stop.y;
        selection.stop.x = tmpX;
        selection.stop.y = tmpY;
    }
}

//Sorts the elements of an array in place and removes similar colors.
const sortAndRemoveSimilarColors = (colors) => {
    colors.sort((c1, c2) => c2.count - c1.count);
    var copy = [...colors];
    colors.length = 0;

    for (var i = 0; i < copy.length; ++i) {
        if (!colors.some((c) => getColorDistance(c, copy[i]) < 6)) {
            colors.push(copy[i]);
        }
    }

    return colors;
}

const getColorDistance = (colorA, colorB) => {
    //calculate Euclidean distance, which is probably not the best way, but should be fine for our use case, hsl seems to be better suited
    return Math.sqrt(Math.pow(colorB.r - colorA.r, 2) + Math.pow(colorB.g - colorA.g, 2) + Math.pow(colorB.b - colorB.b, 2));;
}

var colorSelectionId = 0;
const getProminentColors = () => {
    colorSelectionId++;
    var colors = [];
    var drawContext = canvas.getContext("2d");

    //selection ratio to image
    var selectionPercentage = {
        top: (selection.start.y - screenshot.offsetTop) / screenshot.offsetHeight,
        left: (selection.start.x - screenshot.offsetLeft) / screenshot.offsetWidth,
        height: (selection.stop.y - selection.start.y) / screenshot.offsetHeight,
        width: (selection.stop.x - selection.start.x) / screenshot.offsetWidth
    };

    //getImageData returns array with r,g,b,a without grouping them into objects, so every block of 4 values represents 1 pixel
    var canvasColors = drawContext.getImageData(Math.floor(canvas.width * selectionPercentage.left), Math.floor(canvas.height * selectionPercentage.top), Math.floor(canvas.width * selectionPercentage.width), Math.floor(canvas.height * selectionPercentage.height)).data;
    for (let i = 0; i < canvasColors.length; i += 4) {
        var color = new Color(canvasColors[i], canvasColors[i + 1], canvasColors[i + 2])

        //increment counter or add new color
        var c = colors.find(c => c.toString() === color.toString());
        if (c) {
            c.count++;
        } else {
            colors.push(color);
        }
    }

    var colors = sortAndRemoveSimilarColors(colors);

    var colorDisplay = document.getElementById("colors-display");
    colorDisplay.hidden = false;

    var colorHeading = document.getElementById("colors-display-heading");
    colorHeading.insertAdjacentHTML('afterend', createColorDisplay(colorSelectionId, colors));
    colorHeading.scrollIntoView();
}

const createColorDisplay = (colorSelectionId, colors) => {
    var colorDisplayHtml = `<div>
                                <div class="separator my-2"></div>
                                <h5>Selection - ${colorSelectionId}</h5>
                                <div class="d-flex justify-content-start flex-wrap">`;

    for (const color of colors) {
        colorDisplayHtml += `<div class="color-display p-2 m-3 d-flex flex-column">
                                <div class="color-display-color" style="background-color: ${color.toHex};"></div>
                                <div class="color-display-value text-center">
                                    <button type="button" class="copy-btn-text">${color.toHex}</button>
                                    <br>
                                    <button type="button" class="copy-btn-text">rgb(${color.toString()})</button>
                                </div>
                            </div>`;
    }

    return colorDisplayHtml + '</div></div>';
}

const onClickCopyText = (e) => {
    if (e.target.classList.contains("copy-btn-text")) {
        navigator.clipboard.writeText(e.target.innerText);
    }
}

window.onload = () => {
    var screenshotImg = document.getElementById("screenshot");
    screenshotImg.addEventListener("mousedown", startImageSelection);
    screenshotImg.addEventListener("mousemove", moveImageSelection)
    screenshotImg.addEventListener("mouseup", stopImageSelection);
    window.addEventListener('resize', resetSelection);
    window.addEventListener('click', onClickCopyText);
}