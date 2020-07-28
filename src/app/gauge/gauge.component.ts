import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Shape from 'd3';
@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss'],
})
export class GaugeComponent implements OnInit {
  gaugemap = {};

  dynamicValue = {
    achieved: '$ 7500',
    price: '+ $1000',
    low: '$ 5k',
    score: 2,
    high: '$ 10k',
    minValue: 0,
    maxValue: 10,
  };

  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>; // this is line defination

  constructor() {
    this.dynamicValue = {
      achieved: '$ 7500',
      price: '+ $1000',
      low: '$ 5k',
      score: 2,
      high: '$ 10k',
      minValue: 0,
      maxValue: 10,
    };
    // configure margins and width/height of the graph
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  public ngOnInit(): void {
    this.draw();
  }

  draw() {
    var self: any = this;

    var gauge = (container, configuration) => {
      var config = {
        size: 710,
        clipWidth: 200,
        clipHeight: 110,
        ringInset: 20,
        ringWidth: 20,
        pointerWidth: 20,
        pointerTailLength: 4,
        pointerHeadLengthPercent: 0.9,
        minValue: this.dynamicValue.minValue,
        maxValue: this.dynamicValue.maxValue,
        minAngle: -90,
        maxAngle: 90,
        transitionMs: 750,
        majorTicks: 10,
        labelFormat: d3.format('d'),
        labelInset: 10,
        arcColorFn: d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a')),
      };

      var colorFormat = [
        {
          ID: 1,
          SCORE_FROM: 0.0,
          SCORE_TO: 3.33,
          COLOR: '#FF5A5A',
          COMPANY_ID: 3,
        },
        {
          ID: 2,
          SCORE_FROM: 3.34,
          SCORE_TO: 6.66,
          COLOR: '#F2C91D', //'#EDB612',
          COMPANY_ID: 3,
        },
        {
          ID: 3,
          SCORE_FROM: 6.67,
          SCORE_TO: 10.0,
          COLOR: '#2BCC71',
          COMPANY_ID: 3,
        },
      ]

      var defaultColor = '#D3D3D3'

      var range = undefined;
      var r = undefined;
      var pointerHeadLength = undefined;
      var value = 0;
      var svg = undefined;
      var arc = undefined;
      var arc2 = undefined;
      var scale = undefined;
      var ticks = undefined;
      var tickData = undefined;
      var pointer = undefined;

      function deg2rad(deg) {
        return (deg * Math.PI) / 180;
      }

      function configure(configuration) {
        let prop = undefined;
        for (prop in configuration) {
          config[prop] = configuration[prop];
        }
        range = config.maxAngle - config.minAngle;
        r = config.size / 2;
        pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);
        // a linear scale this.gaugemap maps domain values to a percent from 0..1
        scale = d3
          .scaleLinear()
          .range([0, 1])
          .domain([config.minValue, config.maxValue]);
        ticks = scale.ticks(config.majorTicks);
        tickData = d3.range(config.majorTicks).map(function () {
          return 1 / config.majorTicks;
        });
        arc = d3
          .arc()
          .innerRadius(115)
          .outerRadius(70)
          .startAngle(function (d: any, i) {
            var ratio: any = d * i;
            return deg2rad(config.minAngle + ratio * range);
          })
          .endAngle(function (d: any, i) {
            var ratio: any = d * (i + 1);
            return deg2rad(config.minAngle + ratio * range);
          });
        arc2 = d3
          .arc()
          .innerRadius(130)
          .outerRadius(120)
          .startAngle(function (d: any, i) {
            var ratio: any = d * i;
            return deg2rad(config.minAngle + ratio * range);
          })
          .endAngle(function (d: any, i) {
            var ratio: any = d * (i + 1);
            return deg2rad(config.minAngle + ratio * range);
          });
      }

      self.gaugemap.configure = configure;

      function centerTranslation() {
        return 'translate(' + r + ',' + r + ')';
      }

      function isRendered() {
        return svg !== undefined;
      }

      self.gaugemap.isRendered = isRendered;

      function render(newValue) {
        svg = d3
          .select(container)
          .append('svg:svg')
          .attr('class', 'gauge')
          .attr('width', config.clipWidth)
          .attr('height', config.clipHeight);
        var centerTx = centerTranslation();
        var arcs = svg
          .append('g')
          .attr('class', 'arc')
          .attr('transform', centerTx);
        var arcs2 = svg
          .append('g')
          .attr('class', 'arc')
          .attr('transform', centerTx);
        arcs
          .selectAll('path')
          .data(tickData)
          .enter()
          .append('path')
          .attr('fill', function (d, i) {
            const [firstPart, secondPart, thirdPart] = colorFormat

            // return i < 3 ? '#D3D3D3' : i >= 3 && i < 7 ? '#F2C91D' : '#D3D3D3';

            if (firstPart.SCORE_FROM >= newValue || newValue <= firstPart.SCORE_TO) {
              return firstPart.SCORE_FROM >= i || i <= firstPart.SCORE_TO ? firstPart.COLOR : defaultColor
            }
            else if (secondPart.SCORE_FROM >= newValue || newValue <= secondPart.SCORE_TO) {
              return secondPart.SCORE_FROM >= i || i <= secondPart.SCORE_TO ? secondPart.COLOR : defaultColor
            }
            else if (thirdPart.SCORE_FROM >= newValue || newValue <= thirdPart.SCORE_TO) {
              return thirdPart.SCORE_FROM >= i || i <= thirdPart.SCORE_TO ? thirdPart.COLOR : defaultColor
            }
          })
          .attr('d', arc);
        arcs2
          .selectAll('path')
          .data(tickData)
          .enter()
          .append('path')
          .attr('fill', function (d, i) {

            const [firstPart, secondPart, thirdPart] = colorFormat

            return firstPart.SCORE_FROM >= i || i <= firstPart.SCORE_TO ? firstPart.COLOR
              : secondPart.SCORE_FROM >= i || i <= secondPart.SCORE_TO ? secondPart.COLOR
                : thirdPart.SCORE_FROM >= i || i <= thirdPart.SCORE_TO ? thirdPart.COLOR : null
          })
          .attr('d', arc2);
        var lg = svg
          .append('g')
          .attr('class', 'label')
          .attr('transform', centerTx);
        lg.selectAll('text')
          .data(ticks)
          .enter()
          .append('text')
          .attr('transform', function (d) {
            var ratio = scale(d);
            var newAngle = config.minAngle + ratio * range;
            return (
              'rotate(' +
              newAngle +
              ') translate(0,' +
              (config.labelInset - r) +
              ')'
            );
          })
          .text(config.labelFormat);
        var lineData = [
          [config.pointerWidth / 2, 0],
          [0, -pointerHeadLength],
          [-(config.pointerWidth / 2), 0],
          [0, config.pointerTailLength],
          [config.pointerWidth / 2, 0],
        ];
        var pointerLine = d3.line().curve(d3.curveLinear);
        var pg = svg
          .append('g')
          .data([lineData])
          .attr('class', 'pointer')
          .attr('transform', centerTx);
        pointer = pg
          .append('path')
          .attr('d', pointerLine /*function(d) { return pointerLine(d) +'Z';}*/)
          .attr('transform', 'rotate(' + config.minAngle + ')');
        update(newValue === undefined ? 0 : newValue);
      }

      self.gaugemap.render = render;

      function update(newValue, newConfiguration?) {
        if (newConfiguration !== undefined) {
          configure(newConfiguration);
        }
        var ratio = scale(newValue);
        var newAngle = config.minAngle + ratio * range;
        pointer
          .transition()
          .duration(config.transitionMs)
          .ease(d3.easeElastic)
          .attr('transform', 'rotate(' + newAngle + ')');
      }

      self.gaugemap.update = update;

      configure(configuration);

      return self.gaugemap;
    };

    var powerGauge: any = gauge('#power-gauge', {
      size: 300,
      clipWidth: 300,
      clipHeight: 200,
      ringWidth: 60,
      maxValue: 10,
      transitionMs: 4000,
    });

    powerGauge.render(this.dynamicValue.score);
  }
}
