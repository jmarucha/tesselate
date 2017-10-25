
var varianceTreshold = 6666;

var step = 10;


function variance(imageData, imageSize, triangle) {
	box = new BoundingBox(triangle);
	var c = 0;
	var r = 0, g = 0, b = 0;
	var rr = 0, gg = 0, bb = 0;
	for (var x = box.leftX; x < box.rightX; ++x)
		for (var y = box.leftY; y < box.rightY; ++y) {
			p = new Point(x,y);
			if (inTriangle(p, triangle)) {
				++c;
				r += imageData[4*(imageSize.w*y+x)];
				g += imageData[4*(imageSize.w*y+x)+1];
				b += imageData[4*(imageSize.w*y+x)+2];
				rr += imageData[4*(imageSize.w*y+x)]*imageData[4*(imageSize.w*y+x)];
				gg += imageData[4*(imageSize.w*y+x)+1]*imageData[4*(imageSize.w*y+x)+1];
				bb += imageData[4*(imageSize.w*y+x)+2]*imageData[4*(imageSize.w*y+x)+2];
			}
		}
	if (c == 0) return 0;
	return rr+gg+bb+(1.0/(c*c)-2.0/c)*(r*r-g*g-b*b);
}

function improveImage(image, triangles, steps) {
	var imgCanvas = document.createElement('canvas');
	imgCanvas.width = image.width;
	imgCanvas.height = image.height;
	var imageSize = {w: image.width, h: image.height};
	var imageCtx = imgCanvas.getContext('2d');
	imageCtx.drawImage(image, 0, 0, image.width, image.height);
	imageData = imageCtx.getImageData(0, 0, image.width, image.height).data;

	for (var i = 0; i < steps; ++i) {
		tweakImage(imageData, imageSize, triangles);
	}
}

function tweakImage(imageData, imageSize, triangles) {
	var pointsSet = new Set();
	for (var i = triangles.length - 1; i >= 0; i--) {
		for (var j = 0; j < 3; ++j) {
			if (triangles[i][j].triangles===undefined)
				triangles[i][j].triangles=[];
			triangles[i][j].triangles.push(i);
			pointsSet.add(triangles[i][j]);
		}
	}
	pointsSet.forEach(function (p) {
		fiddle(imageData, imageSize, p, triangles);
	});
	
	for (var i = triangles.length - 1; i >= 0; i--) {
		for (var j = 0; j < 3; ++j) {
			delete triangles[i][j].triangles;
		}
	}
}

function fiddle(imageData, imageSize, point, triangles) {
	if (!isPointFull(point, triangles)) return;

	var initialVariance = poinVariance(imageData, imageSize, point, triangles);
	var newVariance;
	if (canvas.width - point.x > step) {
		// try right
		point.x += step;
		newVariance = poinVariance(imageData, imageSize, point, triangles);
		if (initialVariance < newVariance) {
			point.x -= step; // revert
			if (point.x >= step) {
				//try left
				point.x -= step;
				newVariance = poinVariance(imageData, imageSize, point, triangles);
				if (initialVariance < newVariance) {
					point.x += step; // revert
				}
			}
		}
	}

	if (canvas.height - point.y > step) {
		// try down
		point.y += step;
		newVariance = poinVariance(imageData, imageSize, point, triangles);
		if (initialVariance < newVariance) {
			point.x -= step; // revert
			if (point.y >= step) {
				//try up
				point.y -= step;
				newVariance = poinVariance(imageData, imageSize, point, triangles);
				if (initialVariance < newVariance) {
					point.y += step; // revert
				}
			}
		}
	}
}

function poinVariance(imageData, imageSize, point, triangles) {
	var totalVar = 0;
	for (var i = 0; i < point.triangles.length; ++i) {
		t = point.triangles[i];
		totalVar += variance(imageData, imageSize, triangles[t]);
	}
	return totalVar;
}

function isPointFull(point, triangles) {
	multiset = {}
	for (var i = 0; i < point.triangles.length; ++i) {
		t = point.triangles[i];
		for (var j = 0; j < 3; ++j) {
			key = triangles[t][j].toString();
			if (multiset[key]===undefined)
				multiset[key] = 0;
			multiset[key]++;
		}
	}
	for (var i in multiset) {
		if (multiset[key]==1) return false;
	}
	return true;
}