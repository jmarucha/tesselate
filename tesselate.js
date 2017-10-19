var canvas;
var ctx;

function init() {
	canvas = document.getElementById("tesselate");
	ctx = canvas.getContext("2d");

	ctx.fillStyle = "#FFFFFF";

	var points = [];
	for (var i = 0; i < 1000; ++i) {
		points.push(new Point(Math.floor(
			Math.random()*canvas.width),
			Math.floor(Math.random()*canvas.height)
		));
	}
	for (var i = 0; i < 100; ++i) {
		ctx.rect(points[i].x,points[i].y, 1, 1);
		ctx.fill();
	}
	triangles = tesselate(points);
	image = new Image();
	image.src = "stary_night.jpg";
	image.onload = function() {tesselateImage(image, triangles)};
}

function tesselate(points) {
	points.sort(function (p1,p2) {
		return (p1.x > p2.x) || (p1.x === p2.x && p1.y > p2.y);
	});
	edges = [];
	invEdges = []
	for (var i = 0; i < points.length;++i) {
			points[i].id=i;
			edges.push([]);
			invEdges.push([]);
	}
	

	triangles = delaunay(points, edges, invEdges);

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
		c = avgColor(imageData, imageSize, triangles[i]);
		ctx.beginPath();
		ctx.moveTo(triangles[i][0].x, triangles[i][0].y);
		ctx.lineTo(triangles[i][1].x, triangles[i][1].y);
		ctx.lineTo(triangles[i][2].x, triangles[i][2].y);
		ctx.lineTo(triangles[i][0].x, triangles[i][0].y);
		ctx.strokeStyle = "rgb(0,0,0)";
		ctx.stroke();
		ctx.fillStyle = "rgb("+c.r+","+c.g+","+c.b+")";
		ctx.fill();

	}
}

function avgColor(imageData, imageSize, triangle) {

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