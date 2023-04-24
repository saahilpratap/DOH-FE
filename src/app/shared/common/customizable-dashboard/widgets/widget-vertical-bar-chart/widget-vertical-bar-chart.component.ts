import { Component, OnInit } from '@angular/core';
import { HealthCareLandingServiceProxy } from '@shared/service-proxies/service-proxies';
@Component({
  selector: 'app-widget-vertical-bar-chart',
  templateUrl: './widget-vertical-bar-chart.component.html',
  styleUrls: ['./widget-vertical-bar-chart.component.css'],
})
export class WidgetVerticalBarChartComponent implements OnInit {
  multi: any[];

  view: any[] = [500, 300];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Overall Compliance %';
  showYAxisLabel = true;
    yAxisLabel = '';
    checkin: any;
    result: any;
    legendPosition: string = 'below';
  colorScheme = {
      domain: ['#4fa6b0', '#fd397a', '#AAAAAA', '#AAAAAA'],
  };
    single: { name: string; value: number; }[];

    constructor(
        private _healthCareServiceProxy: HealthCareLandingServiceProxy 
    ) {
    this.single = [
      {
        name: 'Basic',
        value: 99.32,
      },
      {
        name: 'Transitional',
        value: 92.73,
      },
      {
        name: 'Advanced',
        value: 77.27,
      },
    ];
  }

    ngOnInit() {
        this.getRecords();
    }

  onSelect(event) {
    console.log(event);
    }

    getRecords() {
        this._healthCareServiceProxy.getAllAssessmentEntityControlType().subscribe(res => {
            this.result = res.entityControlTypeCount;
        })
    }
}
