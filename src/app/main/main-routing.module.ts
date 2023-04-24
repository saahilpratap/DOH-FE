import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssessmentsComponent } from "./assessments/assessments.component";
import { BusinessEntitiesComponent } from "./businessEntities/businessEntities/businessEntities.component";
import { AuditVendorsComponent } from "./auditVendors/auditVendors/auditVendors.component";
import { BusinessEntityDetailsComponent } from "./business-entity-details/business-entity-details.component";
import { AuditDashboardComponent } from "./audit-dashboard/audit-dashboard.component";
import { CreateOrEditBusinessEntityModalComponent } from "./businessEntities/businessEntities/create-or-edit-businessEntity-modal.component";
import { CreateOrEditAssessmentModalComponent } from "./assessments/create-or-edit-assessment-modal.component";
import { BusinessRisksComponent } from "./businessRisks/businessRisks/businessRisks.component";
import { CreateOrEditBusinessRiskModalComponent } from "./businessRisks/businessRisks/create-or-edit-businessRisk-modal.component";
import { AuthoritativeDocumentsComponent } from "./authoritativeDocuments/authoritativeDocuments/authoritativeDocuments.component";
import { AuthorityDepartmentsComponent } from "./authoritityDepartments/authorityDepartments/authorityDepartments.component";
import { ContactsComponent } from "./contacts/contacts/contacts.component";
import { ContactTypesComponent } from "./contactTypes/contactTypes/contactTypes.component";
import { ControlRequirementsComponent } from "./controlRequirements/controlRequirements/controlRequirements.component";
import { ControlStandardsComponent } from "./controlStandards/controlStandards/controlStandards.component";
import { CountriesComponent } from "./countries/countries/countries.component";
import { DomainsComponent } from "./domains/domains/domains.component";
import { EntityDashboardComponent } from "./entity-dashboard/entity-dashboard.component";

import { ExceptionsComponent } from "./exceptions/exceptions/exceptions.component";
import { CreateOrEditExceptionModalComponent } from "./exceptions/exceptions/create-or-edit-exception-modal.component";
import { QuestionsComponent } from "./questions/questions/questions.component";
import { IncidentTypesComponent } from "./incidentTypes/incidentTypes/incidentTypes.component";
import { IncidentsComponent } from "./incidents/incidents/incidents.component";
import { CreateOrEditIncidentModalComponent } from "./incidents/incidents/create-or-edit-incident-modal.component";

import { IncidentImpactsComponent } from "./incidentImpacts/incidentImpacts/incidentImpacts.component";
import { FindingReportClassificationsComponent } from "./findingReportClassifications/findingReportClassifications/findingReportClassifications.component";
import { FindingReportsComponent } from "./finding-report/findingReport.component";
import { CreateOrEditfindingReportModalComponent } from "./finding-report/create-or-edit-findingReport-modal.component";
import { ExternalQuestionaireComponent } from "./external-questionaire/external-questionaire.component";
import { ComplianceQuestionaireComponent } from "./compliance-questionaire/compliance-questionaire.component";

import { ExternalAssessmentsComponent } from "./externalAssessments/externalAssessments/externalAssessments.component";
import { CreateOrEditExternalAssessmentModalComponent } from "./externalAssessments/externalAssessments/create-or-edit-externalAssessment-modal.component";
import { ExternalAssessmentQuestionsComponent } from './questions/external-assessment-questions/external-assessment-questions.component';
import { PreRegistrationComponent } from './preRegisterUserData/pre-register-user.component';

