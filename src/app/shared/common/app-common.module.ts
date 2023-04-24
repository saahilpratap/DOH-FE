import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { LockthreatComplianceCommonModule } from '@shared/common/common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { ModalModule, TabsModule, BsDropdownModule, BsDatepickerConfig, BsDaterangepickerConfig, BsLocaleService} from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { CommonLookupModalComponent } from './lookup/common-lookup-modal.component';
import { EntityTypeHistoryModalComponent } from './entityHistory/entity-type-history-modal.component';
import { EntityChangeDetailModalComponent } from './entityHistory/entity-change-detail-modal.component';
import { DateRangePickerInitialValueSetterDirective } from './timing/date-range-picker-initial-value.directive';
import { DatePickerInitialValueSetterDirective } from './timing/date-picker-initial-value.directive';
import { DateTimeService } from './timing/date-time.service';
import { TimeZoneComboComponent } from './timing/timezone-combo.component';
import { CustomizableDashboardComponent } from './customizable-dashboard/customizable-dashboard.component';
import { WidgetGeneralStatsComponent } from './customizable-dashboard/widgets/widget-general-stats/widget-general-stats.component';
import { DashboardViewConfigurationService } from './customizable-dashboard/dashboard-view-configuration.service';
import { GridsterModule } from 'angular-gridster2';
import { WidgetDailySalesComponent } from './customizable-dashboard/widgets/widget-daily-sales/widget-daily-sales.component';
import { WidgetEditionStatisticsComponent } from './customizable-dashboard/widgets/widget-edition-statistics/widget-edition-statistics.component';
import { WidgetHostTopStatsComponent } from './customizable-dashboard/widgets/widget-host-top-stats/widget-host-top-stats.component';
import { WidgetIncomeStatisticsComponent } from './customizable-dashboard/widgets/widget-income-statistics/widget-income-statistics.component';
import { WidgetMemberActivityComponent } from './customizable-dashboard/widgets/widget-member-activity/widget-member-activity.component';
import { WidgetProfitShareComponent } from './customizable-dashboard/widgets/widget-profit-share/widget-profit-share.component';
import { WidgetRecentTenantsComponent } from './customizable-dashboard/widgets/widget-recent-tenants/widget-recent-tenants.component';
import { WidgetRegionalStatsComponent } from './customizable-dashboard/widgets/widget-regional-stats/widget-regional-stats.component';
import { WidgetSalesSummaryComponent } from './customizable-dashboard/widgets/widget-sales-summary/widget-sales-summary.component';
import { WidgetSubscriptionExpiringTenantsComponent } from './customizable-dashboard/widgets/widget-subscription-expiring-tenants/widget-subscription-expiring-tenants.component';
import { WidgetTopStatsComponent } from './customizable-dashboard/widgets/widget-top-stats/widget-top-stats.component';
import { WidgetEntityComplianceSummaryComponent } from './customizable-dashboard/widgets/widget-entity-compliance-summary/widget-entity-compliance-summary.component';
import { WidgetKanbanInteractivityDemoComponent } from './customizable-dashboard/widgets/widgets-kanban-interactivity-demo/widgets-kanban-interactivity-demo.component';
import { WidgetTotalRiskStatisticsComponent } from './customizable-dashboard/widgets/widget-total-risk-statistics/widget-total-risk-statistics.component';
import { WidgetComplianceScoreSummaryComponent } from './customizable-dashboard/widgets/widget-compliance-score-summary/widget-compliance-score-summary.component';
import { AuthorityReviewApprovalComponent } from './customizable-dashboard/common-component/authority-review-approval/authority-review-approval.component';
import { EntityReviewApprovalComponent } from './customizable-dashboard/common-component/entity-review-approval/entity-review-approval.component';

