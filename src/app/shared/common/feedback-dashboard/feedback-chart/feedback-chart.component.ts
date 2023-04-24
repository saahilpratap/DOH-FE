import { Component, Injector, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels, ApexPlotOptions, ApexYAxis,
    ApexTitleSubtitle, ApexXAxis, ApexFill
} from "ng-apexcharts";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FeedbacksServiceProxy } from '../../../../../shared/service-proxies/service-proxies';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    title: ApexTitleSubtitle;
};


@Component({
    selector:'feedback-chart',
    templateUrl: './feedback-chart.component.html',
    styleUrls: ['./feedback-chart.component.less']
})

export class FeedbackChartComponent extends AppComponentBase {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    @Input('chartData') chartData: any;
    @Input('xaxisData') xaxisData: any;
    @Input('titleText') titleText: any;
    @Input('data') data: any;
    @Input('feedbackId') feedbackId: any;
    displayModal: boolean;
    listData: any;
    constructor(
        injector: Injector,
        private _feedbacksServiceProxy: FeedbacksServiceProxy,
    ) {
        super(injector);
       
    }
  
    ngOnInit() {        
        let data = [];
        let name = [];        
        this.chartData.forEach(x => {
            data.push(x.count), name.push(x.answer)
        })
        this.titleText;
        this.chartOptions = {
            series: [
                {
                    //name: "Inflation",                  
                    data: data
                }
            ],

            chart: {
                height: 350,
                type: "bar",
                events: {
                   
                    dataPointSelection: (event, chartContext, config) => this.showFeedback(event, chartContext, config)
                }               
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        position: "bottom" // top, center, bottom
                    }
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + "%";
                },
                offsetY: -20,
                style: {
                    fontSize: "12px",
                    colors: ["#304758"]
                }
            },

            xaxis: {
                categories: name,                
                position: "top",
                labels: {
                    offsetY: 1
                },
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                crosshairs: {
                    fill: {
                        type: "gradient",
                        gradient: {
                            colorFrom: "#D8E3F0",
                            colorTo: "#D8E3F0",
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    offsetY: -35
                }
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "light",
                    type: "horizontal",
                    shadeIntensity: 0.25,
                    gradientToColors: undefined,
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [50, 0, 100, 100]
                }
            },
            yaxis: {
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    show: false,
                    formatter: function (val) {
                        return val + "%";
                    }
                }
            },
            title: {
                text: this.titleText,
                floating: true,
                offsetY: 320,
                align: "center",
                style: {
                    color: "#444"
                }
            },

        };
    }
    showFeedback(event, chartContext, config) {      
        this.getEntityData(config.w.globals.labels[config.dataPointIndex]);
    }
    getData(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
            this.primengTableHelper.hideLoadingIndicator();
        }

        this.primengTableHelper.showLoadingIndicator();
    }

    getEntityData(ans) {      
        this._feedbacksServiceProxy.getBusinessEntitiesByQuestionIdAns(this.feedbackId, this.data.questionId, ans).subscribe(res => {
            this.listData = res;
            this.displayModal = true;               
        });
    }
}
