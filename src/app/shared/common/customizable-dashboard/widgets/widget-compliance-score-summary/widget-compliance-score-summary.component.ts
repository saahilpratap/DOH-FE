import { Component, OnInit, Injector } from '@angular/core';
import { TenantDashboardServiceProxy, IdNameDto, AssessmentServiceProxy, DashboardDOmainGraphDto } from '@shared/service-proxies/service-proxies';
import { DashboardChartBase } from '../dashboard-chart-base';
import { WidgetComponentBase } from '../widget-component-base';
import {
    BusinessEntitiesServiceProxy, ADControlrequirementCountDto, HealthCareLandingServiceProxy, GetBusinessEntitiesExcelDto, UserOriginType, EntityType, AuditDashboardServiceProxy, IncidentExceptionFindingDto, AssementTypeCountDto, BusinessEntitysListDto, HealthcarelandingDto
} from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'widget-compliance-score-summary',
    templateUrl: './widget-compliance-score-summary.component.html',
    styleUrls: ['./widget-compliance-score-summary.component.css']
})
export class WidgetComplianceScoreSummaryComponent extends WidgetComponentBase implements OnInit {
    entityList: IdNameDto[] = [];
    entityId: number = 0;
    domainList: DashboardDOmainGraphDto[] = [];
    finalPercentage: number = 0;
    single: any[];
    view: any[] = [300, 300];
    incidentExceptionFindingDto: IncidentExceptionFindingDto[]=[];

    colorScheme = {
        domain: ['#5AA454', '#ffb822']
    };
    ProgressBar: ADControlrequirementCountDto[] = [];

    constructor(injector: Injector,
        private _assessmentServiceProxy: AssessmentServiceProxy
    ) {
        super(injector);
    }
  
    loadData() {
        this._assessmentServiceProxy.assessmentBusinessEntity().subscribe(res => {
            this.entityList = res;
            if (res.length != 0) {
                this.entityId = this.entityList[0].id;
                this.onEntityChange(this.entityId);
            }
        });
    }

    ngOnInit() {
        this.loadData();
    }

    onEntityChange(val) {
        
        if (val != null) {
            this._assessmentServiceProxy.dashboardDOmainGraphEntityId(val).subscribe(res => {
                this.domainList = res;
                //let final = 0;
                //this.domainList.forEach(x => {
                //    final = final + x.percentage
                //});               
                //this.finalPercentage = Math.round((final) / this.domainList.length);
                //var a = new IncidentExceptionFindingDto();
                //a.name = "All Domain";
                //a.value = this.finalPercentage;

                //var b = new IncidentExceptionFindingDto();
                //b.name = "";
                //b.value = 100 - this.finalPercentage;

                //this.incidentExceptionFindingDto.push(a);
                //this.incidentExceptionFindingDto.push(b);
            });
        }
        else {
            this.domainList = [];
        }
    }
}
