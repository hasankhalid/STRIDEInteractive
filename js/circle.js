function makeAgeProportionCircle(){

	var colors = ['#BFCBF0', '#d5d5fc', '#f4eeee'];
	var legendColors = ['#73a1d0', '#bcc8f1', '#eee9ee'];

	var svg = d3.select('#age-circle-diagram');

	var svgWidth = svg.node().width.baseVal.value;
	var svgHeight = svg.node().height.baseVal.value;

	var dimensions = getDimensions(svgWidth, svgHeight);

	var maxRadius = dimensions.cRadius;

	var svgGroup = svg.append('g');

	var data = [
		{val : 61, title : 'Primary'},
		{val : 22, title : 'Middle'},
		{val : 15, title : 'High'}
	];

	var rScale = d3.scaleSqrt().domain([0, d3.max(data, (d)=>d.val)]).range([0,maxRadius]);

	var circles = svgGroup.
		style('transform', dimensions.cTranslate)
		.selectAll('circle')
			.data(data)
		.enter()
		.append('circle')
			.attr('r', 0)
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('filter',"url(#drop-shadow)")
			.attr('fill', (d,i) => colors[i])
			.style('opacity', 0)
			.attr('r', (d)=>rScale(d.val))
			.style('opacity', (d, i)=> (0.6 + (i * 0.15)));

	circlesTest = circles;

	//var center = height/2;

	var legendGroups = svgGroup
		.selectAll('g')
			.data(data)
		.enter()
		.append('g');
			
		legendGroups.append('circle')
			.attr('r', dimensions.lRadius)
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('fill', (d,i) => legendColors[i])
			.style('opacity', 1)
			/*.transition()
			.delay((d,i)=> i * 1500 + 900)
			.duration(600)
			.style('opacity', '1')*/

		legendGroups.append('text')
			.attr('x', 0)
			//.attr('dx', '1.5em')
			.attr('y', 0)
			//.attr('y', (d,i) => i * 50)
			//.attr('dy', '0.5em')
			.attr('fill', '#fff')
			.attr('class', 'legend-text')
			.attr('dx', `${dimensions.lRadius + getLegendPadding()}px`)
			.attr('dy', '0.1em')
			.style('opacity', '1')
			.text((d)=> d.title + ': ' + d.val + '%')
			/*.transition()
			.delay((d,i)=> i * 1500 + 350)
			.duration(300)
			.style('opacity', '1')
			.attr('y', 0)
			.transition()
			.duration(400)
			.delay(200)
			.attr('y', (d,i) => (i - 1) * 50)
			.attr('x', 330);*/

		testLGroup = legendGroups;

		var finalLegendPosition = getFinalLegendPosition(legendGroups, maxRadius);

		legendGroups.style('transform', (d,i)=>{
			return `translate(${finalLegendPosition.x[i]}px, ${finalLegendPosition.y[i]}px)`
		});

		/*circles.transition()
				.ease(d3.easeQuadIn)
				.delay((d,i)=>i * 1500)
				.duration(300)
				.attr('r', (d)=>rScale(d))
				.style('opacity', (d, i)=> (0.6 + (i * 0.15)))
				.on('end', function(d){
					this.setAttribute('filter', 'url(#drop-shadow)');
				});*/
}

function removeAgeProportionCircle(){
	d3.select('#age-circle-diagram')
		.selectAll('g')
		.style('opacity',0)
		.remove();
}

var legendBreakBoint = 760;

function getDimensions(svgWidth, svgHeight){
	var windowWidth = window.innerWidth;

	var cRadius = (Math.min(svgWidth, svgHeight)/2);

	var dimensions = {};

	if(windowWidth < 350){
		dimensions.cTranslate = 'translate(50%,40%)';
		dimensions.lRadius = 5;
		dimensions.cRadius = cRadius * 0.8;
	}else if(windowWidth < legendBreakBoint){
		dimensions.cTranslate = 'translate(50%,40%)';
		dimensions.lRadius = 10;
		dimensions.cRadius = cRadius * 0.8;
	}else if(windowWidth < 1024){
		dimensions.cRadius = cRadius * 0.7;
		dimensions.cTranslate = 'translate(' + cRadius +'px,50%)';
		dimensions.lRadius = 15;
	}else{
		dimensions.cRadius = cRadius * 0.7;
		dimensions.cTranslate = 'translate(35%,50%)';
		dimensions.lRadius = 15;
	}

	return dimensions;
}

function getHorizontalLegendXPositions(selection, padding){
	var widths = [];
	selection.each(function(){
		widths.push(this.getBBox().width);
	});

	var finalPos = [-1 * widths[0] - 30];

	for(var i = 0; i < widths.length - 1; i++){
		finalPos.push(finalPos[i] + widths[i] + padding);
	}

	return finalPos;
}

function getHorizontalLegendYPositions(selection, maxRadius){
	var yPos = [];
	var length = selection.size();
	for(var i = 0; i < length; i++){
		yPos.push(maxRadius + 40);
	}

	return yPos;
}

function getVerticalLegendXPositions(selection, maxRadius){
	var xPos = [];
	var length = selection.size();
	for(var i = 0; i < length; i++){
		xPos.push(maxRadius + 50);
	}

	return xPos;
}

function getVerticalLegendYPositions(selection){
	var yPos = [-50];
	var length = selection.size() - 1;
	for(var i = 0; i < length; i++){
		yPos.push(yPos[i] + 50);
	}

	return yPos;
}

function getFinalLegendPosition(selection,maxRadius){

	if(window.innerWidth < legendBreakBoint){
		var padding = getLegendPadding();

		return {
			x : getHorizontalLegendXPositions(selection,padding),
			y : getHorizontalLegendYPositions(selection, maxRadius)
		};
	}else{
		return {
			x : getVerticalLegendXPositions(selection, maxRadius),
			y : getVerticalLegendYPositions(selection)
		};
	}
}

function getLegendPadding(){
	var windowWidth = window.innerWidth;

	if(windowWidth < 350){
		return 4;
	}
	else if(windowWidth < 450){
		return 5;
	}else{
		return 10;
	}
}