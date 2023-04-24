import { Component, Injector, OnInit, ViewChild, EventEmitter, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TemplateChecklistServiceProxy, TemplateChecklistAuthoritativeDocumentDto, AuthoritativeDocumentListDto,
    BusinessEntitysListDto, ControlType, DynamicNameValueDto, TemplateDocumentType, AttachmentWithTitleDto, FacilityTypeDto, TemplateChecklistDto,} from "@shared/service-proxies/service-proxies";
import { BsModalRef, ModalDirective } from "ngx-bootstrap/modal";
import { StorageServiceProxy } from "@shared/service-proxies/services/storage.service";
import { DomSanitizer } from "@angular/platform-browser";
import { FileUploadComponent } from "../../../shared/common/file-upload/file-upload.component";
import { SummernoteTextEditorService } from "../../../shared/common/summernote-text-editor/summernote-text-editor.service";
@Component({
    selector: "createEditTemplateTypeModals",
    templateUrl: "./create-edit-template-type.component.html",
})
export class CreateEditTemplateTypeComponent extends AppComponentBase
    implements OnInit {
    active = false;
    attachment: boolean=false
    inSystem: boolean=false
    url: boolean = false;
    modalRef2: BsModalRef;
    TemplateDocumentType: TemplateDocumentType;
    @ViewChild(ModalDirective, { static: false }) modal: ModalDirective;
    @Output() closeModal = new EventEmitter();
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(FileUploadComponent) fileUpload: FileUploadComponent;
    attachedFileCodes = [];    
    selectedvalue: any;
    controlTypes = [];
    template: TemplateChecklistDto = new TemplateChecklistDto();

    Category: DynamicNameValueDto[];
    selectedcategory = new DynamicNameValueDto();

    facilityTypesLookUp: FacilityTypeDto[];
    selectedfacility: FacilityTypeDto = new FacilityTypeDto();

    type: DynamicNameValueDto[] = [];
    selectedType: DynamicNameValueDto = new DynamicNameValueDto();

    businessentity: BusinessEntitysListDto[] = [];
    selectedbusinessentity = new BusinessEntitysListDto();

    authorativeDocument: AuthoritativeDocumentListDto[] = [];
    selectedAuthorativeDocument: AuthoritativeDocumentListDto[] = [];

    attachmentCode: AttachmentWithTitleDto[] = [];
    value: any;
    attachmentData: any;
    recordId: any;
    isEdit: any;
    arrayCount: number = 0;
    facilityType = new FacilityTypeDto();
    getSummerNoteData: any;
    hideButton: any;
    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _templateChecklistService: TemplateChecklistServiceProxy,
        private readonly _storageService: StorageServiceProxy,
        private _router: Router,
        private _sanitizer: DomSanitizer,
        private summernoteTextEditorService: SummernoteTextEditorService,
    ) {
        super(injector);
        this.hideButton = true;
        this.controlTypes = [
            { label: "Basic", value: ControlType.Basic },
            { label: "Transitional", value: ControlType.Transitional },
            { label: "Advanced", value: ControlType.Advanced },
        ];
    }

    ngOnInit() {
        this.attachment = true;
        this._activatedRoute.queryParams.subscribe((params) => {
            this.recordId = params["recordId"];
        });
        if (this.recordId) {
            this.isEdit = true;
            this.getAllTemplatecheck(this.recordId);
        } else {
            this.isEdit = false;
            this.getAllTemplatecheck(this.recordId);
        }
    }

    editall() {
        this.editAuditVendor();
        this.editcategory();
        this.editFacilityType();
        this.editReatedAd();
        this.editType();
    }

    editType() {
        this.selectedType = null;
        this.type.forEach((obj) => {
            if (obj.id == this.template.templateTypeId) {
                this.selectedType = obj;
            }
        });
    }

    editAuditVendor() {
        this.selectedbusinessentity = null;
        this.businessentity.forEach((obj) => {
            if (obj.id == this.template.vendorId) {
                this.selectedbusinessentity = obj;
            }
        });
    }

    

    editReatedAd() {
        this.selectedAuthorativeDocument = [];
        this.template.authoritativeDocuments.forEach((obj) => {
            this.authorativeDocument.forEach((team) => {
                if (obj.authoritativeDocumentId == team.id) {
                    var temp = new AuthoritativeDocumentListDto();
                    temp.id = team.id;
                    temp.title = team.title;
                    this.selectedAuthorativeDocument.push(temp);
                }
            });
        });
    }

    editFacilityType() {
        this.facilityType = null;
        this.facilityTypesLookUp.forEach((obj) => {
            if (obj.id == this.template.facilityTypeId) {
                this.facilityType = obj;
            }
        });
    }

    editcategory() {
        this.selectedcategory = null;
        this.Category.forEach((obj) => {
            if (obj.id == this.template.categoryId) {
                this.selectedcategory = obj;
            }
        });
    }

    getAllTemplatecheck(recordId)
    {
        this._templateChecklistService
            .getAllTeamplateinfo(recordId)
            .subscribe((res) => {               
                this.template = res;
                this.facilityTypesLookUp = res.facilityTypeList.map(
                    (f) => f.facilityType
                );
                this.Category = res.categoryList;
                this.authorativeDocument = res.authoritativeDocumentList;
                this.type = res.templateTypeList;
                this.businessentity = res.businessEntitysList;
               
                this.template.authoritativeDocuments = this.template.authoritativeDocuments == undefined ? [] : this.template.authoritativeDocuments;       
                if (this.isEdit) {
                    setTimeout(() => {
                        this.editall();
                    }, 1000);                   
                }
            });
    }

    show(id?: number, buttonStatus?: any): void {
        if (buttonStatus != undefined)
            this.hideButton = buttonStatus;
        else
            this.hideButton = 0;
        if (id > 0) {
            this.isEdit = true;
            this._templateChecklistService
                .getAllTeamplateinfo(id)
                .subscribe((res) => {
                    this.summernoteTextEditorService.setData(res.inSystem);
                    if (res.attachments.length > 0) {
                        this.attachedFileCodes = res.attachments
                       // this.fileUpload.getData(res.attachments);
                    }
                    
                    this.template = res;
                    
                    switch (res.templateDocumentType) {
                        case 0: {
                            this.selectedvalue = 0;
                            this.attachment = true;
                            this.inSystem = false;
                            this.url = false;
                            
                            this.template.templateDocumentType = TemplateDocumentType.Attachment;
                            break;
                        }
                        case 1: {
                            this.selectedvalue = 1;
                            this.attachment = false;
                            this.inSystem = true;
                            this.url = false;
                            
                            this.template.templateDocumentType = TemplateDocumentType.InSystem;
                            break;
                        }
                        case 2: {
                            this.selectedvalue = 2;
                            this.attachment = false;
                            this.inSystem = false;
                            this.url = true;
                            
                            this.template.templateDocumentType = TemplateDocumentType.URL;
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                    this.facilityTypesLookUp = res.facilityTypeList.map(
                        (f) => f.facilityType
                    );
                    if (res.attachments.length > 0)
                    {
                        this.attachedFileCodes = res.attachments
                       // this.fileUpload.getData(res.attachments);
                    }
                   
                    this.Category = res.categoryList;
                    this.authorativeDocument = res.authoritativeDocumentList;
                    this.type = res.templateTypeList;
                    this.businessentity = res.businessEntitysList;
                    this.template.authoritativeDocuments =
                        this.template.authoritativeDocuments == undefined
                            ? []
                            : this.template.authoritativeDocuments;
                    this.active = true;
                    this.modal.show();
                    
                    if (this.isEdit) {
                        setTimeout(() => {
                            this.editall();
                        }, 1000);
                       
                    }
                });
        }
        else {

            this.attachment = true;
            this.inSystem = true;
            this.url = true;
            this.selectedvalue = 2;
            this.active = true;
            this.selectedAuthorativeDocument = [];
            this.modal.show();
        }
    }

    autorativeDocumentChange(event) {
        this.template.authoritativeDocuments = [];
        event.value.forEach((obj) => {
            var item = new TemplateChecklistAuthoritativeDocumentDto();
            item.id = 0;
            item.templateChecklistId = 0;
            item.authoritativeDocumentId = obj.id;
            this.template.authoritativeDocuments.push(item);
        });
    }

    documentType(event,e) {
        switch (e) {
            case 0: {
                this.selectedvalue =0;
                this.attachment = true;
                this.inSystem = true;
                this.url = true;
                this.template.inSystem = null;
                this.template.templateDocumentType = TemplateDocumentType.Attachment;
                break;
            }
            case 1: {
                this.selectedvalue =1;
                this.attachment = true;
                this.inSystem = true;
                this.url = true;
                this.template.inSystem = null;
                this.attachmentData = [];
                this.attachedFileCodes = [];
                this.template.templateDocumentType = TemplateDocumentType.InSystem;
                break;
            }
            case 2: {
                this.selectedvalue=2;
                this.attachment = true;
                this.inSystem = true;
                this.url = true;
                this.template.inSystem = null;
                this.attachmentData = [];
                this.attachedFileCodes = [];
                this.template.templateDocumentType = TemplateDocumentType.URL;
                break;
            }
            default: {
               
                break;
            }
        }
    }

    getAttachment(e) {
        this.attachmentData = e;
    }
    setSummerNoteData(e) {
        this.template.inSystem = e;
    }
    Save(): void {
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
                    this._storageService.AddTeamplateAttachment(formData).subscribe(
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

    saveData(): void {      
        this.template.attachments = this.attachmentCode.filter(e => e.code != "");
        //this.template.vendorId = this.selectedbusinessentity.id;
        //this.template.templateTypeId = this.selectedType.id;
        this._templateChecklistService
            .createorUpdateTemplateChecklist(this.template)
            .subscribe((res) => {
                if (this.isEdit) {
                    abp.notify.success(this.l("SuccessfullyUpdated"));
                    this.modalSave.emit(null);
                    this.close();
                } else {
                    abp.notify.success(this.l("SavedSuccessfully"));
                    this.template = new TemplateChecklistDto();
                    this.modalSave.emit(null);
                    this.close();
                }
                this.closeModal.emit(false);
                this.modal.hide();

            });
    }

    close() {
        this.active = false;
        this.template = new TemplateChecklistDto();
        this.selectedType = new DynamicNameValueDto();
        this.modal.hide();
    }

    back() {
        this._router.navigate(["/app/main/template-type"]);
    }
}
