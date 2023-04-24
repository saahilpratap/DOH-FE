import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { AuditProjectGroupDto, BusinessEntityDto, AuditProjectDto, EntityGroupsServiceProxy, AuditDecisionServiceProxy, EntityPrimaryDto, AuthoritativeDocumentsServiceProxy, AuthoritativeDocumentDto, DynamicNameValueDto, ExtAssementScheduleServiceProxy, AuditProjectServiceProxy, CommonLookupServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { EntityGroupDto } from '../../../../shared/service-proxies/services/system-set-up.service';

@Component({
    selector: 'tab-audit-report',
    templateUrl: './tab-audit-report.component.html',
    styleUrls: ['./tab-audit-report.component.css']
})
export class TabAuditReportComponent extends AppComponentBase implements OnInit {

    type: any;
    @Input('auditProjectId') auditProjectId: number;
    @Input('entityGroupId') entityGroupId: any;
    @Input('businessentityId') businessentityId: any;
    @Input('businessEntity') businessEntity: BusinessEntityDto[] = [];
    @Input('entitygroupDetails') entitygroupDetails: AuditProjectGroupDto = new AuditProjectGroupDto();
    @Input('auditproject') auditproject: AuditProjectDto = new AuditProjectDto();
    @Input('oldAuditProject') oldAuditProject: AuditProjectDto = new AuditProjectDto();
    selectedEntityId: number;
    authorityDocuments: AuthoritativeDocumentDto[];
    selectedADId: number;
    entityGroup: EntityGroupDto[] = [];
    entityPrimary: EntityPrimaryDto = new EntityPrimaryDto();
    assessmentTypes: DynamicNameValueDto[];
    IsAdmin: boolean;
    //@Input('reauditPermission') reauditPermission: boolean;
    reauditPermission: boolean;

    constructor(_injector: Injector,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _entityGroupServiceProxy: EntityGroupsServiceProxy,
        private _authoritativeDocumentsServiceProxy: AuthoritativeDocumentsServiceProxy,
        private _auditdecisionServiceProxy: AuditDecisionServiceProxy,
        private _assementScheduleAppService: ExtAssementScheduleServiceProxy,
        private _router: Router,
        private _auditServiceProxy: AuditProjectServiceProxy,
    ) {
        super(_injector);
    }

    ngOnInit() {
        this.IsAdmin = this.appSession.user.isAdmin;
        if (this.entityGroupId != undefined) {
            this.initializationEntityGroup();
            this.entityGroupId = this.entityGroupId;
        }
        else {
            this.entityGroupId = null;
            this.getbusinessEntity(this.businessentityId);
        }
        this.ReauditPermissionCheck();
    }

    initializeAssessmentTypes() {
        this._assementScheduleAppService.getAssessmentTypes().subscribe(res => {
            this.assessmentTypes = res;
        });
    }

    initializationEntityGroup() {
        this._entityGroupServiceProxy.getAllForLookUp().subscribe(res => {
            this.entityGroup = res;
            this.onGroupChange(this.entityGroupId);
        })
    }

    onGroupChange(id: number) {
        this.spinnerService.show();
        this._auditdecisionServiceProxy.getPrimaryEntityByEntityGroupId(id).subscribe(res => {
            this.entityPrimary = res;
            this.initializeAuthoritativeDocumentLookUp();
        })
    }

    getbusinessEntity(Id: number) {
        this.spinnerService.show();
        this._auditdecisionServiceProxy.getBusinessEntity(Id).subscribe(res => {
            this.entityPrimary = res;
            this.initializeAuthoritativeDocumentLookUp();

        })
    }

    initializeAuthoritativeDocumentLookUp() {
        this.authorityDocuments = [];
        this._authoritativeDocumentsServiceProxy.getallAuthorativeDocuments().subscribe(res => {
            this.authorityDocuments = res;
            this.selectedADId = res[0].id;
            this.initializeAssessmentTypes();
        });
        this.spinnerService.hide();
    }

    //Audit-Report
    ReauditPermissionCheck() {
        this._commonLookupServiceProxy.getCurrentUserRoles().subscribe(
            (result) => {
                var roleList = result.map(x => x.roleName);
                this._auditServiceProxy.reauditPermissionCkeker().subscribe(res => {
                    var isExist = res.find(x => x.id == this.auditProjectId);
                    var isBEA = roleList.find(x => x.toLowerCase() == "Business Entity Admin".toLowerCase());
                    var isEAA = roleList.find(x => x.toLowerCase() == "External Audit Admin".toLowerCase());
                    var isEA = roleList.find(x => x.toLowerCase() == "External Auditor".toLowerCase());
                    var isIEA = roleList.find(x => x.toLowerCase() == "Insurance Entity Admin".toLowerCase());

                    if (isExist != undefined) {
                        if (isExist.accessPermission == 0) {
                            this.reauditPermission = true;
                        }
                        //External Auditor
                        else if (isExist.accessPermission == 4) {
                            this.reauditPermission = this.appSession.user.isAuditer ? false : true;
                        }
                        //Business Entity Admin
                        else if (isExist.accessPermission == 1) {
                            if (isBEA != undefined)
                                this.reauditPermission = false;
                            else
                                this.reauditPermission = true;
                        }
                        //Insurance Entity Admin
                        else if (isExist.accessPermission == 1) {
                            if (isIEA != undefined)
                                this.reauditPermission = false;
                            else
                                this.reauditPermission = true;
                        }
                        //External Auditor Admin
                        else if (isExist.accessPermission == 2) {
                            if (isEAA != undefined)
                                this.reauditPermission = false;
                            else
                                this.reauditPermission = true;
                        }
                        //External Auditor Admin + Business Entity Admin
                        else if (isExist.accessPermission == 3) {
                            if (isEAA != undefined || isBEA != undefined)
                                this.reauditPermission = false;
                            else
                                this.reauditPermission = true;
                        }
                        //External Auditor + External Auditor Admin
                        else if (isExist.accessPermission == 6) {
                            if (isEAA != undefined || isBEA != undefined)
                                this.reauditPermission = false;
                            else
                                this.reauditPermission = true;
                        }
                        //External Auditor + Business Entity Admin
                        else if (isExist.accessPermission == 5) {
                            if (isEA != undefined || isBEA != undefined)
                                this.reauditPermission = false;
                            else
                                this.reauditPermission = true;
                        }

                        //else if (isExist.accessPermission == 3) {
                        //    this.reauditPermissionFlag = this.appSession.user.isAuditer ? false : true;
                        //    if (this.reauditPermissionFlag) {

                        //        if (isBEA != undefined) {
                        //            this.reauditPermissionFlag = false;
                        //        }
                        //        else {
                        //            this.reauditPermissionFlag = true;
                        //        }
                        //    }
                        //}
                    }
                    else {
                        this.reauditPermission = false;
                    }
                    if (this.appSession.user.isAdmin)
                        this.reauditPermission = false;
                });
            });
    }


}
