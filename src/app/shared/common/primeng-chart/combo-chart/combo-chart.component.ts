import { Component, OnInit, Injector, Input, ViewChild, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AssessmentServiceProxy } from '../../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'combo-chart',
    templateUrl: './combo-chart.component.html',
    styleUrls: ['./combo-chart.component.css'],
  animations: [appModuleAnimation()]
})

export class ComboChartComponent extends AppComponentBase implements OnInit, OnDestroy {
    data: any;
    selectedValue: any;
    chartOptions: any;
    
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
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
              type: 'line',
              label: 'Dataset 1',
              borderColor: '#42A5F5',
              borderWidth: 2,
              fill: false,
              data: [
                  50,
                  25,
                  12,
                  48,
                  56,
                  76,
                  42
              ]
          }, {
              type: 'bar',
              label: 'Dataset 2',
              backgroundColor: '#66BB6A',
              data: [
                  21,
                  84,
                  24,
                  75,
                  37,
                  65,
                  34
              ],
              borderColor: 'white',
              borderWidth: 2
          }, {
              type: 'bar',
              label: 'Dataset 3',
              backgroundColor: '#FFA726',
              data: [
                  41,
                  52,
                  24,
                  74,
                  23,
                  21,
                  32
              ]
          }]
      };
      this.chartOptions = {
          responsive: true,
          legend: {
              position: 'bottom'
          },
          title: {
              display: true,
              text: 'Combo Bar Line Chart'
          },
          tooltips: {
              mode: 'index',
              intersect: true
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
