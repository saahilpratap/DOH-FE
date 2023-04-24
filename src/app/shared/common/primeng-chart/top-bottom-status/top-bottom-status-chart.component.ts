import { Component, OnInit, Injector, Input, ViewChild, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AssessmentServiceProxy } from '../../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'top-bottom-status-chart',
    templateUrl: './top-bottom-status-chart.component.html',
    styleUrls: ['./top-bottom-status-chart.component.css'],
  animations: [appModuleAnimation()]
})

export class TopBottomStatusChartComponent extends AppComponentBase implements OnInit, OnDestroy {
    selectedValue: any;
    topStatus: any;
    bottomStatus: any;
    startDate: any = null;
    endDate: any = null;
    multi: any[];
    view: any[] = [700, 300];

    // options
    legend: boolean = true;
    showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = 'Year';
    yAxisLabel: string = 'Population';
    timeline: boolean = true;

    colorScheme = {
        domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    };
    dataGroup = [
        { id: '1', name: 'Groups' },
        { id: '2', name: 'Hospital' },
        { id: '3', name: 'Center' },
        { id: '4', name: 'Individual' }
    ];

    constructor(injector: Injector,
        private _assessmentServiceProxy: AssessmentServiceProxy,
  ) {
    super(injector);
  }

    ngOnInit() {
        this.selectedValue = "1";
        this.getData();
  }

  ngOnDestroy(): void {
  
  }

    getData() {
        this._assessmentServiceProxy.getAssessmentDashboardTopBottomChart(this.startDate, this.endDate, null, null, this.selectedValue, null, null)
            .subscribe((result) => {             
                this.topStatus = result.topCompliance;
                this.bottomStatus = result.bottomCompliance;
                }
           )      
    };

    setDateData(fromDate: Date, endDate: Date) {
        if (fromDate == null || fromDate.toString() == 'Invalid Date') {
            endDate = null;
            fromDate = null;
        }
        else {
            if (endDate == null || endDate.toString() == 'Invalid Date') {
                endDate = fromDate;
            }
        }
        this.startDate = fromDate;
        this.endDate = endDate;
        this.getData();
    }
   
}
