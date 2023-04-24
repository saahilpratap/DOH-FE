import { Component, OnInit, Injector, Input, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Subscription } from 'rxjs';
import { AssessmentServiceProxy, AssessmentPieStatusDto } from '../../../../../../shared/service-proxies/service-proxies';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
    selector: 'stacked-bar-chart',
    templateUrl: './stacked-bar-chart.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./stacked-bar-chart.component.css'],
    animations: [appModuleAnimation()]
})

export class StackedBarChartComponent extends AppComponentBase implements OnInit, OnDestroy {
   
    subscription: Subscription;
    selectedValue: any;
    startDate: any = null;
    endDate: any = null;
    data: any;
    basicData: any;
    
    formatDataLabel(value) {
        return value + '%';
    };
    colorScheme = {
        domain: ['#4fa6b0'],
    };
    dataGroup = [
        { id: '1', name: 'Groups' },
        { id: '2', name: 'Hospital' },
        { id: '3', name: 'Center' }
    ];

    single: any[];
    multi: any[];

    view: any[] = [700, 400];

    // options
    hview: any[];
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = 'Country';
    showYAxisLabel = true;
    yAxisLabel = 'Population';
    legendPosition: string = 'below';
    xAxisTicks = [10, 15, 20, 25, 30, 35, 40, 45];

    xData = [
        { id: '1', name: '100' },
        { id: '2', name: '75' },
        { id: '3', name: '50' },
        { id: '3', name: '25' },
    ];
    data1: AssessmentPieStatusDto[] = [];
    cData: any[] = [];
    diWidth: any;
    widthDynamic: any;
    constructor(injector: Injector,
        private _assessmentServiceProxy: AssessmentServiceProxy,
    ) {
        super(injector);
        am4core.useTheme(am4themes_animated);
    }

    ngOnInit() {
        this.selectedValue = "1";
        this.getData();
    }    
    ngOnDestroy(): void {

    }


    getData() {
        this.primengTableHelper.showLoadingIndicator();
        this.cData = [];
        this._assessmentServiceProxy.getAssessmentDashboardBarChartOne(this.startDate, this.endDate, null, this.selectedValue, null, null, null)
            .subscribe((result) => {
                result.series.forEach(item => {                    
                    //this.data1.push(new AssessmentPieStatusDto({ 'name': item.name, 'value': item.value }));
                    this.cData.push({ name: item.name, value: item.value, value1: 100 - item.value });                    
                });

                this.primengTableHelper.hideLoadingIndicator();
                this.widthDynamic = result.series.length * 5;
                for (let i = 0; i < 8; i++) {
                    this.data = result.series;  
                }
                            
                
                if (this.cData) {
                    this.getChartData();                  
                }

                  this.diWidth = result.series.length * 2
                
                  this.hview = [this.diWidth, 350]
                if (result.series.length > 10) {

                  
                } else {
                   // this.hview = [750, 350]
                }


            })




    };


    getChartData() {
        let chart = am4core.create("cylinderGauge", am4charts.XYChart3D);
        chart.data = this.cData;


        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.grid.template.strokeOpacity = 0;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = -10;
        valueAxis.max = 110;
        valueAxis.strictMinMax = true;
        valueAxis.renderer.baseGrid.disabled = true;
        valueAxis.title.text = "Average Score";
        valueAxis.renderer.labels.template.adapter.add("text", function (text) {
            return text + "%";
        });

        let series1 = chart.series.push(new am4charts.ConeSeries());
        series1.dataFields.valueY = "value";
        series1.dataFields.categoryX = "name";
        series1.name = "Score";
        series1.columns.template.tooltipText = "Score: [bold]{valueY}[/] %";
        series1.columns.template.width = am4core.percent(25);
        series1.columns.template.fillOpacity = 0.9;
        series1.columns.template.strokeOpacity = 1;
        series1.columns.template.strokeWidth = 2;

        let series2 = chart.series.push(new am4charts.ConeSeries());
        series2.dataFields.valueY = ("value1");
        series2.dataFields.categoryX = "name";
        series2.name = "Remaining";
        series2.stacked = true;
        series2.columns.template.tooltipText = "Remaining: [bold]{valueY}[/] %";
        series2.columns.template.width = am4core.percent(25);
        series2.columns.template.fill = am4core.color("#000");
        series2.columns.template.fillOpacity = 0.1;
        series2.columns.template.stroke = am4core.color("#000");
        series2.columns.template.strokeOpacity = 0.2;
        series2.columns.template.strokeWidth = 2;

        chart.scrollbarX = new am4core.Scrollbar();

        chart.legend = new am4charts.Legend();

        chart.cursor = new am4charts.XYCursor();
        chart.responsive.enabled = true;

        let range = valueAxis.createSeriesRange(series2);
        range.value = 0;
        range.endValue = 100;
    }
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
    onChangeDropDown() {
        this.getData();
    }
}
