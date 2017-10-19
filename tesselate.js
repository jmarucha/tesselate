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
	tesselate(points);
}

function inTriangle(point, triangle) {
	c1 = cross(
		pDiff(triangle[0], point),
		pDiff(triangle[0], triangle[1])
		);
	c2 = cross(
		pDiff(triangle[1], point),
		pDiff(triangle[1], triangle[2])
		);
	c3 = cross(
		pDiff(triangle[2], point),
		pDiff(triangle[2], triangle[0])
		);
	if (c1 >= 0 && c2 >= 0 && c3 >= 0)
		return true;
	if (c1 <= 0 && c2 <= 0 && c3 <= 0)
		return true;
	return false;
}

function trianglesIntersect(triangle1, triangle2) {
	if (inTriangle(triangle1[0], triangle2) || inTriangle(triangle2[0], triangle1))
		return false;
	for (var i = 0; i < 3; ++i)
		for (var j = 0; j < 3; ++j)
			if (linesIntersect(
				pDiff(triangle1[i], triangle1[(i+1)%3]),
				pDiff(triangle2[i], triangle2[(i+1)%3])
				)) return false;
	return true;
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
}

function Point(x,y) {
	this.x = x;
	this.y = y;
}
Point.prototype.toString = function () {
	return this.x+" "+this.y;
}


function addEdge(line, edges, invEdges) {
	id1 = line[0].id;
	id2 = line[1].id;
	edges[id1].push(id2);
	invEdges[id2].push(id1);
}

function linesIntersect(line1, line2) {
	v1 = pDiff(line1[1], line1[0]);
	v2 = pDiff(line2[1], line2[0]);
	if (cross(v1,v2)==0) return false; // paralell
	u = cross(pDiff(line2[0],line1[0]), v1)/cross(v1,v2);
	return (u <= 1 && u >= 0);
}

function pDiff(p1, p2) {
	return {
		x: p1.x - p2.x,
		y: p1.y - p2.y,
	};
}
function cross(v1, v2) {
	return v1.x*v2.y - v2.x*v1.y;
}

function ccw(p1, p2, p3) {
	return cross(pDiff(p2,p1),pDiff(p3,p1)) > 0;
}

function rightOf(point, line) {
	return cross(pDiff(point,line[0]),pDiff(line[1], line[0])) > 0;
}
function leftOf(point, line) {
	return cross(pDiff(point,line[0]),pDiff(line[1], line[0])) < 0;
}