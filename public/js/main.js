'use strict';

$.getJSON('languages', function(data) {
    if (!data.languages) return;

    var langs = data.languages;
    var unknown = data.unknown;
    var total = data.total;
    var bilinguals = data.bilinguals;
    var htmlUnknown = '';

    // format languages
    var items = Object.keys(langs).map(function (lang) {
        return {
            'lang': lang,
            'total': langs[lang]
        };
    });

    items.sort(function (a, b) { return b.total - a.total; });

    var cells = items.map(function (e) {
        return '<li class="list-group-item"> <span class="badge">' + e.total + '</span> ' + e.lang + ' </li>';
    });

    $('#details').append(cells.join(''));

    // format unknown
    htmlUnknown = unknown.map(function (e) {
        return '<li class="list-group-item"> ' + e + '</li>';
    }).join('');

    $('#unknown').append(htmlUnknown);

    // numbers
    $('#total-group').append(total);
    $('#bilinguals').append(bilinguals);
    $('#no-data').append(unknown.length);

    // d3 viz

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) { return d.value; })
      .direction('n')
      .offset([0, 1]);

    items = items.map(function (e) {
        return {
            'packageName': e.lang,
            'className': e.lang,
            'value': e.total
        };
    });

    var diameter = 800;
    var color = d3.scale.category10();

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select('#viz').append('svg')
        .attr('width', diameter)
        .attr('height', diameter)
        .attr('class', 'bubble')
        .call(tip);

    var node = svg.selectAll('.node')
        .data(bubble.nodes({children: items})
        .filter(function(d) { return !d.children; }))
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

    node.append('circle')
        .attr('r', function(d) { return d.r; })
        .style('fill', function(d) { return color(d.packageName); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    node.append('text')
        .attr('dy', '.3em')
        .style('text-anchor', 'middle')
        .text(function(d) { return d.className.substring(0, d.r / 3); });


});
