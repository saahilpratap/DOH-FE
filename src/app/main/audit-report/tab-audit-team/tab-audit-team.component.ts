import { Component, OnInit, Injector, ViewChild, Input, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { AuditReportDto, AuditReportServiceProxy, BusinessEntityUserDto, AuditReportTeamStageDto, BusinessEntitiesServiceProxy, BusinessRiskDto, BusinessRiskListOutpurDto, AssementTypeCountDto, AuditDecisionServiceProxy, ApprovalDto, BusinessEntityWorkflowActorType, AuditTeamSignatureDto, AuditProjectDto, GetAllComplianceAuditDto, AuditProjectServiceProxy, CommonLookupServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import * as _ from "lodash";
import { SignaturePad } from 'angular2-signaturepad';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'tab-audit-team',
    templateUrl: './tab-audit-team.component.html',
    styleUrls: ['./tab-audit-team.component.css']
})
export class TabAuditTeamComponent extends AppComponentBase implements OnInit {

    sinData: AuditTeamSignatureDto[];

    //  @ViewChild("signaturen") private signaturen0: SignaturePad;
    type: any;
    data: any[] = [];
    @Input('auditProjectId') auditProjectId: number;
    @Input('oldAuditProject') oldAuditProject: AuditProjectDto = new AuditProjectDto();
    auditReportInput: AuditReportDto = new AuditReportDto();
    auditAgencyAdmins: BusinessEntityUserDto[] = [];
    auditTeamStateInfo: AuditReportTeamStageDto[] = [];
    businessRiskInput: BusinessRiskListOutpurDto = new BusinessRiskListOutpurDto()
    @Input('vendorId') vendorId: any;
    signatureApproverList: AuditTeamSignatureDto[] = [];
    signatureReviewerList: AuditTeamSignatureDto[] = [];
    signatureList: AuditTeamSignatureDto[] = [];
    sigUrl: any;
    stage1Info: any;
    stage1InfoTotalCount: number = 0;
    stage2Info: any;
    abpUserId = abp.session.userId;
    signatureAuthority: AuditTeamSignatureDto = new AuditTeamSignatureDto();
    signatureAuthorityReviwer: AuditTeamSignatureDto = new AuditTeamSignatureDto();
    complianceAuditSummary: GetAllComplianceAuditDto[] = [];
    leadAuditor : any;
    colorScheme = {
        domain: []
    };
    @Input('reauditPermission') reauditPermission: boolean;
   // reauditPermission: boolean;
    IsAdmin: boolean;

