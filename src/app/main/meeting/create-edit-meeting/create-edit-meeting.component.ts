import {
    Component,
    OnInit,
    Injector,
    ViewChild,
    Input,
    TemplateRef,
    Output,
    EventEmitter,
} from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { ModalDirective, BsModalRef, BsModalService } from "ngx-bootstrap";
import {
    AuditMeetingDto,
    MeetingServiceProxy,
    DynamicNameValueDto,
    GetBusinessEntitiesExcelDto,
    BusinessEntityDto,
    CustomDynamicServiceProxy,
    BusinessEntitiesServiceProxy,
    EntityType,
    AttachmentWithTitleDto,
    MeetingTemplateServiceProxy,
    MeetingTemplateDto,
    CustomTemplateServiceProxy,
    CreatorEditEmailTemplateDto,
} from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { StorageServiceProxy } from "@shared/service-proxies/services/storage.service";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { MeetingTemplateModalComponent } from "../edit-meeting-template-modal/meeting-template-modal.component";
declare var $;
import { FileUploadComponent } from "../../../shared/common/file-upload/file-upload.component";
import { SummernoteTextEditorService } from "../../../shared/common/summernote-text-editor/summernote-text-editor.service";
import { SummernoteTextEditorComponent } from "../../../shared/common/summernote-text-editor/summernote-text-editor.component";
import * as moment from 'moment';


@Component({
    selector: "createEditMeetingModals",
    templateUrl: "./create-edit-meeting.component.html",
})
export class CreateEditMeetingComponent extends AppComponentBase implements OnInit {
    @Input() CurrentMeetingId: number;
    currentMeetingId: number;
    meetingData = new AuditMeetingDto();
    modalRef2: BsModalRef;
    //   @ViewChild("createEditMeetingModal", { static: true }) modal: TemplateRef<any>;
    @ViewChild('MeetingTemplateModals', { static: true }) MeetingTemplateModals: MeetingTemplateModalComponent;
    @ViewChild(SummernoteTextEditorComponent) public summerNote: SummernoteTextEditorComponent;
    meetingTemplateList: MeetingTemplateDto[] = [];
    meetingTemplateId: any;
    meetingTemplateIdTemp: any;
    @ViewChild(ModalDirective, { static: false }) modal: ModalDirective;
    @ViewChild(FileUploadComponent) fileUpload: FileUploadComponent;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    currentURL: string;
    hideTextBox: boolean;
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

