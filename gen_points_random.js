
function genPoints(n) {
	var points = [];
	for (var i = 0; i < n; ++i) {
		points.push(new Point(Math.floor(
			Math.random()*canvas.width),
			Math.floor(Math.random()*canvas.height)
		));
	}
	return points;
}