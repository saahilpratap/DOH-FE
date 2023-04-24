import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    OnInit
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import * as moment from "moment";
import { CreateOrEditExternalAssessmentQuestionDto, QuestionsServiceProxy, CreateOrEditQuestionDto, AnswerType, ExternalQuestionDto, ExternalAssessmentAnswerOptionDto, ControlRequirementsServiceProxy, CreateOrEditFeedbackQuestionDto, FeedbacksServiceProxy, FeedbackQuestionAnswerOptionDto } from "../../../shared/service-proxies/service-proxies";

@Component({
    selector: "createOrEditFeedbackQuestionModals",
    templateUrl: "./create-or-edit-feedback-question-modal.component.html"
})
export class CreateOrEditFeedbackQuestionModalComponent extends AppComponentBase 
     implements OnInit {
    @ViewChild("createOrEditFeedbackQuestionModal", { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter < any > = new EventEmitter<any>();

    active = false;
    saving = false;

    question = new CreateOrEditFeedbackQuestionDto();
    hideButton: any;
    constructor(
        injector: Injector,
        private _feedbacksServiceProxy: FeedbacksServiceProxy,
        private _controlRequirementsProxy: ControlRequirementsServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.question.answerOptions = [];
        this.question.mandatory = false;
    }

    show(questionId?: number, buttonStatus?: any): void {
        
        if (buttonStatus != undefined)
            this.hideButton = buttonStatus;
        else
            this.hideButton = 0;
        if (!questionId) {
            this.question = new CreateOrEditFeedbackQuestionDto();
            this.question.id = questionId;
            this.active = true;
            this.modal.show();
        } else {
            this._feedbacksServiceProxy
                .getFeedbackQuestionForEdit(questionId)
                .subscribe(result => {
                   
                    this.question = result;
                    this.active = true;
                    this.modal.show();
                });

        }
    }

    save(): void {

        if (this.question.removedAnswers  != undefined) {
            this.question.removedAnswers= this.question.removedAnswers.filter(Number);
        }

      //  this.question.removedAnswers = this.question.removedAnswers == undefined ? [] : this.question.removedAnswers;

        if (this.question.answerOptions.length == 0) {
            this.message.warn("Please add answers to this questions");
            return;
        }
        else if (this.question.answerOptions.length > 10) {
            this.message.warn("option length should not be more than 10");
            return;
        }
        this.saving = true;
        this._feedbacksServiceProxy
            .createOrEditFeedbackQuestion(this.question)
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

    close(): void {
        this.question.removedAnswers = [];
        this.active = false;
        this.modal.hide();
    }

    onAnswerTypeChange() {
        console.log("onAnswerTypeChange");
        if (this.question.answerOptions.length > 0) {
            this.question.removedAnswers = this.question.removedAnswers == undefined ? [] : this.question.removedAnswers;
            this.question.answerOptions.forEach(obj => {
                if (obj.id != undefined) {
                    this.question.removedAnswers.push(obj.id);
                }
            });
        }
        this.question.answerOptions = [];
        if (this.question.answerType == AnswerType.Logical) {
            let ans1 = new FeedbackQuestionAnswerOptionDto();
            ans1.questionOption = "No";
            this.question.answerOptions.push(ans1);
            let ans2 = new FeedbackQuestionAnswerOptionDto();
            ans2.questionOption = "Yes";
            this.question.answerOptions.push(ans2);
        } else {
            let ans3 = new FeedbackQuestionAnswerOptionDto();
            this.question.answerOptions.push(ans3);
        }
    }
    addAnswerOption() {
        if (this.question.answerType == AnswerType.List) {
            let ans3 = new FeedbackQuestionAnswerOptionDto();
            this.question.answerOptions.push(ans3);
        }
    }

    deleteAnswerOption(answerOption: FeedbackQuestionAnswerOptionDto)
    {
     

        this.question.answerOptions = this.question.answerOptions.filter(
            options => options != answerOption
        );
        this.question.removedAnswers = this.question.removedAnswers == undefined ? [] : this.question.removedAnswers;
        this.question.removedAnswers.push(answerOption.id);

        
    }

    isAnswerTypeLogical() {
        return this.question.answerType == AnswerType.Logical;
    }

    hasAnyAnswerOption() {
        if (this.question.answerOptions == undefined) {
            this.question.answerOptions = [];
        }
        return this.question.answerOptions.length != 0;
    }

    onItemChange(event, id) {
        switch (id) {
            case 1: {
                this.question.mandatory = true;
                break;
            }
            case 2: {
                this.question.mandatory = false;
                break;
            }
        }
    }
}
