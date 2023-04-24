import { Component, OnInit, Injector, Input, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AssessmentServiceProxy } from '../../../../../../shared/service-proxies/service-proxies';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_spiritedaway from "@amcharts/amcharts4/themes/spiritedaway";

@Component({
    selector: 'basic-line-chart',
    templateUrl: './basic-line-chart.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./basic-line-chart.component.css'],
    animations: [appModuleAnimation()]
})

export class BasicLineChartComponent extends AppComponentBase implements OnInit, OnDestroy {
    basicData: any;
    basicOptions: any;
    startDate: any = null;
    endDate: any = null;
    data: any;
    selectedValue: any;
    hview: any[] = [1000, 300];
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    showXAxisLabel: boolean = true;
    showXAxisLabelHorizontal = "";
    showXAxisLabelHorizontalSubmission = "Facility Type";
    yAxisLabel = "Average Score";
    cData: any[] = [];
    diWidth: any;
    widthDynamic: any;
    heightBar: any;
    formatDataLabel(value) {
        return value + '%';
    };
    colorScheme = {
        domain: ["#4E56A6", "#984FA8", "#A94F83", "#AF5452"],
    };
    dataGroup = [
        { id: '1', name: 'Lable-Groups' },
        { id: '2', name: 'Lable - Hospital' }
    ];
    xData = [
        { id: '1', name: '100' },
        { id: '2', name: '75' },
        { id: '3', name: '50' },
        { id: '3', name: '25' },
    ];
    constructor(injector: Injector,
        private _assessmentServiceProxy: AssessmentServiceProxy,
    ) {
        super(injector);
        //am4core.useTheme(am4themes_animated);
        //am4core.useTheme(am4themes_spiritedaway);
          am4core.useTheme(am4themes_animated);
    }

    ngOnInit() {
        this.getData();        
    }

    ngOnDestroy(): void {

    }
   
    getData() {
        this._assessmentServiceProxy.getTotalFacilityTypeAssessmentBarChart(this.startDate, this.endDate, null, null, null, null, null)
            .subscribe((result) => {
                this.data = result.series;
                this.widthDynamic = result.series.length * 5;
                this.cData = [];
                this.heightBar = Math.max.apply(Math, result.series.map(function (o) { return o.value; }));
                //if (result.series.length < 10) {
                //    this.diWidth = result.series.length * 25
                //}
                //else if (result.series.length < 20) {
                //    this.diWidth = result.series.length * 20
                //}
                //else {
                //    this.diWidth = result.series.length * 15
                //}
                result.series.forEach(item => {
                    this.cData.push({ name: item.name, value: item.value, value1: 100 - item.value });
                });
                this.getChartData();
            });       
    };

    getChartData() {     
        let chart = am4core.create("cylinderIdGauge", am4charts.XYChart3D);

        //chart.titles.create().text = "Crude oil reserves";

        // Add data
        chart.data = this.cData;

        // Create axes
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 0;
        categoryAxis.title.text = "";

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = -10;
        valueAxis.max = 110;
        valueAxis.strictMinMax = true;
        valueAxis.renderer.baseGrid.disabled = true;
        valueAxis.title.text = "Average Score";
        valueAxis.renderer.labels.template.adapter.add("text", function (text) {
            return text + "%";
        });

        // Create series
        let series1 = chart.series.push(new am4charts.ConeSeries());
        series1.dataFields.valueY = "value";
        series1.dataFields.categoryX = "name";
        series1.name = "Score";
        series1.clustered = true;
        series1.columns.template.tooltipText = "Score: [bold]{valueY}[/]%";
        series1.columns.template.width = am4core.percent(20);
        series1.columns.template.fillOpacity = 0.9;
        series1.columns.template.strokeOpacity = 1;
        series1.columns.template.strokeWidth = 2;

        let series2 = chart.series.push(new am4charts.ConeSeries());
        series2.dataFields.valueY = "value1";
        series2.dataFields.categoryX = "name";
        series2.name = "Remaining";
        series2.clustered = true;
        series2.columns.template.tooltipText = "Remaining: [bold]{valueY}[/]%";
        series2.stacked = true;
        series2.columns.template.width = am4core.percent(20);
        series2.columns.template.fill = am4core.color("#000");
        series2.columns.template.fillOpacity = 0.1;
        series2.columns.template.stroke = am4core.color("#000");
        series2.columns.template.strokeOpacity = 0.2;
        series2.columns.template.strokeWidth = 2;

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
