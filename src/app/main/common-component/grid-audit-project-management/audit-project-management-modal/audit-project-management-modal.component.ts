import { Component, OnInit, Injector, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize, debounce, groupBy } from "rxjs/operators";
import { QuestionDto, AuditProjectServiceProxy, AuditQuestResponseDto, CommonLookupServiceProxy } from '../../../../../shared/service-proxies/service-proxies';
import { StorageServiceProxy } from '../../../../../shared/service-proxies/services/storage.service';
import { string } from '@amcharts/amcharts4/core';
import { FileDownloadService } from '../../../../../shared/utils/file-download.service';
import * as _ from 'lodash';




export class QuestionList {
    tenantId: number;
    description!: string;
    questionId!: number;
    auditProjectId!: number;
    questionGroupId!: number;
    answerType: string;
    comments!: string;
    response!: string;
    id!: number;
    valueAndScores: valueAndScoresList[] = [];
    attachment: any;
    fileName: any;
    sectionName: string;
    SectionId: number;
}

export class valueAndScoresList {
    value!: string | undefined;
    score!: number;
}
export class TestQuestionList {
    section: string;
    questionList: QuestionList[] = [];
}


@Component({
    selector: 'auditProjectManagementModals',
    templateUrl: './audit-project-management-modal.component.html',
    styleUrls: ['./audit-project-management-modal.component.scss']
})
export class AuditProjectManagementModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('auditProjectManagementModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Input('auditProjectId') auditProjectId: number;
    active = false;
    saving = false;
    questionDto: QuestionList[] = [];
    auditQuestRes: AuditQuestResponseDto[] = [];
    modalHeader: string = '';
    filledANswers: AuditQuestResponseDto[];
    flag: boolean = false;

    questionnairDocuments: { code: string; auditProjectId: string; questionId: string; fileName: string; questionGroupId: null }[];
    uploadDocument: any;
    attachedFileCodes: any;
    count = 0;
    submitQuestinaryButton: boolean = false;
    fileExtensionList = [] = ['jpeg', 'jpg', 'xls', 'xlsx', 'doc', 'docx', 'txt', 'pdf', 'png', 'pptx', 'ppt', 'rtf', 'zip', 'msg'];
    @Input('reauditPermission') reauditPermission: boolean;

    IsAdmin: boolean;

    constructor(_injector: Injector,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _router: Router,
        private _auditServiceProxy: AuditProjectServiceProxy,
        private _storageService: StorageServiceProxy,
        private _fileDownloadService: FileDownloadService,
    ) {
        super(_injector);
        this.questionnairDocuments = new Array<{ code: null; auditProjectId: null; questionId: null; fileName: null; questionGroupId: null }>();
    }
    SectionNames = [];
    attachmentData = [];
    attachmentGetData: any;
    projectId: any;
    questionGroupId: any;
    qustionId: any;
    fileName: any;
    listdata: any;
    testData: any;
    ngOnInit() {
        this.IsAdmin = this.appSession.user.isAdmin;
    }
    show(auditProjectId: number, data?: any): void {
        this.testData = [];
        this.projectId = auditProjectId;
        this.questionGroupId = data.questionGroupId;
        this.getcheckButton(this.projectId);
        this.modalHeader = data.questionGroupName;

        this.listdata = data;
       
        this._auditServiceProxy.getAllAuditQuestResponseByAuditProjectId(auditProjectId, this.questionGroupId).subscribe(res => {
            this.questionDto = [];

            if (res.length != 0) {
                data.questionList.forEach(objTemp => {
                    var found = res.find(x => x.questionId == objTemp.id);

                    if (found != undefined) {
                        var obj = new QuestionList();
                        obj.id = found.id;
                        obj.tenantId = objTemp.tenantId;
                        obj.description = objTemp.description;
                        obj.answerType = objTemp.answerType;
                        obj.comments = found.comments;
                        obj.questionId = found.questionId;
                        obj.questionGroupId = found.questionGroupId;
                        obj.response = found.response;
                        obj.sectionName = objTemp.sectionName;
                        obj.SectionId = found.sectionId;
                        obj.auditProjectId = auditProjectId;
                        obj.valueAndScores = objTemp.valueAndScores;
                        obj.attachment = found.attachment;
                        obj.fileName = found.fileName;

                        this.questionDto.push(obj);
                    }
                    else {
                        var obj = new QuestionList();
                        obj.id = 0;
                        obj.tenantId = objTemp.tenantId;
                        obj.description = objTemp.description;
                        obj.answerType = objTemp.answerType;
                        obj.comments = '';
                        obj.questionId = objTemp.id;
                        obj.questionGroupId = objTemp.questionGroupId;
                        obj.response = '';
                        obj.sectionName = objTemp.sectionName;
                        obj.SectionId = found.sectionId;
                        obj.auditProjectId = auditProjectId;
                        obj.valueAndScores = objTemp.valueAndScores;
                        obj.attachment = objTemp.attachment;
                        obj.fileName = objTemp.fileName;
                        this.questionDto.push(obj);
                    }
                });
            }
            else {

                data.questionList.forEach(objTemp => {
                    var obj = new QuestionList();
                    obj.id = 0;
                    obj.tenantId = objTemp.tenantId;
                    obj.description = objTemp.description;
                    obj.answerType = objTemp.answerType;
                    obj.comments = '';
                    obj.questionId = objTemp.id;
                    obj.questionGroupId = data.questionGroupId;
                    obj.response = '';
                    obj.sectionName = objTemp.sectionName;
                    obj.SectionId = objTemp.sectionId;
                    obj.auditProjectId = auditProjectId;
                    obj.valueAndScores = objTemp.valueAndScores;
                    obj.attachment = objTemp.attachment;
                    obj.fileName = objTemp.fileName;
                    this.questionDto.push(obj);
                });
            }
            this.testData = _.chain(this.questionDto)
                .groupBy("sectionName")
                .map(function (v, i) {
                    return {
                        sectionName: i,
                        questionList: v
                    }
                }).value();
        });
        this.active = true;
        this.modal.show();
    }

    getcheckButton(auditId: any) {
        this._auditServiceProxy.getcheckAuditQuestionButton(auditId).subscribe(res => {
            this.submitQuestinaryButton = res;
        });
    }

    Submit() {
        this.auditQuestRes = [];
        var check = this.questionDto.filter(x => x.response != "");
        if (check.length != this.questionDto.length) {
            this.message.warn("Please fill all question response !");
        }
        else {
            for (let i = 0; i < this.testData.lenght; i++) {
                let c = this.testData[i].questionList;
                for (let j = 0; j < c.lenght; j++) {
                    c[i].questionGroupId = this.questionGroupId;
                    this.questionDto.push(c)
                }
            }
            this.questionDto.forEach(obj => {
                var item = new AuditQuestResponseDto();
                item.auditProjectId = obj.auditProjectId;
                item.questionId = obj.questionId;
                item.questionGroupId = obj.questionGroupId;
                item.id = obj.id;
                item.tenantId = obj.tenantId;
                item.description = obj.description;
                item.comments = obj.comments;
                item.response = obj.response;
                item.sectionId = obj.SectionId;

                if (this.questionnairDocuments.length != 0) {
                    var code2 = this.questionnairDocuments.find(x => x.auditProjectId == "" + obj.auditProjectId && x.questionId == "" + obj.questionId && x.questionGroupId == "" + obj.questionGroupId);
                    if (code2 != null) {
                        item.attachment = code2.code;
                        item.fileName = code2.fileName;
                    }
                    else {
                        item.attachment = obj.attachment;
                        item.fileName = obj.fileName;
                    }
                }
                else {
                    item.attachment = obj.attachment;
                    item.fileName = obj.fileName;
                }
                this.auditQuestRes.push(item);
            })
            this._auditServiceProxy.auditQuestResponseAndAuditStatusUpdate(this.auditQuestRes).pipe(
                finalize(() => {
                    this.saving = false;
                })
            ).subscribe(() => {
                this.notify.info(this.l("Questionnaire Submitted Successfully"));
                this.close();
                this.modalSave.emit(null);
            });
        }
    }

    save(): void {
        for (let i = 0; i < this.testData.lenght; i++) {
            let c = this.testData[i].questionList;
            for (let j = 0; j < c.lenght; j++) {
                c[i].questionGroupId = this.questionGroupId;
                this.questionDto.push(c)
            }
        }

        this.auditQuestRes = [];
        this.questionDto.forEach(obj => {
            var item = new AuditQuestResponseDto();
            item.auditProjectId = obj.auditProjectId;
            item.questionId = obj.questionId;
            item.questionGroupId = obj.questionGroupId;
            item.id = obj.id;
            item.tenantId = obj.tenantId;
            item.description = obj.description;
            item.comments = obj.comments;
            item.response = obj.response;
            item.sectionId = obj.SectionId;
            if (this.questionnairDocuments.length != 0) {
                var code2 = this.questionnairDocuments.find(x => x.auditProjectId == "" + obj.auditProjectId && x.questionId == "" + obj.questionId && x.questionGroupId == "" + obj.questionGroupId);
                if (code2 != null) {
                    item.attachment = code2.code;
                    item.fileName = code2.fileName;
                }
                else {
                    item.attachment = obj.attachment;
                    item.fileName = obj.fileName;
                }
            }
            else {
                item.attachment = obj.attachment;
                item.fileName = obj.fileName;
            }
            this.auditQuestRes.push(item);
        })
        this._auditServiceProxy.createOrUpdateAuditQuestResponse(this.auditQuestRes).pipe(
            finalize(() => {
                this.saving = false;

            })
        ).subscribe(() => {
            this.notify.info(this.l("save Successfully"));            
        });
    }
    close(): void {
        this.active = false;
        this.modal.hide();
        this.modalSave.emit(null);
    }
    checkResponse() {
        this.notify.warn('Please Give Response First and Save Response Then Add Attachment');       
    }

    uploadAttachment(evt: any, qID, gId, sectionId) {      
        let a = evt.file;
        this.questionDto;
        if (evt.target.files.length !== 0) {
            Array.from(evt.target.files).forEach((obj) => {
                const file: any = obj;
                this.attachmentData.push({ pId: this.projectId, qId: qID, name: file.name, type: file.type });
                let formData: FormData = new FormData();
                formData.append("File", file, file.name);
                formData.append("Title", this.projectId + "," + qID + "," + gId + "," + sectionId);
                var fileExtension = file.name.split('.').pop();
                if (file.size > 4000000) {
                    this.notify.error(this.l('File size should not be more than 4 MB'));
                }
                else {
                    var extentionExist = this.fileExtensionList.find(x => x == fileExtension.toLowerCase());
                    this._storageService.AddAuditQuestionnaryResponseAttachment(formData).subscribe(res => {
                        let code = res.result.code;
                        let auditProjectId = res.result.auditProjectId;
                        let questionId = res.result.questionId
                        let questionGroupId = res.result.questionGroupId
                        let fileName = res.result.fileName
                        this.questionnairDocuments.push({ code, auditProjectId, questionId, fileName, questionGroupId });
                        this.notify.success(fileName + "Uploaded");
                        this.show(this.projectId, this.listdata);
                    },
                        error => {
                            this.spinnerService.hide();
                            this.close();
                            this.modalSave.emit(null);
                            this.message.error(
                                "Couldn't upload file at this time, try later :)!"
                            );
                        });
                }
            });
        }
    }
    removeFile(i) {
        this.questionnairDocuments.splice(i, 1);
    }
    qustionClick(e) {
        this.qustionId = e;
    }
    downloadAttachment(code) {
        const self = this;
        self._fileDownloadService.downloadAuditQuestionResponse(code);
    }
    deleteAttachment(input) {
        const self = this;
        self._fileDownloadService.deleteAuditQuestionResponse(input).subscribe(() => {
            this.questionnairDocuments = new Array<{ code: null; auditProjectId: null; questionId: null; fileName: null; questionGroupId: null }>();
            this._auditServiceProxy.getAllAuditQuestResponseByAuditProjectId(this.projectId, this.questionGroupId).subscribe(res => {
                this.questionDto = [];
                if (res.length != 0) {
                    this.listdata.questionList.forEach(objTemp => {
                        var found = res.find(x => x.questionId == objTemp.id);
                        var obj = new QuestionList();
                        obj.id = found.id;
                        obj.tenantId = objTemp.tenantId;
                        obj.description = objTemp.description;
                        obj.answerType = objTemp.answerType;
                        obj.comments = found.comments;
                        obj.questionId = found.questionId;
                        obj.questionGroupId = found.questionGroupId;
                        obj.response = found.response;
                        obj.sectionName = objTemp.sectionName;
                        obj.SectionId = objTemp.SectionId;
                        obj.auditProjectId = this.projectId;
                        obj.valueAndScores = objTemp.valueAndScores;
                        obj.attachment = found.attachment;
                        obj.fileName = found.fileName;
                        this.questionDto.push(obj);
                    });
                }
                this.show(this.projectId, this.listdata);
            });            
            this.notify.error("File removed Successfully");
        });
    }


}

