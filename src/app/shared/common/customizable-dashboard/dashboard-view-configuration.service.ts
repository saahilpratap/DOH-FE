import { Injectable, OnInit } from '@angular/core';
import { WidgetViewDefinition, WidgetFilterViewDefinition } from './definitions';
import { DashboardCustomizationConst } from './DashboardCustomizationConsts';
import { WidgetGeneralStatsComponent } from './widgets/widget-general-stats/widget-general-stats.component';
import { WidgetDailySalesComponent } from './widgets/widget-daily-sales/widget-daily-sales.component';
import { WidgetProfitShareComponent } from './widgets/widget-profit-share/widget-profit-share.component';
import { WidgetMemberActivityComponent } from './widgets/widget-member-activity/widget-member-activity.component';
import { WidgetRegionalStatsComponent } from './widgets/widget-regional-stats/widget-regional-stats.component';
import { WidgetSalesSummaryComponent } from './widgets/widget-sales-summary/widget-sales-summary.component';
import { WidgetIncomeStatisticsComponent } from './widgets/widget-income-statistics/widget-income-statistics.component';
import { WidgetRecentTenantsComponent } from './widgets/widget-recent-tenants/widget-recent-tenants.component';
import { WidgetEditionStatisticsComponent } from './widgets/widget-edition-statistics/widget-edition-statistics.component';
import { WidgetSubscriptionExpiringTenantsComponent } from './widgets/widget-subscription-expiring-tenants/widget-subscription-expiring-tenants.component';
import { WidgetHostTopStatsComponent } from './widgets/widget-host-top-stats/widget-host-top-stats.component';
import { FilterDateRangePickerComponent } from './filters/filter-date-range-picker/filter-date-range-picker.component';
import { WidgetTopStatsComponent } from './widgets/widget-top-stats/widget-top-stats.component';
import { WidgetEntityAssessmentUserComponent } from './widgets/widget-entity-assessment-user/widget-entity-assessment-user.component';
import { WidgetEntityComplianceSummaryComponent } from './widgets/widget-entity-compliance-summary/widget-entity-compliance-summary.component';
import { WidgetKanbanInteractivityDemoComponent } from './widgets/widgets-kanban-interactivity-demo/widgets-kanban-interactivity-demo.component';
import { WidgetTotalRiskStatisticsComponent } from './widgets/widget-total-risk-statistics/widget-total-risk-statistics.component';
import { WidgetComplianceScoreSummaryComponent } from './widgets/widget-compliance-score-summary/widget-compliance-score-summary.component';


@Injectable({
    providedIn: 'root'
})
export class DashboardViewConfigurationService {
    public WidgetViewDefinitions: WidgetViewDefinition[] = [];
    public widgetFilterDefinitions: WidgetFilterViewDefinition[] = [];

    constructor(
    ) {
        this.initializeConfiguration();
    }

    private initializeConfiguration() {
        let filterDateRangePicker = new WidgetFilterViewDefinition(
            DashboardCustomizationConst.filters.filterDateRangePicker,
            FilterDateRangePickerComponent
        );
        //add your filters here
        this.widgetFilterDefinitions.push(filterDateRangePicker);

        let generalStats = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.tenant.generalStats,
            WidgetGeneralStatsComponent,
            6,
            4
        );

        let dailySales = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.tenant.dailySales,
            WidgetDailySalesComponent,
        );

        let profitShare = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.tenant.profitShare,
            WidgetProfitShareComponent
        );

        let memberActivity = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.tenant.memberActivity,
            WidgetMemberActivityComponent,
        );

        let regionalStats = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.tenant.regionalStats,
            WidgetRegionalStatsComponent
        );

        let salesSummary = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.tenant.salesSummary,
            WidgetSalesSummaryComponent,
        );
        
        let complianceScoreSummary = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.tenant.complianceScoreSummary,
            WidgetComplianceScoreSummaryComponent,
        );

        let topStats = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.tenant.topStats,
            WidgetTopStatsComponent,
        );

        let topEntityAssessmentsUserStats = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.tenant.topEntityAssessmentsUserStats,
            WidgetEntityAssessmentUserComponent,
        );
        //add your tenant side widgets here

        let incomeStatistics = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.host.incomeStatistics,
            WidgetIncomeStatisticsComponent,
        );

        let editionStatistics = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.host.editionStatistics,
            WidgetEditionStatisticsComponent,
        );

        let recentTenants = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.host.recentTenants,
            WidgetRecentTenantsComponent,
        );

        let subscriptionExpiringTenants = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.host.subscriptionExpiringTenants,
            WidgetSubscriptionExpiringTenantsComponent
        );

        let hostTopStats = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.host.topStats,
            WidgetHostTopStatsComponent,
        );

        let hostTopEntityAssessmentsUserStats = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.host.topEntityAssessmentsUserStats,
            WidgetEntityAssessmentUserComponent,
        );

        let entityComplianceSummary = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.tenant.entityComplianceSummary,
            WidgetEntityComplianceSummaryComponent
        );
        
        let totalRiskStatistics = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.tenant.totalRiskStatistics,
            WidgetTotalRiskStatisticsComponent,
        );

        let kanbanInteractivityDemo = new WidgetViewDefinition(
            DashboardCustomizationConst.widgets.tenant.kanbanInteractivityDemo,
            WidgetKanbanInteractivityDemoComponent
        );
        //add your host side widgets here

        this.WidgetViewDefinitions.push(generalStats);
        this.WidgetViewDefinitions.push(dailySales);
        this.WidgetViewDefinitions.push(profitShare);
        this.WidgetViewDefinitions.push(memberActivity);
        this.WidgetViewDefinitions.push(regionalStats);
        this.WidgetViewDefinitions.push(salesSummary);
        this.WidgetViewDefinitions.push(complianceScoreSummary);

        this.WidgetViewDefinitions.push(entityComplianceSummary);
        this.WidgetViewDefinitions.push(totalRiskStatistics);
        this.WidgetViewDefinitions.push(kanbanInteractivityDemo);
        //this.WidgetViewDefinitions.push(topStats);
        this.WidgetViewDefinitions.push(incomeStatistics);
        this.WidgetViewDefinitions.push(editionStatistics);
        this.WidgetViewDefinitions.push(recentTenants);
        this.WidgetViewDefinitions.push(subscriptionExpiringTenants);
        this.WidgetViewDefinitions.push(hostTopStats);
        this.WidgetViewDefinitions.push(topEntityAssessmentsUserStats);
        //this.WidgetViewDefinitions.push(hostTopEntityAssessmentsUserStats);
        this.WidgetViewDefinitions.push(subscriptionExpiringTenants);
        this.WidgetViewDefinitions.push(hostTopStats);
        this.WidgetViewDefinitions.push(topEntityAssessmentsUserStats);
    }
}
