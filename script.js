var canvasFg = document.getElementById("d1");
var fgCanCtx = canvasFg.getContext('2d');
var canvasBg = document.getElementById("d2");
var fgImage = null;
var bgImage = null;
var copyImage = null;
var fileUpload;
var fileUploadBg;
var sizeBrush = document.getElementById("sizeInput").value;
var brushColor = document.getElementById("brushColor").value;
var isPainting = false;
// var brushDefault = true;

function isNumeric(value) {
	// standard JavaScript function to determine whether a string is an illegal number (Not-a-Number)
	return !isNaN(value);
}

function setWidth(value) {
	if (isNumeric(value) == true) {
		canvasFg.width = value;
	} else { alert("Invalid input type, please enter a whole number, i.e. 300 or 1000") }
}

function setHeight(value) {
	if (isNumeric(value) == true) {
		canvasFg.height = value;
	} else { alert("Invalid input type, please enter a whole number, i.e. 300 or 1000") }
}

function changeBrushClr(newColor) {
	brushColor = newColor;
}
function brushSize(newSize) {
	sizeBrush = newSize;
	document.getElementById("sizeOutput").value = newSize;
}

function doChange() {
	let pickerColor = document.getElementById("colorPicker");
	
	fgCanCtx.fillStyle = pickerColor.value;
	fgCanCtx.fillRect(0, 0, canvasFg.width, canvasFg.height);
}

function draw(x, y) {
	if (!isPainting) return;
	fgCanCtx.lineWidth = sizeBrush;
	fgCanCtx.lineCap = "round";
	fgCanCtx.lineTo(x, y);
	fgCanCtx.stroke();
	fgCanCtx.beginPath();
	fgCanCtx.moveTo(x, y);
	fgCanCtx.strokeStyle = brushColor;
}

function startPaint() {
	isPainting = true;
}

function endPaint() {
	isPainting = false;
	fgCanCtx.beginPath();
}

function doPaint() {
	if (isPainting == true) {
		draw(x, y)
	}
}


function clearCanvas() {
	fgCanCtx.clearRect(0, 0, canvasFg.width, canvasFg.height);
	canvasFg.style.backgroundColor = 'transparent';
	fgImage = null;
	var bgCanCtx = canvasBg.getContext('2d');
	bgCanCtx.clearRect(0, 0, canvasBg.width, canvasBg.height);
	canvasBg.style.backgroundColor = 'transparent';
	bgImage = null;
	
}

function clearCanvasGS() {
	fgCanCtx.clearRect(0, 0, canvasFg.width, canvasFg.height);
	canvasFg.style.backgroundColor = 'transparent';
	var bgCanCtx = canvasBg.getContext('2d');
	bgCanCtx.clearRect(0, 0, canvasBg.width, canvasBg.height);
	canvasBg.style.backgroundColor = 'transparent';
}

// TODO - fix the uploader so that you can upload the same picture after applying the GS Effect
function doFgUpload() {
	fileUpload = document.getElementById("fgUploader");
	fgImage = new SimpleImage(fileUpload);
	fgImage.drawTo(canvasFg);
	copyImage = fgImage;
}

function doBgUpload() {
	fileUploadBg = document.getElementById("bgUploader");
	bgImage = new SimpleImage(fileUploadBg);
	bgImage.drawTo(canvasBg);
}

function downloadCanvas() {
	image = canvasFg.toDataURL();
	var tmpLink = document.createElement("a");
	tmpLink.download = "image.png";
	tmpLink.href = image;
	// document.body.appendChild(tmpLink);
	tmpLink.click();
	// document.body.removeChild(tmpLink);
}

function createComposite() {
	// this function creates a new image with the dimensions of the foreground image and returns the composite green screen image
	var output = new SimpleImage(fgImage.getWidth(), fgImage.getHeight());
	var greenThreshold = 250;
	for (var pixel of fgImage.values()) {
		var x = pixel.getX();
		var y = pixel.getY();
		if (pixel.getGreen() > greenThreshold) {
			//pixel is green, use background
			var bgPixel = bgImage.getPixel(x, y);
			output.setPixel(x, y, bgPixel);
		}
		else {
			//pixel is not green, use foreground
			output.setPixel(x, y, pixel);
		}
	}
	return output;
}

function doGreenScreen() {
	if (fgImage == null || !fgImage.complete()) {
		alert("Foreground image not loaded!");
	}
	if (bgImage == null || !bgImage.complete()) {
		alert("Background image not loaded!");
	}
	if (fgImage.getWidth() != bgImage.getWidth() | fgImage.getHeight() != bgImage.getHeight()) {
		alert("Size of images do not match, using size of foreground image...");
		bgImage.setSize(fgImage.getWidth(), fgImage.getHeight()); }
	clearCanvasGS();
	var finalImage = createComposite();
	finalImage.drawTo(canvasFg);
	copyImage = finalImage;
}

function applyRed() {
  if ( fgImage == null)
    {
      alert("No image uploaded. Please upload an image!");
    }
	var redImage = fgImage;
	for (var pixel of redImage.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue() + pixel.getAlpha())/4;
    if (avg < 128)
    {
    pixel.setRed(avg * 3);
    pixel.setGreen(0);
    pixel.setBlue(0);
    }
    else {
        pixel.setRed(255);
        pixel.setGreen((avg * 3) - 255);
        pixel.setBlue((avg * 3) - 255);
    }
	}
	redImage.drawTo(canvasFg);
  alert("Red filter applied!");
	}

function applyGrayScale() {
  if (fgImage == null)
    { 
      alert("No image loaded. Please upload an image!");
    }
	var grayImage = fgImage;
for (var pixel of grayImage.values())
{
 var avg = (pixel.getRed() + pixel.getGreen() + 
 pixel.getBlue())/3;
 pixel.setRed(avg);
 pixel.setGreen(avg);
 pixel.setBlue(avg);
 }
  grayImage.drawTo(canvasFg);
  alert("Grayscale applied!");
}

function applyEulersGhostFilter() {
if ( fgImage == null)
    {
      alert("No image uploaded. Please upload an image!");
    }
	var eulerImage = fgImage;
for (var pixel of eulerImage.values()) {
var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue())/Math.E;
if (avg < 128 && (pixel.getX() + pixel.getY()) < ((pixel.getX() + pixel.getY())/Math.E))
{
    pixel.setRed(pixel.getBlue() * Math.E);
    pixel.setGreen(avg * Math.E);
    pixel.setBlue(pixel.getRed() * Math.E);
    pixel.setAlpha(avg * Math.E);
} else {
    pixel.setRed(pixel.getBlue() / Math.E);
    pixel.setGreen(avg / Math.E);
    pixel.setBlue(pixel.getRed() / Math.E);
    pixel.setAlpha(avg / Math.E);
}
}
  eulerImage.drawTo(canvasFg);
  alert("Euler's Ghost Filter applied!👻");
}

function revert() {
  if (fgImage == null)
    {
	 alert("Upload an image first, please!");
} else {
		copyImage = new SimpleImage(fileUpload);
	  copyImage.drawTo(canvasFg);
  alert("Image restored to original!");
}
}

