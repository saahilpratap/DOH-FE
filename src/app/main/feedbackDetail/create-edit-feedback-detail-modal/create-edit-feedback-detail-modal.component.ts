
import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from "@angular/core";

import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy, FeedbackQuestionDto, FeedbacksServiceProxy, FeedBackDetailDto } from "@shared/service-proxies/service-proxies";
import { ModalDirective } from "ngx-bootstrap";
import * as _ from 'lodash';
import * as moment from 'moment';
@Component({
    selector: "CreateOrEditFeedbackDetailModal",
    templateUrl: "./create-edit-feedback-detail-modal.component.html"

})
export class CreateOrEditFeedbackDetailModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    hideButton: any;
    feedbackquestion: FeedbackQuestionDto[] = [];
    attachedQuestions: FeedbackQuestionDto[] = [];
    active = false;
    saving = false;
    createFeedbackDetail: FeedBackDetailDto;
    constructor(
        injector: Injector,
        private _feedbacksServiceProxy: FeedbacksServiceProxy,

    ) {
        super(injector);
        this.createFeedbackDetail = new FeedBackDetailDto();
    }

    feedbackquestions() {
        this.feedbackquestion = [];
        this._feedbacksServiceProxy.getAllFeedbackQuestions().subscribe(res => {
            this.feedbackquestion = res;
        })
    }

    deletefeedbackdetail(id) {

    }

    show(feedbackId?: number, buttonStatus?: any): void {
        if (buttonStatus != undefined)
            this.hideButton = buttonStatus;
        else
            this.hideButton = 0;

        if (!feedbackId) {
            this.active = true;
            this.feedbackquestions();
            this.modal.show();
        }
        else {
            this._feedbacksServiceProxy
                .getFeedbackDetailForEdit(feedbackId)
                .subscribe(result => {

                    this.createFeedbackDetail = result;
                    this.attachedQuestions = result.feedbackDetailQuestions;
                    this.editquestion();
                    this.active = true;
                    this.modal.show();
                });

        }

    }

    editquestion() {
        this.feedbackquestion = [];
        this._feedbacksServiceProxy.getAllFeedbackQuestions().subscribe(res => {
            if (this.attachedQuestions.length > 0) {
                res.forEach(obj => {
                    var item = this.attachedQuestions.filter(c => c.questionId == obj.questionId).length;
                    if (item == 0) {
                        let item = new FeedbackQuestionDto();
                        item.questionId = obj.questionId;
                        item.description = obj.description;
                        item.questionSrNo = obj.questionSrNo;
                        this.feedbackquestion.push(item);
                    }
                });
            }
            else {
                res.forEach(obj => {
                    let item = new FeedbackQuestionDto();
                    item.questionId = obj.questionId;
                    item.description = obj.description;
                    item.questionSrNo = obj.questionSrNo;
                    this.feedbackquestion.push(item);
                });
            }
        });
    }


    save() {
        this.saving = true;

        this.createFeedbackDetail.feedbackDetailQuestions = [];
        this.attachedQuestions.forEach((y, index) => {
            var temp = new FeedbackQuestionDto();
            temp = y;
            temp.questionSrNo = index + 1;
            this.createFeedbackDetail.feedbackDetailQuestions.push(temp);
        });

        this._feedbacksServiceProxy
            .createFeedBackDetail(this.createFeedbackDetail)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l("SavedSuccessfully"));
                this.close();
                this.modalSave.emit(null);
            });
    }
    close() {
        this.active = false;
        this.createFeedbackDetail = new FeedBackDetailDto();
        this.attachedQuestions = [];
        this.feedbackquestion = [];

        this.modal.hide();
    }
}
