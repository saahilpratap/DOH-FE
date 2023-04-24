import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { CountoModule } from 'angular2-counto';

import {
    ModalModule,
    TabsModule,
    BsDropdownModule,
    PopoverModule,
} from 'ngx-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainRoutingModule } from './main-routing.module';
import {
    NgxChartsModule,
    LineChartComponent,
    AdvancedPieChartComponent,
    PieChartComponent,
    AreaChartComponent,
} from '@swimlane/ngx-charts';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import {
    BsDatepickerConfig,
    BsDaterangepickerConfig,
    BsLocaleService,
} from 'ngx-bootstrap/datepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OwlModule } from 'ngx-owl-carousel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NgSelectModule } from '@ng-select/ng-select';
import { PickListModule } from 'primeng/picklist';
import { TooltipModule } from 'primeng/tooltip';
import { CapitalizePipe } from '../../shared/common/pipes/capitalize.pipe';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { AssessmentsComponent } from './assessments/assessments.component';
import { CreateOrEditAssessmentModalComponent } from './assessments/create-or-edit-assessment-modal.component';
import { AuditDashboardComponent } from './audit-dashboard/audit-dashboard.component';
import { AuditVendorsComponent } from './auditVendors/auditVendors/auditVendors.component';
import { ViewAuditVendorModalComponent } from './auditVendors/auditVendors/view-auditVendor-modal.component';
import { CreateOrEditAuditVendorModalComponent } from './auditVendors/auditVendors/create-or-edit-auditVendor-modal.component';
import { BusinessEntityDetailsComponent } from './business-entity-details/business-entity-details.component';
import { BusinessEntitiesComponent } from './businessEntities/businessEntities/businessEntities.component';
import { CreateOrEditBusinessEntityModalComponent } from './businessEntities/businessEntities/create-or-edit-businessEntity-modal.component';
import { BusinessRisksComponent } from './businessRisks/businessRisks/businessRisks.component';
import { ViewBusinessRiskModalComponent } from './businessRisks/businessRisks/view-businessRisk-modal.component';
import { CreateOrEditBusinessRiskModalComponent } from './businessRisks/businessRisks/create-or-edit-businessRisk-modal.component';
import { CalendarModule } from 'primeng/calendar';
import { ComplianceQuestionaireComponent } from './compliance-questionaire/compliance-questionaire.component';
import { AssessmentAgreementModalComponent } from './compliance-questionaire/assessment-agreement-modal/assessment-agreement-modal.component';
import { AuthoritativeDocumentsComponent } from './authoritativeDocuments/authoritativeDocuments/authoritativeDocuments.component';
import { ViewAuthoritativeDocumentModalComponent } from './authoritativeDocuments/authoritativeDocuments/view-authoritativeDocument-modal.component';
import { CreateOrEditAuthoritativeDocumentModalComponent } from './authoritativeDocuments/authoritativeDocuments/create-or-edit-authoritativeDocument-modal.component';

import { AuthorityDepartmentsComponent } from './authoritityDepartments/authorityDepartments/authorityDepartments.component';
import { ViewAuthorityDepartmentModalComponent } from './authoritityDepartments/authorityDepartments/view-authorityDepartment-modal.component';
import { CreateOrEditAuthorityDepartmentModalComponent } from './authoritityDepartments/authorityDepartments/create-or-edit-authorityDepartment-modal.component';
import { ExternalFindingReportsComponent } from './externalAssessments/externalAssessments/external-finding-grid/external-finding-grid.component';
import { ContactsComponent } from './contacts/contacts/contacts.component';
import { ViewContactModalComponent } from './contacts/contacts/view-contact-modal.component';
import { CreateOrEditContactModalComponent } from './contacts/contacts/create-or-edit-contact-modal.component';

import { findingLogComponent } from './findingLog/findinglog.component';

import { ContactTypesComponent } from './contactTypes/contactTypes/contactTypes.component';
import { ViewContactTypeModalComponent } from './contactTypes/contactTypes/view-contactType-modal.component';
import { CreateOrEditContactTypeModalComponent } from './contactTypes/contactTypes/create-or-edit-contactType-modal.component';
import { ControlRequirementsComponent } from './controlRequirements/controlRequirements/controlRequirements.component';
import { CreateOrEditControlRequirementModalComponent } from './controlRequirements/controlRequirements/create-or-edit-controlRequirement-modal.component';
import { ControlStandardsComponent } from './controlStandards/controlStandards/controlStandards.component';
import { CreateOrEditControlStandardModalComponent } from './controlStandards/controlStandards/create-or-edit-controlStandard-modal.component';

