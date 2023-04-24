import { AfterViewChecked, Component, ElementRef, EventEmitter, Injector, Output, ViewChild, ViewChildren, ContentChild, QueryList, ContentChildren, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthorityDepartmentsServiceProxy, ActionCategory, EmailReminderTemplateServiceProxy, CreatorEditEmailReminderTemplateDto, WorkFlowServiceProxy, TemplateDto, StateApplicability, WorkFlowPageDto, ActionTimeType, CreateOrUpdateStateDto, GetContactForViewDto, BusinessEntityUserDto, AuthoritativeDocumentsServiceProxy, AuthoritativeDocumentDto, DynamicNameValueDto, CustomDynamicServiceProxy, BusinessEntitiesServiceProxy, CreateOrEditAuthorityDepartmentDto, ContactsServiceProxy, CustomTemplateDto, CustomTemplateServiceProxy, AttachmentWithTitleDto } from "../../../shared/service-proxies/service-proxies";
import { SummernoteTextEditorComponent } from '../../shared/common/summernote-text-editor/summernote-text-editor.component';
import { SummernoteTextEditorService } from '../../shared/common/summernote-text-editor/summernote-text-editor.service';
import { FileUploadComponent } from '../../shared/common/file-upload/file-upload.component';
import { StorageServiceProxy } from '../../../shared/service-proxies/services/storage.service';

@Component({
    selector: 'createEmailReminderModals',
    templateUrl: './create-email-reminder-modal.component.html',
})

export class CreateEmailReminderModalComponent extends AppComponentBase {

