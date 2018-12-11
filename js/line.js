function createLineChart(){
	var margin = {
			left : 40,
			right : 40,
			top : 100,
			bottom : 150
		};

		var svg = d3.select('#cost-line-diagram'),
			width = 900 - margin.left - margin.right,
			height = 700 - margin.top - margin.bottom;

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

		var mainLine = mainG.append('path')
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
		mainG.append('g')
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
		mainG.append('g')
			.attr('class', 'line-years')
			.selectAll('text')
			.data(circles)
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
			.text((d)=> d.val + 20)
			.attr('x', (d)=>x(d.year))
			.attr('y', (d)=>y(d.val))
			.attr('dy', '-1.2em')
			.attr('font-size', '40px');

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

		mainG.selectAll('.line-years text')
			.filter((d,i)=>i === 0)
			.transition()
			.duration(300)
			.style('opacity', '1')
			.attr('transform', ()=>'translate(0,0)');

		mainG.selectAll('.line-values text')
			.filter((d,i)=>i === 0)
			.transition()
			.delay(100)
			.duration(300)
			.style('opacity', '1')
			.attr('transform', function(d){
				return `translate(${getValueTextTransform(d)}, 0)`;
			});

		mainG.selectAll('.circles circle')
			.filter((d,i)=>i === 0)
			.transition()
			.delay(400)
			.duration(300)
			.style('opacity', '1');

		mainG.selectAll('.circles circle')
			.filter((d,i)=>i === 0)
			.transition()
			.delay(400)
			.duration(300)
			.style('opacity', '1');

		mainLine.transition()
				.delay(900)
				.duration(900)
				.attr('stroke-dashoffset', 0);

		mainG.selectAll('.circles circle')
			.filter((d,i)=>i === 1)
			.transition()
			.delay(1850)
			.duration(300)
			.style('opacity', '1');

		mainG.selectAll('.line-years text')
			.filter((d,i)=>i === 1)
			.transition()
			.delay(1950)
			.duration(300)
			.style('opacity', '1')
			.attr('transform', ()=>'translate(0,0)');

		mainG.selectAll('.line-values text')
			.filter((d,i)=>i === 1)
			.transition()
			.delay(2000)
			.duration(300)
			.style('opacity', '1')
			.attr('transform', function(d){
				return `translate(${getValueTextTransform(d)}, 0)`;
			});

		secondLine.transition()
				.delay(2400)
				.duration(600)
				.attr('stroke-dashoffset', 0);

		mainG.selectAll('.circles circle')
			.filter((d,i)=>i === 2)
			.transition()
			.delay(3050)
			.duration(300)
			.style('opacity', '1');

		mainG.selectAll('.line-years text')
			.filter((d,i)=>i === 2)
			.transition()
			.delay(3150)
			.duration(300)
			.style('opacity', '1')
			.attr('transform', ()=>'translate(0,0)');

		mainG.selectAll('.line-values text')
			.filter((d,i)=>i === 2)
			.transition()
			.delay(3200)
			.duration(300)
			.style('opacity', '1')
			.attr('transform', function(d){
				return `translate(${getValueTextTransform(d)}, 0)`;
			});

		thirdLine.transition()
				.delay(3600)
				.duration(600)
				.attr('stroke-dashoffset', 0);

		mainG.selectAll('.circles circle')
			.filter((d,i)=>i === 3)
			.transition()
			.delay(4250)
			.duration(300)
			.style('opacity', '1');

		mainG.selectAll('.line-values text')
			.filter((d,i)=>i === 3)
			.transition()
			.delay(4350)
			.duration(300)
			.style('opacity', '1')
			.attr('transform', function(d){
				return `translate(${getValueTextTransform(d)}, 0)`;
			});

		function getValueTextTransform(d){
			switch(d.year){
				case 2017 : return -40;
				case 2018 : return 50;
				default : return 0;
			};
		}
}

function removeLineChart(){
	d3.select('#cost-line-diagram')
		.selectAll('g')
		.style('opacity',0)
		.remove();
}