import { FeedbackDetailComponent } from './feedbackDetail/feedback-Detail.component';
import { FeedbackResponseComponent } from './feedbackResponse/feedback-Response.component';
import { FeedbackEntityQuestionResponseModalComponent } from './feedbackResponse/feedback-entity-modal.component';

import { CreateOrEditFeedbackDetailModalComponent } from './feedbackDetail/create-edit-feedback-detail-modal/create-edit-feedback-detail-modal.component';

import { CountriesComponent } from './countries/countries/countries.component';
import { ViewCountryModalComponent } from './countries/countries/view-country-modal.component';
import { CreateOrEditCountryModalComponent } from './countries/countries/create-or-edit-country-modal.component';
import { GridRemediationPlanComponent } from './common-component/grid-remediation-plan/grid-remediation-plan.component';
import { DomainsComponent } from './domains/domains/domains.component';
import { CreateOrEditDomainModalComponent } from './domains/domains/create-or-edit-domain-modal.component';
import { EntityDashboardComponent } from './entity-dashboard/entity-dashboard.component';
import { ExceptionsComponent } from './exceptions/exceptions/exceptions.component';
import { CreateOrEditExceptionModalComponent } from './exceptions/exceptions/create-or-edit-exception-modal.component';

import { QuestionsComponent } from './questions/questions/questions.component';
import { CreateOrEditQuestionModalComponent } from './questions/questions/create-or-edit-question-modal.component';

import { IncidentTypesComponent } from './incidentTypes/incidentTypes/incidentTypes.component';
import { CreateOrEditIncidentTypeModalComponent } from './incidentTypes/incidentTypes/create-or-edit-incidentType-modal.component';

import { IncidentsComponent } from './incidents/incidents/incidents.component';
import { CreateOrEditIncidentModalComponent } from './incidents/incidents/create-or-edit-incident-modal.component';

import { IncidentImpactsComponent } from './incidentImpacts/incidentImpacts/incidentImpacts.component';
import { CreateOrEditIncidentImpactModalComponent } from './incidentImpacts/incidentImpacts/create-or-edit-incidentImpact-modal.component';
import { FindingReportClassificationsComponent } from './findingReportClassifications/findingReportClassifications/findingReportClassifications.component';
import { CreateOrEditFindingReportClassificationModalComponent } from './findingReportClassifications/findingReportClassifications/create-or-edit-findingReportClassification-modal.component';
import { FindingReportsComponent } from './finding-report/findingReport.component';
import { CreateOrEditfindingReportModalComponent } from './finding-report/create-or-edit-findingReport-modal.component';
import { ExternalQuestionaireComponent } from './external-questionaire/external-questionaire.component';
import { TemplateTypeComponent } from './template-type/template-type.component';
import { GridTemplateTypeComponent } from './common-component/grid-template-type/grid-template-type.component';
import { GridQuestionnaireGroupComponent } from './common-component/grid-questionnaire-group/grid-questionnaire-group.component';
import { QuestionnaireGroupComponent } from './questionnaire-group/questionnaire-group.component';

