var canvas;
var ctx;
var image;
var points, triangles;

function init() {
	canvas = document.getElementById("tesselate");
	ctx = canvas.getContext("2d");

	ctx.fillStyle = "#FFFFFF";
	image = new Image();
	image.src = "stary_night.jpg";
	//improveImage(1,1,triangles);
	image.onload = function() {
		points = genPoints(4000, image)
		triangles = tesselate(points);
		setTimeout(function() {tesselateImage(image, triangles);});
	};
}

function tesselate(points) {
	points.sort(function (p1,p2) {
		return (p1.x > p2.x) || (p1.x === p2.x && p1.y > p2.y);
	});
	

	triangles = delaunay(points);

	for (var i = 0; i < triangles.length; ++i) {
		ctx.beginPath();
		ctx.moveTo(triangles[i][0].x, triangles[i][0].y);
		ctx.lineTo(triangles[i][1].x, triangles[i][1].y);
		ctx.lineTo(triangles[i][2].x, triangles[i][2].y);
		ctx.lineTo(triangles[i][0].x, triangles[i][0].y);
		ctx.strokeStyle = "#FFFFFF";
		ctx.stroke();
	}
	return triangles;
}

function tesselateImage(image, triangles) {
	var imgCanvas = document.createElement('canvas');
	imgCanvas.width = image.width;
	imgCanvas.height = image.height;
	var imageSize = {w: image.width, h: image.height};
	var imageCtx = imgCanvas.getContext('2d');
	imageCtx.drawImage(image, 0, 0, image.width, image.height);
	imageData = imageCtx.getImageData(0, 0, image.width, image.height).data;

	for (var i = 0; i < triangles.length; ++i) {
		var c = avgColor(imageData, imageSize, triangles[i]);
		var triangle = bitBigger(triangles[i]);
		ctx.beginPath(); 
		ctx.moveTo(triangle[0].x, triangle[0].y);
		ctx.lineTo(triangle[1].x, triangle[1].y);
		ctx.lineTo(triangle[2].x, triangle[2].y);
		ctx.lineTo(triangle[0].x, triangle[0].y);
		//ctx.strokeStyle = "rgb(0,0,0)";
		//ctx.stroke();
		ctx.fillStyle = "rgb("+c.r+","+c.g+","+c.b+")";
		ctx.fill();
	}

	for (var i = 0; i < triangles.length; ++i) {
		var c = avgColor(imageData, imageSize, triangles[i]);
		var triangle = triangles[i];
		ctx.beginPath(); 
		ctx.moveTo(triangle[0].x, triangle[0].y);
		ctx.lineTo(triangle[1].x, triangle[1].y);
		ctx.lineTo(triangle[2].x, triangle[2].y);
		ctx.lineTo(triangle[0].x, triangle[0].y);
		//ctx.strokeStyle = "rgb(0,0,0)";
		//ctx.stroke();
		ctx.fillStyle = "rgb("+c.r+","+c.g+","+c.b+")";
		ctx.fill();
	}
}

function fullAvgColor(imageData, imageSize, triangle) {

	box = new BoundingBox(triangle);
	var c = 0;
	var r = 0, g = 0, b = 0;
	for (var x = box.leftX; x < box.rightX; ++x)
		for (var y = box.leftY; y < box.rightY; ++y) {
			p = new Point(x,y);
			if (inTriangle(p, triangle)) {
				++c;
				r += imageData[4*(imageSize.w*y+x)];
				g += imageData[4*(imageSize.w*y+x)+1];
				b += imageData[4*(imageSize.w*y+x)+2];
			}
		}
	return {
		r: Math.floor(r/c),
		g: Math.floor(g/c),
		b: Math.floor(b/c),
	}
}

function monteCarloAvgColor(imageData, imageSize, triangle, samples) {
	if (samples === undefined) {
		samples = 200;
	}
	var edge1 = pDiff(triangle[1],triangle[0]);
	var edge2 = pDiff(triangle[2],triangle[0]);
	var r = 0, g = 0, b = 0;

	for (var i = 0; i < samples; ++i) {
		var r1 = Math.random();
		var r2 = Math.random();
		if (r1 + r2 > 1) {
			r1 = 1 - r1;
			r2 = 1 - r2;
		}
		var samplePoint = pSum(
				triangle[0],
				pSum(
					scale(edge1, r1),
					scale(edge2, r2)
				)
			);
		x = ~~(samplePoint.x);
		y = ~~(samplePoint.y);

		r += imageData[4*(imageSize.w*y+x)];
		g += imageData[4*(imageSize.w*y+x)+1];
		b += imageData[4*(imageSize.w*y+x)+2];

	}

	return {
		r: Math.floor(r/samples),
		g: Math.floor(g/samples),
		b: Math.floor(b/samples),
	}
}
//// Alternatives:
//	fullAvgColor - slow method, O(w*h), where w*h
//		is size of triangle's bounding box
//
//	monteCarloAvgColor - fast approximation, O(1)
var avgColor = monteCarloAvgColor;