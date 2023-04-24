import { Component, OnInit, Injector, ViewChild, Input, Inject, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { TabViewAuditProjectComponent } from '../tab-view-audit-project/tab-view-audit-project.component';
import { TabViewAuditReportComponent } from '../tab-view-audit-report/tab-view-audit-report.component';
import { TabViewCertificateComponent } from '../tab-view-certificate/tab-view-certificate.component';
import { TabViewCertificationProposalComponent } from '../tab-view-certification-proposal/tab-view-certification-proposal.component';
import { TabViewDecisionComponent } from '../tab-view-decision/tab-view-decision.component';
import { TabViewExternalAuditComponent } from '../tab-view-external-audit/tab-view-external-audit.component';
import { TabViewSurviellanceProgramComponent } from '../tab-view-surviellance-program/tab-view-surviellance-program.component';
import { ModalDirective } from 'ngx-bootstrap';
import { CreateEditMeetingComponent } from '../../meeting/create-edit-meeting/create-edit-meeting.component';
import { FileUploadComponent } from '../../../shared/common/file-upload/file-upload.component';
import { AuditProjectDto, AttachmentWithTitleDto, AuditProjectServiceProxy, AssessmentServiceProxy, CommonLookupServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { StorageServiceProxy } from '../../../../shared/service-proxies/services/storage.service';
import { FileDownloadService } from '../../../../shared/utils/file-download.service';
import { DOCUMENT } from '@angular/common';


@Component({
    selector: 'add-edit-audit-project',
    templateUrl: './add-edit-audit-project.component.html',
    styleUrls: ['./add-edit-audit-project.component.css']
})
export class AddEditAuditPprojectComponent extends AppComponentBase implements OnInit {

    @ViewChild(TabViewAuditProjectComponent)
    tabViewProject: TabViewAuditProjectComponent;
    @ViewChild(TabViewAuditReportComponent)
    tabViewReport: TabViewAuditReportComponent;
    @ViewChild(TabViewCertificateComponent)
    tabViewCertificate: TabViewCertificateComponent;
    @ViewChild(TabViewCertificationProposalComponent)
    tabViewCertificationProposal: TabViewCertificationProposalComponent;
    @ViewChild(TabViewDecisionComponent)
    tabViewDecision: TabViewDecisionComponent;
    @ViewChild(TabViewExternalAuditComponent)
    tabViewExAudit: TabViewExternalAuditComponent;
    @ViewChild(TabViewSurviellanceProgramComponent)
    tabViewSuProgram: TabViewSurviellanceProgramComponent;
    @ViewChild("createEditAuditProjectManagementModal", { static: true })
    modal: ModalDirective;
    @ViewChild(CreateEditMeetingComponent)
    tabMeeting: CreateEditMeetingComponent;
    @ViewChild(FileUploadComponent) fileUpload: FileUploadComponent;
    auditProject = new AuditProjectDto();
    selectedItem: number;
    auditProId: number;
    active = false;
    mettingTabShow = false;
    exAuditFinding = false;
    templates = false;
    checklists = false;
    exAssessments = false;
    isDisabled: any;
    currentMeetingId: any;
    attachedFileCodes = [];
    reports = [];
    value: any[] = [];
    attachmentData: any;
    attachmentCode: AttachmentWithTitleDto[] = [];
    arrayCount: number = 0;
    getReportData: any;
    auditProID: number;
    auditProjectId: any;
    businessEntityId: any;
    entityGroupId: any;
    vendorId: any;
    tabShow: any;
    btnSaveHide: boolean;
    isStatus: any;
    reauditPermissionFlag: boolean =false ;
    checkEetranalAuditor: boolean = false;

    tabIndex = [
        { id: "1", name: "Audit Project" },
        { id: "2", name: "Audit Report" },
        { id: "3", name: "Surviellance Program" },
        { id: "4", name: "Certification Proposal" },
        { id: "5", name: "Decision" },
        { id: "6", name: "Certificate" },
        { id: "7", name: "Corrective Action Plan" },
    ];

    constructor(_injector: Injector,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _auditServiceProxy: AuditProjectServiceProxy,
        private _commonlookupServiceProxy: CommonLookupServiceProxy,
        private _storageService: StorageServiceProxy, private _fileDownloadService: FileDownloadService,
        private _assessmentServiceProxy: AssessmentServiceProxy,
        @Inject(DOCUMENT) private document: Document
    ) {
        super(_injector);
    }
    ngOnInit() {
        this.btnSaveHide = true;
        this.selectedItem = 1;
        let id = this._activatedRoute.snapshot.queryParams['auditProjectId'];
        this.tabShow = id;
        this.ReauditPermissionCheck();
        if (id) {
            this._assessmentServiceProxy.getDecriptAssessmentParameter(id, '').subscribe((ressult) => {
                if (ressult.assessmentId != 0) {
                    this.auditProID = ressult.assessmentId;
                    this.auditProId = ressult.assessmentId;
                    if (this.auditProID) {
                        this.spinnerService.show();
                        this._auditServiceProxy
                            .getAuditProjectForEdit(this.auditProID)
                            .subscribe((result) => {
                                this.auditProject = result;
                                this.attachedFileCodes = result.attachments;
                                this.reports = result.reports;
                                this.businessEntityId = result.businessEntityId;
                                this.entityGroupId = result.entityGroupId;
                                this.tabViewProject.geteditAuditProject(this.auditProID);
                                this.tabViewProject.getcheckstatus(this.auditProID);
                                this.vendorId = result.vendorId;
                                this.spinnerService.hide();
                                this.toggleLeftAside();
                               // this.ReauditPermissionCheck();

                            });
                    } else {

                    }
                }
                else {

                }
            });
        }
        
    }

    selectTab(e, s) {
        this.selectedItem = e;
        if (e == 9) {
            this.getReportData = [];
            this._auditServiceProxy.getReports(this.auditProID).subscribe(result => {
                this.getReportData = result;
            })
        }
        else if (e == 10) {
            this.getReportData = [];
            this._auditServiceProxy.getEntityCertificate(this.auditProId).subscribe(result => {
                this.getReportData = result;
            })

        }
        this.btnSaveHide = true;       
        this.getcheckstatus(s);
    }
    getcheckstatus(auditProIDs) {       
        this._auditServiceProxy.getCheckStatusAuditProject(auditProIDs).subscribe(res => {
            this.isStatus = res;           
        })
    }
    toggleLeftAside(): void {
        this.document.body.classList.toggle('kt-aside--minimize');
        this.triggerAsideToggleClickEvent();
    }
    triggerAsideToggleClickEvent(): void {
        abp.event.trigger('app.kt_aside_toggler.onClick');
    }
    btnBack() {
        this._router.navigate(["/app/main/audit-project-management"]);
    }

    save(id) {
        switch (id) {
            case 1:
                this.tabViewProject.save();
                break;
            case 2:
                this.tabViewReport.tabSave();
                break;
            case 3:
                this.tabViewSuProgram.save();
                break;
            case 4:
                this.tabViewCertificationProposal.save();
                break;
            case 5:
                this.tabViewDecision.SavedAuditDecision();
                break;
            case 6:
                // this.tabMeeting.isAuditTab = false;                
                break;
            case 8:
                this.saveAttachment();
                break;
        }
    }
    uploadAttachment(event: any, attachment: AttachmentWithTitleDto) {
        var file = event.target.files[0];
        let formData: FormData = new FormData();
        formData.append("file", file, file.name);
        this.spinnerService.show();
        this._storageService.AddAuditAttachment(formData).subscribe(
            res => {              
                event.target.value = "";
                attachment.code = res.result.code;
            },
            error => {
                console.log(error);               
                this.message.error(
                    "Couldn't upload file at this time, try later :)!"
                );
            }
        );
        setTimeout(() => {
            this.spinnerService.hide()
        }, 3000);
    }

    getAttachment(e) {        
        this.attachmentData = e;
    }

    saveAttachment() {
        this.spinnerService.show();
        this.arrayCount = 0;
        this.attachmentCode = [];
        if (this.attachmentData == undefined || this.attachmentData == 0) {
            this.saveData();
        }
        else {
            this.attachmentData.forEach(item => {                
                if (!item.code) {
                    let formData: FormData = new FormData();
                    formData.append("file", item, item.name);                   
                    this._storageService.AddAuditAttachment(formData).subscribe(
                        res => {
                            this.arrayCount++;
                            this.spinnerService.hide();
                            let items = new AttachmentWithTitleDto();
                            items.code = res.result.code;
                            items.title = item.name;
                            this.attachmentCode.push(items);
                            if (this.attachmentData.length == this.arrayCount) {
                                this.saveData();
                            }
                        },
                        error => {
                            console.log(error);                            
                            this.message.error(
                                "Couldn't upload file at this time, try later :)!"
                            );
                            setTimeout(() => {
                                this.spinnerService.hide()
                            }, 3000);
                        });
                }
                else {
                    this.arrayCount++;
                }
            });
        }
        setTimeout(() => {
            this.spinnerService.hide()
        }, 3000);
    }

    deleteRelatedAttachmentInput(input) {
        this.spinnerService.show();
        const self = this;
        self._fileDownloadService
            .removeAttachment(input.code)
            .subscribe(() => {
                this.attachedFileCodes = this.attachedFileCodes.filter(
                    (item) => item != input
                );
                this.notify.error("File removed Successfully");  
                this.spinnerService.hide();
            });
       
    }
    deleteAttachment() {        
        this.saveAttachment();
    }
    saveData() {
        this.auditProject.attachments = this.attachmentCode.filter(e => e.code != "");
        this._auditServiceProxy.addUpdateAuditProject(this.auditProject).subscribe(res => {
            this._auditServiceProxy.getAuditProjectForEdit(this.auditProId).subscribe((result) => {
                this.attachedFileCodes = result.attachments;
                this.fileUpload.getData(result.attachments);
                this.attachmentData = [];
            });
        });
    }
    downloadAttachmentReport(code: string) {
        const self = this;
        self._fileDownloadService.downloadReport(code);
    }
    downloadEntityCertificate(code: string) {
        const self = this;
        self._fileDownloadService.downloadEntityCertificate(code);
    }
    hideSaveButton(e) {
        this.btnSaveHide = e;
    }

    ReauditPermissionCheck() {
        this._commonlookupServiceProxy.getCurrentUserRoles().subscribe(
            (result) => {
                var roleList = result.map(x => x.roleName);
                this._auditServiceProxy.reauditPermissionCkeker().subscribe(res => {
                    var isExist = res.find(x => x.id == this.auditProID);
                    var isExist = res.find(x => x.id == this.auditProID);
                    var isBEA = roleList.find(x => x.trim().toLowerCase() == "Business Entity Admin".trim().toLowerCase());
                    var isEAA = roleList.find(x => x.trim().toLowerCase() == "External Audit Admin".trim().toLowerCase());
                    var isEA = roleList.find(x => x.trim().toLowerCase() == "External Auditors".trim().toLowerCase());
                    var isIEA = roleList.find(x => x.trim().toLowerCase() == "Insurance Entity Admin".trim().toLowerCase());
                                     
                    if (isExist != undefined) {
                        switch (isExist.accessPermission) {
                            case 0:
                                {
                                    this.reauditPermissionFlag = true;
                                    break;
                                }
                            case 1:
                                {
                                    if (isBEA != undefined || isIEA != undefined)
                                        this.reauditPermissionFlag = false;
                                    else
                                        this.reauditPermissionFlag = true;
                                    break;
                                }
                            case 2:
                                {
                                    if (isEAA != undefined)
                                        this.reauditPermissionFlag = false;
                                    else
                                        this.reauditPermissionFlag = true;
                                    break;
                                }
                            case 3:
                                {
                                    if (isEAA != undefined || isBEA != undefined)
                                        this.reauditPermissionFlag = false;
                                    else
                                        this.reauditPermissionFlag = true;
                                    break;
                                }
                            case 4:
                                {

                                    if (isEA != undefined)
                                        this.reauditPermissionFlag = false;
                                    else
                                        this.reauditPermissionFlag = true;
                                    break;
                                }
                            case 5:
                                {
                                    if (isEA != undefined || isBEA != undefined)
                                        this.reauditPermissionFlag = false;
                                    else
                                        this.reauditPermissionFlag = true;
                                    break;
                                }
                            case 6:
                                {
                                    if (isEA != undefined || isEAA != undefined)
                                        this.reauditPermissionFlag = false;
                                    else
                                        this.reauditPermissionFlag = true;
                                    break;
                                }
                            case 7:
                                {
                                    this.reauditPermissionFlag = false;
                                    break;
                                }
                        }
                    }
                    else {
                        this.reauditPermissionFlag = false;
                      
                    }

                    if (this.appSession.user.isAdmin)
                        this.reauditPermissionFlag = false;
                                          
                });

            });
    }

    originalAuditProjectIdBind(input: number): string {
        var idAsString = "" + input;
        if (idAsString.length == 1) {
            return "00" + idAsString;
        }
        else if (idAsString.length == 2) {
            return "0" + idAsString;
        }
        else
            return idAsString;
    }

}
