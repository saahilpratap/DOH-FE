import { Component, OnInit, Injector, Input, ViewChild, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AssessmentServiceProxy } from '../../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'popar-area-chart',
    templateUrl: './popar-area-chart.component.html',
    styleUrls: ['./popar-area-chart.component.css'],
  animations: [appModuleAnimation()]
})

export class PoparAreaChartComponent extends AppComponentBase implements OnInit, OnDestroy {
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
          datasets: [{
              data: [
                  11,
                  16,
                  7,
                  3,
                  14
              ],
              backgroundColor: [
                  "#FF6384",
                  "#4BC0C0",
                  "#FFCE56",
                  "#E7E9ED",
                  "#36A2EB"
              ],
              label: 'My dataset'
          }],
          labels: [
              "Red",
              "Green",
              "Yellow",
              "Grey",
              "Blue"
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
