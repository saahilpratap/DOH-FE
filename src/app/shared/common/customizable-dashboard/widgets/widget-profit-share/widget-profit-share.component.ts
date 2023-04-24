import { Component, OnInit, Injector } from '@angular/core';
import { TenantDashboardServiceProxy, HealthCareLandingServiceProxy, IncidentExceptionFindingDto, AssementTypeCountDto } from '@shared/service-proxies/service-proxies';
import { DashboardChartBase } from '../dashboard-chart-base';
import { WidgetComponentBase } from '../widget-component-base';
import { Router } from '@angular/router';

class ProfitSharePieChart extends DashboardChartBase {
    businessEntityId: any;
    chartData: any[] = [];
    IncidentExceptionFinding: AssementTypeCountDto[] = [];
    scheme: any = {
        name: 'custom',
        selectable: true,
        group: 'Ordinal',
        domain: [
            '#00c5dc', '#ffb822', '#716aca'
        ]
    };

    colorScheme = {
        domain: ['#00c5dc', '#ffb822', '#716aca']
    };

    constructor(private _dashboardService: TenantDashboardServiceProxy, private _healthCareServiceProxy: HealthCareLandingServiceProxy) {
        super();
    }


    init(data: number[]) {

        let formattedData = [];
        for (let i = 0; i < data.length; i++) {
            formattedData.push({
                'name': this.getChartItemName(i),
                'value': data[i]
            });
        }

        this.chartData = formattedData;
    }

    getHealthCareDashboard() {
        this._healthCareServiceProxy.getDashboardBusinessIncidentRisk(this.businessEntityId).subscribe(res => {
            //   this.IncidentExceptionFinding = res;
            //this.IncidentExceptionFinding = res.incidentExceptionFindingCount;
            let totalcount = 0;
            res.forEach(obj => {
                totalcount = totalcount + obj.value;
            })
            res.forEach(obj => {
                var formated = Math.round((100 / totalcount) * (obj.value));
                obj.label = (formated.toString() == 'NaN' ? '0' : formated) + "% " + obj.name;
            })
            this.IncidentExceptionFinding = res;
        })
    }

    getChartItemName(index: number) {
        if (index === 0) {
            return 'Product Sales';
        }

        if (index === 1) {
            return 'Online Courses';
        }

        if (index === 2) {
            return 'Custom Development';
        }

        return 'Other';
    }

    reload() {
        this.showLoading();
        //  this._dashboardService.getProfitShare().subscribe(data => {
        //     this.init(data.profitShares);
        this.getHealthCareDashboard();
        this.hideLoading();
        //  });
    }
}

@Component({
    selector: 'app-widget-profit-share',
    templateUrl: './widget-profit-share.component.html',
    styleUrls: ['./widget-profit-share.component.css']
})
export class WidgetProfitShareComponent extends WidgetComponentBase implements OnInit {

    profitSharePieChart: ProfitSharePieChart;
    IncidentExceptionFinding: AssementTypeCountDto[] = [];
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    businessEntityId: any;
    view: any[] = [350, 250];
    colorScheme = {
        domain: ['#00c5dc', '#ffb822', '#716aca']
    };
    constructor(injector: Injector, private _router: Router,
        private _dashboardService: TenantDashboardServiceProxy, private _healthCareServiceProxy: HealthCareLandingServiceProxy) {
        super(injector);
        // this.profitSharePieChart = new ProfitSharePieChart(this._dashboardService);
        // this.IncidentExceptionFinding = new  AssementTypeCountDto[]=(this._healthCareServiceProxy);
    }

    ngOnInit() {
        this.getHealthCareDashboard();
    }

    getHealthCareDashboard() {
        this._healthCareServiceProxy.getDashboardBusinessIncidentRisk(this.businessEntityId).subscribe(res => {
            //   this.IncidentExceptionFinding = res;
            //this.IncidentExceptionFinding = res.incidentExceptionFindingCount;
            let totalcount = 0;
            res.forEach(obj => {
                totalcount = totalcount + obj.value;
            })
            res.forEach(obj => {
                var formated = Math.round((100 / totalcount) * (obj.value));
                obj.label = (formated.toString() == 'NaN' ? '0' : formated) + "% " + obj.name;
            })
            this.IncidentExceptionFinding = res;
        })
    }

    redirectTo(option) {      
        var url = '';
        var val = option.split('%')[1];
        switch (val) {
            case ' Incident': url = '/app/main/incidents/incidents'; break;
            case ' Exception': url = '/app/main/exceptions/exceptions'; break;
            case ' Business Risk': url = '/app/main/businessRisks/businessRisks'; break;
        }
        this._router.navigate([url]);
    }
}