import { DashboardTestComponent } from './dashboard-test/dashboard-test.component';
import { AuditManagementLandingPageComponent } from './audit-management-landing-page/audit-management-landing-page.component';
import { ComplianceManagementLandingPageComponent } from './compliance-management-landing-page/compliance-management-landing-page.component';
import { HealthCareEntitiesLandingPageComponent } from './health-care-entities-landing-page/health-care-entities-landing-page.component';
import { OrganizationSetupLandingPageComponent } from './organization-setup-landing-page/organization-setup-landing-page.component';
import { CreateEditRemediationPlanComponent } from './remediation-plan/create-edit-remediation-plan/create-edit-remediation-plan.component';
import { RemediationPlanComponent } from './remediation-plan/remediation-plan.component';
import { AuditProjectManagementComponent } from './audit-project-management/audit-project-management.component';
import { MeetingComponent } from './meeting/meeting.component';
import { QuestionnaireGroupComponent } from './questionnaire-group/questionnaire-group.component';
import { TemplateTypeComponent } from './template-type/template-type.component';
import { CreateEditTemplateTypeComponent } from './template-type/create-edit-template-type/create-edit-template-type.component';
import { CreateEditQuestionnaireGroupComponent } from './questionnaire-group/create-edit-questionnaire-group/create-edit-questionnaire-group.component';
import { MapComponent } from './map/map.component';
import { AuditProjectGroupComponent } from './common-component/audit-project-group/audit-project-group.component';

