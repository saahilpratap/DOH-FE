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
import { CreateOrEditQuestionDto, QuestionsServiceProxy, AnswerType, AnswerOptionDto } from "../../../../shared/service-proxies/service-proxies";

@Component({
    selector: "createOrEditQuestionModal",
    templateUrl: "./create-or-edit-question-modal.component.html"
})
export class CreateOrEditQuestionModalComponent extends AppComponentBase
    implements OnInit {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    question = new CreateOrEditQuestionDto();
    hideButton: any;
    constructor(
        injector: Injector,
        private _questionsServiceProxy: QuestionsServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.question.answerOptions = [];
    }
    show(questionId?: number, buttonStatus?: any): void {
        if (buttonStatus != undefined)
            this.hideButton = buttonStatus;
        else
            this.hideButton = 0;
        if (!questionId) {
            this.question = new CreateOrEditQuestionDto();
            this.question.id = questionId;

            this.active = true;
            this.modal.show();
        } else {
            this._questionsServiceProxy
                .getQuestionForEdit(questionId)
                .subscribe(result => {
                    this.question = result.question;
                    this.active = true;
                    this.modal.show();
                });
        }
    }

    save(): void {
        
        //this.question.removedAnswers = this.question.removedAnswers == undefined ? [] : this.question.removedAnswers;
        if (this.question.removedAnswers != undefined) {

            this.question.removedAnswers = this.question.removedAnswers.filter(Number);
        }

        if (this.question.answerOptions.length == 0) {
            this.message.warn("Please add answers to this questions");
            return;
        }
        this.saving = true;
        this._questionsServiceProxy
            .createOrEdit(this.question)
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
        console.log(this.question);
    }

    onAnswerTypeChange() {
        
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
            let ans1 = new AnswerOptionDto();
            ans1.value = "No";
            ans1.score = 0.0;
            this.question.answerOptions.push(ans1);
            let ans2 = new AnswerOptionDto();
            ans2.value = "Yes";
            ans2.score = 0.0;
            this.question.answerOptions.push(ans2);
        }
        else {
            let ans3 = new AnswerOptionDto();
            ans3.score = 0.0;
            this.question.answerOptions.push(ans3);
        }
    }

    addAnswerOption() {
        if (this.question.answerType == AnswerType.List) {
            let ans3 = new AnswerOptionDto();
            ans3.score = 0.0;
            this.question.answerOptions.push(ans3);
        }
        else if (this.question.answerType == AnswerType.Multiselect) {
            let ans3 = new AnswerOptionDto();
            ans3.score = 0.0;
            this.question.answerOptions.push(ans3);
        }
    }

    deleteAnswerOption(answerOption: AnswerOptionDto)
    {
        
        this.question.answerOptions = this.question.answerOptions.filter(
            option => option != answerOption
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
}
