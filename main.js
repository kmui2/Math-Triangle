$(document).ready( () => {

	$('#angle').on('input', function () {
		let results = computeResults(this.value*10, $('#AB').val(), $('#AC').val());;
		plot(results.connections, results.vertices, results.segments);
	});
	$('#AB').on('input', function () {
		let results = computeResults($('#angle').val()*10, $('#AB').val(), $('#AC').val());;
		plot(results.connections, results.vertices, results.segments);
	});
	$('#AC').on('input', function () {
		let results = computeResults($('#angle').val()*10, $('#AB').val(), $('#AC').val());;
		plot(results.connections, results.vertices, results.segments);
	});

	function computeResults(degrees, AB, AC) {
		// console.log(degrees)
		// if (degrees < 20) {
		// 	degrees = 20;
		// }
		// if (degrees > 160) {
		// 	degrees = 160;
		// }

		const AE_TO_EC = [2, 3];
		const AF_TO_FB = [2, 1];

		const A = [0, 10];


		let angle = degrees * (Math.PI / 180);
		let B = [-AB * Math.sin(angle / 2) + A[0], -AB * Math.cos(angle / 2) + A[1]];
		let C = [AC * Math.sin(angle / 2) + A[0], -AC * Math.cos(angle / 2) + A[1]];

		// console.log(B);
		// console.log(C);

		let AE = AC * AE_TO_EC[0] / math.sum(AE_TO_EC);
		let AF = AB * AF_TO_FB[0] / math.sum(AF_TO_FB);

		// console.log(AE);
		// console.log(AF)

		let F = [-AF * Math.sin(angle / 2) + A[0], -AF * Math.cos(angle / 2) + A[1]];
		let E = [AE * Math.sin(angle / 2) + A[0], -AE * Math.cos(angle / 2) + A[1]];

		// console.log(F);
		// console.log(E);

		let lineFC = line(F, C);
		let lineEB = line(E, B);

		// console.log(lineFC);
		// console.log(lineEB);

		let O = intersect(lineFC, lineEB);

		// console.log(O);

		let lineAO = line(A, O);

		let lineBC = line(B, C);

		let D = intersect(lineAO, lineBC);

		let BD = math.distance(B, D);
		let DC = math.distance(D, C);

		let BD_TO_DC = [1, (DC / BD)]
		if (!isNaN(BD_TO_DC[0]) && !isNaN(BD_TO_DC[1]) ) {
			$('#details').html(`BD:DC = 1:${BD_TO_DC[1].toFixed(20)} <br> BD = ${BD.toFixed(4)} <br> DC = ${DC.toFixed(4)}`)
			// console.log(BD_TO_DC);
		}

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
			segments: {
				BD,
				DC
			},
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

	function plot(connections, vertices, segments) {

		let lines = connections.map((c) => {
			return {
				x: [c[0][0], c[1][0]],
				y: [c[0][1], c[1][1]],
				mode: 'text+lines',
				type: 'scatter',
				hoverinfo: 'none',
				legendgroup: 'lines',
				showlegend: false,
				// text: math.distance(c[0],c[1]),
				// textposition: 'bottom'
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
				},
				// legendgroup: 'points'
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

	let results = computeResults($('#angle').val()*10, $('#AB').val(), $('#AC').val());
	plot(results.connections, results.vertices, results.segments);


	function randwalk(x, generation, limit, lim) {
		var delta = Math.random() > 0.5 ? 10 : -10;
		x += delta;
		console.log(x, generation);
	  
		if (generation < limit)
		  requestAnimationFrame(
			walk.bind(null, x, ++generation, limit, lim)
		  );
	  }
	function walk(x,y,z, generation, limit, xlim, xinc) {

			let delta = 0.5;
			Math.random() > 0.5 ? x+=delta : x-=delta;
			Math.random() > 0.5 ? y+delta : y-=delta;
			Math.random() > 0.5 ? z+=delta : z-=delta;
			// console.log($('#angle').val()*10+x, $('#AB').val()+x, $('#AC').val()+x)
			// console.log(xinc)
			x = Math.max(-10,x);
			x = Math.min(10,x);
			y = Math.max(0,y);
			y = Math.min(20,y);
			z = Math.max(0,z);
			z = Math.min(20,z);
			try {
				let results = computeResults(($('#angle').val()-x)*10, Number($('#AB').val())+y, Number($('#AC').val())+z);
				plot(results.connections, results.vertices, results.segments);
			}
			catch(err){

			}
		
			if (x >= xlim[1])
				xinc = false;
			else if (x <= xlim[0])
				xinc = true;
			if (generation < limit && fap)
			setTimeout(
				walk.bind(null, x,y,z, ++generation, limit, xlim, xinc)
			, 50);

	}

	let fap = false;
	$('#toggleFap').click(()=>{
		console.log('fap')
		fap = !fap;
		if (fap) {
			
		walk(0,0,0, 1, 1000, [-10,10], true);
		}
	});


});