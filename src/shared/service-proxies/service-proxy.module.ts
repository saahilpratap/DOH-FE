import { AbpHttpInterceptor, RefreshTokenService, AbpHttpConfigurationService } from 'abp-ng2-module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import * as ApiServiceProxies from './service-proxies';
import { ZeroRefreshTokenService } from '@account/auth/zero-refresh-token.service';
import { ZeroTemplateHttpConfigurationService } from './zero-template-http-configuration.service';
import {
    AssessmentsServiceProxy,
    ExternalAssessmentsServiceProxy
} from "./services/assessments.service";

import { AgreementAcceptanceService } from "./services/agreement-acceptance.service";
import { ComplianceManagementServiceProxy } from "./services/compliance-management.service";
import { StatisticsServiceProxy } from "./services/statistic.service";
import { QuestionsServiceProxy } from "./services/question.service";


import {
    ContactTypesServiceProxy,
    ContactsServiceProxy
} from "./services/contact.service";
import {
    IncidentTypesServiceProxy,
    IncidentImpactsServiceProxy
} from "./services/incident.service";
import {
    ExceptionTypesServiceProxy,
    ExceptionsServiceProxy
} from "./services/exception.service";

import {
    FindingReportClassificationsServiceProxy,
    EntityGroupsServiceProxy
} from "./services/system-set-up.service";

