import {
    Component,
    OnInit,
    Injector,
    ViewChild,
    Input,
    Output,
    EventEmitter,
} from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
@Component({
    selector: "quick-action",
    templateUrl: "./quick-action.component.html",
    // styleUrls: ['./quick-action.component.scss']
})
export class QuickActionComponent extends AppComponentBase implements OnInit {
    //Output() toParent: new EventEmitter<string>;
    @Output() toParent = new EventEmitter<string>();
    @Input("menuID") mID: any;
    selectedMenu: any;

    administration = [
        {
            icon: "flaticon-folder-1",
            title: "Agreement logs",
            permision: "Pages.Administration.AgreementAcceptance.Logs",
            url: "/app/admin/agreement-acceptance-logs",
        },
        {
            icon: "flaticon-map",
            title: "OrganizationUnits",
            permision: "Pages.Administration.OrganizationUnits",
            url: "/app/admin/organization-units",
        },
        {
            icon: "flaticon-settings-1",
            title: "Application Settings",
            permision: "Pages.Administration.ApplicationSettings",
            url: "/app/admin/workflows",
        },
        {
            icon: "flaticon-network",
            title: "EntityGroups",
            permision: "Pages.Administration.EntityGroups",
            url: "/app/admin/entityGroups/entityGroups",
        },
        {
            icon: "flaticon-folder-1",
            title: "AuditLogs",
            permision: "Pages.Administration.AuditLogs",
            url: "/app/admin/auditLogs",
        },       
        {
            icon: "flaticon-suitcase",
            title: "Roles",
            permision: "Pages.Administration.Roles",
            url: "/app/admin/roles",
        },
        {
            icon: "flaticon-users",
            title: "Users",
            permision: "Pages.Administration.Users",
            url: "/app/admin/users",
        },
        {
            icon: "flaticon-users",
            title: "Preregister Entity",
            permision: "Pages.Administration.Tenant.PreRegistration.Approver",
            url: "/app/main/preRegisterRequests",
        },
        {
            icon: "flaticon-lock",
            title: "Maintenance",
            permision: "Pages.Administration.Host.Maintenance",
            url: "/app/admin/maintenance",
        },
        {
            icon: "flaticon-tabs",
            title: "Languages",
            permision: "Pages.Administration.Languages",
            url: "/app/admin/languages/{name}/texts",
        },
        {
            icon: "flaticon-medical",
            title: "VisualSettings",
            permision: "Pages.Administration.UiCustomization",
            url: "/app/admin/ui-customization",
        },
        {
            icon: "flaticon-settings",
            title: "Settings",
            permision: "Pages.Administration.Host.Settings",
            url: "/app/admin/hostSettings",
        },
        {
            icon: "flaticon-settings",
            title: "Settings",
            permision: "Pages.Administration.Tenant.Settings",
            url: "/app/admin/tenantSettings",
        },
        {
            icon: "flaticon2-world",
            title: "WebhookSubscriptions",
            permision: "Pages.Administration.WebhookSubscription",
            url: "/app/admin/webhook-subscriptions",
        },
    ];
    dynamicParameters = [
        {
            icon: "flaticon-interface-8",
            title: "Definitions",
            permision: "Pages.Administration.DynamicParameters",
            url: "/app/admin/dynamic-parameter",
        },
        {
            icon: "flaticon-interface-8",
            title: "EntityDynamicParameters",
            permision: "Pages.Administration.EntityDynamicParameters",
            url: "/app/admin/entity-dynamic-parameter",
        },
    ];
    systemSetUp = [
        //{
        //    icon: "flaticon-more",
        //    title: "BusinessTypes",
        //    permision: "Pages.SystemSetUp.BusinessTypes",
        //    url: "/app/admin/businessTypes/businessTypes",
        //},
        {
            icon: "flaticon-more",
            title: "FacilityTypes",
            permision: "Pages.SystemSetUp.FacilityTypes",
            url: "/app/admin/facilityTypes/facilityTypes",
        },
        {
            icon: "flaticon-more",
            title: "Facility Sub Types",
            permision: "Pages.SystemSetUp.FacilitySubTypes",
            url: "/app/admin/facilitysubTypes",
        },
        {
            icon: "flaticon-more",
            title: "ExceptionTypes",
            permision: "Pages.SystemSetUp.Exceptions.ExceptionTypes",
            url: "/app/admin/exceptionTypes/exceptionTypes",
        },
        {
            icon: "flaticon-more",
            title: "FindingReportClassifications",
            permision: "Pages.SystemSetUp.FindingReportClassifications",
            url:
                "/app/main/findingReportClassifications/findingReportClassifications",
        },
        {
            icon: "flaticon-more",
            title: "Countries",
            permision: "Pages.SystemSetUp.Countries",
            url: "/app/main/countries/countries",
        },
        {
            icon: "flaticon-more",
            title: "ContactTypes",
            permision: "Pages.SystemSetUp.ContactTypes",
            url: "/app/main/contactTypes/contactTypes",
        },
    ];
    workFlow = [
        {
            icon: "flaticon-map",
            title: "Template Management",
            permision: "Pages.Workflow.Templates",
            url: "/app/main/template",
        },
        {
            icon: "flaticon-map",
            title: "Sub Work Flow",
            permision: "Pages.SubWorkflow.Workflows",
            url: "/app/admin/grid-work-flows",
        },
        {
            icon: "flaticon-suitcase",
            title: "Email Notification",
            permision: "Pages.Workflow.EmailNotification",
            url: "/app/main/email-notification",
        },
    ];
    incidents = [
        {
            icon: "flaticon-more",
            title: "IncidentTypes",
            permision: "Pages.SystemSetUp.Incidents.IncidentTypes",
            url: "/app/main/incidentTypes/incidentTypes",
        },
        {
            icon: "flaticon-more",
            title: "IncidentImpacts",
            permision: "Pages.SystemSetUp.Incidents.IncidentImpacts",
            url: "/app/main/incidentImpacts/incidentImpacts",
        },
    ];
    organizationSetup = [
        {
            icon: "flaticon-map",
            title: "Authority Departments",
            permision: "Pages.OrganizationSetup.AuthorityDepartments",
            url: "/app/main/authoritityDepartments/authorityDepartments",
        },
        {
            icon: "flaticon-users",
            title: "Authority Employees",
            permision: "Pages.OrganizationSetup.AuthorityEmployees",
            url: "/app/admin/employees",
        },
    ];
    healthCareEntities = [
        {
            icon: "flaticon-line-graph",
            title: "Entities-Dashboard",
            permision: "Pages.HealthCareEntities.Dashboard",
            url: "/app/main/entity-dashboard",
        },
        {
            icon: "flaticon2-hospital",
            title: "All HealthCare Entities",
            permision: "Pages.HealthCareEntities.All",
            url: "/app/main/businessEntities/healthcare" + { type: 0 },
        },
        {
            icon: "flaticon-info",
            title: "All Assessments",
            permision: "Pages.HealthCareEntities.Assessments",
            url: "/app/main/assessments/assessments",
        },
        //{
        //    icon: "flaticon-list-2",
        //    title: "All Findings",
        //    permision: "Pages.HealthCareEntities.FindingReports",
        //    url: "/app/main/findingReportings/findingReportings-internal",
        //},
        {
            icon: "flaticon-clipboard",
            title: "Remediation Plan",
            permision: "Pages.HealthCareEntities.RemediationPlan",
            url: "/app/main/remediation-plan",
        },
    ];

