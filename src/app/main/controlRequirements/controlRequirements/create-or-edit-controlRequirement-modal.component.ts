import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    QueryList
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import { CreateOrEditControlRequirementDto, ReviewDataResponseType, ControlRequirementsServiceProxy, QuestionDto, GetControlStandardForViewDto, RequirementQuestionDto, ControlStandardsServiceProxy, QuestionsServiceProxy } from "../../../../shared/service-proxies/service-proxies";

@Component({
    selector: "createOrEditControlRequirementModal",
    templateUrl: "./create-or-edit-controlRequirement-modal.component.html",

})
export class CreateOrEditControlRequirementModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    controlRequirement: CreateOrEditControlRequirementDto = new CreateOrEditControlRequirementDto();
    reviewDataResponseType = ReviewDataResponseType;
    controlStandards: GetControlStandardForViewDto[];
    controlStandardName = "";
    allQuestions: RequirementQuestionDto[] = [];


    attachedQuestions: RequirementQuestionDto[] = [];
    selectedQuestionIds: number[] = [];
    questionIdsToDeattach: number[] = [];
    filterText = "";
    codeFilter = "";
    nameFilter = "";
    descriptionFilter = "";
    hideButton: any;
    constructor(
        injector: Injector,
        private _controlRequirementsServiceProxy: ControlRequirementsServiceProxy,
        private _controlStandardsServiceProxy: ControlStandardsServiceProxy,
        private _questionsServiceProxy: QuestionsServiceProxy
    ) {
        super(injector);
        this.controlRequirement.iscored = true;
    }

    initializeControlStandards() {
        this._controlStandardsServiceProxy.getAllControlStandard().subscribe(res => {
            this.controlStandards = res;
        });
    }

    initializeQuestions() {
        this.allQuestions = [];
        this._questionsServiceProxy.getAll(this.filterText, undefined, 1000, 0).subscribe(res => {
            res.items.forEach(obj => {
                let item = new RequirementQuestionDto();
                item.questionId = obj.id;
                item.questionDescription = obj.description;
                this.allQuestions.push(item);
            });
        });
    }

    attachQuestions(event) {

    }

    deattachQuestions(event) {
        event.preventDefault();
        this.attachedQuestions = this.attachedQuestions.filter(
            aq =>
                this.questionIdsToDeattach.find(qtd => qtd == aq.questionId) ==
                undefined
        );
        this.questionIdsToDeattach = [];
    }

    show(controlRequirementId?: number, buttonStatus?: any): void {
        if (buttonStatus != undefined)
            this.hideButton = buttonStatus;
        else
            this.hideButton = 0;
        this.initializeControlStandards();
        if (!controlRequirementId) {
            this.controlRequirement = new CreateOrEditControlRequirementDto();
            this.controlRequirement.id = controlRequirementId;
            this.controlRequirement.industryMandated = false;
            this.controlRequirement.iscored = true;
            this.controlStandardName = "";
            this.initializeQuestions();
            this.active = true;
            this.modal.show();
        } else {
            this._controlRequirementsServiceProxy
                .getControlRequirementForEdit(controlRequirementId)
                .subscribe(result => {
                    this.controlRequirement = result.controlRequirement;
                    this.controlRequirement.iscored = result.controlRequirement.iscored;
                    this.controlStandardName = result.controlStandardName;
                    this.attachedQuestions = result.controlRequirement.requirementQuestions;
                    this.editquestion();
                    this.active = true;
                    this.modal.show();
                });
        }
    }

    editquestion() {
        this.allQuestions = [];
        this._questionsServiceProxy.getAll(this.filterText, undefined, 1000, 0).subscribe(res => {
            if (this.attachedQuestions.length > 0) {
                res.items.forEach(obj => {
                    var item = this.attachedQuestions.find(c => c.questionId == obj.id);
                    if (item == undefined) {
                        let item = new RequirementQuestionDto();
                        item.questionId = obj.id;
                        item.questionDescription = obj.description;
                        this.allQuestions.push(item);
                    }
                });
            }
            else {
                res.items.forEach(obj => {
                    let item = new RequirementQuestionDto();
                    item.questionId = obj.id;
                    item.questionDescription = obj.description;
                    this.allQuestions.push(item);
                });
            }
        });
    }

    save(): void {
        this.saving = true;

        this.controlRequirement.requirementQuestions = this.attachedQuestions;
        this._controlRequirementsServiceProxy
            .createOrEdit(this.controlRequirement)
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

    setControlStandardIdNull() {
        this.controlRequirement.controlStandardId = null;
        this.controlStandardName = "";
    }

    close(): void {
        this.attachedQuestions = [];
        this.allQuestions = [];
        this.active = false;
        this.modal.hide();
    }

    changeindustryMandatedState() {

        this.controlRequirement.industryMandated = !this.controlRequirement.industryMandated;
    }
}
