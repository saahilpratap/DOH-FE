import { AfterViewChecked, Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthorityDepartmentsServiceProxy, ActionCategory, EmailNotificationTemplateServiceProxy, CreatorEditEmailTemplateDto, WorkFlowServiceProxy, TemplateDto, StateApplicability, WorkFlowPageDto, ActionTimeType, CreateOrUpdateStateDto, GetContactForViewDto, BusinessEntityUserDto, AuthoritativeDocumentsServiceProxy, AuthoritativeDocumentDto, DynamicNameValueDto, CustomDynamicServiceProxy, BusinessEntitiesServiceProxy, CreateOrEditAuthorityDepartmentDto, ContactsServiceProxy, CustomTemplateDto, CustomTemplateServiceProxy, AuditProjectServiceProxy, AuditProjectStatusIds, AttachmentWithTitleDto } from "../../../../shared/service-proxies/service-proxies";
import { SummernoteTextEditorService } from '../../../shared/common/summernote-text-editor/summernote-text-editor.service';
import { SummernoteTextEditorComponent } from '../../../shared/common/summernote-text-editor/summernote-text-editor.component';
import { GridAuditProjectManagementComponent } from '../grid-audit-project-management/grid-audit-project-management.component';
import Swal from 'sweetalert2'
@Component({
    selector: 'createAuditProjectEmailNotificationModal',
    templateUrl: './create-audit-project-email-notification-modal-component.html'
})
export class CreateAuditProjectEmailNotificationModalComponent extends AppComponentBase {

