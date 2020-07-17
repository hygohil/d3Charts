import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GaugeComponent } from './gauge/gauge.component';
import { LineChartComponent } from './line-chart/line-chart.component';

const routes: Routes = [
  { path: 'gauge-chart', component: GaugeComponent },
  { path: 'line-chart', component: LineChartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
