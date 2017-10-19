function HEdge() {
	this.point;
	this.next;
	this.prev;
	this.pair;
	this.face;
}

function QEdge() {
	this.rightmostHe;		/* right most halfedge */
	this.leftmostHe;		/* left most halfedge */
	this.points;			/* pointer to points */
	this.faces;			/* faces of delaunay */
	this.facesCount;		/* face count */
	this.startPoint;		/* start point index */
	this.endPoint; /* end point index */
} 

function Face() {
}

workingSet = {
	edges: [],
	faces: [],
	freeEdge: NaN,
	freeFace: NaN,
}

function delaunay(points,edges, invEdges) {
	alert(points);
	if (points.length == 3) {
		var line1 = [points[0],points[1]];
		var line2 = [points[1],points[2]];
		var line3 = [points[2],points[0]];
		if (ccw(points[0], points[1], points[2])) {
			addEdge(line1, edges, invEdges);
			addEdge(line2, edges, invEdges);
			addEdge(line3, edges, invEdges);
			return [line1.splice(), line2.reverse()];
		} else if (ccw(points[0], points[2], points[1])) {
			line3.reverse()
			addEdge(line1, edges, invEdges);
			addEdge(line2, edges, invEdges);
			addEdge(line3, edges, invEdges);
			return [line3.slice().reverse(), line3.slice()];
		} else {
			addEdge(line1, edges, invEdges);
			addEdge(line2, edges, invEdges);
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
	if (leftOf(rdi[0], ldi) //what?????
};