    config: any = {
        airMode: false,
        tabDisable: true,
        popover: {
            table: [
                ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
                ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
            ],
            image: [
                ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
                ['float', ['floatLeft', 'floatRight', 'floatNone']],
                ['remove', ['removeMedia']]
            ],
            link: [
                ['link', ['linkDialogShow', 'unlink']]
            ],
            air: [['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],]
        },
        height: '300px',
        uploadImagePath: '/api/upload',
        toolbar: [
            ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
            ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
            ['fontsize', ['fontname', 'fontsize', 'color']],
            ['para', ['style0', 'ul', 'ol', 'paragraph', 'height', 'lineheight']],
            ['insert', ['table', 'picture', 'link', 'video', 'hr']],
            ['customButtons', ['testBtn']],
            ['headline', ['style']],
            ['view', ['fullscreen']],
            ['help', ['help']]

        ],
        codeviewFilter: true,
        codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
        codeviewIframeFilter: true
    };

    meetingTypes: DynamicNameValueDto[];
    meetingStage: DynamicNameValueDto[];
    auditCompaniesLookUp: GetBusinessEntitiesExcelDto[] = [];
    businessEntitiesLookUp: BusinessEntityDto[];
    attachedFileCodes = [];
    auditProjects = [];
    disableMeetingType = false;
    @Output() closeModal = new EventEmitter();
    active = false;
    saving = false;
    auditProjectIds: any;
    meetingTypeId: any;
    value: any;
    attachmentData: any;
    recordId: any;
    isEdit: any;
    arrayCount: number = 0;
    attachmentCode: AttachmentWithTitleDto[] = [];
    propertiesNames: string[] = [];
    hideButton: any;
    txtTo: any;
    txtCc: any;
    propertiesName: string[] = [];
    getSummerNoteData: any;
    txtBody: any;
    tempSummary: string;
    emailnotification: CreatorEditEmailTemplateDto = new CreatorEditEmailTemplateDto();
    reauditPermissions: boolean;
    hrlist: number[] = [];
    minlist: number[] = [];
    sDatehr: number;
    sDatemin: number;
    eDatehr: number;
    eDatemin: number;

    constructor(
        _injector: Injector,
        private _router: Router,
        private _customDynamicService: CustomDynamicServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _meetingServiceProxy: MeetingServiceProxy,
        private _storageService: StorageServiceProxy,
        private _meetingTemplateServiceProxy: MeetingTemplateServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private summernoteTextEditorService: SummernoteTextEditorService,
        private _customTemplateService: CustomTemplateServiceProxy,
    ) {
        super(_injector);
        this.currentURL = this._router.url;

        for (var i = 0; i < 24; i++) {
            this.hrlist.push(i);
        }
        for (var i = 0; i < 60; i++) {
            this.minlist.push(i);
        }
    }

    setTime(val) {
        if (val != undefined) {
            this.sDatehr = val._d.getHours();
            this.sDatemin = val._d.getMinutes();
        }
        else {
            this.sDatehr = 0;
            this.sDatemin = 0;
        }
    }

    setendTime(val) {
        if (val != undefined) {
            this.eDatehr = val._d.getHours();
            this.eDatemin = val._d.getMinutes();
        }
        else {
            this.eDatehr = 0;
            this.eDatemin = 0;
        }
    }

    onHrChange(id, d, e) {
        if (e == 0) {
            this.meetingData.startDate = moment(d._d.setHours(id));
        }
        else {
            this.meetingData.endDate = moment(d._d.setHours(id));
        }
    }

    onMinChange(id, d, e) {
        if (e == 0) {
            this.meetingData.startDate = moment(d._d.setMinutes(id));
        }
        else {
            this.meetingData.endDate = moment(d._d.setMinutes(id));
        }
    }

    ngOnInit() {
        this.tempSummary = "";
        this.meetingData.editorData = "";
        this.onWorkflowChange();
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

    initializeMeetingTypes() {
        this._customDynamicService
            .getDynamicEntityDatabyName("Audit Meeting Type")
            .subscribe((res) => {
                this.meetingTypes = res;
                //this.meetingTypeId = this.meetingTypes.filter(
                //    (m) => m.name == "External"
                //)[0].id;
                if (this.meetingTypeId != undefined) {
                    this.meetingData.meetingTypeId = this.meetingTypeId;
                    this.disableMeetingType = true;
                }
                else {
                    this.disableMeetingType = false;
                }
            });
    }

    initializeMeetingStage() {
        this._customDynamicService
            .getDynamicEntityDatabyName("Meeting Stage")
            .subscribe((res) => {
                this.meetingStage = res;
            });
    }

    initializeAuditCompaniesLookUp() {
        this.spinnerService.show();
        this.businessEntitiesLookUp = [];
        this.auditProjects = [];
        this._businessEntitiesServiceProxy
            .getAllForLookUp(EntityType.ExternalAudit, false)
            .subscribe((res) => {
                this.auditCompaniesLookUp = res;
                this.meetingData.auditVendorId = this.appSession.user.isAuditer
                    ? this.appSession.user.businessEntityId
                    : this.meetingData.auditVendorId;
                if (this.meetingData.auditVendorId) {
                    this.initializeAuditOrganizations(this.meetingData.auditProjectId);
                }
                this.spinnerService.hide();
            });
    }

    initializeAuditOrganizations(auditProjectId) {
        this.spinnerService.show();
        this.auditProjects = [];
        this.getAuditProject();
        this._meetingServiceProxy
            .getAuditProjectByOrganization(auditProjectId)
            .subscribe((res) => {
                this.businessEntitiesLookUp = res;
                this.spinnerService.hide();
            });
    }

    getAuditProject() {
        this.auditProjects = [];
        this._meetingServiceProxy.getAuditProjectByVendor(this.meetingData.auditVendorId).subscribe(res => {
            this.auditProjects = res;
            this.meetingData.auditProjectId = this.auditProjectIds;
        })
    }

    showAuditProject(id?: number) {
        if (id != undefined) {
            this.spinnerService.show();
            this.auditProjects = [];
            this._meetingServiceProxy
                .getAuditProjectByVendorAndEntity(
                    this.meetingData.auditVendorId,
                    this.meetingData.auditOrgId
                )
                .subscribe((res) => {
                    this.auditProjects = res;
                    this.meetingData.auditProjectId = this.auditProjectIds;
                    this.spinnerService.hide();
                });
        }
    }

    show(id?: number, auditProjectId?: number, vendorId?: number, buttonStatus?: any, reauditPermission?: boolean): void {
        this.reauditPermissions = reauditPermission;       
        if (!id) {
            this.active = true;
            this.modal.show();
        }
       
        if (buttonStatus != undefined)
            this.hideButton = buttonStatus;
        else
            this.hideButton = 0;
        this.active = true;

        this.sDatehr = undefined;
        this.sDatemin = undefined;
        this.eDatehr = undefined;
        this.eDatemin = undefined;

        this.attachedFileCodes = [];
        this.auditProjectIds = auditProjectId;
        this.meetingData.auditVendorId = vendorId;
        this.meetingData.auditProjectId = auditProjectId;
        this.initializeMeetingTypes();
        this.initializeMeetingStage();
        this.initializeAuditCompaniesLookUp();
        this.getAllMeetingTemplates();
        this.initilizationToccBcc();
        if (id > 0 || id != undefined) {
            this.spinnerService.show();
            this._meetingServiceProxy
                .getAuditMeetingForEdit(id)
                .subscribe((result) => {
                    this.meetingData = result;
                    this.emailnotification.to = result.toEmail;
                    this.emailnotification.cc = result.ccEmail;
                    this.meetingData.auditOrgId = result.auditOrgId;
                    this.initializeAuditOrganizations(this.meetingData.auditProjectId);
                    this.getAuditProject();
                    this.showAuditProject(this.meetingData.auditOrgId);
                    this.attachedFileCodes = result.attachments;
                    this.fileUpload.getData(result.attachments);
                    this.summernoteTextEditorService.setData(result.editorData);
                    this.summerNote.getData(result.editorData);
                    if (this.meetingData.meetingTypeName == 'Message') {
                        this.hideTextBox = true;
                    }
                    else {
                        this.hideTextBox = false;
                    }
                    this.active = true;
                    this.modal.show();
                    this.spinnerService.hide();
                });
        } else {
            this.emailnotification.to = null;
            this.emailnotification.cc = null;
            this.meetingTemplateId = null;
            this.summerNote.getData('');
            this.txtTo = null;
            this.txtCc = null;
            this.meetingData.auditVendorId = vendorId;
            setTimeout(() => {
                this.initializeAuditOrganizations(auditProjectId);
                this.getAuditProject();
            }, 1000);
            this.meetingData.auditProjectId = auditProjectId;
            this.active = true;
            this.modal.show();
        }
    }
    close() {
        this.txtBody = null;
        this.txtCc = null;
        this.txtTo = null;
        this.tempSummary = "";
        this.summerNote.getData(this.tempSummary);
        this.getSummerNoteData = this.tempSummary;
        this.summernoteTextEditorService.setData(this.tempSummary);
        this.meetingData = new AuditMeetingDto();
        this.active = false;
        this.saving = false;
        this.modal.hide();
    }
    getAttachment(e) {
        this.attachmentData = e;
    }

    save() {
        this.arrayCount = 0;
        this.attachmentCode = [];
        if (this.meetingData.startDate == undefined || this.meetingData.endDate == undefined) {
            this.message.error("start date and end date required");
        }
        else if (this.meetingData.startDate > this.meetingData.endDate) {
            this.message.error("end date should be greater than start date");
        } else if (this.attachmentData == undefined || this.attachmentData == 0) {
            this.saveData();
        }
        else {
            this.attachmentData.forEach(item => {
                if (!item.code) {
                    let blob = new Blob([item], { type: item.extention });
                    let formData: FormData = new FormData();
                    formData.append("File", blob, item.name);
                    this.spinnerService.show();
                    this._storageService.AddAuditSubDocAttachment(formData).subscribe(
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
                    if (this.attachmentData.length == this.arrayCount) {
                        this.saveData();
                    }
                }
            });
        }
    }

    saveData() {
        this.saving = true;
        this.meetingData.tenantId = this.appSession.tenantId;
        this.meetingData.attachments = this.attachmentCode.filter(e => e.code != "");
        if (this.emailnotification.to != "") {
            this.meetingData.toEmail = this.emailnotification.to;
            if (this.emailnotification.cc != "") {
                this.meetingData.ccEmail = this.emailnotification.cc;
            }
        }
        this._meetingServiceProxy
            .addUpdateAuditMeeting(this.meetingData)
            .subscribe((res) => {
                this.notify.success(this.l("SuccessfullyAdded"));
                abp.event.trigger("app.onMeetingAdded");
                this.closeModal.emit(false);
                this.modal.hide();
                this.close();
            });
    }
    setSummerNoteData(e) {
        this.meetingData.editorData = e;
    }
    openMeetingTemplateModal(val: number) {
        this.MeetingTemplateModals.show(val);
    }

    getAllMeetingTemplates() {
        this._meetingTemplateServiceProxy.getAllMeetingTemplate().subscribe(res => {
            this.meetingTemplateList = res;
        })
    }

    setBodyContent(val) {
        if (val == undefined) {
            this.message.confirm("", this.l("Are You Sure Clear Template"), isConfirmed => {
                if (isConfirmed) {
                    this.summerNote.getData('');
                }
            });
        }
        else {
            if (this.meetingData.editorData != undefined && this.meetingData.editorData.length != 0) {
                this.message.confirm("", this.l("Meeting Details below will be cleared. Are You Sure?"), isConfirmed => {
                    if (isConfirmed) {
                        this.summerNote.getData(val.templateJson);
                    }
                });
            }
            else {
                this.summerNote.getData(val.templateJson);
            }
        }
    }

    addAttachmentInputs() {
        this.attachedFileCodes.push(new AttachmentWithTitleDto());
    }

    deleteAttachmentInput(input: AttachmentWithTitleDto) {
        const self = this;
        self._fileDownloadService
            .deleteAuditSubAttachment(input.code)
            .subscribe((res) => {
                this.attachedFileCodes = this.attachedFileCodes.filter(
                    (item) => item != input
                );
                this.notify.success("File removed Successfully");
            });
    }

    downloadAttachment(code: string) {
        const self = this;
        self._fileDownloadService.downloadAuditSubAttachment(code);
    }

    uploadAttachment(event: any, attachment: AttachmentWithTitleDto) {
        var file = event.target.files[0];
        let formData: FormData = new FormData();
        formData.append("file", file, file.name);
        this.spinnerService.show();
        this._storageService.AddAuditSubDocAttachment(formData).subscribe(
            (res) => {
                this.spinnerService.hide();
                event.target.value = "";
                attachment.code = res.result.code;
            },
            (error) => {
                console.log(error);
                this.spinnerService.hide();
                this.message.error("Couldn't upload file at this time, try later :)!");
            }
        );
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

    onTypeChange(id, e) {
        e.forEach(item => {
            if (item.id == id && item.name == 'Message') {
                this.hideTextBox = true;
                this.meetingData.meetingStageId = null;
                this.meetingData.startDate = null;
                this.meetingData.endDate = null;
            }
            else if (item.id == id && item.name == 'Plan') {
                this.hideTextBox = false;
            }
            else if (item.id == id && item.name == 'Meeting') {
                this.hideTextBox = false;

            }
        })
    }

    onWorkflowChange() {

        this.propertiesName = [];

        this._customTemplateService.getAuditProjectMeetingDto()
            .subscribe(res => {

                this.propertiesName = res;
            });

    }

    onemailBodyPropertyChange(e) {
        if (e != undefined) {
            this.meetingData.editorData = this.meetingData.editorData + " {" + e + "}";
            this.summerNote.getData(this.meetingData.editorData);
            this.getSummerNoteData = this.meetingData.editorData;
            this.summernoteTextEditorService.setData(this.meetingData.editorData);
        }
    }
}
