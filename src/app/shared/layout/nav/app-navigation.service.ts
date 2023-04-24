import { PermissionCheckerService } from 'abp-ng2-module';
import { AppSessionService } from '@shared/common/session/app-session.service';

import { Injectable } from '@angular/core';
import { AppMenu } from './app-menu';
import { AppMenuItem } from './app-menu-item';

@Injectable()
export class AppNavigationService {

    constructor(
        private _permissionCheckerService: PermissionCheckerService,
        private _appSessionService: AppSessionService
    ) {

    }

    getMenu(): AppMenu {
        return new AppMenu('MainMenu', 'MainMenu', [

            new AppMenuItem(
                "Dashboard",
                "Pages.Administration.Host.Dashboard",
                "flaticon-line-graph",
                "/app/admin/hostDashboard"
            ),
            new AppMenuItem(
                "Dashboard",
                "Pages.Tenant.Dashboard",
                "flaticon-line-graph",
                "/app/main/dashboard"
            ),
            new AppMenuItem(
                "Tenants",
                "Pages.Tenants",
                "flaticon-list-3",
                "/app/admin/tenants"
            ),

            new AppMenuItem('Administration', '', 'flaticon-interface-8', '', [], [
                new AppMenuItem(
                    "Agreement logs",
                    "Pages.Administration.AgreementAcceptance.Logs",
                    "flaticon-folder-1",
                    "/app/admin/agreement-acceptance-logs"
                ),
                new AppMenuItem(
                    "OrganizationUnits",
                    "Pages.Administration.OrganizationUnits",
                    "flaticon-map",
                    "/app/admin/organization-units"
                ),
                new AppMenuItem(
                    "Application Settings",
                    "Pages.Administration.ApplicationSettings",
                    "flaticon-settings-1",
                    "/app/admin/workflows"
                ),
                new AppMenuItem(
                    "EntityGroups",
                    "Pages.Tenant.Admin",
                    "flaticon-network",
                    "/app/admin/entityGroups/entityGroups"
                ),

                new AppMenuItem(
                    "AuditLogs",
                    "Pages.Administration.AuditLogs",
                    "flaticon-folder-1",
                    "/app/admin/auditLogs"
                ),
                new AppMenuItem(
                    "Certification",
                    "Pages.Administration.AuditLogs",
                    "flaticon-folder-1",
                    "/app/main/auditCertificate"
                ),

                new AppMenuItem("Work Flow", "", "flaticon-map", "/app/admin/work-flow", [], [
                    new AppMenuItem("Template Management", "Pages.Workflow.Templates", "flaticon-map", "/app/main/template"),
                    new AppMenuItem('Sub Work Flow', "Pages.SubWorkflow.Workflows", 'flaticon-map', '/app/admin/grid-work-flows'),
                    new AppMenuItem('Email Notification', "Pages.Workflow.EmailNotification", 'flaticon-suitcase', '/app/main/email-notification'),
                    new AppMenuItem('Email Reminder', "Pages.Workflow.MenuEmailReminder", 'flaticon-suitcase', '/app/main/email-reminder'),
                ]),

                //new AppMenuItem('Finding Log', 'Pages.Administration.findingLog', 'flaticon-suitcase', '/app/main/findingLog'),
                new AppMenuItem('Roles', 'Pages.Administration.Roles', 'flaticon-suitcase', '/app/admin/roles'),
                new AppMenuItem('Users', 'Pages.Administration.Users', 'flaticon-users', '/app/admin/users'),

                new AppMenuItem('Preregister Entity', 'Pages.Administration.Tenant.PreRegistration.Approver', 'flaticon-users', '/app/main/preRegisterRequests'),

                new AppMenuItem('Languages', 'Pages.Administration.Languages', 'flaticon-tabs', '/app/admin/languages', ['/app/admin/languages/{name}/texts']),
                new AppMenuItem('Maintenance', 'Pages.Administration.Host.Maintenance', 'flaticon-lock', '/app/admin/maintenance'),
                new AppMenuItem('VisualSettings', 'Pages.Administration.UiCustomization', 'flaticon-medical', '/app/admin/ui-customization'),
                new AppMenuItem('Settings', 'Pages.Administration.Host.Settings', 'flaticon-settings', '/app/admin/hostSettings'),
                new AppMenuItem('Settings', 'Pages.Administration.Tenant.Settings', 'flaticon-settings', '/app/admin/tenantSettings'),
                new AppMenuItem('WebhookSubscriptions', 'Pages.Administration.WebhookSubscription', 'flaticon2-world', '/app/admin/webhook-subscriptions'),
                new AppMenuItem('DynamicParameters', '', 'flaticon-interface-8', '', [], [
                    new AppMenuItem('Definitions', 'Pages.Administration.DynamicParameters', '', '/app/admin/dynamic-parameter'),
                    new AppMenuItem('EntityDynamicParameters', 'Pages.Administration.EntityDynamicParameters', '', '/app/admin/entity-dynamic-parameter'),
                ]),
                new AppMenuItem("System Set Up", "Pages.SystemSetUp", "flaticon2-ui", "", [],
                    [
                        new AppMenuItem(
                            "FacilityTypes",
                            "Pages.SystemSetUp.FacilityTypes",
                            "flaticon-more",
                            "/app/admin/facilityTypes/facilityTypes"
                        ),
                        new AppMenuItem(
                            "Facility Sub Types",
                            "Pages.SystemSetUp.FacilitySubTypes",
                            "flaticon-more",
                            "/app/admin/facilitysubTypes"
                        ),
                        new AppMenuItem(
                            "ExceptionTypes",
                            "Pages.SystemSetUp.Exceptions.ExceptionTypes",
                            "flaticon-more",
                            "/app/admin/exceptionTypes/exceptionTypes"
                        ),
                        new AppMenuItem(
                            "FindingReportClassifications",
                            "Pages.SystemSetUp.FindingReportClassifications",
                            "flaticon-more",
                            "/app/main/findingReportClassifications/findingReportClassifications"
                        ),
                        new AppMenuItem(
                            "Countries",
                            "Pages.SystemSetUp.Countries",
                            "flaticon-more",
                            "/app/main/countries/countries"
                        ),
                        new AppMenuItem(
                            "ContactTypes",
                            "Pages.SystemSetUp.ContactTypes",
                            "flaticon-more",
                            "/app/main/contactTypes/contactTypes"
                        ),
                        new AppMenuItem("Incidents", "", "flaticon-more", "", [],
                            [
                                new AppMenuItem(
                                    "IncidentTypes",
                                    "Pages.SystemSetUp.Incidents.IncidentTypes",
                                    "flaticon-more",
                                    "/app/main/incidentTypes/incidentTypes"
                                ),
                                new AppMenuItem(
                                    "IncidentImpacts",
                                    "Pages.SystemSetUp.Incidents.IncidentImpacts",
                                    "flaticon-more",
                                    "/app/main/incidentImpacts/incidentImpacts"
                                )
                            ])
                    ]),

            ]),

            new AppMenuItem("Authority Setup", "Pages.OrganizationSetup", "flaticon-map", "", [], [

                new AppMenuItem(
                    "Authority Departments",
                    "Pages.OrganizationSetup.AuthorityDepartments",
                    "flaticon-map",
                    "/app/main/authoritityDepartments/authorityDepartments"
                ),
                new AppMenuItem(
                    "Authority Employees",
                    "Pages.OrganizationSetup.AuthorityEmployees",
                    "flaticon-users",
                    "/app/admin/employees",
                    [], [], false, { type: 1 }
                )
            ]),

            new AppMenuItem("Change Request", "", "flaticon-map", "", [], [
                new AppMenuItem(
                    "Change Request",
                    "Pages.ChangeRequest",
                    "flaticon-map",
                    "/app/main/businessEntities/change-request"
                )
            ]),

            new AppMenuItem("HealthCare Entities", "", "flaticon2-hospital", "", [], [
                new AppMenuItem(
                    "Entities-Dashboard",
                    "Pages.HealthCareEntities.Dashboard",
                    "flaticon-line-graph",
                    "/app/main/entity-dashboard"
                ),
                new AppMenuItem(
                    "All HealthCare Entities",
                    "Pages.HealthCareEntities.All",
                    "flaticon2-hospital",
                    "/app/main/businessEntities/healthcare",
                    [], [], false, { type: 0 }
                ),
                new AppMenuItem(
                    "All Assessments",
                    "Pages.HealthCareEntities.Assessments",
                    "flaticon-info",
                    "/app/main/assessments/assessments"
                ),

                //new AppMenuItem(
                //    "All Findings",
                //    "Pages.HealthCareEntities.FindingReports",
                //    "flaticon-list-2",
                //    "/app/main/findingReportings/findingReportings-internal"
                //),
                new AppMenuItem("Remediation Plans",
                    "Pages.HealthCareEntities.RemediationPlan",
                    "flaticon-clipboard",
                    "/app/main/remediation-plan")
            ]),

            new AppMenuItem("Compliance Management", "Pages.ComplianceManagement", "flaticon-security", "", [], [

                new AppMenuItem(
                    "Authoritative Documents",
                    "Pages.ComplianceManagement.AuthoritativeDocuments",
                    "flaticon-list-1",
                    "/app/main/authoritativeDocuments/authoritativeDocuments"
                ),
                new AppMenuItem(
                    "All AD Domains",
                    "Pages.ComplianceManagement.Domains",
                    "flaticon-squares-1",
                    "/app/main/domains/domains"
                ),
                new AppMenuItem(
                    "Control Standards",
                    "Pages.ComplianceManagement.ControlStandards",
                    "flaticon-list",
                    "/app/main/controlStandards/controlStandards"
                ),
                new AppMenuItem(
                    "Control Requirements",
                    "Pages.ComplianceManagement.ControlRequirements",
                    "flaticon2-shield",
                    "/app/main/controlRequirements/controlRequirements"
                ),
                new AppMenuItem(
                    "Self Assessment Questions",
                    "Pages.ComplianceManagement.SelfAssessmentQuestions",
                    "flaticon-info",
                    "/app/main/questions/questions"
                ),
                new AppMenuItem(
                    "External Assessment Questions",
                    "Pages.AuditManagement.ExternalAssessment.Questions",
                    "flaticon-info",
                    "/app/main/questions/externalAssessmentQuestions"
                ),
                new AppMenuItem(
                    "Section",
                    "",
                    "flaticon-info",
                    "/app/main/section"
                ),
                new AppMenuItem(
                    "Questionnaire Group",
                    "Pages.ComplianceManagement.QuestionnaireGroup",
                    "flaticon-notepad",
                    "/app/main/questionnaire-group"
                )
            ]),

            new AppMenuItem("Audit Management", "", "flaticon-list", "", [], [
                new AppMenuItem(
                    "All External Audit Entities",
                    "Pages.AuditManagement.Entities.All",
                    "flaticon-map",
                    "/app/main/businessEntities/externalaudit",
                    [], [], false, { type: 1 }
                ),
                new AppMenuItem(
                    "Audit Programs Management",
                    "Pages.AuditManagement.ExternalAssessments",
                    "flaticon-calendar-1",
                    "/app/main/externalAssessments/externalAssessments"
                ),
                //new AppMenuItem(
                //    "Audit Programs Management",
                //    "Pages.AuditManagement.ExternalAssessments",
                //    "flaticon-calendar-1",
                //    "/app/main/external-assessment"
                //),
                new AppMenuItem("Audit Projects", "Pages.AuditManagement.AuditProject", "flaticon-layers", "/app/main/audit-project-management"),
                // new AppMenuItem("External Audit Findings", "Pages.AuditManagement.FindingReports", "flaticon-list-3", "/app/main/findingReportings/findingReportings-external"),
                //new AppMenuItem("Meetings", "Pages.AuditManagement.Meeting", "flaticon2-calendar-9", "/app/main/meeting"),
                new AppMenuItem("Templates & Checklist", "Pages.TemplatesAndCheckLists", "flaticon-doc", "/app/main/template-type")
            ]),

            new AppMenuItem("Contact Management", "Pages.Contacts", "flaticon2-avatar", "/app/main/contacts/contacts"),
            //new AppMenuItem("Feedback", "Pages.FeedbackQuestion", "flaticon-doc", "/app/main/FeedBackQuestion/feedback-question"),

            new AppMenuItem("Feedback", "Pages.Feedback", "flaticon-doc", "", [], [
                new AppMenuItem("Feedback Question", "Pages.FeedbackQuestion", "flaticon-map", "/app/main/FeedBackQuestion/feedback-question"),
                new AppMenuItem('FeedBack Detail', "Pages.FeedbackDetail", 'flaticon-map', '/app/main/feedbackDetail/feedback-Detail'),
                new AppMenuItem('FeedBack Response', "Pages.FeedbackResponse", 'flaticon-suitcase', '/app/main/feedbackResponse/feedback-Response'),
            ]),
            new AppMenuItem('PAP Enrollment', 'Pages.PAPEnrollment', 'flaticon-shapes', '/app/main/pap-enrollment'),           
            new AppMenuItem("Table Top exercise", "Pages.TableTopExercise", "flaticon-layers", "", [], [
                new AppMenuItem("Question", "Pages.TableTopExerciseQuestion", "flaticon-map", "/app/main/table-top-exercise-question" ),
                new AppMenuItem("Scenario", "Pages.TableTopExerciseSection", "flaticon-map", "/app/main/table-top-exercise-scenario"),
                new AppMenuItem("Exercise", "Pages.TableTopExerciseGroup", "flaticon-map", "/app/main/table-top-exercise-exercise"),
                new AppMenuItem("Response", "Pages.TableTopExerciseResponse", "flaticon-map", "/app/main/table-top-exercise-response")
                
            ]),
        ]);
    }

