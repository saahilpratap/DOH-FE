import { Component, OnInit, Injector, Input, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AssessmentServiceProxy, MultiGroupBarChartDto } from '../../../../../shared/service-proxies/service-proxies';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
    selector: 'doughnut-chart',
    templateUrl: './doughnut-chart.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./doughnut-chart.component.css'],
    animations: [appModuleAnimation()]
})

export class DoughnutChartComponent extends AppComponentBase implements OnInit, OnDestroy {
    selectedValue: any;
    data: any;
    cData: any[] = [];
    diWidth: any;
    widthDynamic: any;
   
    dataGroup = [
        { id: '1', name: 'Groups' },
        { id: '2', name: 'Hospital' },
        { id: '3', name: 'Center' }
    ];
    xData = [
        { id: '1', name: '100' },
        { id: '2', name: '75' },
        { id: '3', name: '50' },
        { id: '3', name: '25' },        
    ];


    multi: any[];
    view: any[] = [700, 400];

    // options
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = true;
    showLegend: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = 'Country';
    showYAxisLabel: boolean = true;
    yAxisLabel: string = 'Population';
    legendTitle: string = 'Years';

    colorScheme = {
        domain: ['#5AA454', '#C7B42C', '#AAAAAA', '#ff0000']
    };


    constructor(injector: Injector,
        private _assessmentServiceProxy: AssessmentServiceProxy,
    ) {
        super(injector);
        am4core.useTheme(am4themes_animated);
    }

    ngOnInit() {
        this.selectedValue = "1";
        this.getData();
        this.getChartData();

        function percentTickFormatting(val: any): string {
            alert('');
            return val.toLacaleString('en-us', {
                syle: 'percent',
                maximumSignificantDigits: 1
            });
        }
    }

    ngOnDestroy(): void {

    }

    getData() {
        this.primengTableHelper.showLoadingIndicator();
        this._assessmentServiceProxy.getAssessmentsMonitorQuaterBarChart(null, null, null, null, null, null, this.selectedValue)
            .subscribe((result) => {                
                this.data = result;
                this.multi = result;
                //this.data = result.totalMonitoredBarChart;
                this.cData = [];
                this.widthDynamic = result.length * 19;
      
                result.forEach((item, index) => {
                    this.cData.push({
                        name: item.name, q1: item.q1Value, q2: item.q2Value, q3: item.q1Value, q4: item.q1Value, q1Y: item.q1Value +"% - "+ item.q1Year
                        , q2Y: item.q2Value + "% - " + item.q2Year, q3Y: item.q3Value + "% - " + item.q3Year, q4Y: item.q4Value + "% - " + item.q4Year

                    });                   
                });
                this.primengTableHelper.hideLoadingIndicator();

                if (this.cData) {
                    this.getChartData();
                }               
                
            })

    };

    getChartData() {
        let chart = am4core.create("chartDoughnut", am4charts.XYChart3D);

        chart.data = this.cData;

        // Create axes
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());

        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 100;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Average Score (Last Three Quaters)";
        valueAxis.renderer.labels.template.adapter.add("text", function (text) {
            return text + "%";
        });

        // Create series
        let series = chart.series.push(new am4charts.ColumnSeries3D());
        series.dataFields.valueY = "q1";
        series.dataFields.categoryX = "name";
        series.dataFields.categoryY = "q1Y";
        series.name = "Q1";
        series.clustered = true;
        series.columns.template.tooltipText = "Q1: [bold]{categoryY}[/]";
        series.columns.template.fillOpacity = 0.9;
        series.columns.template.stroke = am4core.color("#f44336");
        series.columns.template.fill = am4core.color("#f44336");
        series.columns.template.width = am4core.percent(25);

        let series2 = chart.series.push(new am4charts.ColumnSeries3D());
        series2.dataFields.valueY = "q2";
        series2.dataFields.categoryX = "name";
        series2.dataFields.categoryY = "q2Y";
        series2.name = "Q2";
        series2.clustered = true;
        series2.columns.template.tooltipText = "Q2: [bold]{categoryY}[/]";
        series2.columns.template.stroke = am4core.color("#9C27B0");
        series2.columns.template.fill = am4core.color("#9C27B0");
        series2.columns.template.width = am4core.percent(25);

        let series3 = chart.series.push(new am4charts.ColumnSeries3D());
        series3.dataFields.valueY = "q3";
        series3.dataFields.categoryX = "name";
        series3.dataFields.categoryY = "q3Y";
        series3.name = "Q3";
        series3.clustered = true;
        series3.columns.template.tooltipText = "Q3: [bold]{categoryY}[/]";
        series3.columns.template.stroke = am4core.color("#3F51B5");
        series3.columns.template.fill = am4core.color("#3F51B5");
        series3.columns.template.width = am4core.percent(25);


        let series4 = chart.series.push(new am4charts.ColumnSeries3D());
        series4.dataFields.valueY = "q4";
        series4.dataFields.categoryX = "name";
        series4.dataFields.categoryY = "q4Y";
        series4.name = "Q4";
        series4.clustered = true;
        series4.columns.template.tooltipText = "Q4: [bold]{categoryY}[/]";
        series4.columns.template.stroke = am4core.color("#03A9F4");
        series4.columns.template.fill = am4core.color("#03A9F4");
        series4.columns.template.width = am4core.percent(25);

        chart.scrollbarX = new am4core.Scrollbar();

        chart.legend = new am4charts.Legend();

        chart.cursor = new am4charts.XYCursor();
        chart.responsive.enabled = true;
    }

}

