function makeAgeProportionCircle(){

	var colors = ['#BFCBF0', '#B2BAD5', '#C4CDE8'];

	var svg = d3.select('#age-circle-diagram');

	var width = svg.node().width.baseVal.value;
	var height = width;

	console.log(width, height);

	svg.append('g')
		.attr('transform', 'translate(300, 350)')
		.selectAll('circle')
			.data([260, 120, 70])
		.enter()
		.append('circle')
			.attr('r', (d)=>d)
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('fill', (d,i) => colors[i]);

	var center = height/2;

	var legendGroups = svg.append('g')
		.attr('class', 'legend')
		.attr('transform', `translate(650, 250)`)
		.selectAll('circle')
			.data([{title : 'High',val : '15%'},
				{title : 'Middle',val : '2%'},
				{title : 'Primary',val : '65%'}
			])
		.enter()
		.append('g');
			
		legendGroups.append('circle')
			.attr('r', 15)
			.attr('cx', 0)
			.attr('cy', (d,i) => i * 50)
			.attr('fill', (d,i) => colors[i]);

		legendGroups.append('text')
			.attr('r', 15)
			.attr('x', 0)
			.attr('dx', '1.5em')
			.attr('y', (d,i) => i * 50)
			.attr('dy', '0.5em')
			.attr('fill', '#fff')
			.style('font-size', '26px')
			.text((d)=> d.title + ':' + d.val);
}