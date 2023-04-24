import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FileDownloadService } from '../../../../shared/utils/file-download.service';
import { FileUploadService } from './file-upload.service';
import { StorageServiceProxy } from '../../../../shared/service-proxies/services/storage.service';
import { FileSizePipe } from '../../../../shared/common/pipes/file-size.pipe';
import { custom } from 'devextreme/ui/dialog';
import { CommonLookupServiceProxy, AuditProjectServiceProxy } from '../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent extends AppComponentBase implements OnInit {
    @Input('name') name: any;
    @Input() arrayCount: number;
    @Input('attachedFile') attachedFile: any;
    @Input('reportDownload') reportDownload: boolean;
    @Input('multiple') multiple: boolean;
    @Input('fileFormat') fileFormat: any;
    @Input('templateID') templateID: any;
    @Input('emialnotificationId') emialnotificationId: any;
    @Input('emialReminderId') emialReminderId: any;
    @Input('attachedfileSize') attachedfileSize: any;
    @Input('showRollWise') showRollWise: boolean = false;
    @Input('fileExtensionList') fileExtensionList: any;
    @Input('showDelete') showDelete: boolean = true;
    getUploadFileData = this.fileUploadService.getDataUploadFile();
    value: any[] = [];
    value1 = [];
    attachedFileCodes = [];
    @Output() attachmentData: EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output() attachmentData1: EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output() deleteCode: EventEmitter<string[]> = new EventEmitter<string[]>();
    @Output() attachmentDelete: EventEmitter<string[]> = new EventEmitter<string[]>();
    progressVisible = false;
    @Output() countChanged: EventEmitter<number> = new EventEmitter();
    uploadedFiles: any[] = [];
    messageService: any[] = [];
    _fileSize: any;
    @Input('noFileUpload') noFileUpload: any;
    @Input('auditProjectId') auditProjectId: any;
    reauditPermission: boolean;


    constructor(_injector: Injector,
        private _fileDownloadService: FileDownloadService,
        private fileUploadService: FileUploadService,
        private _storageService: StorageServiceProxy,
        private _fileSizePipe: FileSizePipe,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _auditServiceProxy: AuditProjectServiceProxy
    ) {
        super(_injector);
        _fileSizePipe.transform(this.attachedfileSize);
        this.fileExtensionList = ['jpeg', 'jpg', 'xls', 'xlsx', 'doc', 'docx', 'txt', 'pdf', 'png', 'pptx', 'ppt', 'rtf', 'zip', 'msg'];
    }

    ngOnInit() {
        this.ReauditPermissionCheck();       
        this.value = [];
        this.attachedFile.forEach(i => {
            this.value.push({ name: i.title, code: i.code, name1: i.fileName, static: i.static });
            this.value1.push({ name: i.title, code: i.code, name1: i.fileName, static: i.static });
        });
        this._fileSize = this._fileSizePipe.transform(this.attachedfileSize);
    }
    getData(item) {
        this.value = [];
        item.forEach(i => {
            this.value.push({ name: i.title, code: i.code, name1: i.fileName, static: i.static });
            this.value1.push({ name: i.title, code: i.code, name1: i.fileName, static: i.static });
        });
    }
    deleteFun(i) {        
        this.arrayCount = this.value.length;
        this.value.splice(i, 1);
        this.countChanged.emit(this.arrayCount);
    }
    onUploadStarted(e) {
        this.attachmentData.emit(this.value1)
    }

    myUploader(event, form) {
        if (event.files.length <= (this.noFileUpload - this.value.length)) {
            event.files.forEach((i, j) => {
                var fileExtension = i.name.split('.').pop();
                var extentionExist = this.fileExtensionList.find(x => x == fileExtension.toLowerCase());
                if (i.size > this.attachedfileSize) {
                    let myDialog = custom({
                        showTitle: false,
                        messageHtml: '<div class="flaticon-close font-icon-size-dev-express text-center text-danger"></div> File size <b>' + this._fileSizePipe.transform(i.size) + '</b> should not be more than<b> ' + this._fileSizePipe.transform(this.attachedfileSize) + '</b>',
                        buttons: [{
                            text: "Ok",
                            onClick: (e) => {
                                return { buttonText: e.component.option("text") }
                            }
                        }]
                    });
                    myDialog.show().then((dialogResult) => {
                        if (dialogResult.buttonText == "Ok") { }
                    });
                }
                else {
                    var extentionExist = this.fileExtensionList.find(x => x == fileExtension.toLowerCase());
                    if (extentionExist != undefined) {
                        var checkFile = this.value.find(x => x.name == i.name);
                        if (checkFile == undefined) {
                            this.value.push(i);
                        }
                    }
                    else {
                        let correctFormat = custom({
                            showTitle: false,
                            messageHtml: '<b>Please use the correct file format</b>',
                            buttons: [{
                                text: "Ok",
                                onClick: (e) => {
                                    return { buttonText: e.component.option("text") }
                                }
                            }]
                        });
                        correctFormat.show().then((dialogResult) => {
                            if (dialogResult.buttonText == "Ok") { }
                        });
                    }
                }
            });
            this.attachmentData.emit(this.value);
        }
        else {
            let limitReached = custom({
                showTitle: false,
                messageHtml: '<div><div class="flaticon-danger font-icon-size-dev-express text-center text-danger"></div><div class="h5">Maximum File upload limit reached</div></div>',
                buttons: [{
                    text: "Ok",
                    onClick: (e) => {
                        return { buttonText: e.component.option("text") }
                    }
                }]
            });
            limitReached.show().then((dialogResult) => {
                if (dialogResult.buttonText == "Ok") { }
            });
        }
        form.clear();
    }
    onUpload(event) {
        for (let file of event.files) {
            this.value.push({ name: file.name, code: file.code, name1: file.fileName });
        }
        this.messageService.push({ severity: 'info', summary: 'File Uploaded', detail: '' });
    }

    downloadAttachment(code: string, statics: boolean) {
        const self = this;
        if (statics) {
            self._fileDownloadService.downloadPAPGlobalAttachment(code);
        }
        else {
            switch (this.name) {
                case "Incident":
                    self._fileDownloadService.downloadAttachment(code);
                    break;
                case "Business Risks":
                    self._fileDownloadService.downloadAttachment(code);
                    break;
                case "Exception":
                    self._fileDownloadService.downloadAttachment(code);
                    break;
                case "Remediation Plan":
                    self._fileDownloadService.downloadRemediationAttachment(code);
                    break;
                case "Finding Report Internal":
                    self._fileDownloadService.downloadAttachment(code);
                    break;
                case "Audit Project Management":
                    self._fileDownloadService.downloadAttachment(code);
                    break;
                case "AuditProjectManagementRelatedAttachment":
                    self._fileDownloadService.downloadAuditAttachment(code);
                    break;
                case "Template Type":
                    self._fileDownloadService.downloadAttachment(code);
                    break;
                case "Metting":
                    self._fileDownloadService.downloadAuditSubAttachment(code);
                    break;
                case "WorkflowTeamplate":
                    self._fileDownloadService.downloadWorkflowTeamplateAttachment(code, this.templateID);
                    break;
                case "EmailNotification":
                    self._fileDownloadService.downloadEmailNotificationAttachment(code, this.emialnotificationId);
                    break;
                case "EmailReminder":
                    self._fileDownloadService.downloadEmailReminderAttachment(code, this.emialReminderId);
                    break; case "Report":
                    self._fileDownloadService.downloadReport(code);
                    break;
                case "Findding Report":
                    self._fileDownloadService.downloadAttachment(code);
                    break;
                case "PAP":
                    self._fileDownloadService.downloadPAPAttachment(code);
                    break;
                case "Section":
                    self._fileDownloadService.downloadTTXFile(code);
                    break;
                case "PAP_Global_Attachment":
                    self._fileDownloadService.downloadPAPGlobalAttachment(code);
                    break;
            }
        }
    }

    pap_Global_Attachments(code: string) {


    }

    deleteAttachmentInput(input, i) {
        const self = this;
        let myDialog = custom({
            showTitle: false,
            messageHtml: '<div class="kt-align-center"><div class="flaticon-warning-sign message-icon-size text-warning"></div><div class="h1"></div><div class="h1">Are you sure?</div><div class="h5">You want to delete this Attachment!</div></div>',
            buttons: [{
                text: "Yes",
                onClick: (e) => {
                    return { buttonText: e.component.option("text") }
                }
            },
                {
                    text: "No",
                    onClick: (e) => {
                        return { buttonText: e.component.option("text") }
                    }
                }, 
            ]
        });
        myDialog.show().then((dialogResult) => {           
            if (dialogResult.buttonText == "Yes") {             
                switch (this.name) {
                    case "Incident":
                        self._fileDownloadService.removeAttachment(input.code).subscribe(() => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.attachmentData.emit(this.value);
                            this.deleteFun(i);
                            this.deleteCode.emit(input.code);
                            this.notify.error("File removed Successfully");
                        });
                        break;
                    case "Business Risks":
                        self._fileDownloadService.removeAttachment(input.code).subscribe(() => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.attachmentData.emit(this.value);
                            this.deleteFun(i);
                            this.deleteCode.emit(input.code);
                            this.notify.error("File removed Successfully");
                        });
                        break;
                    case "Exception":
                        self._fileDownloadService.removeAttachment(input.code).subscribe(() => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.deleteFun(i);
                            this.attachmentData.emit(this.value);
                            this.deleteCode.emit(input.code);
                            this.notify.error("File removed Successfully");
                        });
                        break;
                    case "Remediation Plan":
                        self._fileDownloadService.deleteRemediationAttachment(input.code).subscribe(() => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.attachmentData.emit(this.value);
                            this.deleteFun(i);
                            this.deleteCode.emit(input.code);
                            this.notify.error("File removed Successfully");
                        });
                        break;
                    case "Finding Report Internal":
                        self._fileDownloadService.removeAttachment(input.code).subscribe(() => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.attachmentData.emit(this.value);
                            this.deleteFun(i);
                            this.deleteCode.emit(input.code);
                            this.notify.error("File removed Successfully");
                        });
                        break;
                    case "Audit Project Management":
                        self._fileDownloadService.removeAttachment(input.code).subscribe(() => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.deleteFun(i);
                            this.attachmentData.emit(this.value);
                            this.deleteCode.emit(input.code);
                            this.notify.error("File removed Successfully");
                        });
                        break;
                    case "Template Type":
                        self._fileDownloadService.removeAttachment(input.code).subscribe(() => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.attachmentData.emit(this.value);
                            this.deleteFun(i);
                            this.deleteCode.emit(input.code);
                            this.notify.error("File removed Successfully");
                        });
                        break;
                    case "Metting":
                        self._fileDownloadService.deleteAuditSubAttachment(input.code).subscribe((res) => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.attachmentData.emit(this.value);
                            this.deleteCode.emit(input.code);
                            this.deleteFun(i);
                            this.notify.error("File removed Successfully");
                        });
                        break;
                    case "Findding Report":
                        self._fileDownloadService.removeAttachment(input.code).subscribe(() => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.value.splice(i, 1);
                            this.notify.error("File removed Successfully");
                            this.deleteCode.emit(input.code);
                        });
                        break;


                    case "AuditProjectManagementRelatedAttachment":
                        self._fileDownloadService.deleteAuditAttachment(input.code).subscribe(() => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.attachmentData.emit(this.value);
                            this.deleteCode.emit(input.code);
                            this.deleteFun(i);
                            this.notify.error("File removed Successfully");
                        });
                        break;

                    case "WorkflowTeamplate":
                        self._fileDownloadService.deleteWorkflowTeamplateAttachment(input.code, this.templateID).subscribe(() => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.attachmentData.emit(this.value);
                            this.deleteCode.emit(input.code);
                            this.deleteFun(i);
                            this.notify.error("File removed Successfully");
                        });
                        break;

                    case "EmailNotification":
                        self._fileDownloadService.deleteEmailNotificationAttachment(input.code, this.emialnotificationId).subscribe(() => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.attachmentData.emit(this.value);
                            this.deleteCode.emit(input.code);
                            this.deleteFun(i);
                            this.notify.error("File removed Successfully");
                        });
                        break;
                    case "EmailReminder":
                        self._fileDownloadService.deleteEmailReminderAttachment(input.code, this.emialReminderId).subscribe(() => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.attachmentData.emit(this.value);
                            this.deleteCode.emit(input.code);
                            this.deleteFun(i);
                            this.notify.error("File removed Successfully");
                        });
                        break;
                    case "PAP":
                        self._fileDownloadService.deletePAPAttachment(input.code).subscribe(() => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.attachmentData.emit(this.value);
                            this.deleteCode.emit(input.code);
                            this.deleteFun(i);
                            this.notify.error("File removed Successfully");
                        });
                        break;
                    case "Section":
                        self._fileDownloadService.deleteTTXFile(input.code).subscribe(() => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.attachmentData.emit(this.value);
                            this.deleteCode.emit(input.code);
                            this.deleteFun(i);
                            this.notify.error("File removed Successfully");
                        });
                        break;
                    case "PAP_Global_Attachment":
                        self._fileDownloadService.deletePAPGlobalAttachmentfile(input.code).subscribe(() => {
                            this.attachedFileCodes = this.attachedFileCodes.filter(
                                (item) => item != input
                            );
                            this.attachmentData.emit(this.value);
                            this.deleteCode.emit(input.code);
                            this.deleteFun(i);
                            this.notify.error("File removed Successfully");
                        });
                        break;
                }            
            }
        });
    }

    //Related Attachments
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
                    if (isExist.id != undefined) {
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
