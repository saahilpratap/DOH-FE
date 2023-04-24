import {
    Component,
    OnInit,
    Injector,
    ViewChild,
    Output,
    EventEmitter,
    Input,
} from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { Router } from "@angular/router";
import * as moment from "moment";
import { ModalDirective } from "ngx-bootstrap";
import { Paginator } from "primeng/public_api";
import {
    AssessmentDto,
    IReviewDataDto,
    ReviewDataDto,
    QuestResponseDto,
    QuestResponseServiceProxy,
} from "../../../../shared/service-proxies/service-proxies";
import { AttachmentDto } from "@shared/service-proxies/services/assessments.service";
import { StorageServiceProxy } from "../../../../shared/service-proxies/services/storage.service";
import { FileDownloadService } from "../../../../shared/utils/file-download.service";

@Component({
    selector: "commonQuestionaireModals",
    templateUrl: "./common-questionaire-modal.component.html",
    styleUrls: ["./common-questionaire-modal.component.scss"],
})
export class CommonQuestionaireModalComponent extends AppComponentBase
    implements OnInit {
    @ViewChild("commonQuestionaireModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    reviewData = new ReviewDataDto();
    responseData: QuestResponseDto[] = [];
    responseDataList: QuestResponseDto[] = [];
    questionnairDocuments: { code: string; auditProjectId: string; questionId: string; fileName: string }[];
    active = false;
    creationDateRange: Date;
    options: boolean;
    checked: boolean;
    optionValue: string = "toggle";
    reviewDataId: any;
    attachmentData = [];
 //questionnairDocuments: { file: any; fileName: string }[];
    dataQuestions = [
        {
            questionName: " Security Strategy",
            response: "",
            comments: "",
            description: "Do you have a documented and approved security strategy",
        },
        {
            questionName: "Security Team Size",
            response: "",
            comments: "",
            description: "Do you have a documented and approved security strategy",
        },
        {
            questionName: "Security Program",
            response: "",
            comments: "",
            description:
                "What is the current maturity level of your security program",
        },
        {
            questionName: "Data Protection & Privacy",
            response: "",
            comments: "",
            description:
                "What securiuty controls address your data security and privacy needs",
        },
    ];

    constructor(
        _injector: Injector,
        private _router: Router,
        private _reviewRepo: QuestResponseServiceProxy,
        private _storageService: StorageServiceProxy,
        private _fileDownloadService: FileDownloadService     
    ) {
        super(_injector);
        this.questionnairDocuments = new Array<{ code: null; auditProjectId: null; questionId: null; fileName: null }>();
        //this.questionnairDocuments = new Array<{ file: null; fileName: null }>();
    }
    @Input() showResponseType: boolean;
    ngOnInit() {
        this.options = true;
    }

    show(reviewData: ReviewDataDto): void {
        this.responseData = [];
        this.showResponseType = true;
        this.reviewData = reviewData;
        this.reviewDataId = reviewData.id;
        this.reviewData.reviewQuestions = reviewData.reviewQuestions.filter(x => x.answerType != 4);
        this._reviewRepo.getQuestionResponse(this.reviewData.id).subscribe(
            (res) => {
                this.responseData = res.questResponses;
                this.active = true;
                this.modal.show();
            },
            (err) => {
                this.spinnerService.hide();
                this.message.error(err.error.error.message);
            }
        );
    }

    close(): void {
        this.active = false;
        this.modalSave.emit({ reviewData: this.reviewData });
        this.reviewData = new ReviewDataDto();
        this.modal.hide();
    }
    save() {
        this.active = false;
        this.responseData;
        this.responseDataList = [];
        this.responseData.forEach(obj => {
            var item = new QuestResponseDto();
            item.reviewDataId = obj.reviewDataId;
            item.response = obj.response;
            item.comments = obj.comments;
            item.tenantId = obj.tenantId;
            item.questionId = obj.questionId;
            item.id = obj.id;
            if (this.questionnairDocuments.length != 0) {
                var code2 = this.questionnairDocuments.find(x => x.auditProjectId == "" + obj.reviewDataId && x.questionId == "" + obj.questionId);
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
            this.responseDataList.push(item);
        })
        this._reviewRepo.createOrEdit(this.responseDataList).subscribe(
            (res) => {
                var result = res;
                this.modalSave.emit({ reviewData: this.reviewData });
                this.reviewData = new ReviewDataDto();
                this.modal.hide();
                this.notify.success("Saved Successfully");
            },
            (err) => {
                this.spinnerService.hide();
                this.message.error(err.error.error.message);
            }
        );

        
    }
    setResponse(j: number, val: any) {
        this.responseData[j].response = val;
    }

    //uploadAttachment(evt: any) {
    //    if (evt.target.files.length !== 0) {
    //        Array.from(evt.target.files).forEach((element) => {
    //            const file: any = element;
    //            const obj = { file: file, fileName: file.name };
    //            this.questionnairDocuments.push(obj);
    //        });
    //    }
    //}

    removeFile(i) {
        this.questionnairDocuments.splice(i, 1);
    }

    uploadAttachment(evt: any, qID) {
        let a = evt.file;
        if (evt.target.files.length !== 0) {
            Array.from(evt.target.files).forEach((obj) => {
                const file: any = obj;
                this.attachmentData.push({ pId: this.reviewDataId, qId: qID, name: file.name, type: file.type });
                let formData: FormData = new FormData();
                formData.append("File", file, file.name);
                formData.append("Title", this.reviewDataId + "," + qID);
                this._storageService.AddAssessmentQuestionResponseAttachment(formData).subscribe(res => {
                    let code = res.result.code;
                    let auditProjectId = res.result.auditProjectId;
                    let questionId = res.result.questionId
                    let fileName = res.result.fileName
                    this.questionnairDocuments.push({ code, auditProjectId, questionId, fileName });
                    this.notify.success(fileName + "Uploaded");
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

            });
        }
    }

    downloadAttachment(code) {
        const self = this;
        self._fileDownloadService.downloadAssessmentQuestionResponse(code);
    }
    deleteAttachment(input) {
        const self = this;
        self._fileDownloadService.deleteAssessmentQuestionResponse(input).subscribe(() => {
            this.reviewDataId = this.reviewData.id;
            this.questionnairDocuments = new Array<{ code: null; auditProjectId: null; questionId: null; fileName: null }>();
            this.reviewData.reviewQuestions = this.reviewData.reviewQuestions.filter(x => x.answerType != 4);
            this._reviewRepo.getQuestionResponse(this.reviewData.id).subscribe(
                (res) => {
                    this.responseData = [];
                    this.responseData = res.questResponses;
                    this.active = true;
                    this.modal.show();
                },
                (err) => {
                    this.spinnerService.hide();
                    this.message.error(err.error.error.message);
                }
            );
            //this.deleteFun(i);
            this.notify.success("File removed Successfully");
        });
    }
}
