function init() {
	var canvas = document.getElementById("tesselate");
	var ctx = canvas.getContext("2d");

	ctx.fillStyle = "#FFFFFF";

	var points = [];
	for (var i = 0; i < 100; ++i) {
		points.push({
			x: Math.floor(Math.random()*canvas.width),
			y: Math.floor(Math.random()*canvas.height),
			toString: function() { return this.x+' '+this.y}
		});
	}
	for (var i = 0; i < 100; ++i) {
		ctx.rect(points[i].x,points[i].y, 1, 1);
		ctx.fill();
	} 
	tesselate(points);
	console.log(points);
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
	edges = []
	//delaunay(points, edges);
}

function delaunay(points,edges) {
	alert(points);
	if (points.length == 3) {
		var line1 = [points[0],points[1]];
		var line2 = [points[1],points[2]];
		var line3 = [points[2],points[0]];
		if (ccw(points[0], points[1], points[2])) { 
			edges.push(line1,line2,line3);
			return [line1.splice(), line2.reverse()];
		} else if (ccw(points[0], points[2], points[1])) {
			line3.reverse()
			edges.push(line1,line2,line3);
			return [line3.slice().reverse(), line3.slice()];
		} else {
			edges.push(line1,line2);
			return [line1.splice(), line2.reverse()];
		}
	} else if (points.length == 2) {
		var line = [points[0],points[1]];
		edges.push(line);
		return [line.slice(), line.reverse()];
	} else {
		var half = Math.floor(points.length/2);
		return delaunayMerge(delaunay(points.slice(0,half)),
							 delaunay(points.slice(half, points.length)),
							 edges);
	}
}

function delaunayMerge(delRes1, delRes2, edges) {
	var ldo = delRes1[0];
	var ldi = delRes1[1];
	var rdi = delRes2[0];
	var rdo = delRes2[0];
	if 
};



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