import { FindingReportServiceProxy } from "./services/finding-report.service";
import { StorageServiceProxy } from "./services/storage.service";
import { AuthorityDepartmentsServiceProxy } from "./services/AuthorityDepartment.service";
@NgModule({
    providers: [
        // AuthorityDepartmentsServiceProxy,
        // FindingReportServiceProxy,
        // FindingReportClassificationsServiceProxy,
        // ExceptionTypesServiceProxy,
        // IncidentImpactsServiceProxy,
        // IncidentTypesServiceProxy,
        // ContactsServiceProxy,
        //ContactTypesServiceProxy,
        ApiServiceProxies.AuthorityDepartmentsServiceProxy,
        ApiServiceProxies.FindingReportServiceProxy,
        ApiServiceProxies.FindingReportClassificationsServiceProxy,
        ApiServiceProxies.ExceptionTypesServiceProxy,
        ApiServiceProxies.IncidentTypesServiceProxy,
        ApiServiceProxies.IncidentImpactsServiceProxy,
        ApiServiceProxies.ContactsServiceProxy,
        ApiServiceProxies.ContactTypesServiceProxy,
        ApiServiceProxies.ExceptionsServiceProxy,
        ApiServiceProxies.CountriesServiceProxy,
        ApiServiceProxies.ControlRequirementsServiceProxy,
        ApiServiceProxies.ControlStandardsServiceProxy,
        ApiServiceProxies.DomainsServiceProxy,
        ApiServiceProxies.AuthoritativeDocumentsServiceProxy,
        ApiServiceProxies.AuditVendorsServiceProxy,
        //ExceptionsServiceProxy,
        ApiServiceProxies.IncidentsServiceProxy,
        ApiServiceProxies.BusinessRisksServiceProxy,
        ApiServiceProxies.BusinessEntitiesServiceProxy,
        ApiServiceProxies.FeedbacksServiceProxy,
        ApiServiceProxies.FacilityTypesServiceProxy,
        ApiServiceProxies.AssessmentServiceProxy,
        ApiServiceProxies.ExternalAssessmentsServiceProxy,
        ApiServiceProxies.AuditLogServiceProxy,
        ApiServiceProxies.CachingServiceProxy,
        ApiServiceProxies.ChatServiceProxy,
        ApiServiceProxies.CommonLookupServiceProxy,
        ApiServiceProxies.EditionServiceProxy,
        ApiServiceProxies.FriendshipServiceProxy,
        ApiServiceProxies.HostSettingsServiceProxy,
        ApiServiceProxies.InstallServiceProxy,
        ApiServiceProxies.LanguageServiceProxy,
        ApiServiceProxies.NotificationServiceProxy,
        ApiServiceProxies.OrganizationUnitServiceProxy,
        ApiServiceProxies.PermissionServiceProxy,
        ApiServiceProxies.ProfileServiceProxy,
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.TenantDashboardServiceProxy,
        ApiServiceProxies.TenantSettingsServiceProxy,
        ApiServiceProxies.TimingServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.UserLinkServiceProxy,
        ApiServiceProxies.UserLoginServiceProxy,
        ApiServiceProxies.WebLogServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.TenantRegistrationServiceProxy,
        ApiServiceProxies.HostDashboardServiceProxy,
        ApiServiceProxies.PaymentServiceProxy,
        ApiServiceProxies.DemoUiComponentsServiceProxy,
        ApiServiceProxies.InvoiceServiceProxy,
        ApiServiceProxies.SubscriptionServiceProxy,
        ApiServiceProxies.InstallServiceProxy,
        ApiServiceProxies.UiCustomizationSettingsServiceProxy,
        ApiServiceProxies.PayPalPaymentServiceProxy,
        ApiServiceProxies.StripePaymentServiceProxy,
        ApiServiceProxies.DashboardCustomizationServiceProxy,
        ApiServiceProxies.WebhookEventServiceProxy,
        ApiServiceProxies.WebhookSubscriptionServiceProxy,
        ApiServiceProxies.WebhookSendAttemptServiceProxy,
        ApiServiceProxies.UserDelegationServiceProxy,
        ApiServiceProxies.DynamicParameterServiceProxy,
        ApiServiceProxies.DynamicEntityParameterDefinitionServiceProxy,
        ApiServiceProxies.EntityDynamicParameterServiceProxy,
        ApiServiceProxies.DynamicParameterValueServiceProxy,
        ApiServiceProxies.EntityDynamicParameterValueServiceProxy,
        ApiServiceProxies.AssessmentServiceProxy,
        ApiServiceProxies.ExternalAssessmentsServiceProxy,
        ApiServiceProxies.AgreementAcceptanceLogServiceProxy,
        ComplianceManagementServiceProxy,
        StatisticsServiceProxy,
        ApiServiceProxies.QuestionsServiceProxy,
        ApiServiceProxies.EntityGroupsServiceProxy,
        ApiServiceProxies.AssementScheduleServiceProxy,
        ApiServiceProxies.EntityApplicationSettingServiceProxy,
        ApiServiceProxies.ExtAssementScheduleServiceProxy,
        ApiServiceProxies.TemplateChecklistServiceProxy,
        ApiServiceProxies.MeetingTemplateServiceProxy ,
        StorageServiceProxy, ApiServiceProxies.AuditDashboardServiceProxy,
        ApiServiceProxies.RemediationServiceProxy, ApiServiceProxies.HealthCareLandingServiceProxy,
        ApiServiceProxies.AuditProjectServiceProxy, ApiServiceProxies.CustomDynamicServiceProxy,
        ApiServiceProxies.MeetingServiceProxy, ApiServiceProxies.QuestionGroupServiceProxy,
        ApiServiceProxies.QuestResponseServiceProxy, ApiServiceProxies.AuditDecisionServiceProxy, ApiServiceProxies.CertificationProposalServiceProxy,
        ApiServiceProxies.AuditSurviellanceProjectServiceProxy,
        ApiServiceProxies.AuditReportServiceProxy,
        ApiServiceProxies.WorkFlowServiceProxy,
        ApiServiceProxies.FacilitySubTypeServiceProxy,
        ApiServiceProxies.HangfireCustomServiceProxy,
        ApiServiceProxies.CustomTemplateServiceProxy,
        ApiServiceProxies.EmailNotificationTemplateServiceProxy,
        ApiServiceProxies.BusinessEntityAdminChangeRequestServiceProxy,
        ApiServiceProxies.CertificateQRCodeServiceProxy,
        ApiServiceProxies.EmailReminderTemplateServiceProxy,
        ApiServiceProxies.SectionServiceProxy,
        ApiServiceProxies.PatientAuthenticationPlatformServiceProxy,
        ApiServiceProxies.TableTopExerciseServiceProxy,
        ApiServiceProxies.TableTopExerciseGroupServiceProxy,
        ApiServiceProxies.TableTopExerciseSectionServiceProxy, 
        ApiServiceProxies.AuditProjectCloneServiceProxy,
        { provide: RefreshTokenService, useClass: ZeroRefreshTokenService },
        { provide: AbpHttpConfigurationService, useClass: ZeroTemplateHttpConfigurationService },
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class ServiceProxyModule { }
