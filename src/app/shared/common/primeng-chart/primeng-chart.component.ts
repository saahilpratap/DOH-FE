import { Component, OnInit, Injector, Input, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { HorizontalBarChartComponent } from './bar-chart/horizontal-bar-chart/horizontal-bar-chart.component';
import { VerticalBarChartComponent } from './bar-chart/vertical-bar-chart/vertical-bar-chart.component';
import { MultiAxisLineChartComponent } from './line-chart/multi-axis-line-chart/multi-axis-line-chart.component';
import { StackedBarChartComponent } from './bar-chart/stacked-bar-chart/stacked-bar-chart.component';
import { BasicLineChartComponent } from './line-chart/basic-line-chart/basic-line-chart.component';
import { TopBottomStatusChartComponent } from './top-bottom-status/top-bottom-status-chart.component';
import { MultiAxisBarChartComponent } from './bar-chart/multi-axis-bar-chart/multi-axis-bar-chart.component';
import { TopBottomDomainListComponent } from './top-bottom-domain-list/top-bottom-domain-list.component';
import { TopBottomControlListComponent } from './top-bottom-control-list/top-bottom-control-list.component';

@Component({
    selector: 'primeng-chart',
    templateUrl: './primeng-chart.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./primeng-chart.component.css'],
  animations: [appModuleAnimation()]
})

export class PrimengChartComponent extends AppComponentBase implements OnInit, OnDestroy {
    @ViewChild(PieChartComponent) PieChartView: PieChartComponent;
    @ViewChild(HorizontalBarChartComponent) HorizontalBarChartView: HorizontalBarChartComponent;
    @ViewChild(VerticalBarChartComponent) VerticalBarChartView: VerticalBarChartComponent;
    @ViewChild(MultiAxisBarChartComponent) MultiAxisBarChartView: MultiAxisBarChartComponent;
    @ViewChild(StackedBarChartComponent) StackedBarChartView: StackedBarChartComponent;
    @ViewChild(BasicLineChartComponent) BasicLineChartView: BasicLineChartComponent;
    @ViewChild(TopBottomStatusChartComponent) TopBottomStatusChartView: TopBottomStatusChartComponent;
    @ViewChild(TopBottomDomainListComponent) TopBottomDomainListView: TopBottomDomainListComponent;
    @ViewChild(TopBottomControlListComponent) TopBottomControlListView: TopBottomControlListComponent;
    data: any;
    dataGroup = [
        { id: '1', name: 'Lable-Groups' },
        { id: '2', name: 'Lable - Hospital' }
    ];
    startDateValue: any;
    endDateValue: any;
    startDate: any;
    endDate: any;

  constructor(injector: Injector,
  ) {
    super(injector);
  }

    ngOnInit() {
        this.quaterdate();
      this.data = {
          labels: ['A', 'B', 'C'],
          datasets: [
              {
                  data: [300, 50, 100],
                  backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                  ],
                  hoverBackgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                  ]
              }]
      };
  
    }
    ngAfterViewInit() {

        setTimeout(() => {
            this.PieChartView.setDateData(this.startDate, this.endDate);
            this.HorizontalBarChartView.setDateData(this.startDate, this.endDate);
            this.VerticalBarChartView.setDateData(this.startDate, this.endDate);
            this.StackedBarChartView.setDateData(this.startDate, this.endDate);
            this.BasicLineChartView.setDateData(this.startDate, this.endDate);
            this.TopBottomStatusChartView.setDateData(this.startDate, this.endDate);
            this.MultiAxisBarChartView.setDateData(this.startDate, this.endDate);
            this.TopBottomDomainListView.setDateData(this.startDate, this.endDate);
            this.TopBottomControlListView.setDateData(this.startDate, this.endDate);
        }, 1000);

       
    }

    quaterdate() {      
        var month = new Date().getMonth() + 1;
        var quarter;
        if (month < 4)
            quarter = 1;
        else if (month < 7)
            quarter = 4;
        else if (month < 10)
            quarter = 7;
        else if (month < 13)
            quarter = 10;
        var quarterstartMonth = (Math.floor(new Date().getMonth() / 3) * 3) + 1;
        var quaterEndMonth = quarter + 2;
        var endday = "";
        if (quarter == 4 || quarter == 7) {
            endday = "30"
        }
        else {
            endday = "31"
        }
        var firstdate = quarter + "/1/" + "/" + new Date().getFullYear();
        var lastdate = quaterEndMonth + "/" + endday + "/" + "/" + new Date().getFullYear();
        var date = new Date(firstdate);
        var date2 = new Date(lastdate);
        this.startDateValue = date;
        this.endDateValue = date2;
        this.startDate = date;
        this.endDate = date2;
        this.BasicLineChartView.setDateData(date, date2);
        this.StackedBarChartView.setDateData(date, date2);
        this.PieChartView.setDateData(date, date2);
        this.HorizontalBarChartView.setDateData(date, date2);
        this.VerticalBarChartView.setDateData(date, date2);
        this.TopBottomStatusChartView.setDateData(date, date2);
        this.MultiAxisBarChartView.setDateData(date, date2);
        this.TopBottomDomainListView.setDateData(date, date2);
        this.TopBottomControlListView.setDateData(date, date2);
        //var startD = moment(this.startDate).format("MM/DD/YYYY");
        //var endD = moment(this.endDate).format("MM/DD/YYYY");
        //this.startDateValue = startD;
        //this.endDateValue = endD;       
    }

    getDate() {
        if (this.startDate == null || this.startDate.toString() == 'Invalid Date') {
            this.startDate = null;
            this.endDate = null;
        }
        else {
            if (this.endDate == null || this.endDate.toString() == 'Invalid Date') {
                this.endDate = this.startDate;
            }
        }
        this.startDateValue = this.startDate;
        this.endDateValue = this.endDate;
       
    }

    globalSearch(event?: any) {      
        this.BasicLineChartView.setDateData(this.startDate, this.endDate);
        this.StackedBarChartView.setDateData(this.startDate, this.endDate);
        this.PieChartView.setDateData(this.startDate, this.endDate);
        this.TopBottomStatusChartView.setDateData(this.startDate, this.endDate);
        this.HorizontalBarChartView.setDateData(this.startDate, this.endDate);
        this.VerticalBarChartView.setDateData(this.startDate, this.endDate);
        this.MultiAxisBarChartView.setDateData(this.startDate, this.endDate);
        this.TopBottomDomainListView.setDateData(this.startDate, this.endDate);
        this.TopBottomControlListView.setDateData(this.startDate, this.endDate);
    }

  ngOnDestroy(): void {
  
  }

  
   
}