import { ExternalAssessmentsComponent } from './externalAssessments/externalAssessments/externalAssessments.component';
import { CreateOrEditExternalAssessmentModalComponent } from './externalAssessments/externalAssessments/create-or-edit-externalAssessment-modal.component';
import { ExternalAssessmentQuestionsComponent } from './questions/external-assessment-questions/external-assessment-questions.component';
import { CreateOrEditExternalAssessmentQuestionModalComponent } from './questions/external-assessment-questions/create-or-edit-external-assessment-question-modal.component';
import { CreateOrEditExternalControlRequirementModalComponent } from './external-questionaire/create-or-edit-external-controlRequirement-modal.component';
import { PreRegistrationComponent } from './preRegisterUserData/pre-register-user.component';
import { AngularCalendarYearViewModule } from 'angular-calendar-year-view';
import { CreateScheduleModalComponent } from './assessments/create-schedule-modal.component';
import { ComplianceQuestionaireModalComponent } from './compliance-questionaire/compliance-questionaire-modal/compliance-questionaire-modal.component';
import { ExternalComplianceQuestionaireModalComponent } from './external-questionaire/external-compliance-questionaire-modal/external-compliance-questionaire-modal.component';
import { AuditManagementLandingPageComponent } from './audit-management-landing-page/audit-management-landing-page.component';
import { ComplianceManagementLandingPageComponent } from './compliance-management-landing-page/compliance-management-landing-page.component';
import { HealthCareEntitiesLandingPageComponent } from './health-care-entities-landing-page/health-care-entities-landing-page.component';
import { OrganizationSetupLandingPageComponent } from './organization-setup-landing-page/organization-setup-landing-page.component';
import { CreateEditRemediationPlanComponent } from './remediation-plan/create-edit-remediation-plan/create-edit-remediation-plan.component';
import { RemediationPlanComponent } from './remediation-plan/remediation-plan.component';
import { AuthorityReviewApprovalComponent } from './common-component/authority-review-approval/authority-review-approval.component';
import { EntityReviewApprovalComponent } from './common-component/entity-review-approval/entity-review-approval.component';
import { GridAuditProjectManagementComponent } from './common-component/grid-audit-project-management/grid-audit-project-management.component';
import { GridMeetingComponent } from './common-component/grid-meeting/grid-meeting.component';
import { AuditProjectManagementComponent } from './audit-project-management/audit-project-management.component';
import { MeetingComponent } from './meeting/meeting.component';
import { CreateEditMeetingComponent } from './meeting/create-edit-meeting/create-edit-meeting.component';
import { CreateEditAuditProjectManagementComponent } from './audit-project-management/create-edit-audit-project-management/create-edit-audit-project-management.component';
import { AddRemediationPlanModalComponent } from './common-component/grid-remediation-plan/add-remediation-plan/add-remediation-plan-modal.component';
import {
    PerfectScrollbarModule,
    PERFECT_SCROLLBAR_CONFIG,
    PerfectScrollbarConfigInterface,
} from 'ngx-perfect-scrollbar';
import { TreeModule } from 'primeng/tree';

import { StepsModule } from 'primeng/steps';
import { MultiSelectModule } from 'primeng/multiselect';
import { ViewIncidentModalComponent } from './incidents/incidents/view-incident-modal.component';
import { ViewExceptionsModalComponent } from './exceptions/exceptions/view-exceptions-modal.component';
import { ViewFindingReportModalComponent } from './finding-report/view-finding-report-modal.component';
import { ViewFindingReportClassificatinModalComponent } from './findingReportClassifications/findingReportClassifications/view-finding-report-classificatin-modal.component';
import { DialogModule } from 'primeng/dialog';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { GridsterModule } from 'angular-gridster2';
import { DashboardTestComponent } from './dashboard-test/dashboard-test.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AccordionModule } from 'primeng/accordion';
import { GaugeChartModule, GaugeChartComponent } from 'angular-gauge-chart';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { createOrEditPreRegisterModalComponent } from './preRegisterUserData/edit-preRegister-entity-modal.component';
import { ExternalAssessmentWorkPaperModalComponent } from './externalAssessments/externalAssessments/auditWorkPaper/add-externalAssessment-work-paper-modal.component';
import { CreateExtScheduleModalComponent } from './externalAssessments/externalAssessments/ext-schedule/create-ext-schedule-modal.component';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { SignaturePadModule } from 'angular2-signaturepad';
import { CheckboxModule } from 'primeng/checkbox';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { CreateEditTemplateTypeComponent } from './template-type/create-edit-template-type/create-edit-template-type.component';
import { CreateEditQuestionnaireGroupComponent } from './questionnaire-group/create-edit-questionnaire-group/create-edit-questionnaire-group.component';
import { GridAuditWorkPaperInformationComponent } from './common-component/grid-audit-work-paper-information/grid-audit-work-paper-information.component';
import { CommonQuestionaireModalComponent } from './common-component/common-questionaire/common-questionaire-modal.component';
import { MapComponent } from './map/map.component';
import { EsriMapComponent } from './map/esri-map/esri-map.component';
import { AuditProjectGroupComponent } from './common-component/audit-project-group/audit-project-group.component';
import { AuditPlanComponent } from './common-component/audit-project-group/audit-plan/audit-plan.component';
import { AuditReportComponent } from './common-component/audit-project-group/audit-report/audit-report.component';
import { CertificateComponent } from './common-component/audit-project-group/certificate/certificate.component';
import { CorrectiveActionPlanComponent } from './common-component/audit-project-group/corrective-action-plan/corrective-action-plan.component';
import { AuditProjectGroupDashboardComponent } from './common-component/audit-project-group/dashboard/dashboard.component';
import { DecisionComponent } from './common-component/audit-project-group/decision/decision.component';
import { ExternalAssessmentComponent } from './common-component/audit-project-group/external-assessment/external-assessment.component';
import { FindingComponent } from './common-component/audit-project-group/finding/finding.component';
import { SelfAssessmentComponent } from './common-component/audit-project-group/self-assessment/self-assessment.component';
import { SurviellanceProgramComponent } from './common-component/audit-project-group/surviellance-program/surviellance-program.component';
import { AddExternalFindingAssessmentModalComponent } from './external-questionaire/external-questionnaire-findings/add-external-finding-assessment-modal/add-external-finding-assessment-modal.component';
import { CertificationProposalComponent } from './common-component/audit-project-group/certification-proposal/certification-proposal.component';

