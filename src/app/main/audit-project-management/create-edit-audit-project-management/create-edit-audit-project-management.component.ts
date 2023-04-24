import {
    Component,
    OnInit,
    Injector,
    ViewChild,
    Output,
    EventEmitter,
} from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { Router } from "@angular/router";
import * as moment from "moment";
import { ModalDirective } from "ngx-bootstrap";
import {AuditProjectServiceProxy, AuditProjectDto,AttachmentWithTitleDto,} from "../../../../shared/service-proxies/service-proxies";
import { StorageServiceProxy } from "../../../../shared/service-proxies/services/storage.service";
import { FileDownloadService } from "../../../../shared/utils/file-download.service";
import { TabViewAuditProjectComponent } from "../tab-view-audit-project/tab-view-audit-project.component";
import { TabViewAuditReportComponent } from "../tab-view-audit-report/tab-view-audit-report.component";
import { TabViewCertificateComponent } from "../tab-view-certificate/tab-view-certificate.component";
import { TabViewCertificationProposalComponent } from "../tab-view-certification-proposal/tab-view-certification-proposal.component";
import { TabViewDecisionComponent } from "../tab-view-decision/tab-view-decision.component";
import { TabViewExternalAuditComponent } from "../tab-view-external-audit/tab-view-external-audit.component";
import { TabViewSurviellanceProgramComponent } from "../tab-view-surviellance-program/tab-view-surviellance-program.component";
import { CreateEditMeetingComponent } from "@app/main/meeting/create-edit-meeting/create-edit-meeting.component";
import { FileUploadComponent } from "../../../shared/common/file-upload/file-upload.component";

@Component({
    selector: "createEditAuditProjectManagementModals",
    templateUrl: "./create-edit-audit-project-management.component.html",
})
export class CreateEditAuditProjectManagementComponent extends AppComponentBase implements OnInit {
    @ViewChild(TabViewAuditProjectComponent)
    tabViewProject: TabViewAuditProjectComponent;
    @ViewChild(TabViewAuditReportComponent)
    tabViewReport: TabViewAuditReportComponent;
    @ViewChild(TabViewCertificateComponent)
    tabViewCertificate: TabViewCertificateComponent;
    @ViewChild(TabViewCertificationProposalComponent)
    tabViewCertification: TabViewCertificationProposalComponent;
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
    auditProId: any;
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

    constructor(
        _injector: Injector,
        private _auditServiceProxy: AuditProjectServiceProxy,
        private _storageService: StorageServiceProxy, private _fileDownloadService: FileDownloadService,

    ) {
        super(_injector);
    }
    tabIndex = [
        { id: "1", name: "Audit Project" },
        { id: "2", name: "Audit Report" },
        { id: "3", name: "Surviellance Program" },
        { id: "4", name: "Certification Proposal" },
        { id: "5", name: "Decision" },
        { id: "6", name: "Certificate" },
        { id: "7", name: "Corrective Action Plan" },
    ];
    ngOnInit() {
        this.selectedItem = 1;
        this.isDisabled = false;      
    }
    show(id?: number): void {      
        this.selectedItem = 1;
        this.auditProId = id;
        this.active = true;
        if (this.auditProId > 0) {
            this.spinnerService.show();
            this._auditServiceProxy
                .getAuditProjectForEdit(this.auditProId)
                .subscribe((result) => {
                    this.auditProject = result;
                    this.attachedFileCodes = result.attachments;
                    this.reports = result.reports;
                    this.modal.show();
                    this.tabViewProject.geteditAuditProject(this.auditProId);
                    this.spinnerService.hide();

                });
        } else {
            this.modal.show();
        }
    }

    selectTab(e) {      
        this.auditProId
        this.selectedItem = e;        
        if (e==9) {
            this._auditServiceProxy.getReports(this.auditProId).subscribe(result => {
               // this.fileUpload.getData(result);
                this.getReportData = result;
            })
        }
       
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
                this.tabViewCertification.save();
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

    close(e) {

        this.selectedItem = 1;
        this.active = false;
        this.modal.hide();
        this.isDisabled = false;
        this.mettingTabShow = false;
        // this.tabMeeting.isAuditTab = false;

        if (e == 1) {
            this.tabViewProject.selectedTab();
            this.tabViewProject.close();
        }

    }

    showsTab(e) {
        let tab = e[0].tabName;
        switch (tab) {
            case "MettingTab":
                this.isDisabled = true;
                this.selectedItem = 7;
                this.mettingTabShow = true;
                this.currentMeetingId = e[0].currentMeetingId;
                break;
            case "templateTab":
                this.isDisabled = true;
                this.selectedItem = 9;
                this.templates = true;
                break;
            case "templateTab":
                this.isDisabled = true;
                this.selectedItem = 10;
                this.checklists = true;
                break;
        }
    }

    showsAllTab(e) {
        this.isDisabled = false;
        this.mettingTabShow = false;
        this.templates = false;
        this.checklists = false;
    }

    addAttachmentInputs() {
        this.attachedFileCodes.push(new AttachmentWithTitleDto());
    }

    deleteAttachmentInput(input: AttachmentWithTitleDto) {
        const self = this;
        self._fileDownloadService.deleteAuditAttachment(input.code).subscribe(res => {
            this.attachedFileCodes = this.attachedFileCodes.filter(
                item => item != input
            );
            this.notify.success("File removed Successfully");
        });
    }

    downloadAttachment(code: string) {
        const self = this;
        self._fileDownloadService.downloadAuditAttachment(code);
    }

    uploadAttachment(event: any, attachment: AttachmentWithTitleDto) {
        var file = event.target.files[0];
        let formData: FormData = new FormData();
        formData.append("file", file, file.name);
        this.spinnerService.show();
        this._storageService.AddAuditAttachment(formData).subscribe(
            res => {
                this.spinnerService.hide();
                event.target.value = "";
                attachment.code = res.result.code;
            },
            error => {
                console.log(error);
                this.spinnerService.hide();
                this.message.error(
                    "Couldn't upload file at this time, try later :)!"
                );
            }
        );
    }

    getAttachment(e) {
        this.attachmentData = e;
    }

    saveAttachment() {
        this.arrayCount = 0;
        this.attachmentCode = [];
        if (this.attachmentData == undefined || this.attachmentData == 0) {
            this.saveData();
        }
        else {
            this.attachmentData.forEach(item => {
                if (!item.code) {
                    let blob = new Blob([item], { type: item.extention });
                    let formData: FormData = new FormData();
                    formData.append("File", blob, item.name);
                    this.spinnerService.show();
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
                            this.spinnerService.hide();
                            this.message.error(
                                "Couldn't upload file at this time, try later :)!"
                            );
                        });
                }
                else {
                    this.arrayCount++;
                }
            });
        }
    }

    deleteRelatedAttachmentInput(input) {
        const self = this;
        self._fileDownloadService
            .removeAttachment(input.code)
            .subscribe(() => {
                this.attachedFileCodes = this.attachedFileCodes.filter(
                    (item) => item != input
                );
                this.notify.success("File removed Successfully");
            });
    }

    saveData() {
        this.auditProject.attachments = this.attachmentCode.filter(e => e.code != "");
        this._auditServiceProxy.addUpdateAuditProject(this.auditProject).subscribe(res => {
            this._auditServiceProxy.getAuditProjectForEdit(this.auditProId).subscribe((result) => {
                this.attachedFileCodes = result.attachments;
                this.fileUpload.getData(result.attachments);
                });
        });
    }


    downloadAttachmentReport(code: string) {
        const self = this;
        self._fileDownloadService.downloadReport(code);
    }
}
