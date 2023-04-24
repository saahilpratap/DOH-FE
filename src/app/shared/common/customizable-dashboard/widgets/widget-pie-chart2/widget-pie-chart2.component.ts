import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { HealthCareLandingServiceProxy } from '@shared/service-proxies/service-proxies';
@Component({
  selector: 'app-widget-pie-chart2',
  templateUrl: './widget-pie-chart2.component.html',
    styleUrls: ['./widget-pie-chart2.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class WidgetPieChart2Component implements OnInit {
  @Input() subName: string;
  multi: any[];
  view: any[] = [500, 400];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  xAxisLabel = 'Overall Compliance %';
  showYAxisLabel = true;
  yAxisLabel = '';
    result: any;
    checkin: any;
  colorScheme = {
    domain: ['#4fa6b0', '#fd397a', '#4fa6b0', '#AAAAAA'],
  };
  single: { name: string; value: number }[];
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
    constructor(
        private _healthCareServiceProxy: HealthCareLandingServiceProxy       
    ) {
    this.single = [
      {
        name: 'Implemented control',
        value: 89.77,
      },
      {
        name: 'Gap',
        value: 10.23,
      },
    ];
  }

    ngOnInit() {
        this.getRecords();
    }
    getRecords() {
        this._healthCareServiceProxy.getAllEntityComplianceCount().subscribe(res => {
            this.result = res.overAllEntityCompCount;
        })
    }
}
