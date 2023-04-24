import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter, } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { AuditProjectServiceProxy, AuditDecisionServiceProxy, CustomDynamicServiceProxy, AuditDecUsersDto, BusinessEntityWorkflowActorType, TechnicalCommiteDto, AuditAgencyDto, AuthorityDto, ApprovalDto, BusinessEntitiesServiceProxy, BusinessEnityGroupWiesDto, DynamicNameValueDto, EntityPrimaryDto, OutPutConClusion, EntityGroupDto, EntityGroupsServiceProxy, AuditDecisionDto, CommonLookupServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { DomSanitizer } from '@angular/platform-browser';
import { SignaturePad } from 'angular2-signaturepad';
import { ViewChildren, QueryList } from '@angular/core';

export class DocumentCheck {
    id: number;
    name: string;
    checked: boolean;
}
@Component({
    selector: 'tab-view-decision',
    templateUrl: './tab-view-decision.component.html',
})

export class TabViewDecisionComponent extends AppComponentBase implements OnInit {
    @Input('auditprojectId') auditprojectId: any;
    @Input('entityGroupId') entityGroupId: any;
    @Input('businessentityId') businessentityId: any;
    abpUserId = abp.session.userId;

    @Output() closeModal = new EventEmitter();
    certifiableExcept = [
        { id: '1', name: 'Group is Certifiable' },
        { id: '2', name: 'Group is Certifiable' },
        { id: '3', name: 'Individual is Certifiable' },
    ];

    @ViewChild("signaturen") private signaturen: SignaturePad;
    @ViewChild("signaturen1") private signaturen1: SignaturePad;

    @ViewChildren('signaturen8') signaturen8: QueryList<SignaturePad>;

    signaturePadOptions: Object = {
        'minWidth': 0.1,
        'canvasWidth': 615,
        'canvasHeight': 100,
        'penColor': 'rgb(0, 0, 128)'
    };

    flag: boolean = false;
    technicalCommitee: TechnicalCommiteDto[] = [];
    Approval: ApprovalDto[] = [];
    Authority: AuthorityDto[] = [];
    AuditAgency: AuditAgencyDto[] = [];
    auditagency: AuditDecisionDto[] = [];
    imgUrl: any;
    selectedItem: boolean;
    entityGroup: EntityGroupDto[] = [];

    auditDecision: AuditDecisionDto = new AuditDecisionDto();
    entityPrimary: EntityPrimaryDto = new EntityPrimaryDto();
    documents: DynamicNameValueDto[];
    selectedDocument: DocumentCheck[] = [];
    entityReview: any;
    authorityReview: any;
    documentany: any;
    outputconclusion: { id: number; name: string }[] = [];
    splitted: any;
    splitedbusinessentity: any;
    businessentitys: any;
    businessentity: BusinessEnityGroupWiesDto[] = [];
    selectedBusinessEntity: BusinessEnityGroupWiesDto[] = [];
    authorityPerson: boolean;
    approvalPerson: boolean;


    approvalName: string;
    approvalId: number = 0;
    authortiyName: string;
    authortiyId: number = 0;
    Auditdecid: any;
    @Input('reauditPermission') reauditPermission: boolean;
   // reauditPermission: boolean;
    IsAdmin : boolean;
    constructor(_injector: Injector,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _entityGroupServiceProxy: EntityGroupsServiceProxy,
        private _auditServiceProxy: AuditProjectServiceProxy,
        private _auditdecisionServiceProxy: AuditDecisionServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _sanitizer: DomSanitizer
    ) {
        super(_injector);
        this.documentany = [];
    }

    async ngOnInit() {
        
        this.IsAdmin = this.appSession.user.isAdmin;
        this.getdocuments();
        if (this.entityGroupId != undefined) {
            await this.initializationEntityGroup();
            await this.initializationbusinessEntity(this.entityGroupId);
            this.auditDecision.entityGroupId = this.entityGroupId;
        }
        else {
            this.auditDecision.entityGroupId = null;
            await this.getbusinessEntity(this.businessentityId);
            await this.getbusinessEntityByProject(this.businessentityId);
        }
        this.getLeadAuditorAndAuthorityUser();
        await this.getoutputconclusion();
        await this.getAuditDecision();
    }

    async businessentitySelected() {
        this.businessentitys = [];
        this.businessentity.forEach(obj => {
            this.businessentitys.push(obj.id);
        })
    }

    async SingleBusinessentitySelected() {
        this.businessentitys = [];
        this.businessentitys.push(this.businessentity[0].id);
    }

    getbusinessEntity(Id: number) {
        this._auditdecisionServiceProxy.getBusinessEntity(Id).subscribe(res => {
            this.entityPrimary = res;
        })
    }

    getbusinessEntityByProject(Id: number) {
        this._businessEntitiesServiceProxy.getBusinessEntityes(Id).subscribe(res => {
            this.businessentity = res;
        })
    }

    initializationbusinessEntity(id: number) {
        this.selectedBusinessEntity = [];
        this._businessEntitiesServiceProxy.getBusinessEntityWithGrouporNot(id, this.auditprojectId).subscribe(res => {
            this.businessentity = res;
        })
    }

    async editauditdecUser() {
        this.AuditAgency = [];
        this.auditDecision.auditDecUser.forEach(obj => {
            var auditsign = new AuditAgencyDto();
            auditsign.id = obj.id;
            auditsign.memberNameId = obj.memberNameId;
            auditsign.signature = obj.signature;
            auditsign.auditDecFormId = obj.auditDecFormId;
            auditsign.name = obj.name;
            auditsign.type = obj.type;
            this.AuditAgency.push(auditsign);
        })
    }

    async editAuthoritydecUser() {
        this.Authority = [];
        this.auditDecision.authorityUser.forEach(obj => {
            var auditsign = new AuditAgencyDto();
            auditsign.id = obj.id;
            auditsign.memberNameId = obj.memberNameId;
            auditsign.signature = obj.signature;
            auditsign.auditDecFormId = obj.auditDecFormId;
            auditsign.name = obj.name;
            auditsign.type = obj.type;
            this.Authority.push(auditsign);
        })
    }

    getAuditDecision() {
        this.spinnerService.show();
        this.documentany = [];
        this.businessentitys = [];
        this.selectedBusinessEntity = [];
        this._auditdecisionServiceProxy.getAuditDecisionByProjectId(this.auditprojectId).subscribe(async res => {
            if (res.id > 0) {
                this.selectedDocument = [];
                this.auditDecision = res;
                this.auditDecision.auditDecUser = res.auditDecUser;
                this.approvalName = res.doHApprover;
                this.authortiyName = res.auditAgencyApprover;
                await this.editauditdecUser();
                await this.editAuthoritydecUser();
                if (this.auditDecision.documentCheck != null) {
                    this.splitted = this.auditDecision.documentCheck.split(',');
                    this.splitted = this.splitted.slice(0, (this.splitted.length - 1));
                }

                if (this.auditDecision.businessEntityNames != null) {
                    this.selectedItem = true;
                    var businessEntitiesList = this.auditDecision.businessEntityNames.split(',');
                    businessEntitiesList = businessEntitiesList.slice(0, (businessEntitiesList.length - 1));

                    this.splitedbusinessentity = [];
                    businessEntitiesList.forEach(x => {
                        var a = x.split(':')[0];
                        this.splitedbusinessentity.push(a);
                    });

                    if (this.splitedbusinessentity != undefined) {
                        this.businessentity.forEach(obj => {

                            var items = this.splitedbusinessentity.find(x => Number(x) == obj.id);
                            if (items != undefined) {
                                this.selectedBusinessEntity.push(obj);
                            }
                        })
                    }
                }

                this._customDynamicService.getDynamicEntityDatabyName("Documents").subscribe(async result => {

                    this.documents = result;
                    this.documents.forEach(obj => {
                        if (this.splitted != undefined) {
                            var item = this.splitted.find(x => Number(x) == obj.id);
                        }
                        if (item == undefined) {
                            var a = new DocumentCheck();
                            a.checked = false;
                            a.id = obj.id;
                            a.name = obj.name;
                            this.selectedDocument.push(a);
                        }
                        else {
                            var a = new DocumentCheck();
                            a.checked = true;
                            a.id = obj.id;
                            a.name = obj.name;
                            this.selectedDocument.push(a);

                            this.documentany.push(obj.id);
                        }
                    })
                })
            }
            else {
                this.getapprovalandagency();
            }

            if (res) {
                this.spinnerService.hide();
            }
            else {
                this.spinnerService.hide();
            }
        })


    }

    getdocuments() {
        this._customDynamicService.getDynamicEntityDatabyName("Documents").
            subscribe(result => {
                this.documents = result;
                result.forEach(obj => {
                    var a = new DocumentCheck();
                    a.checked = false;
                    a.id = obj.id;
                    a.name = obj.name;
                    this.selectedDocument.push(a);
                })
            })
    }

    setdocument(e, item) {

        if (e.currentTarget.checked == true) {
            this.documentany.push(item.id);
        }
        else {

        }
    }

    async auditTypeSelect(event: any, type: any) {
        if (type == 1) {
            this.selectedItem = true;
        }
        else if (type == 2) {
            this.selectedBusinessEntity = null;
            this.selectedItem = false;
            await this.businessentitySelected();
        }
        else if (type == 3) {
            this.selectedBusinessEntity = null;
            this.selectedItem = false;
            await this.SingleBusinessentitySelected();
        }

        this.auditDecision.outPutConClusion = type;
    }

    getbusinessentityChange() {
        if (this.selectedBusinessEntity != null) {
            this.businessentitys = [];
            this.selectedBusinessEntity.forEach(obj => {
                this.businessentitys.push(obj.id);
            })
        }
    }

    initializationEntityGroup() {
        this._entityGroupServiceProxy.getAllForLookUp().subscribe(res => {
            this.entityGroup = res;
            if (this.auditDecision.entityGroupId != null) {
                this.onGroupChange(this.entityGroupId);
            }

        })
    }

    clearImage(e) {
        if (e == 'entityReview') {
            this.entityReview = true;
        }
        else if (e == 'authorityReview') {
            this.authorityReview = true;
        }
    }

    getoutputconclusion() {
        this.outputconclusion = [];
        for (var n in OutPutConClusion) {
            if (typeof OutPutConClusion[n] === 'number') {
                this.outputconclusion.push({ id: <any>OutPutConClusion[n], name: n });
            }
        }
    }

    getsignPushUsers() {
        this.auditDecision.auditDecUser = [];
        this.auditDecision.authorityUser = [];
        let getsignature = this.signaturen8.toArray();

        for (var j = 0; j < this.AuditAgency.length; j++) {

            var auditsign = new AuditDecUsersDto();
            auditsign.id = 0;
            auditsign.memberNameId = this.AuditAgency[j].memberNameId;
            if (auditsign.memberNameId == this.abpUserId) {
                auditsign.signature = this.AuditAgency[j].signature
            }
            auditsign.type = this.AuditAgency[j].type;
            this.auditDecision.auditDecUser.push(auditsign);

        }


        for (var j = 0; j < this.Authority.length; j++) {


            var auditsign1 = new AuditDecUsersDto();
            auditsign1.id = 0;
            auditsign1.memberNameId = this.Authority[j].memberNameId;
            if (auditsign1.memberNameId == this.abpUserId) {
                auditsign1.signature = this.Authority[j].signature
            }
            auditsign1.type = this.Authority[j].type;
            this.auditDecision.authorityUser.push(auditsign1);

        }

    }

    async editAuditdecisionSign() {
        this.auditDecision.auditDecUser = [];
        this.auditDecision.authorityUser = [];
        let getsignature = this.signaturen8.toArray();
        for (var j = 0; j < this.AuditAgency.length; j++) {

            var auditsign = new AuditDecUsersDto();
            auditsign.id = this.AuditAgency[j].id;
            auditsign.memberNameId = this.AuditAgency[j].memberNameId;
            if (auditsign.memberNameId == this.abpUserId) {
                auditsign.signature = this.AuditAgency[j].signature
            }
            auditsign.type = this.AuditAgency[j].type;
            auditsign.auditDecFormId = this.AuditAgency[j].auditDecFormId;
            this.auditDecision.auditDecUser.push(auditsign);

        }


        for (var j = 0; j < this.Authority.length; j++) {


            var auditsign1 = new AuditDecUsersDto();
            auditsign1.id = this.Authority[j].id;
            auditsign1.memberNameId = this.Authority[j].memberNameId;
            auditsign1.auditDecFormId = this.Authority[j].auditDecFormId;
            if (auditsign1.memberNameId == this.abpUserId) {
                auditsign1.signature = this.Authority[j].signature
            }
            auditsign1.type = this.Authority[j].type;
            this.auditDecision.authorityUser.push(auditsign1);

        }
    }

    async SavedAuditDecision() {


        if (this.auditDecision.id == undefined || this.auditDecision.id == null || this.auditDecision.id == 0) {
            await this.getsignPushUsers();
        }
        else {
            await this.editAuditdecisionSign();

        }
        this.getbusinessentityChange();


        this.auditDecision.businessEntityNames = "";
        this.auditDecision.auditProjectId = this.auditprojectId;
        this.auditDecision.documentCheck = null;


        this.documentany.forEach(obj => {
            this.auditDecision.documentCheck = this.auditDecision.documentCheck + obj + ",";
        });

        if (this.businessentitys != undefined) {
            this.businessentitys.forEach(obj => {
                this.auditDecision.businessEntityNames = this.auditDecision.businessEntityNames + obj + ",";
            })
        }
        if (this.auditDecision.decisionDate == undefined || this.auditDecision.expireDate == undefined) {
            this.message.error("Decision Date and Expire Date are mandatory ");
            return false;
        }

        this.auditDecision.doHApprover = this.approvalName;
        this.auditDecision.auditAgencyApprover = this.authortiyName;        

        if (this.approvalId == this.abpUserId) {
            this.message.confirm('', this.l('Do you Want to send Mail Notification to DOH for Approval'), (isConfirmed) => {
                this._auditdecisionServiceProxy.addorUpdateAuditDecison(true, this.auditDecision).subscribe(res => {
                    abp.notify.success(this.l('SavedSuccessfully'));
                })
            });
        }
        else {
            this._auditdecisionServiceProxy.addorUpdateAuditDecison(false, this.auditDecision).subscribe(res => {
                abp.notify.success(this.l('SavedSuccessfully'));
            })
        }
        
    }

    async getapprovalandagency() {
        this._auditdecisionServiceProxy.getAllTechnicalCommite(this.auditprojectId, this.businessentityId).
            subscribe(async res => {
                this.Approval = res.approval;
                this.AuditAgency = res.auditAgency;
                if (res.approval.length != 0) {

                    res.approval.forEach(y => {
                        if (y.type == BusinessEntityWorkflowActorType.Approver) {
                            this.approvalName = y.name;
                            this.approvalId = y.id;
                        }
                        else if (y.type == BusinessEntityWorkflowActorType.Reviewer) {
                            this.authortiyName = y.name;
                            this.authortiyId = y.id;
                        }
                    });
                }
            })
    }
    onGroupChange(id: number) {
        this._auditdecisionServiceProxy.getPrimaryEntityByEntityGroupId(id).subscribe(res => {
            this.entityPrimary = res;
            this.auditDecision.facilityTypeId = res.facilityTypeId;
        })
    }
    getAuditProjectManager(auditId, businessEntityId, entityGroupId) {
        this.auditprojectId = auditId;
        this.entityGroupId = entityGroupId;
        this.businessentityId = businessEntityId;
    }

    signatureUrl(e) {
        this.auditDecision.doHSign = e;
    }
    signatureUrl1(e) {
        this.auditDecision.auditVensign = e;
    }
    signatureUrl2(e) {
        for (var i = 0; i < this.AuditAgency.length; i++) {
            if (this.AuditAgency[i].memberNameId == this.abpUserId) {
                this.AuditAgency[i].signature = e;
            }
        }
    }

    signatureUrl3(e) {
        for (var i = 0; i < this.Authority.length; i++) {
            if (this.Authority[i].memberNameId == this.abpUserId) {
                this.Authority[i].signature = e;
            }
        }
    }

    async getLeadAuditorAndAuthorityUser() {
        this._auditdecisionServiceProxy.getAllTechnicalCommite(this.auditprojectId, this.businessentityId).
            subscribe(async res => {
                this.Approval = res.approval;
                if (res.approval.length != 0) {
                    res.approval.forEach(y => {
                        if (y.type == BusinessEntityWorkflowActorType.Approver) {
                            this.approvalName = y.name;
                            this.approvalId = y.id;
                        }
                        else if (y.type == BusinessEntityWorkflowActorType.Reviewer) {
                            this.authortiyName = y.name;
                            this.authortiyId = y.id;
                        }
                    });
                }
            })
    }

    //Decision
    ReauditPermissionCheck() {
        this._commonLookupServiceProxy.getCurrentUserRoles().subscribe(
            (result) => {
                var roleList = result.map(x => x.roleName);
                this._auditServiceProxy.reauditPermissionCkeker().subscribe(res => {
                    var isExist = res.find(x => x.id == this.auditprojectId);
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
