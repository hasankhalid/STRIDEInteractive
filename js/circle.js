function makeAgeProportionCircle(){

	var circlesM = {};
	var legendTextsM = {};
	var legendCirclesM = {};
	legendGroupsM = {};

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
			//.attr('filter',"url(#drop-shadow)")
			.attr('fill', (d,i) => colors[i])
			.style('opacity', 0)
			.attr('r', 0)
			.each(function(d,i){
				circlesM[d.title] = {el : this, radius : rScale(d.val), opacity : (0.6 + (i * 0.15))};
			});
			//.style('opacity', (d, i)=> (0.6 + (i * 0.15)));

	//var center = height/2;

	var legendGroups = svgGroup
		.selectAll('g')
			.data(data)
		.enter()
		.append('g')
		.each(function(d){
			legendGroupsM[d.title] = { el : this};
		});
			
		legendGroups.append('circle')
			.attr('r', dimensions.lRadius)
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('fill', (d,i) => legendColors[i])
			.style('opacity', 0)
			.each(function(d,i){
				legendCirclesM[d.title] = this;
			});
			/*.transition()
			.delay((d,i)=> i * 1500 + 900)
			.duration(600)
			.style('opacity', '1')*/

		legendGroups.append('text')
			.attr('x', 0)
			//.attr('dx', '1.5em')
			.attr('y', 30)
			//.attr('y', (d,i) => i * 50)
			//.attr('dy', '0.5em')
			.attr('fill', '#fff')
			.attr('class', 'legend-text')
			.attr('dx', `${dimensions.lRadius + getLegendPadding()}px`)
			.attr('dy', '0.1em')
			.style('opacity', '0')
			.text((d)=> d.title + ': ' + d.val + '%')
			.each(function(d,i){
				legendTextsM[d.title] = this;
			});

		var finalLegendPosition = getFinalLegendPosition(legendGroups, maxRadius);

		legendGroups.each((d,i)=>{
			legendGroupsM[d.title].transform = {x :finalLegendPosition.x[i], y :finalLegendPosition.y[i]};
		});

		var masterTl = new TimelineMax().delay(0.8);

		/*tl.to(circlesM['Primary'].el, 0.5, {attr : {r : circlesM['Primary'].radius}, ease : Power1.easeInOut, autoAlpha : circlesM['Primary'].opacity})
			.add(()=>{circlesM['Primary'].el.setAttribute('filter',"url(#drop-shadow)")})
			.to(legendTextsM['Primary'], 0.3, {ease : Power1.easeInOut, autoAlpha : 1, attr : {y: 0}})
			.to(legendGroupsM['Primary'].el, 0.6, {ease : Power1.easeInOut, autoAlpha : 1, y : legendGroupsM['Primary'].transform.y, x : legendGroupsM['Primary'].transform.x}, '+=0.2')
			.to(legendCirclesM['Primary'], 0.3, {ease : Power1.easeIn, autoAlpha : 1}, '-=0.2');*/

		data.map((d)=>d.title).forEach((d)=>{
			var tl = new TimelineMax();

			tl.to(circlesM[d].el, 0.5, {attr : {r : circlesM[d].radius}, ease : Power1.easeInOut, autoAlpha : circlesM[d].opacity})
				.add(()=>{circlesM[d].el.setAttribute('filter',"url(#drop-shadow)")})
				.to(legendTextsM[d], 0.3, {ease : Power1.easeInOut, autoAlpha : 1, attr : {y: 0}})
				.to(legendGroupsM[d].el, 0.6, {ease : Power1.easeOut, autoAlpha : 1, y : legendGroupsM[d].transform.y, x : legendGroupsM[d].transform.x}, '+=0.2')
				.to(legendCirclesM[d], 0.3, {ease : Power1.easeIn, autoAlpha : 1}, '-=0.2');

			masterTl.add(tl);
		});

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

	var finalPos = [-1 * widths[0] - 40];

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