    signaturePadOptions: Object = {
        'minWidth': 0.1,
        'canvasWidth': 400,
        'canvasHeight': 80,
        'penColor': 'rgb(0, 0, 128)'
    };
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: 'auto',
        minHeight: '150px',
        maxHeight: '200px',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: false,
        showToolbar: false,
        defaultParagraphSeparator: '',
        defaultFontName: '',
        defaultFontSize: '',
        fonts: [
            { class: 'arial', name: 'Arial' },
            { class: 'times-new-roman', name: 'Times New Roman' },
            { class: 'calibri', name: 'Calibri' },
            { class: 'comic-sans-ms', name: 'Comic Sans MS' }
        ],
        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
    }

    constructor(_injector: Injector,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _auditdecisionServiceProxy: AuditDecisionServiceProxy,
        private auditReportService: AuditReportServiceProxy,
        private _router: Router,
        private _sanitizer: DomSanitizer,
       private _auditProjectservice: AuditProjectServiceProxy,
       private _auditServiceProxy: AuditProjectServiceProxy,

    ) {
        super(_injector);
    }

    ngAfterViewInit() {

    }
    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    loadVendorUsers(vendorId) {       
        this._businessEntitiesServiceProxy
            .getAllAuditAgencyAdmins(vendorId)
            .subscribe(res => {
               
                    this.auditAgencyAdmins = res;
                    this.spinnerService.hide();
               
            }, err => {
                
            });
    }

    async ngOnInit() {
       
        this.IsAdmin = this.appSession.user.isAdmin;
        this.getLeadAuditor(this.auditProjectId);
        await this.getAuditTeamApprovalSignatures();
        this.spinnerService.show();
        this.auditReportService.getAuditReportInfoByAuditProjectId(this.auditProjectId).subscribe(res => {         
            this.auditReportInput = res.auditReport;
            this.complianceAuditSummary = res.auditReport.compliancesummary;
            this.auditReportInput.leadAuditorId = this.leadAuditor;
            this.auditTeamStateInfo = res.auditReportTeamStageList;

            this.stage2Info = _.chain(this.auditTeamStateInfo).groupBy("dominName").map(function (v, i) {
                return {
                    name: i,
                    list: v
                }
            }).value();
            this.stage2Info.forEach(x => {
                this.stage1Info = (this.stage1Info == undefined) ? x.list : _.concat(this.stage1Info, x.list);
                this.stage1InfoTotalCount = this.stage1Info.length;
            });
            this.auditReportInput.auditProjectId = this.auditProjectId;           
            this.loadVendorUsers(this.vendorId);
            this.spinnerService.hide();
        }, err => {
            this.spinnerService.hide();
            this.message.error(err.error.error.message);
        });
    }

    calculas(val1): number {
        var result = 0;
        result = (val1 / this.stage1InfoTotalCount) * 100;
        return result;
    }

    async save() {
        await this.saveRecord();
        this.saveSignature();
    }


    async saveRecord() {      
        this.spinnerService.show();
        this.auditReportService.createOrEditAuditReport(this.auditReportInput).subscribe(res => {

            this.notify.info('Record Save Successfully');
            this.spinnerService.hide();
        }, err => {
            this.spinnerService.hide();
            this.message.error(err.error.error.message);
        });
    }

    saveSignature() {
        this.spinnerService.show();   
        this.auditReportService.createOrEditAuditTeamSignatures(this.sinData).subscribe(res => {
            this.message.info('Record Save Successfully');
            this.spinnerService.hide();
            this.ngOnInit();
        }, err => {
            this.spinnerService.hide();
            this.message.error(err.error.error.message);
        });
    }

    LoadBusinessRisk() {
        this.spinnerService.show();
        this.auditReportService.getAllNotClosedRisk()
            .subscribe(res => {
                setTimeout(() => {
                    this.businessRiskInput = res;
                    this.data = [];
                    for (var i = 0; i < res.riskChar.labels.length; i++)
                    {
                        this.data.push({ "name": res.riskChar.labels[i], "label": res.riskChar.labels[i], "value": res.riskChar.datasets[0].data[i] });
                        this.colorScheme.domain.push(res.riskChar.datasets[0].backgroundColor[i]);
                    }

                    this.loadVendorUsers(this.vendorId);

                    this.spinnerService.hide();
                }, 1000);
            }, err => {
                this.spinnerService.hide();
            });
    }

    setPerformance1(val) {
        this.auditReportInput.performance1 = val;
    }

    setPerformance2(val) {
        this.auditReportInput.performance2 = val;
    }
    signatureUrl3(e,index) {
        for (var i = 0; i < this.sinData.length; i++) {
            if (index == i) {
                this.sinData[i].signature = e;
            }
        }
    }
    async getAuditTeamApprovalSignatures() {
        this.auditReportService.getAllAuditTeamApprovalList(this.auditProjectId).subscribe(async res => {
            this.sinData = res;
            this.signatureApproverList = res.filter(x => x.type == 2);
            this.signatureAuthority = res.find(x => x.type == 4);
            this.signatureAuthorityReviwer = res.find(x => x.type == 1);
        })
    }

    getLeadAuditor(id) {
        var getLeadAuditor = this._auditProjectservice.getAuditProjectForEdit(id).subscribe(res => {
            this.leadAuditor = res.leadAuditorId;

        });
    }

    //Audit Outcome
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
