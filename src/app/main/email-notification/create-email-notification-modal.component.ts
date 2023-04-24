import { AfterViewChecked, Component, ElementRef, EventEmitter, Injector, Output, ViewChild, ViewChildren, ContentChild, QueryList, ContentChildren, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { AuthorityDepartmentsServiceProxy, ActionCategory, EmailNotificationTemplateServiceProxy, CreatorEditEmailTemplateDto, WorkFlowServiceProxy, TemplateDto, StateApplicability, WorkFlowPageDto, ActionTimeType, CreateOrUpdateStateDto, GetContactForViewDto, BusinessEntityUserDto, AuthoritativeDocumentsServiceProxy, AuthoritativeDocumentDto, DynamicNameValueDto, CustomDynamicServiceProxy, BusinessEntitiesServiceProxy, CreateOrEditAuthorityDepartmentDto, ContactsServiceProxy, CustomTemplateDto, CustomTemplateServiceProxy, AttachmentWithTitleDto } from "../../../shared/service-proxies/service-proxies";
import { SummernoteTextEditorComponent } from '../../shared/common/summernote-text-editor/summernote-text-editor.component';
import { SummernoteTextEditorService } from '../../shared/common/summernote-text-editor/summernote-text-editor.service';
import { FileUploadComponent } from '../../shared/common/file-upload/file-upload.component';
import { StorageServiceProxy } from '../../../shared/service-proxies/services/storage.service';

@Component({
    selector: 'createEmailNotificationModals',
    templateUrl: './create-email-notification-modal.component.html',
})

export class CreateEmailNotificationModalComponent extends AppComponentBase {

    @ViewChild('createEmailNotificationModal', { static: true }) modal: ModalDirective;
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
    emailnotification: CreatorEditEmailTemplateDto = new CreatorEditEmailTemplateDto();
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
        private _emailtemplateservice: EmailNotificationTemplateServiceProxy,
        private summernoteTextEditorService: SummernoteTextEditorService,
        injector: Injector,
    ) {
        super(injector);
        this.checkauditproject = false;
        this.checkAssessmentFlag = false;
        this.emailnotification = new CreatorEditEmailTemplateDto();
    }

    ngOnInit() {

    }
    onToPropertyChange(e) {
        if (e != undefined) {
            this.emailnotification.to = this.emailnotification.to + " ,{" + e + "}";
        }
    }

    onCcPropertyChange(e) {
        if (e != undefined) {
            this.emailnotification.cc = this.emailnotification.cc + " ,{" + e + "}";
        }
    }

    onBccPropertyChange(e) {
        if (e != undefined) {
            this.emailnotification.bcc = this.emailnotification.bcc + " ,{" + e + "}";
        }
    }

    onSubjectPropertyChange(e) {
        if (e != undefined) {
            this.emailnotification.subject = this.emailnotification.subject + " {" + e + "}";
        }
    }

    onReportTypeChange(e) {
        if (e != undefined) {
            this.emailnotification.reportType = this.emailnotification.reportType + " {" + e + "}";
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
                this.workflow = res;
                this.auditId = this.workflow.find(x => x.pageName.trim().toLowerCase() == ("Audit Project").trim().toLowerCase()).id;
                this.assessmentId = this.workflow.find(x => x.pageName.trim().toLowerCase() == ("Self Assessment").trim().toLowerCase()).id;

            });
    }

    getDeleteCode(code)
    {
        if (code) {
            this._emailtemplateservice.getEmailNotificationTemplateForEdit(this.templateId).subscribe(res => {
                this.emailnotification.attachmentJson = res.attachmentJson;
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
                this.emailnotification.bcc = "";
                this.emailnotification.cc = "";
                this.emailnotification.to = "";
                this.emailnotification.reportType = "";
            });
    }

    onpageChange() {
        if (this.emailnotification.workFlowPageId != null)
        {
            this._customTemplateService.getAuditProjectClassProperties(this.emailnotification.workFlowPageId)
                .subscribe(res => {
                    if (this.auditId != this.emailnotification.workFlowPageId) {
                        this.checkauditproject = false;
                        this.emailnotification.auditStatusId = null;
                    }
                    else {
                        this.checkauditproject = true;
                    }

                    if (this.assessmentId != this.emailnotification.workFlowPageId) {
                        this.checkAssessmentFlag = false;
                        this.emailnotification.auditStatusId = null;
                    }
                    else {
                        this.checkAssessmentFlag = true;
                    }
                    this.propertiesName = res;
                    this.emailnotification.emailBody = "";
                    this.emailnotification.to = "";
                    this.emailnotification.cc = "";
                    this.emailnotification.bcc = "";
                });
        }
        else {
            this.checkauditproject = false;
            this.checkAssessmentFlag = false;
            this.emailnotification.auditStatusId = null;
        }
    }

    initilizationReportType() {
        this.reportType = [];

        this._customTemplateService.getAuditReportType()
            .subscribe(res => {
                this.reportType = res;

            });
    }

    save()
    {
        this.emailnotification.to = this.emailnotification.to.trimLeft();
        this.emailnotification.cc = this.emailnotification.cc.trimLeft();
        this.emailnotification.bcc = this.emailnotification.bcc.trimLeft();
        if (this.emailnotification.to.length > 0 && this.emailnotification.to[0] == ',') {
            this.emailnotification.to = this.emailnotification.to.substring(1, this.emailnotification.to.length);
        }
        if (this.emailnotification.cc.length > 0 && this.emailnotification.cc[0] == ',') {
            this.emailnotification.cc = this.emailnotification.cc.substring(1, this.emailnotification.cc.length);
        }
        if (this.emailnotification.bcc.length > 0 && this.emailnotification.bcc[0] == ',') {
            this.emailnotification.bcc = this.emailnotification.bcc.substring(1, this.emailnotification.bcc.length);
        }
       
        this._emailtemplateservice.createOrEdit(this.emailnotification)
            .subscribe(result => {
                this.notify.success('Save sucessfully');
                if (this.attachmentData == undefined || this.attachmentData == 0)
                {
                    this.close();
                    this.modalSave.emit(null);
                }
                else {
                    this.saveAttachmentWithData(result);
                    this.close();
                    this.modalSave.emit(null);
                }
            });
    }

    show(id?: number) {
        this.attachedFileCodes = [];
        this.attachmentCode = [];
        this.checkauditproject = false;
        this.checkAssessmentFlag = false;
        this.emailnotification = new CreatorEditEmailTemplateDto();
        this.emailnotification.reportType = "";
        this.emailnotification.bcc = "";
        this.emailnotification.cc = "";
        this.emailnotification.subject = "";
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
            this._emailtemplateservice.getEmailNotificationTemplateForEdit(id).subscribe(res => {
                this.emailnotification = res;             
                if (res.workFlowPageId != null) {

                    this._customTemplateService.getAuditProjectClassProperties(this.emailnotification.workFlowPageId)
                        .subscribe(result => {
                            this.propertiesName = result;
                        });
                }
                if (res.auditStatusId != null) {

                    if (res.workFlowPage.trim().toLowerCase() == "Audit Project".trim().toLowerCase())  
                        this.checkauditproject = true;
                    if (res.workFlowPage.trim().toLowerCase() == "Self Assessment".trim().toLowerCase())
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
              

                this.modal.show();
                this.active = true;
                this.getSummerNoteData = res.emailBody;
                
                this.summernoteTextEditorService.setData(res.emailBody);
            })
        }
    }

    setSummerNoteData(e) {
        this.emailnotification.emailBody = e;
    }

    close() {
        this.txtBody = null;
        this.emailnotification = null;
        this.active = false;
        this.attachmentData = [];
        this.modalSave.emit(null);
        this.modal.hide();
    }

    saveAttachmentWithData(id) {
        this.arrayCount = 0;
        this.attachmentCode = [];
       
        this.attachmentData.forEach(item =>
        {
            
            if (!item.code) {
                let blob = new Blob([item], { type: item.extention });
                let formData: FormData = new FormData();
                formData.append("File", blob, item.name);
                formData.append("title", id);
                this.spinnerService.show();
                this._storageService.AddEmailNotificationAttachment(formData).subscribe(
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
                            this.attachmentData = [];
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
