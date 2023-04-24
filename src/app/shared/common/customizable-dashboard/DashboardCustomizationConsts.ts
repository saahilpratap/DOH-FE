export class DashboardCustomizationConst {
    static widgets = {
        tenant: {
            profitShare: 'Widgets_Tenant_ProfitShare',
            memberActivity: 'Widgets_Tenant_MemberActivity',
            regionalStats: 'Widgets_Tenant_RegionalStats',
            salesSummary: 'Widgets_Tenant_SalesSummary',
            topStats: 'Widgets_Tenant_TopStats',
            generalStats: 'Widgets_Tenant_GeneralStats',
            dailySales: 'Widgets_Tenant_DailySales',
            topEntityAssessmentsUserStats: 'Widgets_Tenant_TopEntityAssessmentsUserStats',
            complianceScoreSummary: 'Widget_Compliance_Score_Summary',           
            entityComplianceSummary: 'Widgets_Tenant_EntityComplianceSummary',
            totalRiskStatistics: 'Widgets_Tenant_TotalRiskStatistics',
            kanbanInteractivityDemo: 'Widgets_Tenant_KanbanInteractivityDemo',
        },
        host: {
            topStats: 'Widgets_Host_TopStats',
            incomeStatistics: 'Widgets_Host_IncomeStatistics',
            editionStatistics: 'Widgets_Host_EditionStatistics',
            subscriptionExpiringTenants: 'Widgets_Host_SubscriptionExpiringTenants',
            recentTenants: 'Widgets_Host_RecentTenants',
            topEntityAssessmentsUserStats: 'Widgets_Host_TopEntityAssessmentsUserStats',
        }
    };
    static filters = {
        filterDateRangePicker: 'Filters_DateRangePicker'
    };
    static dashboardNames = {
        defaultTenantDashboard: 'TenantDashboard',
        defaultHostDashboard: 'HostDashboard',
    };
    static Applications = {
        Angular: 'Angular'
    };
}
