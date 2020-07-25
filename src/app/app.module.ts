import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GaugeComponent } from './gauge/gauge.component';
import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
  declarations: [AppComponent, GaugeComponent, LineChartComponent],
  imports: [
    BrowserModule,
    // AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
