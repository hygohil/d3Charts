import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Axis from 'd3';
import { FormControl } from '@angular/forms';
import moment from 'moment';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  selectedValue: FormControl;
  public title = 'Line Chart';
  data: any[] = [
    { date: new Date('2020-01-01'), value: 40 },
    { date: new Date('2020-02-04'), value: 60 },
    { date: new Date('2020-03-05'), value: 90 },
    { date: new Date('2020-04-06'), value: 20 },
    { date: new Date('2020-05-07'), value: 100 },
    { date: new Date('2020-01-08'), value: 70 },
    { date: new Date('2020-01-09'), value: 110 },
    { date: new Date('2020-01-10'), value: 55 },
    { date: new Date('2020-01-11'), value: 130 },
  ];
  months = [];
  historyData;
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
    console.log('height', this.height, 'widhth', this.width);
    this.months = this.data.reduce((accm, dataItem) => {
      const date = moment(dataItem.date).format('MMM YYYY');
      return accm.includes(date) ? accm : [...accm, date];
    }, []);
    console.log(this.data);
    this.historyData = Object.assign([], this.data);
    // this.selectedValue.setValue(this.historyData[0].month)
  }
  public ngOnInit(): void {
    this.selectedValue = new FormControl();
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
      )
      .attr('id', 55);
  }

  private addXandYAxis() {
    // range of data configuring
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    console.log('new', this.data);
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
    console.log('new', this.x);
    console.log('new', this.y);
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
    let div: any = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
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
      .selectAll('dot')
      .data(this.data)
      .enter()
      .append('circle')
      .on('mouseover', function (d) {
        div.transition().duration(2000).style('opacity', 0.9);
        div
          .html(d.date + '<br/>' + d.value)
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY - 28 + 'px');
      })
      .on('mouseout', function (d) {
        div.transition().duration(5000).style('opacity', 0);
      })
      .attr('fill', function (d, i) {
        return d.value < 50
          ? '#FF5A5A'
          : d.value >= 50 && d.value < 100
          ? '#F2C91D'
          : '#2BCC71';
      })
      .attr('cx', (d) => this.x(d.date))
      .attr('cy', (d) => this.y(d.value))
      .attr('r', 5);
  }

  public async onValueChange($ev: any) {
    this.data = [];
    this.svg = undefined;
    this.x = undefined;
    this.y = undefined;
    this.line = undefined;
    this.data = await this.historyData.filter(
      (historyItem) => $ev === moment(historyItem.date).format('MMM YYYY')
    );
    this.buildSvg();
    this.addXandYAxis();
    this.drawLineAndPath();
  }
}
