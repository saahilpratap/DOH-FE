import { Component, OnInit, Injector, Input, ViewChild, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AssessmentServiceProxy } from '../../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'radar-chart',
    templateUrl: './radar-chart.component.html',
    styleUrls: ['./radar-chart.component.css'],
  animations: [appModuleAnimation()]
})

export class RadarChartComponent extends AppComponentBase implements OnInit, OnDestroy {
    selectedValue: any;
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
      this.data = {
          labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
          datasets: [
              {
                  label: 'My First dataset',
                  backgroundColor: 'rgba(179,181,198,0.2)',
                  borderColor: 'rgba(179,181,198,1)',
                  pointBackgroundColor: 'rgba(179,181,198,1)',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: 'rgba(179,181,198,1)',
                  data: [65, 59, 90, 81, 56, 55, 40]
              },
              {
                  label: 'My Second dataset',
                  backgroundColor: 'rgba(255,99,132,0.2)',
                  borderColor: 'rgba(255,99,132,1)',
                  pointBackgroundColor: 'rgba(255,99,132,1)',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: 'rgba(255,99,132,1)',
                  data: [28, 48, 40, 19, 96, 27, 100]
              }
          ]
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
