function createBarChart(){

	var outerRectM = [];
	var innersRectM = [];
	var titlesM = [];
	var valuesM = [];

	var margin = getBarMargin();

	var padding = 10;
	var labelPadding = 10;
	var barHeight = getBarHeight() || 50;

	var data = [
		{title : 'Primary', val : 131376},
		{title : 'Middle', val : 16928},
		{title : 'Lower Secondary', val : 13129},
		{title : 'Higher Secondary', val : 1998}
	];

	var svg = d3.select('#num-schools-bar-chart'),
		svgWidth = svg.node().width.baseVal.value,
		svgHeight = svg.node().height.baseVal.value,
		width = svgWidth - margin.left - margin.right,
		height = svgHeight - margin.top - margin.bottom,
		rx = 3;

	var maxSum = d3.sum(data, (d)=> d.val);
	var scale = d3.scaleLinear().domain([0, maxSum]).range([0, width]);

	var outerGroup = svg.append('g');

	var barGroup = outerGroup.selectAll('rect')
					.data(data)
					.enter()
					.append('g')
					.attr('class', 'bar-chart__g');

	barGroup.append('rect')
			.attr('width', scale(maxSum))
			.attr('height', barHeight)
			.attr('rx', rx)
			.attr('ry', rx)
			.attr('x', margin.left)
			.attr('y', (d,i)=>i * (barHeight + padding * 2))
			.attr('filter', 'url(#drop-shadow)')
			.style('opacity', 0)
			.each(function(d,i){
				outerRectM.push(this);
			});

	barGroup.append('rect')
			.attr('width', 0)
			.attr('height', barHeight)
			.attr('x', margin.left)
			.attr('y', (d,i)=>i * (barHeight + padding * 2))
			.attr('rx', rx)
			.attr('ry', rx)
			.style('opacity', 0.5)
			.style('fill', '#CDDC39')
			.each(function(d,i){
				innersRectM.push({el : this, width : scale(d.val)});
			});

	barGroup.append('text')
			.attr('class', 'bar-chart__text')
			.style('opacity', 0)
			.attr('x', labelPadding + margin.left)
			.attr('y', (d,i)=>i * (barHeight + padding * 2) + (barHeight/2))
			.attr('dy', '0.3em')
			.html((d)=>d.title)
			.each(function(d,i){
				titlesM.push(this);
			});

	barGroup.append('text')
			.attr('class', 'bar-chart__text')
			.attr('x', scale(maxSum) - labelPadding + margin.left)
			.attr('y', (d,i)=>i * (barHeight + padding * 2) + (barHeight/2))
			.attr('dy', '0.3em')
			.attr('text-anchor', 'end')
			.style('opacity', 0)
			.html((d)=>d.val.toLocaleString())
			.each(function(){
				valuesM.push(this);
			});

	var svgMid = svgHeight / 2;
	var outerGroupMid = (outerGroup.node().getBBox().height)/2;

	outerGroup.style('transform', `translate(0px, ${svgMid - outerGroupMid}px)`);

	var tl = new TimelineMax().delay(0.7);

	tl.add('start')
		.staggerTo(outerRectM, 0.4, {autoAlpha : 0.3, ease : Power1.easeIn}, 0.3)
		.staggerTo(titlesM, 0.4, {autoAlpha : 1, ease : Power1.easeIn}, 0.3, "start+=0.05")
		.add('scene2')
		.staggerTo(innersRectM.map((d)=>d.el), 0.3, {ease : Power1.easeIn, cycle : {attr : function(i){ return {width : innersRectM[i].width};}}}, 0.2)
		.staggerTo(valuesM, 0.3, {autoAlpha : 1, ease : Power1.easeIn}, 0.3, "scene2+=0.05");

}

function getBarMargin(){
	var windowWidth = window.innerWidth;

	if(windowWidth < 900){
		return {
			top : 50,
			bottom : 50,
			right : 0,
			left : 0
		};
	}else{
		return {
			top : 50,
			bottom : 50,
			right : 50,
			left : 50
		};
	}
}

function getBarHeight(){

}

function forceRemoveBarChart(){
	d3.select('#num-schools-bar-chart')
		.selectAll('g')
		.style('opacity',0)
		.remove();
}

function removeBarChart(){
	return new Promise(function(resolve){
		d3.select('#num-schools-bar-chart')
			.selectAll('g')
			.transition()
			.duration(300)
			.style('opacity',0)
			.remove()
			.on('end', resolve);
	});
}
