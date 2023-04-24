import { Component, OnInit, Injector, Input, ViewChild, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AssessmentServiceProxy, AssessmentPieStatusDto } from '../../../../../shared/service-proxies/service-proxies';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
    selector: 'pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.css'],
  animations: [appModuleAnimation()]
})

export class PieChartComponent extends AppComponentBase implements OnInit, OnDestroy {
    selectedValue: any;
    data: any[] = [];   
    startDate: any = null;
    endDate: any = null;
    dataGroup = [
        { id: '1', name: 'Groups' },
        { id: '2', name: 'Hospital' },
        { id: '3', name: 'Center' }
    ];

    single: any[];
    view: any[] = [500, 300];

    // options
    gradient: boolean = true;
    showLegend: boolean = true;
    showLabels: boolean = false;
    isDoughnut: boolean = false;
    legendPosition: string = 'below';
    colorScheme = {
        domain: ['#4fa6b0', '#f45d78', '#f4e05d' ]
    };

   

    assessmentPieStatusDto: AssessmentPieStatusDto[] = [];
  constructor(injector: Injector,
      private _assessmentServiceProxy: AssessmentServiceProxy,
  ) {
      super(injector);
      am4core.useTheme(am4themes_animated);
  }

    ngOnInit() {
      this.selectedValue = "1";
        this.getData
        
    }

    getData() {
        this._assessmentServiceProxy.getAssessmentDashboardPieChart(this.startDate, this.endDate, this.selectedValue, null, null, null, null)
            .subscribe((result) => {              
                this.data = result.assessmentPieStatuses;
                this.assessmentPieStatusDto = result.assessmentPieStatuses;
                //this.getChartData();              
                this.single = result.assessmentPieStatuses;
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
    getChartData() {
        let chart = am4core.create("pieChart", am4charts.PieChart);

        // Add data
        chart.data = this.data;

        // Add and configure Series
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "name";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;

        // This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;

    }
  



  ngOnDestroy(): void {
  
  }   
}