import { CertificateGridComponent } from './certificate/certificate-grid.component';
import { CertificationProposalGridComponent } from './certification-proposal/certification-proposal.component';
import { DecisionGridComponent } from './decision/decision-grid.component';
import { AuditReportGridComponent } from './audit-report/audit-report.component'
import { SurviellanceProgramGridComponent } from './surviellance-program/surviellance-program.component';
import { TemplateComponent } from './template/template.component';
import { EmailNotificationComponent } from './email-notification/email-notification.component';
import { EmailReminderComponent } from './email-reminder/email-reminder.component';
import { AddEditAuditPprojectComponent } from './audit-project-management/add-edit-audit-project/add-edit-audit-project.component';
import { ExternalsAssessmentComponent } from './external-assessment/external-assessment.component';
import { BusinessEntityAdminChangeRequestComponent } from './businessEntities/businessEntities/business-entity-change-request.component';
import { FeedbackQuestionsComponent } from './FeedBackQuestion/feedback-questions.component';
import { FeedbackDetailComponent } from './feedbackDetail/feedback-Detail.component';
import { FeedbackResponseComponent } from './feedbackResponse/feedback-Response.component';
import { AuditCertificateComponent } from './auditCertificate/Auditcertificate-grid.component';
import { findingLogComponent } from './findingLog/findinglog.component';
import { SectionComponent } from './section/section.component';
import { PAPEnrollmentComponent } from './pap-enrollment/pap-enrollment.component';
import { TableTopExerciseGroupComponent } from './table-top-exercise/table-top-exercise-group/table-top-exercise-group.component';
import { TableTopExerciseQuestionComponent } from './table-top-exercise/table-top-exercise-question/table-top-exercise-question.component';
import { TableTopExerciseSectionComponent } from './table-top-exercise/table-top-exercise-section/table-top-exercise-section.component';
import { TableTopExerciseResponseComponent } from './table-top-exercise/table-top-exercise-response/table-top-exercise-response.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'dashboard', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'dashboard-test', component: DashboardTestComponent },
                    
                    
                    { path: "businessEntities/healthcare", component: BusinessEntitiesComponent, data: { permission: "Pages.HealthCareEntities" } },
                    { path: "businessEntities/externalaudit", component: BusinessEntitiesComponent, data: { permission: "Pages.HealthCareEntities" } },
                    { path: "businessEntities/change-request", component: BusinessEntityAdminChangeRequestComponent, },

                    {
                        path: "assessments/assessments",
                        component: AssessmentsComponent,
                        data: {
                            permission: "Pages.HealthCareEntities.Assessments"
                        }
                    },
                    {
                        path: "findingReportings/findingReportings-internal",
                        component: FindingReportsComponent,
                        data: {
                            permission: "Pages.HealthCareEntities.FindingReports"
                        }
                    },                  
                    {
                        path:"externalAssessments/externalAssessments/:id/compliance-questionaire",
                        component: ExternalQuestionaireComponent
                    },
                    {
                        path: "assessments/assessments/new",
                        component: CreateOrEditAssessmentModalComponent,
                        data: {
                            permission: "Pages.HealthCareEntities.Assessments.Create"
                        }
                    },
                    {
                        path: "auditVendors/auditVendors",
                        component: AuditVendorsComponent,
                        data: {
                            permission: "Pages.AuditManagement.AuditVendors"
                        }
                    },

                    {
                        path: "businessEntities/businessEntities/:id/details",
                        component: BusinessEntityDetailsComponent
                    },
                    {
                        path: "businessEntities/businessEntities/new",
                        component: CreateOrEditBusinessEntityModalComponent
                       
                    },
                    {
                        path: "audit-agency-dashboard",
                        component: AuditDashboardComponent,
                        data: { permission: "Pages.Tenant.Dashboard" }
                    },
                    {
                        path: "businessRisks/businessRisks",
                        component: BusinessRisksComponent,
                        data: { permission: "Pages.BusinessRisks" }
                    },
                    {
                        path: "businessRisks/businessRisks/new",
                        component: CreateOrEditBusinessRiskModalComponent,
                        data: { permission: "Pages.BusinessRisks" }
                    },
                    {
                        path: "authoritativeDocuments/authoritativeDocuments",
                        component: AuthoritativeDocumentsComponent,
                        data: {
                            permission:
                                "Pages.ComplianceManagement.AuthoritativeDocuments"
                        }
                    },
                    {
                        path: "contacts/contacts",
                        component: ContactsComponent,
                        data: { permission: "Pages.Contacts" }
                    },

                  
                    {
                        path: "contactTypes/contactTypes",
                        component: ContactTypesComponent,
                        data: { permission: "Pages.SystemSetUp.ContactTypes" }
                    },
                    {
                        path: "authoritityDepartments/authorityDepartments",
                        component: AuthorityDepartmentsComponent,
                        data: { permission: "Pages.OrganizationSetup.AuthorityDepartments" }
                    },
                    {
                        path: "controlRequirements/controlRequirements",
                        component: ControlRequirementsComponent,
                        data: {permission:"Pages.ComplianceManagement.ControlRequirements"}
                    },
                    {
                        path: "controlStandards/controlStandards",
                        component: ControlStandardsComponent,
                        data: {
                            permission:
                                "Pages.ComplianceManagement.ControlStandards"
                        }
                    },
                   

                    {
                        path:
                            "assessments/assessments/:id/:flag/compliance-questionaire",
                        component: ComplianceQuestionaireComponent

                    },
                    {
                        path:
                            "preRegisterRequests",
                        component: PreRegistrationComponent
                    },

                    {
                        path: "countries/countries",
                        component: CountriesComponent,
                        data: { permission: "Pages.SystemSetUp.Countries" }
                    },
                    {
                        path: "domains/domains",
                        component: DomainsComponent,
                        data: {
                            permission: "Pages.ComplianceManagement.Domains"
                        }
                    },
                    {
                        path: "incidents/incidents",
                        component: IncidentsComponent,
                        data: { permission: "Pages.SystemSetUp.Incidents" }
                    },
                    {
                        path: "incidents/incidents/new",
                        component: CreateOrEditIncidentModalComponent,
                        data: { permission: "Pages.SystemSetUp.Incidents" }
                    },
                    {
                        path: "entity-dashboard",
                        component: EntityDashboardComponent,
                        data: { permission: "Pages.Tenant.Dashboard" }
                    },
                    {
                        path: "exceptions/exceptions",
                        component: ExceptionsComponent,
                        data: { permission: "Pages.SystemSetUp.Exceptions" }
                    },
                    {
                        path: "exceptions/exceptions/new",
                        component: CreateOrEditExceptionModalComponent,
                        data: { permission: "Pages.SystemSetUp.Exceptions.Create" }
                    },
                    {
                        path: "questions/questions",
                        component: QuestionsComponent,
                        data: { permission: "Pages.ComplianceManagement.SelfAssessmentQuestions" }
                    },
                    {
                        path: "questions/externalAssessmentQuestions",
                        component: ExternalAssessmentQuestionsComponent,
                        data: { permission: "Pages.AuditManagement.ExternalAssessment.Questions" }
                    },
                    {
                        path: "section",
                        component: SectionComponent,
                        data: { permission: "" }
                    },
                    {
                        path: "incidentTypes/incidentTypes",
                        component: IncidentTypesComponent,
                        data: { permission: "Pages.SystemSetUp.Incidents.IncidentTypes" }
                    },
                    {
                        path: "incidentImpacts/incidentImpacts",
                        component: IncidentImpactsComponent,
                        data: { permission: "Pages.SystemSetUp.Incidents.IncidentImpacts" }
                    },
                    {
                        path:
                            "findingReportClassifications/findingReportClassifications",
                        component: FindingReportClassificationsComponent,
                        data: {
                            permission: "Pages.SystemSetUp.FindingReportClassifications"
                        }
                    },
                    {
                        path: "externalAssessments/externalAssessments",
                        component: ExternalAssessmentsComponent,
                        data: {
                            permission:
                                "Pages.AuditManagement.ExternalAssessments"
                        }
                    },
                    {
                        path: "externalAssessments/externalAssessments/new",
                        component: CreateOrEditExternalAssessmentModalComponent,
                        data: {
                            permission:
                                "Pages.AuditManagement.ExternalAssessments.Create"
                        }
                    },
                    {
                        path: "findingReportings/findingReportings-external",
                        component: FindingReportsComponent,
                        data: {
                            permission: "Pages.AuditManagement.FindingReports"
                        }
                    },
                    { path: 'FeedBackQuestion/feedback-question', component: FeedbackQuestionsComponent },
                    { path: 'feedbackDetail/feedback-Detail', component: FeedbackDetailComponent },
                    { path: 'feedbackResponse/feedback-Response', component: FeedbackResponseComponent },
                    { path: 'audit-management-landing-page', component: AuditManagementLandingPageComponent },
                    { path: 'compliance-management-landing-page', component: ComplianceManagementLandingPageComponent },
                    { path: 'health-care-entities-landing-page', component: HealthCareEntitiesLandingPageComponent },
                    { path: 'organization-setup-landing-page', component: OrganizationSetupLandingPageComponent },
                    { path: 'remediation-plan', component: RemediationPlanComponent },
                    { path: 'create-edit-remediation-plan', component: CreateEditRemediationPlanComponent },
                    { path: 'audit-project-management', component: AuditProjectManagementComponent },
                    { path: 'meeting', component: MeetingComponent },

                    {
                        path: 'findingLog',
                        component: findingLogComponent,
                        data: {
                            permission: "Pages.Administration.findingLog"
                        }
                        
                    },
                    { path: 'questionnaire-group', component: QuestionnaireGroupComponent },
                    { path: 'template-type', component: TemplateTypeComponent },
                    { path: 'template', component: TemplateComponent },
                    { path: 'create-edit-template-type', component: CreateEditTemplateTypeComponent },
                    { path: 'create-edit-questionnaire-group', component: CreateEditQuestionnaireGroupComponent },                   
                    { path: 'map', component: MapComponent },
                    { path: 'audit-project-group', component: AuditProjectGroupComponent },

                    { path: 'certificate', component: CertificateGridComponent },
                    { path: 'auditCertificate', component: AuditCertificateComponent },
                    { path: 'certification-proposal', component: CertificationProposalGridComponent },
                    { path: 'decision', component: DecisionGridComponent },
                    { path: 'audit-report', component: AuditReportGridComponent },
                    { path: 'surviellance-program', component: SurviellanceProgramGridComponent },
                    { path: 'email-notification', component: EmailNotificationComponent },
                    { path: 'email-reminder', component: EmailReminderComponent },                    
                    { path: 'edit-audit-project-management', component: AddEditAuditPprojectComponent },
                    { path: 'external-assessment', component: ExternalsAssessmentComponent },
                    { path: 'pap-enrollment', component: PAPEnrollmentComponent },
                    { path: 'table-top-exercise-exercise', component: TableTopExerciseGroupComponent },
                    { path: 'table-top-exercise-question', component: TableTopExerciseQuestionComponent },
                    { path: 'table-top-exercise-scenario', component: TableTopExerciseSectionComponent },
                    { path: 'table-top-exercise-response', component: TableTopExerciseResponseComponent },
                    
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: '**', redirectTo: 'dashboard' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
