import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { AuthorityDepartmentsServiceProxy, ActionCategory, CreateOrUpdateStateActionDto, WorkFlowServiceProxy, TemplateDto, StateApplicability, WorkFlowPageDto, ActionTimeType, CreateOrUpdateStateDto, GetContactForViewDto, BusinessEntityUserDto, AuthoritativeDocumentsServiceProxy, AuthoritativeDocumentDto, DynamicNameValueDto, CustomDynamicServiceProxy, BusinessEntitiesServiceProxy, CreateOrEditAuthorityDepartmentDto, ContactsServiceProxy, CustomTemplateDto, CustomTemplateServiceProxy, AttachmentWithTitleDto, CertificateQRCodeServiceProxy } from "../../../shared/service-proxies/service-proxies";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SummernoteTextEditorComponent } from '../../shared/common/summernote-text-editor/summernote-text-editor.component';
import { SummernoteTextEditorService } from '../../shared/common/summernote-text-editor/summernote-text-editor.service';
import { StorageServiceProxy } from '../../../shared/service-proxies/services/storage.service';
import { FileUploadComponent } from '../../shared/common/file-upload/file-upload.component';

@Component({
    selector: 'createTemplateModal',
    templateUrl: './create-template-modal.component.html'
})
export class CreateTemplateModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(FileUploadComponent) fileUpload: FileUploadComponent;

    workflow: WorkFlowPageDto[] = [];
    @ViewChild(SummernoteTextEditorComponent) summerNote: SummernoteTextEditorComponent;
    workFlowPageId: number = 0;
    active = false;
    saving = false;
    customTemplateDto = new CustomTemplateDto();
    propertiesName: string[] = [];
    temppropertiesName: string[] = [];
    txtTitle: any;
    txtBody: any;
    txtSubject: any;
    getSummerNoteData: any;
    value = [];
    attachedFileCodes = [];
    attachmentData: any;
    arrayCount: number = 0;
    attachmentCode: AttachmentWithTitleDto[] = [];
    propertiesNames: string[] = [];
    temppropertiesNames: string[] = [];
    txtTo: any;
    txtCc: any;
    txtBcc: any;
    templateId: number;
    templateID: number;
    constructor(
        injector: Injector,
        private _customTemplateService: CustomTemplateServiceProxy,
        private _certificateQRCodeService: CertificateQRCodeServiceProxy,
        private _authorityDepartmentsServiceProxy: AuthorityDepartmentsServiceProxy,
        private _storageService: StorageServiceProxy,
        private summernoteTextEditorService: SummernoteTextEditorService,
    ) {
        super(injector);
        this.initializeWorkFlow();
    }

    show(id: number) {      
        this.templateId = id;
        this.attachedFileCodes = [];
        this.attachmentCode = [];
        if (id == 0) {
            this.customTemplateDto = new CustomTemplateDto();
            this.customTemplateDto.templateTitle = "";
            this.customTemplateDto.templateDescription = "";
            this.customTemplateDto.templateSubject = "";
            this.customTemplateDto.templateBody = "";
            this.customTemplateDto.templateCc = "";
            this.customTemplateDto.templateTo = "";
            this.customTemplateDto.templateBcc = "";
            this.customTemplateDto.id = id;

            this.txtTitle = "";
            this.txtSubject = "";
            this.txtBody = "";
            this.txtTo = "";
            this.txtCc = "";
            this.txtBcc = "";
        }
        else {
            this._customTemplateService
                .getCustomTemplateById(id)
                .subscribe(result => {
                    this.customTemplateDto = result;
                    this.onWorkflowEditInitial();
                    this.summerNote.getData(result.templateBody);

                    if (result.templateDescription.length > 0) {
                        var list = JSON.parse(result.templateDescription);
                        if (list.length != 0) {
                            list.forEach(x => {
                                var temp = new AttachmentWithTitleDto();
                                temp.code = x.Code;
                                temp.title = x.Title;                            
                                this.attachedFileCodes.push(temp);
                            });
                        }
                    }
                    this.fileUpload.getData(this.attachedFileCodes);
                });
        }
        this.active = true;
        this.initializeWorkFlow();
        this.initilizationToccBcc();
        this.modal.show();
    }

    initializeWorkFlow() {
        this._authorityDepartmentsServiceProxy.getAllPages()
            .subscribe(res => {
                this.workflow = res;
            });
    }

    initilizationToccBcc() {
        this.propertiesNames = [];
        this._customTemplateService.getBusinessEntitiesProperties()
            .subscribe(res => {
                this.propertiesNames = res;
                this.temppropertiesNames = res;
            });
    }

    onToPropertyChange(e) {
        if (e != undefined) {
            if (this.customTemplateDto.templateTo == null)
                this.customTemplateDto.templateTo = "";
            this.customTemplateDto.templateTo = this.customTemplateDto.templateTo + " ,{" + e + "}";
        }
    }

    onCcPropertyChange(e) {
        if (e != undefined) {
            if (this.customTemplateDto.templateCc == null)
                this.customTemplateDto.templateCc = "";
            this.customTemplateDto.templateCc = this.customTemplateDto.templateCc + " ,{" + e + "}";
        }
    }

    onBccPropertyChange(e) {
        if (e != undefined) {
            if (this.customTemplateDto.templateBcc == null)
                this.customTemplateDto.templateBcc = "";
            this.customTemplateDto.templateBcc = this.customTemplateDto.templateBcc + " ,{" + e + "}";
        }
    }

    onWorkflowChange() {
        this.propertiesName = [];
        this.txtTitle = '';
        this.txtBody = '';
        this.txtSubject = '';
        this.customTemplateDto.templateTitle = "";
        this.customTemplateDto.templateDescription = "";
        this.customTemplateDto.templateSubject = "";
        this.customTemplateDto.templateBody = "";
        this._customTemplateService.getClassProperties(this.customTemplateDto.workFlowPageId)
            .subscribe(res => {
                this.propertiesName = res;
                this.temppropertiesName = res;
                if (this.customTemplateDto.id == 0) {
                    this.customTemplateDto.templateTitle = "";
                    this.customTemplateDto.templateDescription = "";
                    this.customTemplateDto.templateSubject = "";
                    this.customTemplateDto.templateBody = "";

                }                
                var selectedWorkflowPage = this.workflow.find(x => x.id == this.customTemplateDto.workFlowPageId);

                if (selectedWorkflowPage.pageName.trim().toLowerCase() == 'Certificate Request'.trim().toLowerCase() || selectedWorkflowPage.pageName.trim().toLowerCase() == 'Certificate Approval'.trim().toLowerCase()) {
                    this.propertiesNames = [];
                    this.propertiesNames.push('Primary_Contact_Email');
                    this.propertiesNames.push('Secondary_Contact_Email');
                    this.propertiesNames.push('Owner_Email');
                    this.propertiesNames.push('Director_Incharge_Email');
                    this.propertiesNames.push('Group_Admin');
                    this.propertiesNames.push('Business_Entity_Admin_Email');
                    this.propertiesName = [];
                    this.propertiesName.push('EntityName');
                    this.propertiesName.push('LicenseNumber');
                    this.propertiesName.push('Issue_Date');
                    this.propertiesName.push('Expire_Date');
                }
                else
                {
                    if (selectedWorkflowPage.pageName.trim().toLowerCase() == 'Submitted'.trim().toLowerCase() || selectedWorkflowPage.pageName.trim().toLowerCase() == 'Under Process'.trim().toLowerCase() || selectedWorkflowPage.pageName.trim().toLowerCase() == 'Completed'.trim().toLowerCase()) {
                        this.propertiesNames = [];
                        this.propertiesNames.push('Business_Entity_Admin_Email');
                        this.propertiesNames.push('Primary_Contact_Email');
                        this.propertiesNames.push('Secondary_Contact_Email');
                        this.propertiesNames.push('Director_Incharge_Email');
                        this.propertiesNames.push('Group_Admin');
                        this.propertiesNames.push('Contact_Information');

                        this.propertiesName = [];
                        this.propertiesName.push('PAP_Id');
                        this.propertiesName.push('EntityList');
                       
                    }
                    else if (selectedWorkflowPage.pageName.trim().toLowerCase() == 'Table Top Exercise'.trim().toLowerCase()) {
                        this.propertiesNames = [];
                        this.propertiesNames.push('Business_Entity_Admin_Email');
                        this.propertiesNames.push('Primary_Contact_Email');
                        this.propertiesNames.push('Secondary_Contact_Email');
                        this.propertiesNames.push('Director_Incharge_Email');
                        this.propertiesNames.push('Group_Admin');
            

                        this.propertiesName = [];
                        this.propertiesName.push('Link');
                        this.propertiesName.push('Business_Entity_Name');
                        this.propertiesName.push('Group_Name');

                    }
                    else {
                        this.propertiesNames = [];
                        this.propertiesNames = this.temppropertiesNames;
                        this.propertiesName = [];
                        this.propertiesName = this.temppropertiesName;
                    }
                }

            });

    }

    onTitlePropertyChange(e) {
        if (e != undefined) {
            this.customTemplateDto.templateTitle = this.customTemplateDto.templateTitle + " {" + e + "}";
        }
    }

    onSubjectPropertyChange(e) {
        if (e != undefined) {
            this.customTemplateDto.templateSubject = this.customTemplateDto.templateSubject + " {" + e + "}";
        }
    }

    onBodyPropertyChange(e) {

        if (e != undefined) {
            this.customTemplateDto.templateBody = this.customTemplateDto.templateBody + " {" + e + "}";
            this.summerNote.getData(this.customTemplateDto.templateBody);
        }
    }


    setSummerNoteData(e) {
        this.customTemplateDto.templateBody = e;
    }
    close(): void {
        this.active = false;
        this.attachmentData = [];
        this.modal.hide();
    }

    addAttachmentInputs() {
        this.attachedFileCodes.push(new AttachmentWithTitleDto());
    }

    getAttachment(e) {      
        this.attachmentData = e;
    }
    getDeleteCode(code) {
        if (code) {
            var a = this.attachedFileCodes.indexOf(code);
            this.attachedFileCodes.splice(a, 1);

            this._customTemplateService
                .getCustomTemplateById(this.templateId)
                .subscribe(result => {
                    this.customTemplateDto.templateDescription = result.templateDescription;
                });
        }        
    }
    onUploadStarted(e) {
    }

    onUploadProgress(e) {
    }

    addParameters(e) {
        this.value = e.value[0];
        let file = e.value[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
            this.customTemplateDto.templateDescription = e.target.result;
        }
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    save(): void {    
        this.customTemplateDto.templateTo = this.customTemplateDto.templateTo.trimLeft();
        if (this.customTemplateDto.templateCc != "" && this.customTemplateDto.templateCc != null) {
            this.customTemplateDto.templateCc = this.customTemplateDto.templateCc.trimLeft();
        }
        if (this.customTemplateDto.templateBcc != "" && this.customTemplateDto.templateBcc != null) {
            this.customTemplateDto.templateBcc = this.customTemplateDto.templateBcc.trimLeft();
        }
        if (this.customTemplateDto.templateTo.length > 0 && this.customTemplateDto.templateTo[0] == ',' && this.customTemplateDto.templateTo.length != null) {
            this.customTemplateDto.templateTo = this.customTemplateDto.templateTo.substring(1, this.customTemplateDto.templateTo.length);
        }
        if (this.customTemplateDto.templateCc.length > 0 && this.customTemplateDto.templateCc[0] == ',' && this.customTemplateDto.templateCc.length != null) {
            this.customTemplateDto.templateCc = this.customTemplateDto.templateCc.substring(1, this.customTemplateDto.templateCc.length);
        }
        if (this.customTemplateDto.templateBcc.length > 0 && this.customTemplateDto.templateBcc[0] == ',' && this.customTemplateDto.templateBcc.length != null) {
            this.customTemplateDto.templateBcc = this.customTemplateDto.templateBcc.substring(1, this.customTemplateDto.templateBcc.length);
        }
        this._customTemplateService.createOrUpdateTemplate(this.customTemplateDto)
            .subscribe(result => {
                this.message.success("Template Save sucessfully!");
                if (this.attachmentData == undefined || this.attachmentData == 0) {
                    this.close();
                    this.modalSave.emit(null);                   
                }
                else {
                    this.saveAttachmentWithData();
                    this.close();
                    this.modalSave.emit(null);    
                }
            });
    }

    saveAttachmentWithData() {
        this.arrayCount = 0;
        this.attachmentData.forEach(item => {
            
            if (!item.code) {
                let blob = new Blob([item], { type: item.extention });
                let formData: FormData = new FormData();
                formData.append("File", blob, item.name);
                formData.append("title", this.customTemplateDto.templateTitle);

                this.spinnerService.show();
                this._storageService.AddWorkflowTeamplateAttachment(formData).subscribe(
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
                        else {

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

            }
        });
        if (this.attachmentCode.length == this.arrayCount) {
           // this.save()
        }
    }

    onWorkflowEditInitial() {
        this.propertiesName = [];
        this._customTemplateService.getClassProperties(this.customTemplateDto.workFlowPageId)
            .subscribe(res => {
                this.propertiesName = res;
                var selectedWorkflowPage = this.workflow.find(x => x.id == this.customTemplateDto.workFlowPageId);

                if (selectedWorkflowPage.pageName == 'Certificate Request' || selectedWorkflowPage.pageName == 'Certificate Approval') {
                    this.propertiesNames = [];
                    this.propertiesNames.push('Primary_Contact_Email');
                    this.propertiesNames.push('Secondary_Contact_Email');
                    this.propertiesNames.push('Owner_Email');
                    this.propertiesNames.push('Director_Incharge_Email');
                    this.propertiesNames.push('Group_Admin');
                    this.propertiesNames.push('Business_Entity_Admin_Email');
                    this.propertiesName = [];
                    this.propertiesName.push('EntityName');
                    this.propertiesName.push('LicenseNumber');
                    this.propertiesName.push('Issue_Date');
                    this.propertiesName.push('Expire_Date');
                }

                else {
                    if (selectedWorkflowPage.pageName.trim().toLowerCase() == 'Submitted'.trim().toLowerCase() || selectedWorkflowPage.pageName.trim().toLowerCase() == 'Under Process'.trim().toLowerCase() || selectedWorkflowPage.pageName.trim().toLowerCase() == 'Completed'.trim().toLowerCase()) {
                        this.propertiesNames = [];
                        this.propertiesNames.push('Business_Entity_Admin_Email');
                        this.propertiesNames.push('Primary_Contact_Email');
                        this.propertiesNames.push('Secondary_Contact_Email');
                        this.propertiesNames.push('Director_Incharge_Email');
                        this.propertiesNames.push('Group_Admin');
                        this.propertiesNames.push('Contact_Information');

                        this.propertiesName = [];
                        this.propertiesName.push('PAP_Id');
                        this.propertiesName.push('EntityList');

                    }
                    else if (selectedWorkflowPage.pageName.trim().toLowerCase() == 'Table Top Exercise'.trim().toLowerCase()) {
                        this.propertiesNames = [];
                        this.propertiesNames.push('Business_Entity_Admin_Email');
                        this.propertiesNames.push('Primary_Contact_Email');
                        this.propertiesNames.push('Secondary_Contact_Email');
                        this.propertiesNames.push('Director_Incharge_Email');
                        this.propertiesNames.push('Group_Admin');


                        this.propertiesName = [];
                        this.propertiesName.push('Link');
                        this.propertiesName.push('Business_Entity_Name');
                        this.propertiesName.push('Group_Name');

                    }
                    else {
                        this.propertiesNames = [];
                        this.propertiesNames = this.temppropertiesNames;
                        this.propertiesName = [];
                        this.propertiesName = this.temppropertiesName;
                    }
                }

            });
    }

    QrCodeGenerate(): void {
        this._certificateQRCodeService.generateQRCOde(1)
            .subscribe(result => {
                this.message.success("QRCode Generate sucessfully!");
                this.active = false;
                this.modal.hide();
            });
    }
}
