import { Component, OnInit, Injector, Input, ViewChild, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AssessmentServiceProxy } from '../../../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'line-styles-line-chart',
    templateUrl: './line-styles-line-chart.component.html',
    styleUrls: ['./line-styles-line-chart.component.css'],
  animations: [appModuleAnimation()]
})

export class LineStylesLineChartComponent extends AppComponentBase implements OnInit, OnDestroy {
    lineStylesData: any;
    selectedValue: any;
    basicOptions: any;
    data: any;
    dataGroup = [
        { id: '1', name: 'Lable-Groups' },
        { id: '2', name: 'Lable - Hospital' }
    ];

    constructor(injector: Injector,
        private _assessmentServiceProxy: AssessmentServiceProxy,
  ) {
    super(injector);
  }

    ngOnInit() {
        this.selectedValue = 1;
        this.getData();
      this.lineStylesData = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
              {
                  label: 'First Dataset',
                  data: [65, 59, 80, 81, 56, 55, 40],
                  fill: false,
                  borderColor: '#42A5F5'
              },
              {
                  label: 'Second Dataset',
                  data: [28, 48, 40, 19, 86, 27, 90],
                  fill: false,
                  borderDash: [5, 5],
                  borderColor: '#66BB6A'
              },
              {
                  label: 'Third Dataset',
                  data: [12, 51, 62, 33, 21, 62, 45],
                  fill: true,
                  borderColor: '#FFA726',
                  backgroundColor: 'rgba(255,167,38,0.2)'
              }
          ]
      };
      this.basicOptions = {
          legend: {
              labels: {
                  fontColor: '#495057'
              },
              
                  position: 'bottom'
             
          },
          scales: {
              xAxes: [{
                  ticks: {
                      fontColor: '#495057'
                  }
              }],
              yAxes: [{
                  ticks: {
                      fontColor: '#495057'
                  }
              }]
          }
      };
  }

  ngOnDestroy(): void {
  
  }

    getData() {
        this._assessmentServiceProxy.getAssessmentDashboardPieChart(null, null, this.selectedValue, null, null, null, null)
            .subscribe((result) => {

            }
            )
    };
   
}
