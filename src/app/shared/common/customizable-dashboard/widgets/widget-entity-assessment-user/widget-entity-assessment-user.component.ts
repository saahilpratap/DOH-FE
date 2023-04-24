import { Component, OnInit, Injector } from '@angular/core';
import { WidgetComponentBase } from '../widget-component-base';
import { DashboardChartBase } from '../dashboard-chart-base';
import { TenantDashboardServiceProxy, CommonTopStatForHostAndTenant } from '../../../../../../shared/service-proxies/service-proxies';
import { Router } from '@angular/router';

class DashboardTopEntityAssessmentUserStats extends DashboardChartBase {

    totalActiveEntities = 0; totalActiveEntitiesCounter = 0;
    newAssessmentsSubmitted = 0; newAssessmentsSubmittedCounter = 0;
    newExternalAssessments = 0; newExternalAssessmentsCounter = 0;
    newUsers = 0; newUsersCounter = 0;

    totalActiveEntitiesChange = 0; totalActiveEntitiesChangeCounter = 0;
    newAssessmentsSubmittedChange = 0; newAssessmentsSubmittedChangeCounter = 0;
    newExternalAssessmentsChange = 0; newExternalAssessmentsChangeCounter = 0;
    newUsersChange = 0; newUsersChangeCounter = 0;

    userPercentage = 0;
    activityEntityPercentage = 0;
    assessmentPercentage = 0;
    externalAssessmentPercentage = 0;

    init(totalActiveEntities, totalActiveEntitiesChange, newAssessmentsSubmitted, newAssessmentsSubmittedChange,
        newExternalAssessments, newExternalAssessmentsChange, newUsers, newUsersChange) {
        this.totalActiveEntities = totalActiveEntities;
        this.totalActiveEntitiesChange = totalActiveEntitiesChange;
        this.newAssessmentsSubmitted = newAssessmentsSubmitted;
        this.newAssessmentsSubmittedChange = newAssessmentsSubmittedChange;
        this.newExternalAssessments = newExternalAssessments;
        this.newExternalAssessmentsChange = newExternalAssessmentsChange;
        this.newUsers = newUsers;
        this.newUsersChange = newUsersChange;
        this.hideLoading();
        this.userPercentage = ((newUsersChange / newUsers) * 100);
        this.externalAssessmentPercentage = ((newExternalAssessmentsChange / newExternalAssessments) * 100);
        this.assessmentPercentage = ((newAssessmentsSubmittedChange / newAssessmentsSubmitted) * 100);
        this.activityEntityPercentage = ((totalActiveEntitiesChange / totalActiveEntities) * 100);
    }
}

@Component({
    selector: 'app-widget-entity-assessment-user',
    templateUrl: './widget-entity-assessment-user.component.html',
    styleUrls: ['./widget-entity-assessment-user.component.css']
})
export class WidgetEntityAssessmentUserComponent extends WidgetComponentBase implements OnInit {

    dashboardTopEntityAssessmentUserStats: DashboardTopEntityAssessmentUserStats;

    constructor(injector: Injector, private _router: Router,
        private _tenantDashboardServiceProxy: TenantDashboardServiceProxy
    ) {
        super(injector);
        this.dashboardTopEntityAssessmentUserStats = new DashboardTopEntityAssessmentUserStats();
    }

    ngOnInit() {
        this.loadTopStatsData();
    }

    loadTopStatsData() {
        //this._tenantDashboardServiceProxy.getTopStats().subscribe((data) => {
        //    this.dashboardTopEntityAssessmentUserStats.init(data.totalProfit, data.newFeedbacks, data.newOrders, data.newUsers);
        //});

        this._tenantDashboardServiceProxy.getTopStatByTenant().subscribe((data: CommonTopStatForHostAndTenant) => {
            this.dashboardTopEntityAssessmentUserStats.init(data.totalActiveEntities, data.totalActiveEntitiesChange,
                data.newAssessmentsSubmitted, data.newAssessmentsSubmittedChange,
                data.newExternalAssessments, data.newExternalAssessmentsChange,
                data.newUsers, data.newUsersChange);
        });
    }

    redirectToActiveEntites(url) {
        this._router.navigate([url],
            {
                queryParams: {
                    type: 0
                }
            });
    }

    redirectTo(url) {
        this._router.navigate([url]);
    }
}
