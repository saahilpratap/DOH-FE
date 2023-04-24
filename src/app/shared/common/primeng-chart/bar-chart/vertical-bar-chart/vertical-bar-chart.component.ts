import { Component, OnInit, Injector, Input, ViewChild, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AssessmentServiceProxy } from '../../../../../../shared/service-proxies/service-proxies';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
    selector: 'vertical-bar-chart',
    templateUrl: './vertical-bar-chart.component.html',
    styleUrls: ['./vertical-bar-chart.component.css'],
  animations: [appModuleAnimation()]
})

export class VerticalBarChartComponent extends AppComponentBase implements OnInit, OnDestroy {
    basicData: any;
    basicOptions: any;
    data: any[] = [];
    startDate: any = null;
    endDate: any = null;
    selectedValue: any;
    hview: any[] = [1000, 300];
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    showXAxisLabel: boolean = true;
    showXAxisLabelHorizontal = "Coverage";
    showXAxisLabelHorizontalSubmission = " Avereage Score";
    yAxisLabel: string = "Country";
    colorScheme = [
        { color: "#5386E4" },
        { color: "#4C4B63" },
        { color: "#72A98F" },
        { color: "#8DE969" },
        { color: "#CBEF43" },
        { color: "#F2F3AE" },
        { color: "#EDD382" },
        { color: "#FC9E4F" },
        { color: "#FF521B" },
        { color: "#EDBF85" },
        { color: "#F7F06D" },
        { color: "#FFB140" },
        { color: "#BC96E6" },
        { color: "#D8B4E2" },
        { color: "#AE759F" },
        { color: "#6C91C2" },
        { color: "#6C91C2" },
        { color: "#C3C9E9" },
        { color: "#AAABBC" },
        { color: "#F46036" }
    ];
    

    dataGroup = [
        { id: '1', name: 'Groups' },
        { id: '2', name: 'Individual' }
    ];
    xData = [
        { id: '1', name: '100' },
        { id: '2', name: '75' },
        { id: '3', name: '50' },
        { id: '3', name: '25' },
    ];
    stackedOptions: any;
    widthDynamic: any;
    legendChart = [        
        { name: 'Provision Of Health Service', colorCode: '' },
        { name: 'Pharmacy', colorCode: '' },
        { name: 'Center', colorCode: '' },
        { name: 'Hospital', colorCode: '' },
        { name: 'Clinic', colorCode: '' },
        { name: 'Drug Store - Medical Store', colorCode: '' },
        { name: 'Rehabilitation', colorCode: '' },
        { name: 'Fertilization Center(IVF)', colorCode: '' },
        { name: 'Scientific Office', colorCode: '' },
        { name: 'Diagnostic Center', colorCode: '' },
        { name: 'Dialysis Center', colorCode: '' },
        { name: 'Tele Medicine Provider', colorCode: '' },
        { name: 'Mobile Health Unit', colorCode: '' },
        { name: 'TCAM', colorCode: '' }
    ]

    constructor(injector: Injector,
        private _assessmentServiceProxy: AssessmentServiceProxy,
  ) {
        super(injector);
        am4core.useTheme(am4themes_animated);
  }

  ngOnInit() {
      this.selectedValue = "1";
     
      this.getData();     
      this.basicData = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
              {
                  label: 'My First dataset',
                  backgroundColor: '#4FA6B0',
                  data: [65, 59, 80, 81, 56, 55, 40]
              },
              {
                  label: 'My Second dataset',
                  backgroundColor: '#72B8C0',
                  data: [28, 48, 40, 19, 86, 27, 90]
              }
          ]
      };

     
    }
    ngAfterViewInit() {
        //this._assessmentServiceProxy.getFacilityTypeAssessmentBarChart(this.startDate, this.endDate, null, null, null, this.selectedValue, null)
        //    .subscribe((result) => {
        //        //this.data = result.series;
        //        result.series.forEach((x, index) => {
        //            this.data.push({ name: x.name, value: x.value, color: this.colorScheme[index].color });
        //        })
        //    });    
    }

  ngOnDestroy(): void {
  
  }
    applyDarkTheme() {
        this.basicOptions = {
            legend: {
                labels: {
                    fontColor: '#ebedef'
                },
                    position: 'bottom'
            },
            
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: '#ebedef'
                    },
                    gridLines: {
                        color: 'rgba(255,255,255,0.2)'
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontColor: '#ebedef'
                    },
                    gridLines: {
                        color: 'rgba(255,255,255,0.2)'
                    }
                }]
            }
        };
    }
    applyLightTheme() {
        this.basicOptions = {
            legend: {
                labels: {
                    fontColor: '#495057'
                },
                position: 'bottom'
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: '#495057'
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontColor: '#495057'
                    }
                }]
            }
        };
        this.stackedOptions.scales.xAxes[0].ticks = {
            fontColor: '#495057'
        };
        this.stackedOptions.scales.xAxes[0].gridLines = {
            color: '#ebedef'
        };
        this.stackedOptions.scales.yAxes[0].ticks = {
            fontColor: '#495057'
        };
        this.stackedOptions.scales.yAxes[0].gridLines = {
            color: '#ebedef'
        };
        this.stackedOptions.legend = {
            labels: {
                fontColor: '#495057'
            }
        };
        this.stackedOptions = { ...this.stackedOptions };

    }
    getData() {
        this.primengTableHelper.showLoadingIndicator();
        this.data = [];
        this._assessmentServiceProxy.getFacilityTypeAssessmentBarChart(this.startDate, this.endDate, null, null, null, this.selectedValue, null)
            .subscribe((result) => {
                 result.series.forEach((x, index) => {                    
                    this.data.push({ name: x.name, value: x.value, color: this.colorScheme[index].color });
                })

                
                
                //this.data = result.series ;
                this.widthDynamic = result.series.length * 5;
                if (result.series) {
                    
                }
            });
        this.primengTableHelper.hideLoadingIndicator();
        
        
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
    onChangeDropDown() {
        this.getData();
    }
}