import { CertificateGridComponent } from './certificate/certificate-grid.component';
import { CreateEditCertificateModalComponent } from './certificate/certificate-modal/create-edit-certificate-modal.component';
import { CertificationProposalGridComponent } from './certification-proposal/certification-proposal.component';
import { CreateEditCertificationProposalModalComponent } from './certification-proposal/create-edit-certification-proposal-modal/create-edit-certification-proposal-modal.component';
import { DecisionGridComponent } from './decision/decision-grid.component';
import { CreateEditDecisionModalComponent } from './decision/create-edit-decision-modal/create-edit-decision-modal.component';
import { CreateEditAuditReportModal1Component } from './audit-report/create-edit-audit-report-modal/create-edit-audit-report-modal.component';
import { AuditReportGridComponent } from './audit-report/audit-report.component';
import { SurviellanceProgramGridComponent } from './surviellance-program/surviellance-program.component';
import { CreateEditSurviellanceProgramModalComponent } from './surviellance-program/create-edit-surviellance-program-modal/create-edit-surviellance-program-modal.component';
import { TabAuditDetailComponent } from './audit-report/tab-audit-detail/tab-audit-detail.component';
import { TabAuditReportComponent } from './audit-report/tab-audit-report/tab-audit-report.component';
import { TabAuditTeamComponent } from './audit-report/tab-audit-team/tab-audit-team.component';

import { TabViewAuditProjectComponent } from './audit-project-management/tab-view-audit-project/tab-view-audit-project.component';
import { TabViewAuditReportComponent } from './audit-project-management/tab-view-audit-report/tab-view-audit-report.component';
import { TabViewCertificateComponent } from './audit-project-management/tab-view-certificate/tab-view-certificate.component';
import { TabViewDecisionComponent } from './audit-project-management/tab-view-decision/tab-view-decision.component';
import { TabViewExternalAuditComponent } from './audit-project-management/tab-view-external-audit/tab-view-external-audit.component';
import { TabViewSurviellanceProgramComponent } from './audit-project-management/tab-view-surviellance-program/tab-view-surviellance-program.component';
import { TabViewCertificationProposalComponent } from './audit-project-management/tab-view-certification-proposal/tab-view-certification-proposal.component';
import { SearchComponent } from './map/search-map/search.component';
import { ExternalAssessmentsGridComponent } from './common-component/external-assessments/external-assessments.component';
import { AuditProjectManagementModalComponent } from './common-component/grid-audit-project-management/audit-project-management-modal/audit-project-management-modal.component';
import { TabViewCorrectiveActionPlanComponent } from './audit-project-management/tab-view-corrective-action-plan/tab-view-corrective-action-plan.component';
import { TabViewModule } from 'primeng/tabview';
import { EditorModule } from 'primeng/editor';
import { NgxSummernoteModule } from 'ngx-summernote';