    @ViewChild('createEmailReminderModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(SummernoteTextEditorComponent) public summerNote: SummernoteTextEditorComponent;
    @ViewChild(FileUploadComponent) fileUpload: FileUploadComponent;
    @ViewChildren('myChild') assetAnnotationComponent: QueryList<SummernoteTextEditorComponent>;
    public currentChildComponent: SummernoteTextEditorComponent;
    workflow: WorkFlowPageDto[] = [];
    active = false;
    saving = false;
    checkauditproject: boolean = false;
    checkAssessmentFlag: boolean = false;
    propertiesName: any;
    auditStatus: DynamicNameValueDto[];
    selfAssessmentStatus: DynamicNameValueDto[];
    propertiesNames: string[] = [];

    reportType: string[] = [];
    emailReminder: CreatorEditEmailReminderTemplateDto = new CreatorEditEmailReminderTemplateDto();
    txtTo: any;
    txtCc: any;
    txtBcc: any;
    txtBody: any;
    auditId: any;
    assessmentId: any;
    auditreportType: any;
    getSummerNoteData: any;
    attachedFileCodes = [];
    attachmentData: any;
    arrayCount: number = 0;
    attachmentCode: AttachmentWithTitleDto[] = [];
    templateId: number;
    constructor(
        private _authorityDepartmentsServiceProxy: AuthorityDepartmentsServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy,
        private _customTemplateService: CustomTemplateServiceProxy,
        private _storageService: StorageServiceProxy,
        private _emailtemplateservice: EmailReminderTemplateServiceProxy,
        private summernoteTextEditorService: SummernoteTextEditorService,
        injector: Injector,
    ) {
        super(injector);
        this.checkauditproject = false;
        this.checkAssessmentFlag = false;
        this.emailReminder = new CreatorEditEmailReminderTemplateDto();
    }

    ngOnInit() {

    }
    onToPropertyChange(e) {
        if (e != undefined) {
            this.emailReminder.to = this.emailReminder.to + " ,{" + e + "}";
        }
    }

    onCcPropertyChange(e) {
        if (e != undefined) {
            this.emailReminder.cc = this.emailReminder.cc + " ,{" + e + "}";
        }
    }

    onBccPropertyChange(e) {
        if (e != undefined) {
            this.emailReminder.bcc = this.emailReminder.bcc + " ,{" + e + "}";
        }
    }

    onSubjectPropertyChange(e) {
        if (e != undefined) {
            this.emailReminder.subject = this.emailReminder.subject + " {" + e + "}";
        }
    }

    onReportTypeChange(e) {
        if (e != undefined) {
            this.emailReminder.reportType = this.emailReminder.reportType + " {" + e + "}";
        }
    }

    onemailBodyPropertyChange(e) {
        if (e != undefined) {
            this.summerNote.getData(" {" + e + "}");
            this.getSummerNoteData = " + e + ";
            this.summernoteTextEditorService.setData(" {" + e + "}");
        }
    }

    initializeWorkFlow() {
        this._authorityDepartmentsServiceProxy.getAllPages()
            .subscribe(res => {
                this.workflow = res.filter(x => x.pageName == "Audit Project");
                this.auditId = this.workflow.find(x => x.pageName.trim().toLowerCase() == ("Audit Project").trim().toLowerCase()).id;
                this.assessmentId = this.workflow.find(x => x.pageName.trim().toLowerCase() == ("Self Assessment").trim().toLowerCase()).id;

            });
    }

    getDeleteCode(code)
    {
        if (code) {
            this._emailtemplateservice.getEmailReminderTemplateForEdit(this.templateId).subscribe(res => {
                this.emailReminder.attachmentJson = res.attachmentJson;
            });
        }       
    }

    initializeAuditStatus() {
        this._customDynamicService.getAuditStatus("Audit Status")
            .subscribe(res => {
                this.auditStatus = res;
            });
    }

    initializeSelfAssessmentStatus() {
        this.selfAssessmentStatus = [];
        var val = new DynamicNameValueDto();
        val.id = 9;
        val.name = "Not Submit";
        this.selfAssessmentStatus.push(val);
    }

    initilizationToccBcc() {
        this.propertiesNames = [];
        this._customTemplateService.getBusinessEntitiesProperties()
            .subscribe(res => {
                this.propertiesNames = res;
                this.emailReminder.bcc = "";
                this.emailReminder.cc = "";
                this.emailReminder.to = "";
                this.emailReminder.reportType = "";
            });
    }

    onpageChange() {
        if (this.emailReminder.workFlowPageId != null) {
            this._customTemplateService.getAuditProjectClassProperties(this.emailReminder.workFlowPageId)
                .subscribe(res => {
                    if (this.auditId != this.emailReminder.workFlowPageId) {
                        this.checkauditproject = false;
                        this.emailReminder.auditStatusId = null;
                    }
                    else {
                        this.checkauditproject = true;
                    }

                    if (this.assessmentId != this.emailReminder.workFlowPageId) {
                        this.checkAssessmentFlag = false;
                        this.emailReminder.auditStatusId = null;
                    }
                    else {
                        this.checkAssessmentFlag = true;
                    }
                    this.propertiesName = res;
                    this.emailReminder.emailBody = "";
                    this.emailReminder.to = "";
                    this.emailReminder.cc = "";
                    this.emailReminder.bcc = "";
                });
        }
        else {
            this.checkauditproject = false;
            this.checkAssessmentFlag = false;
            this.emailReminder.auditStatusId = null;
        }
    }

    initilizationReportType() {
        this.reportType = [];

        this._customTemplateService.getAuditReportType()
            .subscribe(res => {
                this.reportType = res;

            });
    }

    save() {
        this.emailReminder.to = this.emailReminder.to.trimLeft();
        this.emailReminder.cc = this.emailReminder.cc.trimLeft();
        this.emailReminder.bcc = this.emailReminder.bcc.trimLeft();
        if (this.emailReminder.to.length > 0 && this.emailReminder.to[0] == ',') {
            this.emailReminder.to = this.emailReminder.to.substring(1, this.emailReminder.to.length);
        }
        if (this.emailReminder.cc.length > 0 && this.emailReminder.cc[0] == ',') {
            this.emailReminder.cc = this.emailReminder.cc.substring(1, this.emailReminder.cc.length);
        }
        if (this.emailReminder.bcc.length > 0 && this.emailReminder.bcc[0] == ',') {
            this.emailReminder.bcc = this.emailReminder.bcc.substring(1, this.emailReminder.bcc.length);
        }
       
        this._emailtemplateservice.createOrEdit(this.emailReminder)
            .subscribe(result => {             
                this.message.success("Save sucessfully!");
                if (this.attachmentData == undefined || this.attachmentData == 0) {
                    this.close();
                    this.modalSave.emit(null);
                }
                else {
                    this.saveAttachmentWithData(result);
                }
            });
    }

    show(id?: number) {
        this.attachedFileCodes = [];
        this.attachmentCode = [];
        this.checkauditproject = false;
        this.checkAssessmentFlag = false;
        this.emailReminder = new CreatorEditEmailReminderTemplateDto();
        this.emailReminder.reportType = "";
        this.emailReminder.bcc = "";
        this.emailReminder.cc = "";
        this.emailReminder.subject = "";
        this.initializeWorkFlow();
        this.initializeAuditStatus();
        this.initializeSelfAssessmentStatus();
        this.initilizationToccBcc();
        this.initilizationReportType();
        this.templateId = id;
        if (!id) {
            this.modal.show();
            this.active = true;
        }
        else {
            this._emailtemplateservice.getEmailReminderTemplateForEdit(id).subscribe(res => {
                this.emailReminder = res;             
                if (res.workFlowPageId != null) {

                    this._customTemplateService.getAuditProjectClassProperties(this.emailReminder.workFlowPageId)
                        .subscribe(result => {
                            this.propertiesName = result;
                        });
                }
                if (res.auditStatusId != null) {

                    if (res.workFlowPage.toString() == "Audit Project")  
                        this.checkauditproject = true;
                    if (res.workFlowPage.toString() == "Self Assessment")
                        this.checkAssessmentFlag = true;
                }

                if (res.attachmentJson != null && res.attachmentJson != "") {
                    var list = JSON.parse(res.attachmentJson);
                    if (list.length != 0) {
                        list.forEach(x => {
                            var temp = new AttachmentWithTitleDto();
                            temp.code = x.Code;
                            temp.title = x.Title;
                            this.attachedFileCodes.push(temp);
                        });
                    }
                }
                // this.fileUpload.getData(this.attachedFileCodes);

                this.modal.show();
                this.active = true;
                this.getSummerNoteData = res.emailBody;
                //this.summerNote.getData(res.emailBody);
                //this.notify1.getData(res.emailBody);
                this.summernoteTextEditorService.setData(res.emailBody);
            })
        }
    }

    setSummerNoteData(e) {
        this.emailReminder.emailBody = e;
    }

    close() {
        this.txtBody = null;
        this.emailReminder = null;
        this.active = false;
        this.modalSave.emit(null);
        this.modal.hide();
    }

    saveAttachmentWithData(id) {
        this.arrayCount = 0;
        this.attachmentCode = [];
       
        this.attachmentData.forEach(item => {
            if (!item.code) {
                let blob = new Blob([item], { type: item.extention });
                let formData: FormData = new FormData();
                formData.append("File", blob, item.name);
                formData.append("title", id);

                this.spinnerService.show();
                this._storageService.AddEmailReminderAttachment(formData).subscribe(
                    res => {
                        this.arrayCount++;
                        this.spinnerService.hide();
                        let items = new AttachmentWithTitleDto();
                        items.code = res.result.code;
                        items.title = item.name;
                        this.attachmentCode.push(items);
                        if (this.attachmentData.length == this.arrayCount) {
                            this.close();
                            this.modalSave.emit(null);
                        }
                    },
                    error => {
                        console.log(error);
                        this.spinnerService.hide();
                        this.close();
                        this.modalSave.emit(null);
                        this.message.error(
                            "Couldn't upload file at this time, try later :)!"
                        );
                    });
            }
            else {
                this.arrayCount++;
            }
        });
        // }
    }

    getAttachment(e) {
        this.attachmentData = e;
    }

    addAttachmentInputs() {
        this.attachedFileCodes.push(new AttachmentWithTitleDto());
    }

}
