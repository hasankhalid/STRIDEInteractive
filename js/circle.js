function makeAgeProportionCircle(){

	var colors = ['#BFCBF0', '#d5d5fc', '#f4eeee'];
	var legendColors = ['#73a1d0', '#bcc8f1', '#eee9ee'];

	var svg = d3.select('#age-circle-diagram');

	var width = svg.node().width.baseVal.value;
	var height = width;

	console.log(width, height);

	var svgGroup = svg.append('g');

	var circles = svgGroup.
		attr('transform', 'translate(300, 350)')
		.selectAll('circle')
			.data([260, 120, 70])
		.enter()
		.append('circle')
			.attr('r', 0)
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('fill', (d,i) => colors[i])
			.style('opacity', (d, i)=> (0.6 + (i * 0.15)));

	circlesTest = circles;

	var center = height/2;

	var legendGroups = svgGroup
		.selectAll('g')
			.data([{title : 'Primary',val : '65%'},
				{title : 'Middle',val : '40%'},
				{title : 'High',val : '30%'},
			])
		.enter()
		.append('g');
			
		legendGroups.append('circle')
			.attr('r', 15)
			.attr('cx', 300)
			.attr('cy', (d,i) => i * 50 - 60)
			.attr('fill', (d,i) => legendColors[i])
			.style('opacity', 0)
			.transition()
			.delay((d,i)=> i * 1500 + 900)
			.duration(600)
			.style('opacity', '1')

		legendGroups.append('text')
			.attr('r', 15)
			.attr('x', 0)
			//.attr('dx', '1.5em')
			.attr('y', 100)
			//.attr('y', (d,i) => i * 50)
			//.attr('dy', '0.5em')
			.attr('fill', '#fff')
			.attr('class', 'legend-text')
			.style('opacity', '0')
			.text((d)=> d.title + ':' + d.val)
			.transition()
			.delay((d,i)=> i * 1500 + 350)
			.duration(300)
			.style('opacity', '1')
			.attr('y', 0)
			.transition()
			.duration(400)
			.delay(200)
			.attr('y', (d,i) => (i - 1) * 50)
			.attr('x', 330);

		circles.transition()
				.ease(d3.easeQuadIn)
				.delay((d,i)=>i * 1500)
				.duration(300)
				.attr('r', (d)=>d);
}

function removeAgeProportionCircle(){
	d3.select('#age-circle-diagram')
		.selectAll('g')
		.style('opacity',0)
		.remove();
}