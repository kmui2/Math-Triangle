$(document).ready(() => {

	/**
	 * Bind HTML Inputs
	 */
	$('#angle').on('input', function () {
		let results = computeResults(this.value * 10, $('#AB').val(), $('#AC').val());
		plot(results.connections, results.vertices);
	});
	$('#AB').on('input', function () {
		let results = computeResults($('#angle').val() * 10, $('#AB').val(), $('#AC').val());
		plot(results.connections, results.vertices);
	});
	$('#AC').on('input', function () {
		let results = computeResults($('#angle').val() * 10, $('#AB').val(), $('#AC').val());
		plot(results.connections, results.vertices);
	});
	
	let fap = false;
	$('#toggleFap').click(() => {
		fap = !fap;
		if (fap)
			walk(0, 0, 0, 1, 1000, [-10, 10], true);
	});

	/**
	 * Computes the Points for the Triangle given these constraints
	 * @param {Number} degrees angle of vertex A
	 * @param {Number} AB Length
	 * @param {Number} AC Length
	 */
	function computeResults(degrees, AB, AC) {
		// given constraints
		const AE_TO_EC = [2, 3];
		const AF_TO_FB = [2, 1];
		// set A position
		const A = [0, 10];

		// convert degrees to radians
		let angle = degrees * (Math.PI / 180);
		// compute B and C coordinates
		let B = [-AB * Math.sin(angle / 2) + A[0], -AB * Math.cos(angle / 2) + A[1]];
		let C = [AC * Math.sin(angle / 2) + A[0], -AC * Math.cos(angle / 2) + A[1]];

		// compute length of AE and AF
		let AE = AC * AE_TO_EC[0] / math.sum(AE_TO_EC);
		let AF = AB * AF_TO_FB[0] / math.sum(AF_TO_FB);

		// compute F and E coordinates
		let F = [-AF * Math.sin(angle / 2) + A[0], -AF * Math.cos(angle / 2) + A[1]];
		let E = [AE * Math.sin(angle / 2) + A[0], -AE * Math.cos(angle / 2) + A[1]];

		// compute coefficients and constant for FC and line EB
		let lineFC = line(F, C);
		let lineEB = line(E, B);

		// compute intersection O for lines FC and EB
		let O = intersect(lineFC, lineEB);

		// compute coefficients and constant for AO and line BC
		let lineAO = line(A, O);
		let lineBC = line(B, C);

		// compute intersection D for lines AO and BC
		let D = intersect(lineAO, lineBC);

		// compute distance for segments BD and DC
		let BD = math.distance(B, D);
		let DC = math.distance(D, C);

		// compute ratio of BD to DC
		let BD_TO_DC = [1, (DC / BD)]
		// display to use if still a valid triangle
		if (!isNaN(BD_TO_DC[0]) && !isNaN(BD_TO_DC[1]))
			$('#details').html(`BD:DC = 1:${BD_TO_DC[1].toFixed(20)} <br> BD = ${BD.toFixed(4)} <br> DC = ${DC.toFixed(4)}`)


		/**
		 * Returns coefficients for variable x and y and a coeficient describing a line
		 * Xx + Yy = B
		 * @param {[x1,y1]} pt1 First point
		 * @param {[x2,y2]} pt2 Second point
		 */
		function line(pt1, pt2) {
			let m = (pt2[1] - pt1[1]) / (pt2[0] - pt1[0]);
			let b = -m * pt1[0] + pt1[1];
			return {
				Y: 1,
				X: -m,
				B: b
			}
		}

		/**
		 * Returns the intersect of two lines in [x,y]
		 * @param {{Y,X,B}} line1 first line
		 * @param {{Y,X,B}} line2 second line
		 */
		function intersect(line1, line2) {
			let inv = math.inv([[line1.X, line1.Y], [line2.X, line2.Y]]);
			return math.multiply(inv, [line1.B, line2.B]);
		}

		return {
			connections: [
				[A, F],
				[A, O],
				[A, E],
				[F, O],
				[F, B],
				[B, O],
				[B, D],
				[D, O],
				[D, C],
				[C, O],
				[C, E],
				[E, O]
			],
			vertices: {
				A,
				B,
				C,
				D,
				E,
				F,
				O
			}
		}
	}

	/**
	 * Plots the connections and vertices in Plotly
	 * @param {[[A,B],[C,D]]} connections array of connections in arrays
	 * @param {{A,B,B,D}} vertices object of points
	 */
	function plot(connections, vertices) {

		let lines = connections.map((c) => {
			return {
				x: [c[0][0], c[1][0]],
				y: [c[0][1], c[1][1]],
				mode: 'text+lines',
				type: 'scatter',
				hoverinfo: 'none',
				legendgroup: 'lines',
				showlegend: false
			};
		});

		let points = Object.keys(vertices).map((key) => {
			return {
				x: [vertices[key][0]],
				y: [vertices[key][1]],
				mode: 'markers+text',
				type: 'scatter',
				text: key,
				textposition: 'top left',
				name: key,
				hoverinfo: 'text+x+y',
				textfont: {
					size: 20
				}
			}
		})

		let data = lines.concat(points);

		Plotly.newPlot('plotlyDiv', data, {
			hovermode: 'closest',
			xaxis: {
				range: [-20, 20],
				autorange: false
			},
			yaxis: {
				range: [-20, 15],
				autorange: false
			},
			autosize: false
		});
	}

	let results = computeResults($('#angle').val() * 10, $('#AB').val(), $('#AC').val());
	plot(results.connections, results.vertices);

	/**
	 * Performs random walk for a given limit count
	 * @param {Number} x delta
	 * @param {Number} y delta
	 * @param {Number} z delta
	 * @param {Number} generation loop count
	 * @param {Number} limit loop limit count
	 */
	function walk(x, y, z, generation, limit) {
		let delta = 0.5;
		Math.random() > 0.5 ? x += delta : x -= delta;
		Math.random() > 0.5 ? y + delta : y -= delta;
		Math.random() > 0.5 ? z += delta : z -= delta;
		x = Math.max(-10, x);
		x = Math.min(10, x);
		y = Math.max(0, y);
		y = Math.min(20, y);
		z = Math.max(0, z);
		z = Math.min(20, z);
		try {
			let results = computeResults(($('#angle').val() - x) * 10, Number($('#AB').val()) + y, Number($('#AC').val()) + z);
			plot(results.connections, results.vertices);
		}
		catch (err) {
			// cannot compute intersection for coincident lines
		}

		if (generation < limit && fap)
			setTimeout(
				walk.bind(null, x, y, z, ++generation, limit)
				, 50);

	}


});