import { TemplateComponent } from './template/template.component';
import { CreateTemplateModalComponent } from './template/create-template-modal.component';
import { CreateOrEditNewEntityGroupModalComponent } from './businessEntities/businessEntities/create-or-edit-newEntityGroup-modal.component';
import { UpdateEntityProfileModalComponent } from './businessEntities/businessEntities/update-entity-profile-modal.component';
import { CreateEntityFeedbackModalComponent } from './businessEntities/businessEntities/Create-EntiyFeedback-modal.component';

import { AuditProgramsScheduleComponent } from './externalAssessments/externalAssessments/audit-programs-schedule/audit-programs-schedule.component';
import { ScheduledDetailSssessmentComponent } from './externalAssessments/externalAssessments/scheduled-detail-assessment/scheduled-detail-assessment.component';
import { GridExternalAssessmentsComponent } from './common-component/grid-external-assessment/grid-external-assessment.component';
import { GridAllAssessmentsComponent } from './assessments/assessments-grid-view/grid-all-assessments/grid-all-assessments.component';
import { GridViewAuditProgramsScheduleComponent } from './externalAssessments/externalAssessments/grid-view/grid-view-audit-programs-schedule/grid-view-audit-programs-schedule.component';
import { GridViewExternalAssessmentsComponent } from './externalAssessments/externalAssessments/grid-view/grid-view-external-assessments/grid-view-external-assessments.component';
import { GridAssessmentsScheduleComponent } from './assessments/assessments-grid-view/grid-assessments-schedule/grid-assessments-schedule.component';
import { GridScheduleDetailComponent } from './assessments/assessments-grid-view/grid-schedule-detail/grid-schedule-detail.component';
import { GridViewScheduleDetailComponent } from './externalAssessments/externalAssessments/grid-view/grid-view-schedule-detail/grid-view-schedule-detail.component';
import { AllAssessmentsViewComponent } from './assessments/assessments-grid-view/all-assessments-view/all-assessments-view.component';
import { LastUpdateResponseModalComponent } from './external-questionaire/update-last-response-modal.component';
NgxBootstrapDatePickerConfigService.registerNgxBootstrapDatePickerLocales();



import {
    DxDataGridModule,
    DxBulletModule,
     DxCheckBoxModule, DxFileUploaderModule, DxSelectBoxModule 
} from 'devextreme-angular';
import { EmailNotificationComponent } from './email-notification/email-notification.component';
import { EmailReminderComponent } from './email-reminder/email-reminder.component';
import { CreateEmailNotificationModalComponent } from './email-notification/create-email-notification-modal.component';
import { CreateEmailReminderModalComponent } from './email-reminder/create-email-reminder-modal.component';
import { CopyToChildModalComponent } from './compliance-questionaire/copy-to-child-modal/copy-to-child-modal.component';

