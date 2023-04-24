import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import {AuditProjectServiceProxy, CertificationProposalDto, IdNameAndPrimaryDto, IdNameDto, CertificationProposalServiceProxy, EntityWithAssessmentDto, CertificationProposalCalculation, AuthoritativeDocumentDto, AuthoritativeDocumentsServiceProxy, CommonLookupServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { round } from '@amcharts/amcharts4/.internal/core/utils/Time';
import { percent } from '@amcharts/amcharts4/core';

@Component({
    selector: 'tab-view-certification-proposal',
    templateUrl: './tab-view-certification-proposal.component.html',
})

export class TabViewCertificationProposalComponent extends AppComponentBase implements OnInit {
    @Input('auditProjectId') auditProjectId: number;
    @Input('entityGroupId') entityGroupId: any;
    @Input('businessentityId') businessentityId: any;

    certificationProposalInput: CertificationProposalDto = new CertificationProposalDto();
    EntityGroupList: IdNameAndPrimaryDto[] = [];
    BusinessEntityList: EntityWithAssessmentDto[] = [];
    authorityDocuments: AuthoritativeDocumentDto[];
    @Output() closeModal = new EventEmitter();
    selectedPrimaryEntityId: number;
    selectedADId: number;
    referenceList: IdNameDto[] = [];
    certificationProposalCalculation: CertificationProposalCalculation[] = [];
    facilityName: string = '';
    selectedAssessmentId: number;
    DomainTable: {
        Name: string;
        AuditorName: string;
        AuditeeName: string;
        Level: string;
    };
    domainDetails: any;
    externalAssessmentId: string = '';
    totalQuestions: number;
    @Input('reauditPermission') reauditPermission: boolean;
    
    IsAdmin : boolean;
    @Output() activeM = new EventEmitter();
    @Output() popupModal = new EventEmitter();  
    constructor(_injector: Injector,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _auditServiceProxy: AuditProjectServiceProxy,
        private _authoritativeDocumentsServiceProxy: AuthoritativeDocumentsServiceProxy,
        public _ertificationProposalService: CertificationProposalServiceProxy,

    ) {
        super(_injector);
        var temp = new IdNameDto();
        temp.id = 1;
        temp.name = 'ADHICS';
        this.referenceList.push(temp);
        temp.id = 2;
        temp.name = '';
        this.referenceList.push(temp);
    }

    ngOnInit() {
       
        this.IsAdmin = this.appSession.user.isAdmin;
        this.spinnerService.show();
        this.getData(this.auditProjectId, this.businessentityId, this.entityGroupId);
    }   
    getData(auditId, businessEntityId, entityGroupId) {        
        this.auditProjectId = auditId;
        this.entityGroupId = entityGroupId;
        this.businessentityId = businessEntityId;
        this._ertificationProposalService.initilizeCertificationProposal(auditId).subscribe(res => {
            this.EntityGroupList = res.entityGroups;
            this.BusinessEntityList = res.businessEntities;
            this.certificationProposalInput = res.certificationProposalDto;
            let tempDate = moment(this.certificationProposalInput.proposalDate).format("YYYY-MM-DD");
            this.certificationProposalInput.proposalDate = moment(tempDate);
            if (this.certificationProposalInput.entityGroupId != 0) {
                this.SetPrimaryEntityName();
            }
            this.spinnerService.hide();
        }, err => {
            this.spinnerService.hide();
            this.message.error(err.error.error.message);
        });
    }
    SetPrimaryEntityName() {
        
        if (this.entityGroupId != undefined) {
            if (this.EntityGroupList != undefined)
            {          
            let temp = this.EntityGroupList.find(x => x.id == this.certificationProposalInput.entityGroupId);
            if (temp != undefined) {
                this.selectedPrimaryEntityId = temp.entityId;
                }
            else {
                this.selectedPrimaryEntityId = this.businessentityId;
            }
            }
            else {
                this.selectedPrimaryEntityId = this.businessentityId;
            }
        }
        else {
            this.selectedPrimaryEntityId = this.businessentityId;
        }

        var be = this.BusinessEntityList.find(x => x.id == this.selectedPrimaryEntityId);
        if (be != undefined) {
            this.facilityName = be.name;
            this.externalAssessmentId = 'EXE-' + be.assessmentId;
            this.spinnerService.show();
            this._ertificationProposalService.calculateResult(be.id).subscribe(result =>
            {               
                this.certificationProposalCalculation = result;
                this.domainDetails = [];
                this.certificationProposalCalculation.forEach(x => {
                    this.certificationProposalInput.fullyCompliantCount = this.certificationProposalInput.fullyCompliantCount + x.fullyCompliantCount;
                    this.certificationProposalInput.partiallyCompliantCount = this.certificationProposalInput.partiallyCompliantCount + x.partiallyCompliantCount;
                    this.certificationProposalInput.notApplicableCount = this.certificationProposalInput.notApplicableCount + x.notApplicableCount;
                    this.certificationProposalInput.nonCompliantCount = this.certificationProposalInput.nonCompliantCount + x.nonCompliantCount;
                    this.totalQuestions = x.totalCount;
                    var temp = { Name: x.domainName, AuditeeName: '', AuditorName: '', Level: '' + Math.round((((x.fullyCompliantCount + x.partiallyCompliantCount + x.notApplicableCount + x.nonCompliantCount) / x.totalCount) * 100)) + ' %' };
                    this.domainDetails.push(temp);
                });
                if (result.length!=0) {
                    this.certificationProposalInput.grade = this.setGrade();
                }
                this.initializeAuthoritativeDocumentLookUp();
                this.spinnerService.hide();
            }, err => {
                this.spinnerService.hide();
                this.message.error(err.error.error.message);
            });

        } else {
            this.facilityName = '';
            this.externalAssessmentId = '';
        }       
    }

    changeCalcularion(val: number) {
         
        this.spinnerService.show();
        this.externalAssessmentId = "EXE-" + val;
            this._ertificationProposalService.calculateResult(val).subscribe(result => {
                this.certificationProposalCalculation = result;
                this.domainDetails = [];
                
                this.certificationProposalCalculation.forEach(x => {
                    this.certificationProposalInput.fullyCompliantCount = this.certificationProposalInput.fullyCompliantCount + x.fullyCompliantCount;
                    this.certificationProposalInput.partiallyCompliantCount = this.certificationProposalInput.partiallyCompliantCount + x.partiallyCompliantCount;
                    this.certificationProposalInput.notApplicableCount = this.certificationProposalInput.notApplicableCount + x.notApplicableCount;
                    this.certificationProposalInput.nonCompliantCount = this.certificationProposalInput.nonCompliantCount + x.nonCompliantCount;
                    this.totalQuestions = x.totalCount;
                    var temp = { Name: x.domainName, AuditeeName: '', AuditorName: '', Level: '' + Math.round((((x.fullyCompliantCount + x.partiallyCompliantCount + x.notApplicableCount + x.nonCompliantCount) / x.totalCount) * 100)) + ' %' };
                    this.domainDetails.push(temp);
                });
                if (result.length != 0) {
                    this.certificationProposalInput.grade = this.setGrade();
                }
                this.initializeAuthoritativeDocumentLookUp();
                this.spinnerService.hide();
            }, err => {
                this.spinnerService.hide();
                this.message.error(err.error.error.message);
            });
    }

    setGrade(): string {
        var result = '';      
        var attempQuestionCount = this.certificationProposalInput.fullyCompliantCount + this.certificationProposalInput.partiallyCompliantCount + this.certificationProposalInput.notApplicableCount + this.certificationProposalInput.nonCompliantCount;
        var percentage = (attempQuestionCount / this.totalQuestions)*100;

        if (percentage >= 60) {
            result = 'A';
        } else if (percentage < 60 && percentage >= 50) {
            result = 'B';
        } else if (percentage < 50 && percentage >= 40) {
            result = 'C';
        } else {
            result = 'F';
        }
        return result;
    }

    save() {
        this.spinnerService.show();
        this._ertificationProposalService.createOrEdit(this.certificationProposalInput).subscribe(res => {
            abp.notify.success(this.l('SavedSuccessfully'));
            this.spinnerService.hide();
            //this.closeModal.emit(false);
        }, err => {
            this.spinnerService.hide();
                abp.notify.error(err.error.error.message);
        });
    }

    initializeAuthoritativeDocumentLookUp() {
        this.authorityDocuments = [];
        this._authoritativeDocumentsServiceProxy.getallAuthorativeDocuments().subscribe(res => {
            this.authorityDocuments = res;            
            this.selectedADId = res[0].id;
        });
    }

    //Certification Proposal
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