    checkChildMenuItemPermission(menuItem): boolean {
        for (let i = 0; i < menuItem.items.length; i++) {
            let subMenuItem = menuItem.items[i];

            if (subMenuItem.permissionName === '' || subMenuItem.permissionName === null) {
                if (subMenuItem.route) {
                    return true;
                }
            } else if (this._permissionCheckerService.isGranted(subMenuItem.permissionName)) {
                return true;
            }

            if (subMenuItem.items && subMenuItem.items.length) {
                let isAnyChildItemActive = this.checkChildMenuItemPermission(subMenuItem);
                if (isAnyChildItemActive) {
                    return true;
                }
            }
        }
        return false;
    }

    showMenuItem(menuItem: AppMenuItem): boolean {
        if (menuItem.permissionName === 'Pages.Administration.Tenant.SubscriptionManagement' && this._appSessionService.tenant && !this._appSessionService.tenant.edition) {
            return false;
        }

        let hideMenuItem = false;

        if (menuItem.requiresAuthentication && !this._appSessionService.user) {
            hideMenuItem = true;
        }

        if (menuItem.permissionName && !this._permissionCheckerService.isGranted(menuItem.permissionName)) {
            hideMenuItem = true;
        }

        if (this._appSessionService.tenant || !abp.multiTenancy.ignoreFeatureCheckForHostUsers) {
            if (menuItem.hasFeatureDependency() && !menuItem.featureDependencySatisfied()) {
                hideMenuItem = true;
            }
        }

        if (!hideMenuItem && menuItem.items && menuItem.items.length) {
            return this.checkChildMenuItemPermission(menuItem);
        }

        return !hideMenuItem;
    }

    /**
     * Returns all menu items recursively
     */
    getAllMenuItems(): AppMenuItem[] {
        let menu = this.getMenu();
        let allMenuItems: AppMenuItem[] = [];
        menu.items.forEach(menuItem => {
            allMenuItems = allMenuItems.concat(this.getAllMenuItemsRecursive(menuItem));
        });

        return allMenuItems;
    }

    private getAllMenuItemsRecursive(menuItem: AppMenuItem): AppMenuItem[] {
        if (!menuItem.items) {
            return [menuItem];
        }

        let menuItems = [menuItem];
        menuItem.items.forEach(subMenu => {
            menuItems = menuItems.concat(this.getAllMenuItemsRecursive(subMenu));
        });

        return menuItems;
    }
}