import { CreateAuditProjectEmailNotificationModalComponent } from './common-component/audit-project-email-notification/create-audit-project-email-notification-modal-component';
import { MeetingTemplateModalComponent } from './meeting/edit-meeting-template-modal/meeting-template-modal.component';
import { createEntityReviewApprovalSignatureModalComponent } from './common-component/entity-review-approval-signature/create-entity-review-approval-signature-modal-component';
import { SendToAuthorityModalModalComponent } from './compliance-questionaire/send-to-authority-modal/send-to-authority-modal.component';
import { AddEditAuditPprojectComponent } from './audit-project-management/add-edit-audit-project/add-edit-audit-project.component';
import { AssessmentDetailModalComponent } from './audit-project-management/assessment-detail-modal/assessment-detail-modal.component';
import { ScheduleDetailModalComponent } from './externalAssessments/externalAssessments/grid-view/schedule-detail-modal/schedule-detail-modal.component';
import { ExternalsAssessmentComponent } from './external-assessment/external-assessment.component';
import { ResponseRequestModalComponent } from './common-component/grid-audit-project-management/response-request-modal/response-request-modal.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { BusinessEntityAdminChangeRequestComponent } from './businessEntities/businessEntities/business-entity-change-request.component';
import { BusinessEntityAdminChangeRequestModalComponent } from './businessEntities/businessEntities/business-entity-admin-change-request-modal/business-entity-admin-change-request-modal.component';
import { FeedbackQuestionsComponent } from './FeedBackQuestion/feedback-questions.component';
import { CreateOrEditFeedbackQuestionModalComponent } from './FeedBackQuestion/create-or-edit-feedback-question-modal.component';
import { FeedbackQuestionAnswerOptionDto } from '../../shared/service-proxies/service-proxies';
import { AuditCertificateComponent } from './auditCertificate/Auditcertificate-grid.component';
import { AuditcertificateHistoryModalComponent } from './auditCertificate/auditcertificate-history-modal.component';
import { FindingLogModalComponent } from './externalAssessments/externalAssessments/external-finding-grid/finding-log-modal/finding-log-modal.component';
import { HealthCareEntityModalComponent } from './audit-project-management/tab-view-audit-project/health-care-entity-modal/health-care-entity-modal.component';
import { ReleationAssessmentAuditProjectModalComponent } from './compliance-questionaire/releation-assessment-audit-project-modal/releation-assessment-audit-project-modal.component';
import { SectionComponent } from './section/section.component';
import { SectionModalComponent } from './section/section-modal/section-modal.component';
import { TabQuestionGroupComponent } from './audit-project-management/tab-question-group/tab-question-group.component';
import { PAPEnrollmentComponent } from './pap-enrollment/pap-enrollment.component';
import { PAPEnrollmentModalComponent } from './pap-enrollment/pap-enrollment-modal/pap-enrollment-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TableTopExerciseGroupComponent } from './table-top-exercise/table-top-exercise-group/table-top-exercise-group.component';
import { TableTopExerciseQuestionComponent } from './table-top-exercise/table-top-exercise-question/table-top-exercise-question.component';
import { TableTopExerciseSectionComponent } from './table-top-exercise/table-top-exercise-section/table-top-exercise-section.component';
import { TableTopExerciseGroupModalComponent } from './table-top-exercise/table-top-exercise-group/table-top-exercise-group-modal/table-top-exercise-group-modal.component';
import { TableTopExerciseQuestionModalComponent } from './table-top-exercise/table-top-exercise-question/table-top-exercise-question-modal/table-top-exercise-question-modal.component';
import { TableTopExerciseSectionModalComponent } from './table-top-exercise/table-top-exercise-section/table-top-exercise-section-modal/table-top-exercise-section-modal.component';
import { TTXEntitiesModalComponent } from './businessEntities/businessEntities/ttx-entities/ttx-entities-modal.component';
import { TableTopExerciseResponseComponent } from './table-top-exercise/table-top-exercise-response/table-top-exercise-response.component';
import { TableTopExerciseResponseModalComponent } from './table-top-exercise/table-top-exercise-response/table-top-exercise-response-modal/table-top-exercise-response-modal.component';
import { CloneOneModelComponent } from './common-component/grid-audit-project-management/clone-one-modal/clone-one-modal.component';
import { CloneSelectModelComponent } from './common-component/grid-audit-project-management/clone-one-modal/clone-select-modal.component';
import { FindingCAPAListModalsComponent } from './externalAssessments/externalAssessments/external-finding-grid/finding-capa-list-modal/finding-capa-list-modal.component';
import { RadioButtonModule } from 'primeng/radiobutton';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    // suppressScrollX: true
};
@NgModule({
    imports: [
        CommonModule, FormsModule, ModalModule, PaginatorModule, TabsModule, TooltipModule, AppCommonModule, UtilsModule, MainRoutingModule,
        CountoModule, TableModule, OwlModule, InputTextareaModule, ScrollPanelModule, NgSelectModule, NgxChartsModule,
        AngularCalendarYearViewModule, BsDatepickerModule.forRoot(), BsDropdownModule.forRoot(), PopoverModule.forRoot(),
        AppBsModalModule, GridsterModule, InputSwitchModule, AccordionModule, GaugeChartModule, AngularEditorModule,
        DialogModule, PickListModule, CalendarModule, MultiSelectModule, OverlayPanelModule, SignaturePadModule,
        CheckboxModule, AngularMultiSelectModule, PerfectScrollbarModule, FileUploadModule, StepsModule,
        TreeModule, TabViewModule, EditorModule, DxDataGridModule, DxBulletModule,
        DxCheckBoxModule, DxFileUploaderModule, DxSelectBoxModule,
        NgxSummernoteModule, HttpClientModule, DynamicDialogModule, ReactiveFormsModule, RadioButtonModule
    ],
    declarations: [
      
        CreateEntityFeedbackModalComponent, FeedbackDetailComponent, FeedbackResponseComponent, FeedbackEntityQuestionResponseModalComponent,
        CreateOrEditFeedbackDetailModalComponent, DashboardComponent,  CreateOrEditAssessmentModalComponent, AssessmentsComponent,
        AuditDashboardComponent, AuditVendorsComponent, ViewAuditVendorModalComponent, CreateOrEditAuditVendorModalComponent,
        BusinessEntityDetailsComponent, BusinessEntitiesComponent, CreateOrEditBusinessEntityModalComponent,
        BusinessRisksComponent, ViewBusinessRiskModalComponent, CreateOrEditBusinessRiskModalComponent,
        ComplianceQuestionaireComponent,  AssessmentAgreementModalComponent, AuthoritativeDocumentsComponent,
        ViewAuthoritativeDocumentModalComponent, CreateOrEditAuthoritativeDocumentModalComponent,
        AuthorityDepartmentsComponent, ViewAuthorityDepartmentModalComponent,  CreateOrEditAuthorityDepartmentModalComponent,
        ContactsComponent, findingLogComponent, TemplateComponent, CreateTemplateModalComponent, ViewContactModalComponent,
        CreateOrEditContactModalComponent, ContactTypesComponent, ViewContactTypeModalComponent, CreateOrEditContactTypeModalComponent,
        ControlRequirementsComponent,
        CreateOrEditControlRequirementModalComponent,
        ControlStandardsComponent,
        CreateOrEditControlStandardModalComponent,
        CountriesComponent,
        ViewCountryModalComponent,
        CreateOrEditCountryModalComponent,
        DomainsComponent,
        CreateOrEditDomainModalComponent,
        EntityDashboardComponent,
        ExceptionsComponent,
        CreateOrEditExceptionModalComponent,
        QuestionsComponent,
        CreateOrEditQuestionModalComponent,
        IncidentTypesComponent,
        CreateOrEditIncidentTypeModalComponent,
        IncidentsComponent,
        CreateOrEditIncidentModalComponent,
        IncidentImpactsComponent,
        CreateOrEditIncidentImpactModalComponent,
        FindingReportClassificationsComponent,
        CreateOrEditFindingReportClassificationModalComponent,
        FindingReportsComponent,
        CreateOrEditfindingReportModalComponent,
        ExternalQuestionaireComponent,
        ExternalAssessmentsComponent,
        CreateOrEditExternalAssessmentModalComponent,
        ExternalAssessmentQuestionsComponent,
        CreateOrEditExternalAssessmentQuestionModalComponent,
        CreateOrEditExternalControlRequirementModalComponent,
        PreRegistrationComponent,
        CreateScheduleModalComponent,
        DashboardTestComponent,
        ComplianceQuestionaireModalComponent,
        createOrEditPreRegisterModalComponent,
        ExternalComplianceQuestionaireModalComponent,
        AuditManagementLandingPageComponent,
        ComplianceManagementLandingPageComponent,
        HealthCareEntitiesLandingPageComponent,
        OrganizationSetupLandingPageComponent,
        ViewIncidentModalComponent,
        ViewExceptionsModalComponent,
        ViewFindingReportModalComponent,
        ViewFindingReportClassificatinModalComponent,
        ExternalAssessmentWorkPaperModalComponent,
        ExternalFindingReportsComponent,
        CreateExtScheduleModalComponent,
        CapitalizePipe,
        RemediationPlanComponent,
        CreateEditRemediationPlanComponent,
        AuthorityReviewApprovalComponent,
        EntityReviewApprovalComponent,
        GridAuditProjectManagementComponent,
        GridMeetingComponent,
        AuditProjectManagementComponent,
        MeetingComponent,
        CreateEditMeetingComponent,
        CreateEditAuditProjectManagementComponent,
        GridRemediationPlanComponent,
        AddRemediationPlanModalComponent,
        GridQuestionnaireGroupComponent,
        GridTemplateTypeComponent,
        TemplateTypeComponent,
        QuestionnaireGroupComponent,
        CreateEditTemplateTypeComponent,
        CreateEditQuestionnaireGroupComponent,
        GridAuditWorkPaperInformationComponent,
        CommonQuestionaireModalComponent,
        MapComponent,
        EsriMapComponent,
        AuditProjectGroupComponent,
        AuditPlanComponent,
        AuditReportComponent,
        CertificateComponent,
        CorrectiveActionPlanComponent,
        AuditProjectGroupDashboardComponent,
        DecisionComponent,
        ExternalAssessmentComponent,
        FindingComponent,
        SelfAssessmentComponent,
        SurviellanceProgramComponent,
        AddExternalFindingAssessmentModalComponent,
        CertificationProposalComponent,
        CertificateGridComponent,
        CreateEditCertificateModalComponent,
        CertificationProposalGridComponent,
        CreateEditCertificationProposalModalComponent,
        DecisionGridComponent,
        CreateEditDecisionModalComponent,
        AuditReportGridComponent,
        CreateEditAuditReportModal1Component,
        SurviellanceProgramGridComponent,
        CreateEditSurviellanceProgramModalComponent,
        TabAuditDetailComponent,
        TabAuditReportComponent,
        TabAuditTeamComponent,
        TabViewAuditReportComponent,
        TabViewCertificateComponent,
        TabViewDecisionComponent,
        TabViewExternalAuditComponent,
        TabViewSurviellanceProgramComponent,
        TabViewCertificationProposalComponent,
        TabViewAuditProjectComponent,
        SearchComponent, ExternalAssessmentsGridComponent,
        AuditProjectManagementModalComponent, TabViewCorrectiveActionPlanComponent,
        CreateOrEditNewEntityGroupModalComponent, UpdateEntityProfileModalComponent, AuditProgramsScheduleComponent, ScheduledDetailSssessmentComponent,
        GridExternalAssessmentsComponent,
        GridAllAssessmentsComponent, GridViewAuditProgramsScheduleComponent,
        GridViewExternalAssessmentsComponent, GridAssessmentsScheduleComponent,
        GridScheduleDetailComponent, GridViewScheduleDetailComponent,
        AllAssessmentsViewComponent, LastUpdateResponseModalComponent, EmailNotificationComponent,
        EmailReminderComponent, CreateEmailReminderModalComponent,
        CreateEmailNotificationModalComponent, CopyToChildModalComponent, SendToAuthorityModalModalComponent, CreateAuditProjectEmailNotificationModalComponent,
        MeetingTemplateModalComponent, createEntityReviewApprovalSignatureModalComponent, AddEditAuditPprojectComponent,
        AssessmentDetailModalComponent, ScheduleDetailModalComponent, ExternalsAssessmentComponent, ResponseRequestModalComponent,
        BusinessEntityAdminChangeRequestModalComponent,
        BusinessEntityAdminChangeRequestComponent, FeedbackQuestionsComponent, CreateOrEditFeedbackQuestionModalComponent, AuditCertificateComponent,
        AuditcertificateHistoryModalComponent, FindingLogModalComponent, HealthCareEntityModalComponent, ReleationAssessmentAuditProjectModalComponent,
        SectionComponent, SectionModalComponent, TabQuestionGroupComponent, PAPEnrollmentComponent, PAPEnrollmentModalComponent,
        TableTopExerciseGroupComponent, TableTopExerciseQuestionComponent, TableTopExerciseSectionComponent,
        TableTopExerciseGroupModalComponent, TableTopExerciseQuestionModalComponent, TableTopExerciseSectionModalComponent,
        TTXEntitiesModalComponent, TableTopExerciseResponseComponent, TableTopExerciseResponseModalComponent,
        CloneOneModelComponent, CloneSelectModelComponent, FindingCAPAListModalsComponent
    ],
    providers: [
        {
            provide: BsDatepickerConfig,
            useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig,
        },
        {
            provide: BsDaterangepickerConfig,
            useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig,
        },
        {
            provide: BsLocaleService,
            useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale,
        },
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
        }
    ],
    exports: [
        SearchComponent, ComplianceQuestionaireComponent, ExternalQuestionaireComponent, ScheduledDetailSssessmentComponent, ReleationAssessmentAuditProjectModalComponent
    ],
    entryComponents: [
        AssessmentDetailModalComponent, ComplianceQuestionaireComponent, ExternalQuestionaireComponent, ScheduledDetailSssessmentComponent,
        ReleationAssessmentAuditProjectModalComponent
    ]
})
export class MainModule { }