import { FilterDateRangePickerComponent } from './customizable-dashboard/filters/filter-date-range-picker/filter-date-range-picker.component';
import { AddWidgetModalComponent } from './customizable-dashboard/add-widget-modal/add-widget-modal.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CountoModule } from 'angular2-counto';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { SingleLineStringInputTypeComponent } from './input-types/single-line-string-input-type/single-line-string-input-type.component';
import { ComboboxInputTypeComponent } from './input-types/combobox-input-type/combobox-input-type.component';
import { CheckboxInputTypeComponent } from './input-types/checkbox-input-type/checkbox-input-type.component';
import { MultipleSelectComboboxInputTypeComponent } from './input-types/multiple-select-combobox-input-type/multiple-select-combobox-input-type.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PortletBodyComponent } from "./customizable-dashboard/portlet/portlet-body.component";
import { PortletComponent } from "./customizable-dashboard/portlet/portlet.component";
import { PortletHeaderComponent } from "./customizable-dashboard/portlet/portlet-header.component";
import { PortletFooterComponent } from "./customizable-dashboard/portlet/portlet-footer.component";
import { WidgetEntityAssessmentUserComponent } from './customizable-dashboard/widgets/widget-entity-assessment-user/widget-entity-assessment-user.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GaugeChartModule } from 'angular-gauge-chart';
import { WidgetVerticalBarChartComponent } from './customizable-dashboard/widgets/widget-vertical-bar-chart/widget-vertical-bar-chart.component';
import { WidgetPieChartComponent } from './customizable-dashboard/widgets/widget-pie-chart/widget-pie-chart.component'
import { WidgetPieChart2Component } from './customizable-dashboard/widgets/widget-pie-chart2/widget-pie-chart2.component'
import { SignaturePadComponent } from './common-signature-pad/common-signature-pad.component';
import { DialogModule } from 'primeng/dialog';
import { SignaturePadModule } from 'angular2-signaturepad';
import { CommonDatePickerComponent } from './common-date-picker/common-date-picker.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import {
    DxDataGridModule, DxBulletModule, 
    DxCheckBoxModule, DxFileUploaderModule, DxSelectBoxModule, DxPieChartModule } from 'devextreme-angular';
