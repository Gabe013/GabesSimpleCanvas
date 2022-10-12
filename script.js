var canvasFg = document.getElementById("d1");
var fgCanCtx = canvasFg.getContext('2d');
var canvasBg = document.getElementById("d2");
var fgImage = null;
var bgImage = null;
var copyImage;
var finalImage;
var redImage;
var grayImage;
var eulerImage;
var rainbowImage;
var blurImage;
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
	/* fgCanCtx.clearRect(0, 0, canvasFg.width, canvasFg.height);
	canvasFg.style.backgroundColor = 'transparent'; */
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
	redImage = fgImage;
	grayImage = fgImage;
	eulerImage = fgImage;
	rainbowImage = fgImage;
	blurImage = fgImage;
	finalImage = fgImage;
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
	finalImage = new SimpleImage (finalImage);
	finalImage = createComposite();
	finalImage.drawTo(canvasFg);
	copyImage = finalImage;
	fgImage = finalImage;
	redImage = finalImage;
	grayImage = finalImage;
	eulerImage = finalImage;
	rainbowImage = finalImage;
	blurImage = finalImage;
	alert("Green Screen Effect Applied!");
}

function applyRed() {
  if ( redImage == null || !redImage.complete())
    {
      alert("No image uploaded. Please upload an image!");
    }
	redImage = new SimpleImage(redImage);
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
  if (fgImage == null || !grayImage.complete() )
    { 
      alert("No image loaded. Please upload an image!");
    }
	grayImage = new SimpleImage(grayImage);
for (var pixel of grayImage.values()) {
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
if ( fgImage == null || !eulerImage.complete())
    {
      alert("No image uploaded. Please upload an image!");
    }
eulerImage = new SimpleImage(eulerImage);
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

function applyRainbow()  {
  if ( fgImage == null || !fgImage.complete()) {
	  alert("No image uploaded. Please upload an image!");
  }
 rainbowImage = new SimpleImage (rainbowImage);
  var width = rainbowImage.getWidth();
  for (var pixel of rainbowImage.values()) {
    var x = pixel.getX();
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    if (x < width / 7) {
      //red
      if (avg < 128) {
        pixel.setRed(2 * avg);
        pixel.setGreen(0);
        pixel.setBlue(0);
      } else {
        pixel.setRed(255);
        pixel.setGreen(2 * avg - 255);
        pixel.setBlue(2 * avg - 255);
      }
    } else if (x < width * 2 / 7) {
      //orange
      if (avg < 128) {
        pixel.setRed(2 * avg);
        pixel.setGreen(0.8*avg);
        pixel.setBlue(0);
      } else {
        pixel.setRed(255);
        pixel.setGreen(1.2*avg-51);
        pixel.setBlue(2 * avg - 255);
      }
    } else if (x < width * 3 / 7) {
      //yellow
      if (avg < 128) {
        pixel.setRed(2 * avg);
        pixel.setGreen(2*avg);
        pixel.setBlue(0);
      } else {
        pixel.setRed(255);
        pixel.setGreen(255);
        pixel.setBlue(2 * avg - 255);
      }
    } else if (x < width * 4 / 7) {
      //green
      if (avg < 128) {
        pixel.setRed(0);
        pixel.setGreen(2*avg);
        pixel.setBlue(0);
      } else {
        pixel.setRed(2*avg-255);
        pixel.setGreen(255);
        pixel.setBlue(2 * avg - 255);
      }
    } else if (x < width * 5 / 7) {
      //blue
      if (avg < 128) {
        pixel.setRed(0);
        pixel.setGreen(0);
        pixel.setBlue(2*avg);
      } else {
        pixel.setRed(2*avg-255);
        pixel.setGreen(2 * avg - 255);
        pixel.setBlue(255);
      }
    } else if (x < width * 6 / 7) {
      //indigo
      if (avg < 128) {
        pixel.setRed(0.8*avg);
        pixel.setGreen(0);
        pixel.setBlue(2*avg);
      } else {
        pixel.setRed(1.2*avg-51);
        pixel.setGreen(2 * avg - 255);
        pixel.setBlue(255);
      }
    } else {
      //violet
      if (avg < 128) {
        pixel.setRed(1.6*avg);
        pixel.setGreen(0);
        pixel.setBlue(1.6*avg);
      } else {
        pixel.setRed(0.4*avg+153);
        pixel.setGreen(2 * avg - 255);
        pixel.setBlue(0.4*avg+153);
      }
    }
  } 
	rainbowImage.drawTo(canvasFg);
  alert("Rainbow 🌈 filter applied");
}

function RandomInt(min,max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function applyBlur() {
	if ( fgImage == null || !fgImage.complete()) {
	  alert("No image uploaded. Please upload an image!");
  }
	var x1 = 0;
	var y1 = 0;
   blurImage = new SimpleImage (blurImage);
	for(var pixel of fgImage.values()) {
		var x = pixel.getX();
		var y = pixel.getY();
        var width = fgImage.getWidth();
        var height = fgImage.getHeight();
		var random = Math.random();
		if (random < 0.5) {
			blurImage.setPixel(x,y,pixel);
		}
    if (random >= 0.5) {
      x1 = x + RandomInt(-13,13);
      y1 = y + RandomInt(-13,13);
	}
      if (x1 < 0) {
        x1 = 0;
      }
      if (x1 > width - 1) {
        x1 = width - 1;
      }
      if (y1 < 0) {
        y1 = 0;
      }
      if (y1 > height - 1) {
        y1 = height - 1;
      }
      var pix = fgImage.getPixel(x1,y1);
      blurImage.setPixel(x,y,pix);
	}
	blurImage.drawTo(canvasFg);
	alert("Blur🌫🌁 filter applied!");
}


function revert() {
  if (fgImage == null || !fgImage.complete())
    {
	 alert("Upload an image first, please!");
		/* if (finalImage.drawTo(canvasFg) == true) {
			alert("Original Image already on canvas. There is nothing to revert to!");
		} */
} else {
	  copyImage.drawTo(canvasFg);
  alert("Image restored to original!");
}
}