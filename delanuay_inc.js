function delaunay(points) {
	var triangles = [];
	//add super-triangle
	triangles.push([new Point(-1,-1), new Point(10000,-1), new Point(-1,10000)]);
	for (var i = 0; i < points.length; ++i) {
		var badTriangles = [];
		var badEdges = new EdgeSet;
		for (var j = 0; j < triangles.length; ++j) {
			if (triangles[j] === -1) continue;
			if (inCircumcircle(points[i], triangles[j])) {
				badTriangles.push(triangles[j]);

				badEdges.addTriangle(triangles[j]);
				triangles[j] = -1;
			}
		}

		polygon = [];
		for (var j = 0; j < badTriangles.length; ++j) {
			for (var k = 0; k < 3; ++k) {
				begin = badTriangles[j][k];
				end = badTriangles[j][(k+1)%3];
				if (badEdges.isUnique(begin,end))
					polygon.push([begin,end]);
			}
		}
		for (var j = 0; j < polygon.length; ++j) {
			triangles.push([points[i], polygon[j][0],polygon[j][1]]);
		}
		triangles = triangles.filter(function(x){return x!==-1});
	}
	triangles = triangles.filter(function(trig) {
		for (var i = 0; i < 3; ++i) {
			if (trig[i].x === -1 && trig[i].y === -1) return false;
			if (trig[i].x === 10000 && trig[i].y === -1) return false;
			if (trig[i].x === -1 && trig[i].y === 10000) return false;
		}
		return true;
	});
	return triangles;
}

function inCircumcircle(point, triangle) {
	//nasty determinant formula
	var ax = triangle[0].x - point.x;
	var ay = triangle[0].y - point.y;
	var ar = ax*ax+ay*ay;

	var bx = triangle[1].x - point.x;
	var by = triangle[1].y - point.y;
	var br = bx*bx+by*by;

	var cx = triangle[2].x - point.x;
	var cy = triangle[2].y - point.y;
	var cr = cx*cx+cy*cy;
	var det = ax*(by*cr-br*cy)+ay*(br*cx-bx*cr)+ar*(bx*cy-cx*by);
	if (det>0 && ccw(triangle[0],triangle[1],triangle[2])) return true;
	if (det<0 && !ccw(triangle[0],triangle[1],triangle[2])) return true;
	return false;
}

function EdgeSet() {

}
EdgeSet.prototype.addEdge = function(p1, p2) {
	hash = this.hashPoints(p1, p2);
	if (this[hash]===undefined) {
		this[hash]=0;
	}
	++this[hash];
};

EdgeSet.prototype.addTriangle = function(t) {
	this.addEdge(t[0],t[1]);
	this.addEdge(t[1],t[2]);
	this.addEdge(t[2],t[0]);
};
EdgeSet.prototype.hashPoints = function(p1,p2) {
	if (p1.x > p2.x || (p1.x == p2.x && p1.y > p2.y)) {
		return ''+p1.x+p1.y+p2.x+p2.y;
	} else {
		return ''+p2.x+p2.y+p1.x+p1.y;
	}
};
EdgeSet.prototype.isUnique = function(p1,p2) {
	hash = this.hashPoints(p1, p2);
	return this[hash]===1;
};