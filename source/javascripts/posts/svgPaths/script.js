var margin = 10,
    width = 750 - margin*2,
    height = 500 - margin*2;

var colors = ['steelblue', 'red', 'green', 'purple', 'orange', 'gold']
colors = colors.concat(colors).concat(colors)
colors = colors.concat(colors).concat(colors)


//move to
!(function(){
  var drag = d3.behavior.drag()
      .on('drag', function(d){
        d[0] = Math.round(Math.max(0, Math.min(width,  d3.event.x)))
        d[1] = Math.round(Math.max(0, Math.min(height, d3.event.y)))
        update()
      })
      .origin(function(d){ return {x: d[0], y: d[1]} })

  function update(){
    svg.selectAll('circle').translate(f())
    path.attr('d', ['M' + circlePos.join('L')].join(' '))

    text.html('')
    circlePos.forEach(function(d, i){
      text.append('span').text(i ? ' L ' : 'M ')
      text.append('span.cord').text(d).style('color', colors[i])
    })
  }

  var text = d3.select('#moveto').append('div.pathstr')

  var svg = d3.select('#moveto').append('svg')
      .attr({width: width + margin*2, height: height + margin*2})
    .append('g')
      .translate([margin, margin])
  svg.append('rect')
      .attr({width: width, height: height})
      .style('opacity', 0)
      .on('click', function(){
        circlePos.push(d3.mouse(this).map(Math.round))
        drawCircles()
        update()
      })


  var circlePos = [[100, 200], [400, 300], [123, 44]]
  function drawCircles(){
    svg.selectAll('circle')
        .data(circlePos).enter()
      .append('circle.draggable')
        .style('fill', function(d, i){ return colors[i] })
        .attr('r', margin)
        .call(drag)
  }

  var path = svg.append('path.editable')

  drawCircles()
  update()

})()





!(function(){
  var drag = d3.behavior.drag()
      .on('drag', function(d){
        d[0] = Math.round(Math.max(0, Math.min(width,  d3.event.x)))
        d[1] = Math.round(Math.max(0, Math.min(height, d3.event.y)))
        update()
      })
      .origin(function(d){ return {x: d[0], y: d[1]} })

  function update(){
    svg.selectAll('circle').translate(f())

    ctrlG.selectAll('.ctrl-connect').remove()
    ctrlG.selectAll('.ctrl-connect')
        .data(circlePos.filter(function(d, i){ return i%2 })).enter()
      .append('path.ctrl-connect')
        .attr('d', function(d, i){ return ['M', d, 'L', circlePos[i*2]].join('') })
        .style('stroke', f('color'))



    var sIndexes = d3.range(2, circlePos.length/2)
    path.attr('d',  [ 'M', circlePos[0], 
                      'C', circlePos.slice(1, 4).join(' '),
                      sIndexes.map(function(i){
                        console.log(i)
                        return ['S', circlePos[2*i], circlePos[2*i + 1]].join(' ')
                      })
                    ].join(' '))




    text.html('')
    text.append('span').text('M ')
    text.append('span.cord').text(circlePos[0]).style('color', colors[0])
    text.append('span').text(' C ')
    text.append('span.ctrl').text(circlePos[1]).style('color', colors[0])
    text.append('span.ctrl').text(circlePos[2]).style('color', colors[1])
    text.append('span.cord').text(circlePos[3]).style('color', colors[1])

    sIndexes.forEach(function(i){
      text.append('span.ctrl').text(circlePos[2*i])    .style('color', colors[i])
      text.append('span.cord').text(circlePos[2*i + 1]).style('color', colors[i])
    })
  }

  var text = d3.select('#bez1').append('div.pathstr')

  var svg = d3.select('#bez1').append('svg')
      .attr({width: width + margin*2, height: height + margin*2})
    .append('g')
      .translate([margin, margin])
  svg.append('rect')
      .attr({width: width, height: height})
      .style('opacity', 0)
      .on('click', function(){
        circlePos.push(d3.mouse(this).map(function(d){ return Math.round(d*.8) }))
        circlePos.push(d3.mouse(this).map(Math.round))
        drawCircles()
        update()
      })

  var ctrlG = svg.append('g')
  var path = svg.append('path.editable')

  var circlePos = [[100, 200], [400, 300], [123, 44], [10, 44]]
  
  function drawCircles(){
    var circle = svg.selectAll('circle')
        .data(circlePos)

    circle.enter()
      .append('circle.draggable')
        .each(function(d, i){
          d.isCtrl = !(i % 2) == !(i < 2)
          d.color = colors[Math.floor(i/2)]
        })
        .style('fill',   function(d, i){ return d.isCtrl ? 'rgba(255,255,255,.99)' : d.color })
        .style('stroke', function(d, i){ return d.isCtrl ? d.color : '' })
        .call(drag)
        .on('dblclick', function(d){
          if (circlePos.length == 4) return

          var i = Math.floor(_.indexOf(circlePos, d)/2)
          circlePos.splice(i*2, 2)
          drawCircles()
          update()
        })   
        .attr('r', 0)
      .transition()
        .attr('r', margin)

    circle.exit()
      .transition()
        .attr('r', 0)
        .remove()
  }

  drawCircles()
  update()



})()