    authoritySetup = [
        {
            icon: "flaticon-map",
            title: "Authority Departments",
            permision: "Pages.ComplianceManagement.AuthoritativeDocuments",
            url: "/app/main/authoritativeDocuments/authoritativeDocuments",
        },
        {
            icon: "flaticon-users",
            title: "Authority Employees",
            permision: "Pages.ComplianceManagement.Domains",
            url: "/app/main/domains/domains",
        },
    ];

    complianceManagement = [
        {
            icon: "flaticon-list-1",
            title: "Authoratative Documents",
            permision: "Pages.ComplianceManagement.AuthoritativeDocuments",
            url: "/app/main/authoritativeDocuments/authoritativeDocuments",
        },
        {
            icon: "flaticon-info",
            title: "All AD Domains",
            permision: "Pages.ComplianceManagement.Domains",
            url: "/app/main/domains/domains",
        },
        {
            icon: "flaticon-interface-8",
            title: "Control Standard Reports",
            permision: "Pages.ComplianceManagement.ControlStandards",
            url: "/app/main/controlStandards/controlStandards",
        },
        {
            icon: "flaticon-info",
            title: "Control Requirements",
            permision: "Pages.ComplianceManagement.ControlRequirements",
            url: "/app/main/controlRequirements/controlRequirements",
        },
        {
            icon: "flaticon-info",
            title: "Self Assessment Questions",
            permision: "Pages.ComplianceManagement.SelfAssessmentQuestions",
            url: "/app/main/questions/questions",
        },
        {
            icon: "flaticon-info",
            title: "External Assessment Questions",
            permision: "Pages.AuditManagement.ExternalAssessment.Questions",
            url: "/app/main/questions/externalAssessmentQuestions",
        },
        {
            icon: "flaticon-info",
            title: "Questionnaire Group",
            permision: "Pages.ComplianceManagement.QuestionnaireGroup",
            url: "/app/main/questionnaire-group",
        },
    ];
    auditManagement = [
        //{
        //    icon: "flaticon-line-graph",
        //    title: "Audit-Dashboard",
        //    permision: "Pages.AuditManagement.Entities.Dashboard",
        //    url: "/app/main/audit-agency-dashboard",
        //},
        {
            icon: "flaticon-map",
            title: "All External Audit Entities",
            permision: "Pages.AuditManagement.Entities.All",
            url: "/app/main/businessEntities/externalaudit",
        },
        {
            icon: "flaticon-calendar-1",
            title: "Audit Programs Management",
            permision: "Pages.AuditManagement.ExternalAssessments",
            url: "/app/main/externalAssessments/externalAssessments",
        },
        {
            icon: "flaticon-layers",
            title: "Audit Projects",
            permision: "Pages.AuditManagement.ExternalAssessments",
            url: "/app/main/audit-project-management",
        },
        //{
        //    icon: "flaticon-list-3",
        //    title: "External Audit Findings",
        //    permision: "Pages.AuditManagement.FindingReports",
        //    url: "/app/main/findingReportings/findingReportings-external",
        //},
        //{
        //    icon: "flaticon-list-3",
        //    title: "Meetings",
        //    permision: "Pages.AuditManagement.Meeting",
        //    url: "/app/main/meeting",
        //},
        {
            icon: "flaticon-list-3",
            title: "Templates & Checklist",
            permision: "Pages.TemplatesAndCheckLists",
            url: "/app/main/template-type",
        },
    ];

    constructor(
        _injector: Injector,
        private _router: Router,
        route: ActivatedRoute
    ) {
        super(_injector);
    }

    ngOnInit() { }
    onChange(value) {
        this.toParent.emit(value);
    }
    menuClick(e) {
        this.selectedMenu = e;
    }
}
