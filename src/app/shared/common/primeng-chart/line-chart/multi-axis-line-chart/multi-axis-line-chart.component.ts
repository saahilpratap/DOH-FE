import { Component, OnInit, Injector, Input, ViewChild, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AssessmentServiceProxy } from '../../../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'multi-axis-line-chart',
    templateUrl: './multi-axis-line-chart.component.html',
    styleUrls: ['./multi-axis-line-chart.component.css'],
  animations: [appModuleAnimation()]
})

export class MultiAxisLineChartComponent extends AppComponentBase implements OnInit, OnDestroy {
    multiAxisData: any;
    multiAxisOptions: any;
    data: any;
    selectedValue: any;
    startDate: any = null;
    endDate: any = null;
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
      this.multiAxisData = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
              label: 'Dataset 1',
              fill: false,
              borderColor: '#42A5F5',
              yAxisID: 'y-axis-1',
              data: [65, 59, 80, 81, 56, 55, 10]
          }, {
              label: 'Dataset 2',
              fill: false,
              borderColor: '#00bb7e',
              yAxisID: 'y-axis-2',
              data: [28, 48, 40, 19, 86, 27, 90]
          }]
      };

      this.multiAxisOptions = {
          responsive: true,
          hoverMode: 'index',
          stacked: false,
          scales: {
              yAxes: [{
                  type: 'linear',
                  display: true,
                  position: 'left',
                  id: 'y-axis-1',
              }, {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  id: 'y-axis-2',
                  gridLines: {
                      drawOnChartArea: false
                  }
              }]
          },
          legend: {
              position: 'bottom'
          }
      };
  
  }

  ngOnDestroy(): void {
  
  }

    getData() {
        this._assessmentServiceProxy.getAssessmentDashboardPieChart(this.startDate, this.endDate, this.selectedValue, null, null, null, null)
            .subscribe((result) => {

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
