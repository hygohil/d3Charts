import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  public title = 'Line Chart';
  data: any[] = [
    { date: new Date('2010-01-01'), value: 40 },
    { date: new Date('2010-01-04'), value: 120 },
    { date: new Date('2010-01-05'), value: 98 },
    { date: new Date('2010-01-06'), value: 130 },
    { date: new Date('2010-01-07'), value: 110 },
    { date: new Date('2010-01-08'), value: 70 },
    { date: new Date('2010-01-09'), value: 130 },
    { date: new Date('2010-01-10'), value: 107 },
    { date: new Date('2010-01-11'), value: 140 },
  ];

  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>; // this is line defination

  constructor() {
    // configure margins and width/height of the graph
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }
  public ngOnInit(): void {
    this.buildSvg();
    this.addXandYAxis();
    this.drawLineAndPath();
  }

  private buildSvg() {
    this.svg = d3
      .select('svg')
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );
  }
  private addXandYAxis() {
    // range of data configuring
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    // this.x.domain(d3Array.extent(this.data, (d) => d.date));
    // this.y.domain(d3Array.extent(this.data, (d) => d.value));

    this.x.domain(
      d3.extent(this.data, function (d) {
        return d.date;
      })
    );
    this.y.domain([
      0,
      d3.max(this.data, function (d) {
        return d.value;
      }),
    ]);

    // Configure the X Axis
    this.svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x).tickSize(-this.height).tickFormat(null))
      .attr('fill', '#F1F2F5')
      // .attr('fill-opacity', 0.4)
      .attr('stroke-dasharray', `${5},${5}`)
      .attr('stroke-width', 0.3);
    // Configure the Y Axis
    this.svg
      .append('g')
      .attr('class', 'grid')
      .attr('fill', '#F1F2F5')
      // .attr('fill-opacity', 0.4)
      .attr('stroke-dasharray', `${5},${5}`)
      .attr('stroke-width', 0.3)
      .call(d3Axis.axisLeft(this.y).tickSize(-this.width).tickFormat(null));
  }

  private drawLineAndPath() {
    this.line = d3Shape
      .area()
      .x((d: any) => this.x(d.date))
      .y1((d: any) => this.y(d.value))
      .y0(this.height);
    // Configuring line path
    this.svg
      .append('path')
      .attr('stroke-dasharray', `${5},${5}`)
      .datum(this.data)
      .attr('class', 'area')
      .attr('d', this.line)
      .attr('fill', '#89cff0')
      .attr('fill-opacity', 0.3)
      .attr('center-stroke', '#949596')
      .attr('stroke-width', 2);

    this.svg
      .selectAll('myCircles')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('fill', '#2BCC71')
      .attr('cx', (d) => this.x(d.date))
      .attr('cy', (d) => this.y(d.value))
      .attr('r', 3);
  }

  // function for the x grid lines
  private make_x_axis() {
    return this.svg.axis().scale(this.x).orient('bottom').ticks(5);
  }

  // function for the y grid lines
  private make_y_axis() {
    return this.svg.axis().scale(this.y).orient('left').ticks(5);
  }

  private xAxis() {
    return this.svg.axis().scale(this.x).orient('bottom').ticks(5);
  }
  private yAxis() {
    return this.svg.axis().scale(this.y).orient('left').ticks(5);
  }
}