    @ViewChild('createAuditProjectEmailNotificationModal', { static: true }) modal: ModalDirective;
    @Output() getAuditProject: EventEmitter<any> = new EventEmitter<any>();
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    workflow: WorkFlowPageDto[] = [];
    active = false;
    saving = false;
    auditstatusid: boolean = false;
    attachmentData: any;
    attachedFileCodes = [];
    attachmentCode: AttachmentWithTitleDto[] = [];
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: "auto",
        minHeight: "0",
        maxHeight: "auto",
        width: "auto",
        minWidth: "0",
        translate: "yes",
        enableToolbar: true,
        showToolbar: true,
        placeholder: "Enter text here...",
        defaultParagraphSeparator: "",
        defaultFontName: "",
        defaultFontSize: "",
        fonts: [
            { class: "arial", name: "Arial" },
            { class: "times-new-roman", name: "Times New Roman" },
            { class: "calibri", name: "Calibri" },
            { class: "comic-sans-ms", name: "Comic Sans MS" },
        ],
        customClasses: [
            {
                name: "quote",
                class: "quote",
            },
            {
                name: "redText",
                class: "redText",
            },
            {
                name: "titleText",
                class: "titleText",
                tag: "h1",
            },
        ],
        uploadUrl: "",
        uploadWithCredentials: false,
        sanitize: true,
        toolbarPosition: "top",
        toolbarHiddenButtons: [["bold", "italic"], ["fontSize"]],
    };
    getSummerNoteData: any;
    propertiesName: any;
    auditStatus: DynamicNameValueDto[];
    propertiesNames: string[] = [];
    emailnotification: CreatorEditEmailTemplateDto = new CreatorEditEmailTemplateDto();
    @ViewChild(SummernoteTextEditorComponent) public summerNote: SummernoteTextEditorComponent;
    txtTo: any;
    txtCc: any;
    txtBcc: any;
    txtBody: any;
    aduitIdList: AuditProjectStatusIds = new AuditProjectStatusIds();
    flag: boolean = false;
    constructor(
        private _authorityDepartmentsServiceProxy: AuthorityDepartmentsServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy,
        private _customTemplateService: CustomTemplateServiceProxy,
        private _emailtemplateservice: EmailNotificationTemplateServiceProxy,
        private _auditServiceProxy: AuditProjectServiceProxy,
        private summernoteTextEditorService: SummernoteTextEditorService,
        injector: Injector,
    ) {
        super(injector);

    }

    ngOnInit() {
        this.initializeWorkFlow();
        this.initializeWorkFlow();
        this.initilizationToccBcc();
    }

    onToPropertyChange(e) {

        if (e != undefined) {
            this.emailnotification.to = this.emailnotification.to + " {" + e + "}";
        }
    }

    onCcPropertyChange(e) {

        if (e != undefined) {
            this.emailnotification.cc = this.emailnotification.cc + " {" + e + "}";
        }
    }

    onBccPropertyChange(e) {

        if (e != undefined) {
            this.emailnotification.bcc = this.emailnotification.bcc + " {" + e + "}";
        }
    }

    onemailBodyPropertyChange(e) {
        if (e != undefined) {
            this.emailnotification.emailBody = this.emailnotification.emailBody + " {" + e + "}";
        }
    }

    initializeWorkFlow() {
        this._authorityDepartmentsServiceProxy.getAllPages()
            .subscribe(res => {
                this.workflow = res;
            });
    }

    initializeAuditStatus() {
        this._customDynamicService.getAuditStatus("Audit Status")
            .subscribe(res => {
                this.auditStatus = res;
            });
    }

    initilizationToccBcc() {
        this.propertiesNames = [];
        this._customTemplateService.getBusinessEntitiesProperties()
            .subscribe(res => {
                this.propertiesNames = res;
                this.emailnotification.bcc = "";
                this.emailnotification.cc = "";
                this.emailnotification.to = "";
            });
    }

    onpageChange() {
        this._customTemplateService.getClassProperties(this.emailnotification.workFlowPageId)
            .subscribe(res => {
                this.propertiesName = res;
                this.emailnotification.emailBody = "";
                this.emailnotification.to = "";
                this.emailnotification.cc = "";
                this.emailnotification.bcc = "";
            });
    }
    save() {
        this.spinnerService.show();
        this.aduitIdList.emailSendStatus = true;
         this._auditServiceProxy.sendnotificationForAuditProject(this.aduitIdList)
             .subscribe(res => {
                 this.notify.success("Successfully Invited");                                       
                        this.spinnerService.hide();
                        this.modal.hide();
                        this.close();
                        this.getAuditProject.emit(null);
                    });
        this.spinnerService.hide();
    }

    show(items: any) {
        this.attachedFileCodes = [];
        this.attachmentCode = [];
        this.aduitIdList = items;
        if (items.auditStatusId != null) {
            this.auditstatusid = true;
        }
        let statusId = items.auditStatusId;
        this.initializeWorkFlow();
        this.initializeAuditStatus();
        this.initilizationToccBcc();
        this._emailtemplateservice.getStatusWies(statusId).subscribe(result => {
            
            if (result.workFlowPageId != undefined) {
                this.flag = false;
                this.emailnotification = result;
                this.getSummerNoteData = result.emailBody;
                this.summernoteTextEditorService.setData(result.emailBody);
                this.summerNote.getData(result.emailBody);

                var list = JSON.parse(result.attachmentJson);
                if (list != null) {
                    if (list.length != 0) {
                        list.forEach(x => {
                            var temp = new AttachmentWithTitleDto();
                            temp.code = x.Code;
                            temp.title = x.Title;
                            this.attachedFileCodes.push(temp);
                        });
                    }
                }
            }
            else {
                this.flag = true;               
                this.message.warn("Status template not configured");
            }           
        })
        this.modal.show();
        this.active = true;        
    }
    SendNotification() {
        this.spinnerService.show();
        this.aduitIdList.emailSendStatus = false;
        this._auditServiceProxy.sendnotificationForAuditProject(this.aduitIdList)
            .subscribe(res => {
                this.notify.success("Successfully Invited");
                this.spinnerService.hide();
                this.modal.hide();
                this.close();
                this.getAuditProject.emit(null);
            });
    }
    close() {
        this.active = false;
        this.modalSave.emit(null);
        this.modal.hide();
    }

    getAttachment(e) {
        this.attachmentData = e;
    }

    addAttachmentInputs() {
        this.attachedFileCodes.push(new AttachmentWithTitleDto());
    }
}