import { DxPivotGridModule, DxChartModule } from 'devextreme-angular';
import { NgxSummernoteModule } from 'ngx-summernote';
import { HttpClientModule } from '@angular/common/http';
import { SummernoteTextEditorComponent } from './summernote-text-editor/summernote-text-editor.component';
import { SummernoteTextEditorService } from './summernote-text-editor/summernote-text-editor.service';
import { FileUploadService } from './file-upload/file-upload.service';
import { DevExpressGridService } from './dev-express-grid/dev-express-grid.service';
import { DevExpressGridComponent } from './dev-express-grid/dev-express-grid.component';
import { PivotGridComponent } from './pivot-grid/pivot-grid.component';
import { PivotGridService } from './pivot-grid/pivot-grid.service';
import { DevExpressReportComponent } from './dev-express-report/dev-express-report.component';
import { DxReportViewerModule } from 'devexpress-reporting-angular';
import { CommonDevExpressGridComponent } from './common-dev-express-grid/common-dev-express-grid.component';
import { CommonDevExpressGridService } from './common-dev-express-grid/common-dev-express-grid.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartModule } from 'primeng/chart';
import { ToolTipComponent } from './tool-tip/tool-tip.component';
import { PrimengChartComponent } from './primeng-chart/primeng-chart.component';
import { HorizontalBarChartComponent } from './primeng-chart/bar-chart/horizontal-bar-chart/horizontal-bar-chart.component';
import { MultiAxisBarChartComponent } from './primeng-chart/bar-chart/multi-axis-bar-chart/multi-axis-bar-chart.component';
import { StackedBarChartComponent } from './primeng-chart/bar-chart/stacked-bar-chart/stacked-bar-chart.component';
import { VerticalBarChartComponent } from './primeng-chart/bar-chart/vertical-bar-chart/vertical-bar-chart.component';
import { ComboChartComponent } from './primeng-chart/combo-chart/combo-chart.component';
import { DoughnutChartComponent } from './primeng-chart/doughnut-chart/doughnut-chart.component';
import { BasicLineChartComponent } from './primeng-chart/line-chart/basic-line-chart/basic-line-chart.component';
import { LineStylesLineChartComponent } from './primeng-chart/line-chart/line-styles-line-chart/line-styles-line-chart.component';
import { MultiAxisLineChartComponent } from './primeng-chart/line-chart/multi-axis-line-chart/multi-axis-line-chart.component';
import { PieChartComponent } from './primeng-chart/pie-chart/pie-chart.component';
import { PoparAreaChartComponent } from './primeng-chart/popar-area-chart/popar-area-chart.component';
import { RadarChartComponent } from './primeng-chart/radar-chart/radar-chart.component';
import { TopBottomStatusChartComponent } from './primeng-chart/top-bottom-status/top-bottom-status-chart.component';
import { TopBottomDomainListComponent } from './primeng-chart/top-bottom-domain-list/top-bottom-domain-list.component';
import { TopBottomControlListComponent } from './primeng-chart/top-bottom-control-list/top-bottom-control-list.component';
import { TooltipModule } from 'primeng/tooltip';
import { FeedbackDashboardComponent } from './feedback-dashboard/feedback-dashboard.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { FeedbackChartComponent } from './feedback-dashboard/feedback-chart/feedback-chart.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FileUploadModule } from 'primeng/fileupload';
import { EditorModule } from 'primeng/editor';
import { CommonTextEditorComponent } from './common-text-editor/common-text-editor.component';
import { FileSizePipe } from '../../../shared/common/pipes/file-size.pipe';
import { DataSharedService } from './data-shared/data-shared.service';
import { DxTooltipModule } from "devextreme-angular";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        UtilsModule,
        LockthreatComplianceCommonModule,
        TableModule,
        PaginatorModule,
        GridsterModule,
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxChartsModule,
        BsDatepickerModule.forRoot(),
        PerfectScrollbarModule,
        CountoModule,
        AppBsModalModule,
        AutoCompleteModule,
        DragDropModule,
        GaugeChartModule,
        SignaturePadModule,
        DxDataGridModule,
        DxBulletModule,
        DxCheckBoxModule, DxFileUploaderModule, DxSelectBoxModule,
        NgxSummernoteModule, HttpClientModule,
        DxPivotGridModule, DxChartModule,
        NgSelectModule,
        DxReportViewerModule,
        DxPieChartModule, ChartModule, TooltipModule, NgApexchartsModule, DialogModule,
        OverlayPanelModule, FileUploadModule, EditorModule, DxTooltipModule
        

    ],
    declarations: [
        TimeZoneComboComponent,
        CommonLookupModalComponent,
        EntityTypeHistoryModalComponent,
        EntityChangeDetailModalComponent,
        DateRangePickerInitialValueSetterDirective,
        DatePickerInitialValueSetterDirective,
        CustomizableDashboardComponent,
        WidgetGeneralStatsComponent,
        WidgetDailySalesComponent,
        WidgetEditionStatisticsComponent,
        WidgetHostTopStatsComponent,
        WidgetIncomeStatisticsComponent,
        WidgetMemberActivityComponent,
        WidgetProfitShareComponent,
        WidgetRecentTenantsComponent,
        WidgetRegionalStatsComponent,
        WidgetSalesSummaryComponent,
        WidgetSubscriptionExpiringTenantsComponent,
        WidgetTopStatsComponent,
        WidgetEntityComplianceSummaryComponent,
        WidgetKanbanInteractivityDemoComponent,
        WidgetTotalRiskStatisticsComponent,
        WidgetComplianceScoreSummaryComponent,
        AuthorityReviewApprovalComponent, EntityReviewApprovalComponent,
        FilterDateRangePickerComponent,
        AddWidgetModalComponent,
        SingleLineStringInputTypeComponent,
        ComboboxInputTypeComponent,
        CheckboxInputTypeComponent,
        MultipleSelectComboboxInputTypeComponent,
        PortletBodyComponent,
        PortletComponent,
        PortletHeaderComponent,
        PortletFooterComponent,
        WidgetEntityAssessmentUserComponent,
        WidgetVerticalBarChartComponent,
        WidgetPieChartComponent,
        SignaturePadComponent,
        CommonDatePickerComponent,
        WidgetPieChart2Component,
        FileUploadComponent,
        SummernoteTextEditorComponent, DevExpressGridComponent, PivotGridComponent,
        DevExpressReportComponent, CommonDevExpressGridComponent, ToolTipComponent,        
        DevExpressReportComponent, CommonDevExpressGridComponent,  
        PrimengChartComponent, HorizontalBarChartComponent, MultiAxisBarChartComponent, StackedBarChartComponent, VerticalBarChartComponent, ComboChartComponent,
        DoughnutChartComponent, BasicLineChartComponent, LineStylesLineChartComponent, MultiAxisLineChartComponent, PieChartComponent, PoparAreaChartComponent,
        RadarChartComponent, TopBottomStatusChartComponent, TopBottomDomainListComponent, TopBottomControlListComponent,
        FeedbackDashboardComponent, FeedbackChartComponent, CommonTextEditorComponent
    ],
    exports: [
        TimeZoneComboComponent,
        CommonLookupModalComponent,
        EntityTypeHistoryModalComponent,
        EntityChangeDetailModalComponent,
        DateRangePickerInitialValueSetterDirective,
        DatePickerInitialValueSetterDirective,
        CustomizableDashboardComponent,
        NgxChartsModule,
        WidgetEntityAssessmentUserComponent,
        WidgetEntityComplianceSummaryComponent,
        WidgetTotalRiskStatisticsComponent,
        WidgetSalesSummaryComponent,
        WidgetProfitShareComponent,
        WidgetGeneralStatsComponent,
        WidgetDailySalesComponent,
        WidgetVerticalBarChartComponent,
        WidgetPieChartComponent,
        SignaturePadComponent,
        CommonDatePickerComponent,
        WidgetPieChart2Component,
        FileUploadComponent,
        SummernoteTextEditorComponent, DevExpressGridComponent, PivotGridComponent,
        DevExpressReportComponent, CommonDevExpressGridComponent, ToolTipComponent,        
        PrimengChartComponent, HorizontalBarChartComponent, MultiAxisBarChartComponent, StackedBarChartComponent, VerticalBarChartComponent, ComboChartComponent,
        DoughnutChartComponent, BasicLineChartComponent, LineStylesLineChartComponent, MultiAxisLineChartComponent, PieChartComponent, PoparAreaChartComponent,
        RadarChartComponent, TopBottomStatusChartComponent, TopBottomDomainListComponent, TopBottomControlListComponent,
        FeedbackDashboardComponent, FeedbackChartComponent

    ],
    providers: [
        DateTimeService,
        AppLocalizationService,
        AppNavigationService,
        DashboardViewConfigurationService,
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig },
        SummernoteTextEditorService, FileUploadService, DevExpressGridService,
        PivotGridService, CommonDevExpressGridService, CommonTextEditorComponent, FileSizePipe, DataSharedService
    ],

    entryComponents: [
        WidgetGeneralStatsComponent,
        WidgetDailySalesComponent,
        WidgetEditionStatisticsComponent,
        WidgetHostTopStatsComponent,
        WidgetIncomeStatisticsComponent,
        WidgetMemberActivityComponent,
        WidgetProfitShareComponent,
        WidgetRecentTenantsComponent,
        WidgetRegionalStatsComponent,
        WidgetSalesSummaryComponent,
        WidgetSubscriptionExpiringTenantsComponent,
        WidgetTopStatsComponent,
        WidgetEntityComplianceSummaryComponent,
        WidgetKanbanInteractivityDemoComponent,
        WidgetTotalRiskStatisticsComponent,
        WidgetComplianceScoreSummaryComponent,
        AuthorityReviewApprovalComponent, EntityReviewApprovalComponent,
        FilterDateRangePickerComponent,
        SingleLineStringInputTypeComponent,
        ComboboxInputTypeComponent,
        CheckboxInputTypeComponent,
        MultipleSelectComboboxInputTypeComponent,
        PortletBodyComponent,
        PortletComponent,
        PortletHeaderComponent,
        PortletFooterComponent,
        SignaturePadComponent,
        CommonDatePickerComponent,
        FileUploadComponent,
        SummernoteTextEditorComponent, DevExpressGridComponent, PivotGridComponent,
        DevExpressReportComponent, CommonDevExpressGridComponent, ToolTipComponent,       
        PrimengChartComponent, HorizontalBarChartComponent, MultiAxisBarChartComponent, StackedBarChartComponent, VerticalBarChartComponent, ComboChartComponent,
        DoughnutChartComponent, BasicLineChartComponent, LineStylesLineChartComponent, MultiAxisLineChartComponent, PieChartComponent, PoparAreaChartComponent,
        RadarChartComponent, TopBottomStatusChartComponent, TopBottomDomainListComponent, TopBottomControlListComponent,
        FeedbackDashboardComponent, FeedbackChartComponent, CommonTextEditorComponent
    ]
})
export class AppCommonModule {
    static forRoot(): ModuleWithProviders<AppCommonModule> {
        return {
            ngModule: AppCommonModule,
            providers: [
                AppAuthService,
                AppRouteGuard
            ]
        };
    }
}


