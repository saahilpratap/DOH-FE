import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { SalesSummaryDatePeriod, TenantDashboardServiceProxy, IRMSummaryDetailDto, HealthCareLandingServiceProxy } from '@shared/service-proxies/service-proxies';
import { WidgetComponentBase } from '../widget-component-base';
import * as moment from 'moment';
import { Router } from '@angular/router';


@Component({
    selector: 'app-widget-sales-summary',
    templateUrl: './widget-sales-summary.component.html',
    styleUrls: ['./widget-sales-summary.component.css']
})
export class WidgetSalesSummaryComponent extends WidgetComponentBase implements OnInit, OnDestroy {

    appSalesSummaryDateInterval = SalesSummaryDatePeriod;
    startdate: Date;
    enddate: Date;
    StartDates: any;
    EndDates: any;
    view: any[] = [700, 300];
    incidentTotal: number = 0;
    exceptionTotal: number = 0;
    businessRiskTotal: number = 0;
    findingTotal: number = 0;

    result: IRMSummaryDetailDto[] = [];
    businessEntityId: any;
    type: string = 'Monthly';
    timeline = true;
    autoScale = true;   
    legend: boolean = true;
    showLabels: boolean = true;  
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = true;
    showXAxisLabel: boolean = true;   
    animations: false;


    constructor(injector: Injector, private _router: Router,
        private _healthCareServiceProxy: HealthCareLandingServiceProxy) {
        super(injector);
        this.startdate = new Date(Date.now());
        this.enddate = new Date(Date.now());
    }

    ngOnInit() {
        this.getHealthCareDashboard();
    }

    onclick(val) {
        this.type = val;
        this.EndDates = moment(this.enddate).toDate();
        this.StartDates = moment(this.startdate).toDate();
        if (val == 'Daily') {
            this.getRecord(this.EndDates, this.EndDates);
        } else if (val == 'Weekly') {
            this.StartDates.setDate(this.StartDates.getDate() - 7);
            this.getRecord(this.StartDates, this.EndDates);
        } else if (val == '') {
            this.StartDates.setDate(this.StartDates.getDate() - 30);
            this.getRecord(this.StartDates, this.EndDates);
        } else if (val == 'Yearly') {
            this.StartDates.setDate(this.StartDates.getDate() - 365);
            this.getRecord(this.StartDates, this.EndDates);
        }
    }

    getHealthCareDashboard() {
        this.StartDates = moment(this.startdate).toDate();
        this.EndDates = moment(this.enddate).toDate();
        this.onclick('Monthly');     
    }

    getRecord(sDate: any, eDate: any) {      
        this.result = [];
        this._healthCareServiceProxy.getAllIRMSummary(sDate, eDate, this.businessEntityId).subscribe(res => {
            this.result = res;
            this.exceptionTotal = 0;
            this.incidentTotal = 0;
            this.findingTotal = 0;
            this.businessRiskTotal = 0;

            var incidentInfo = res.find(x => x.name == 'Incident');
            if (incidentInfo != undefined) {
                incidentInfo.series.forEach(x => {
                    this.incidentTotal = this.incidentTotal + x.value;
                });
            }
            var exceptionInfo = res.find(x => x.name == 'Exception');
            if (exceptionInfo != undefined) {
                exceptionInfo.series.forEach(x => {
                    this.exceptionTotal = this.exceptionTotal + x.value;
                });
            }
            var findingInfo = res.find(x => x.name == 'Finding');
            if (findingInfo != undefined) {
                findingInfo.series.forEach(x => {
                    this.findingTotal = this.findingTotal + x.value;
                });
            }
            var businessRiskInfo = res.find(x => x.name == 'Business Risk');
            if (businessRiskInfo != undefined) {
                businessRiskInfo.series.forEach(x => {
                    this.businessRiskTotal = this.businessRiskTotal + x.value;
                });
            }
        });
    }
    redirectTo(url) {
        this._router.navigate([url]);
    }
}
