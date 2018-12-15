function createLineChart(){
	//replace with getMargin()
	var margin = getLineMargins() || {
			left : 40,
			right : 40,
			top : 100,
			bottom : 150
		};

	var svg = d3.select('#cost-line-diagram'),
		svgWidth = svg.node().width.baseVal.value,
		svgHeight = svg.node().height.baseVal.value,
		width = svgWidth - margin.left - margin.right,
		height = svgHeight - margin.top - margin.bottom;

	var data = [
		{year : 2012, val : 0},
		{year : 2013, val : 10},
		{year : 2014, val : 45},
		{year : 2015, val : 60},
		{year : 2016, val : 85},
		{year : 2017, val : 140}
	];

	var predictedData = [
		{year : 2017, val : 140},
		{year : 2018 , val : 200, type : 'Predicted'},
	];

	var strideData = [
		{year : 2017, val : 140},
		{year : 2018 , val : 80, type : 'Stride'},
	];

	var x = d3.scaleLinear()
			.domain([2012,2019])
			.range([0,width]);

	var y = d3.scaleLinear()
			.domain([0, 230])
			.range([height,0]);

	var mainG = svg.append('g')
				.attr('transform', `translate(${margin.left},${margin.top})`);

	//create lines

	var firstLine = d3.line()
	    .x(function(d) { return x(d.year); })
	    .y(function(d) { return y(d.val); });

	mainLine = mainG.append('path')
			.datum(data)
			.attr('d', firstLine)
			.attr('fill', 'none')
			.attr('class', 'chart-line')

	var secondLine = mainG.append('path')
			.datum(predictedData)
			.attr('d', firstLine)
			.attr('fill', 'none')
			.attr('class', 'predicted-line');

	var thirdLine = mainG.append('path')
			.datum(strideData)
			.attr('d', firstLine)
			.attr('fill', 'none')
			.attr('class', 'chart-line');

	mainG.selectAll('.chart-line,.predicted-line')
			.attr('stroke-dasharray', function(){
				return `${this.getTotalLength()}, ${this.getTotalLength()}`;
			})
			.attr('stroke-dashoffset', function(){
				return this.getTotalLength();
			});

	//create points
	var circles = [
		data[0],
		data[data.length - 1],
		predictedData[1],
		strideData[1],
	];
	
	var points = mainG.append('g')
		.attr('class', 'circles')
		.selectAll('circle')
		.data(circles)
		.enter()
		.append('circle')
		.attr('class', function(d,i){
			return d.type === 'Predicted' ? 'predicted': 'actual';
		})
		.attr('cx', function(d){
			return x(d.year);
		})
		.attr('cy', function(d){
			return y(d.val);
		})
		.attr('r', 7)
		.style('opacity', 0);

	//add years 
	var years = mainG.append('g')
		.attr('class', 'line-years')
		.selectAll('text')
		.data(circles.slice(0,3))
		.enter()
		.append('text')
		.text((d)=> d.year)
		.attr('x', (d)=>x(d.year))
		.attr('y', height)
		.attr('dy', '1.8em')
		.style('opacity', 0)
		.attr('transform', 'translate(0,10)');

	//add value text 
	var valueTextNodes = mainG.append('g')
		.attr('class', 'line-values')
		.selectAll('text')
		.attr('class', (d)=>'line-val' + d.year)
		.data(circles)
		.enter()
		.append('text')
		.style('opacity', 0);

	valueTextNodes.append('tspan')
		.attr('class', 'point-value')
		.text((d)=> d.val + 20)
		.attr('x', (d)=>x(d.year))
		.attr('y', (d)=>y(d.val))
		.attr('dy', '-1.2em')

	valueTextNodes.append('tspan')
		.text('Rs.bn')
		.attr('x', (d)=>x(d.year))
		.attr('y', (d)=>y(d.val))
		.attr('dy', '-1.5em')
		.style('font-weight', 100);

	valueTextNodes
		.filter((d)=>d.year === 2018)
		.append('tspan')
		.text((d)=>d.type)
		.attr('x', (d)=>x(d.year))
		.attr('y', (d)=>y(d.val))
		.attr('dy', '-0.3em');

	valueTextNodes.attr('transform', function(d){
		return `translate(${getValueTextTransform(d)}, 10)`;
	});

	/*mainG.selectAll('.line-years text')
		.filter((d,i)=>i === 0)
		.style('opacity', '1')
		.attr('transform', ()=>'translate(0,0)');

	mainG.selectAll('.line-values text')
		.filter((d,i)=>i === 0)
		.style('opacity', '1')
		.attr('transform', function(d){
			return `translate(${getValueTextTransform(d)}, 0)`;
		});

	mainG.selectAll('.circles circle')
		.filter((d,i)=>i === 0)
		.style('opacity', '1');

	mainG.selectAll('.circles circle')
		.filter((d,i)=>i === 0)
		.style('opacity', '1');

	mainLine.attr('stroke-dashoffset', 0);

	mainG.selectAll('.circles circle')
		.filter((d,i)=>i === 1)
		.style('opacity', '1');*/

	/*mainG.selectAll('.line-years text')
		.filter((d,i)=>i === 1)
		.style('opacity', '1')
		.attr('transform', ()=>'translate(0,0)');

	mainG.selectAll('.line-values text')
		.filter((d,i)=>i === 1)
		.style('opacity', '1')
		.attr('transform', function(d){
			return `translate(${getValueTextTransform(d)}, 0)`;
		});

	secondLine.attr('stroke-dashoffset', 0);

	mainG.selectAll('.circles circle')
		.filter((d,i)=>i === 2)
		.style('opacity', '1');*

	mainG.selectAll('.line-years text')
		.filter((d,i)=>i === 2)
		.style('opacity', '1')
		.attr('transform', ()=>'translate(0,0)');

	mainG.selectAll('.line-values text')
		.filter((d,i)=>i === 2)
		.style('opacity', '1')
		.attr('transform', function(d){
			return `translate(${getValueTextTransform(d)}, 40)`;
		});

	thirdLine.attr('stroke-dashoffset', 0);

	/*mainG.selectAll('.circles circle')
		.filter((d,i)=>i === 3)
		.style('opacity', '1');

	mainG.selectAll('.line-values text')
		.filter((d,i)=>i === 3)
		.style('opacity', '1')
		.attr('transform', function(d){
			return `translate(${getValueTextTransform(d)}, 40)`;
		});*/

	//animation

	var pointsArr = points.nodes();
	var yearsArr = years.nodes();
	var vtArr = valueTextNodes.nodes();

	var tl = new TimelineMax();

	tl.add('firstPoint', 0.2)
		.to(pointsArr[0], 0.3, {autoAlpha : 1, ease : Power1.easeInOut}, 'firstPoint')
		.fromTo(yearsArr[0], 0.3, {y : 10},{autoAlpha : 1, y : 0, ease : Power1.easeInOut}, 'firstPoint+=0.02')
		.fromTo(vtArr[0], 0.3, {y : 10}, {autoAlpha : 1, y : 0, ease : Power1.easeInOut}, 'firstPoint+=0.04')
	.add('drawFirstLine')
		.to(mainLine.node(), 0.75, {attr: {'stroke-dashoffset' : '0'}, ease : Power1.easeIn}, 'drawFirstLine')
	.add('secondPoint')
		.to(pointsArr[1], 0.3, {autoAlpha : 1, ease : Power1.easeInOut}, 'secondPoint')
		.fromTo(yearsArr[1], 0.3, {y : 10}, {autoAlpha : 1, y : 0, ease : Power1.easeInOut}, 'secondPoint+=0.02')
		.fromTo(vtArr[1], 0.3, {y : 10},{autoAlpha : 1, y : 5, ease : Power1.easeInOut}, 'secondPoint+=0.04')
	.add('drawPredictedLine')
		.to(secondLine.node(), 0.55, {attr: {'stroke-dashoffset' : '0'}, ease : Power1.easeIn}, 'drawPredictedLine')
	.add('predictedPoint')
		.to(pointsArr[2], 0.3, {autoAlpha : 1, ease : Power1.easeInOut}, 'predictedPoint')
		.fromTo(yearsArr[2], 0.3, {y : 10}, {autoAlpha : 1, y : 0, ease : Power1.easeInOut}, 'predictedPoint+=0.02')
		.fromTo(vtArr[2], 0.3, {y : 50},{autoAlpha : 1, y : 40, ease : Power1.easeInOut}, 'predictedPoint+=0.04')
	.add('drawStrideLine')
		.to(thirdLine.node(), 0.55, {attr: {'stroke-dashoffset' : '0'}, ease : Power1.easeIn}, 'drawStrideLine')
	.add('stridePoint')
		.to(pointsArr[3], 0.3, {autoAlpha : 1, ease : Power1.easeInOut}, 'stridePoint')
		.fromTo(vtArr[3], 0.3, {y : 50}, {autoAlpha : 1, y : 40, ease : Power1.easeInOut}, 'stridePoint+=0.04')
}

function getValueTextTransform(d){
	switch(d.year){
		case 2017 : return -40;
		case 2018 : return 50;
		default : return 0;
	}
}

function removeLineChart(){
	d3.select('#cost-line-diagram')
		.selectAll('g')
		.style('opacity',0)
		.remove();
}

function getLineMargins(){
	var windowWidth = window.innerWidth;

	if(windowWidth < 350){
		return {
			left : 10,
			right : 50,
			top : 0,
			bottom : 50
		};
	}else if(windowWidth < 600){
		return {
			left : 20,
			right : 30,
			top : 0,
			bottom : 50
		};
	}else if(windowWidth < 1024){
		return {
			left : 50,
			right : 50,
			top : 0,
			bottom : 50
		};
	}else{
		return {
			left : 100,
			right : 100,
			top : 100,
			bottom : 150
		};
	}
}