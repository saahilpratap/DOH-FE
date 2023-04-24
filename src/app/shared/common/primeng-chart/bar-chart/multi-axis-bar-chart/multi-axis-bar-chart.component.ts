import { Component, OnInit, Injector, Input, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AssessmentServiceProxy } from '../../../../../../shared/service-proxies/service-proxies';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
    selector: 'multi-axis-bar-chart',
    templateUrl: './multi-axis-bar-chart.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./multi-axis-bar-chart.component.css'],
    animations: [appModuleAnimation()]
})

export class MultiAxisBarChartComponent extends AppComponentBase implements OnInit, OnDestroy {
    multiAxisData: any;
    chartOptions: any;
    multiAxisOptions: any;
    selectedValue: any;
    startDate: any = null;
    endDate: any = null;
    data: any;
    view: any[] = [1100, 400];
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = 'Facility Type';
    showYAxisLabel: boolean = true;
    yAxisLabel: string = 'Total Count';
    legendTitle: string = 'Legend';
    cData: any[] = [];
    widthDynamic: any;
    heightBar: any;
    colorScheme = {
        domain: ["#9900FF", "#CC00FF"]
    };
    dataGroup = [
        { id: '1', name: 'Lable-Groups' },
        { id: '2', name: 'Lable - Hospital' }
    ];
    diWidth: any;
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
        this._assessmentServiceProxy.getMonitoredAssessmentBarChart(this.startDate, this.endDate, null, null, null, null, null)
            .subscribe((result) => {             
                this.data = result;
                this.widthDynamic = result.length * 10;
                this.cData = [];
                let heightOne = Math.max.apply(Math, result.map(function (o) { return o.tValue; }));
                let heightTwo = Math.max.apply(Math, result.map(function (o) { return o.mValue; }));
                this.heightBar = heightOne >= heightTwo ? heightOne : heightTwo;
                this.heightBar = this.heightBar + 50;
                //if (result.length < 10) {
                //    this.diWidth = result.length * 30
                //}
                //else if (result.length < 20) {
                //    this.diWidth = result.length * 25
                //}
                //else {
                //    this.diWidth = result.length * 20
                //}
                //this.data = result.totalMonitoredBarChart;
                //this.diWidth = result.totalMonitoredBarChart.length
              
                result.forEach((item, index) => {
                    this.cData.push({ name: item.name, tValue: item.tValue, mValue: item.mValue });
                });
                if (this.cData) {
                    this.getChartData();
                } 
            }
            )
    };
    getChartData() {

        let chart = am4core.create("monitoringStatus", am4charts.XYChart3D);

        // Add data
        chart.data = this.cData;


        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 100;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.title.text = "Monitored and Total Count As Per Facility Type";
        valueAxis.renderer.labels.template.adapter.add("text", function (text) {
            return text + "";
        });

        let series = chart.series.push(new am4charts.ColumnSeries3D());
        series.dataFields.valueY = "tValue";
        series.dataFields.categoryX = "name";
        series.name = "Total";
        series.clustered = true;
        series.columns.template.tooltipText = "Total : [bold]{valueY}[/]";
        series.columns.template.fillOpacity = 0.9;
        series.columns.template.stroke = am4core.color("#f44336");
        series.columns.template.fill = am4core.color("#f44336");
        series.columns.template.width = am4core.percent(30);

        let series2 = chart.series.push(new am4charts.ColumnSeries3D());
        series2.dataFields.valueY = "mValue";
        series2.dataFields.categoryX = "name";
        series2.name = "Monitored";
        series2.clustered = true;
        series2.columns.template.tooltipText = "Monitored : [bold]{valueY}[/]";
        series2.columns.template.stroke = am4core.color("#9C27B0");
        series2.columns.template.fill = am4core.color("#9C27B0");
        series2.columns.template.width = am4core.percent(30);

        chart.scrollbarX = new am4core.Scrollbar();

        chart.legend = new am4charts.Legend();

        chart.cursor = new am4charts.XYCursor();
        chart.responsive.enabled = true;

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
}
