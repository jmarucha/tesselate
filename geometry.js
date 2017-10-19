

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

function BoundingBox(triangle) {
	this.leftX = Math.min(triangle[0].x,Math.min(triangle[1].x,triangle[2].x));
	this.leftY = Math.min(triangle[0].y,Math.min(triangle[1].y,triangle[2].y));
	this.rightX = Math.max(triangle[0].x,Math.max(triangle[1].x,triangle[2].x));
	this.rightY = Math.max(triangle[0].y,Math.max(triangle[1].y,triangle[2].y));
	return this;
}