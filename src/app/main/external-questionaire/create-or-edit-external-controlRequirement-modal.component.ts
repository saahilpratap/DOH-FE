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
import { ControlRequirementsServiceProxy, ControlStandardsServiceProxy, QuestionsServiceProxy, CreateOrEditControlRequirementDto, ReviewDataResponseType, GetControlStandardForViewDto, QuestionDto, RequirementQuestionDto, ExternalAssessmentsServiceProxy, ExternalRequirementQuestionDto, ExternalQuestionDto, CreateOrEditExternalAssessmentCRQuestionDto, GetAuthoritativeDocumentForViewDto, AuthoritativeDocumentsServiceProxy } from "../../../shared/service-proxies/service-proxies";
import * as $ from 'jquery';
import { map } from "@amcharts/amcharts4/.internal/core/utils/Array";

@Component({
    selector: "createOrEditExternalControlRequirementModal",
    templateUrl: "./create-or-edit-external-controlRequirement-modal.component.html",

})
export class CreateOrEditExternalControlRequirementModalComponent extends AppComponentBase {
    @ViewChild("createOrEditExternalQuestionModal", { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    crActive = false;
    etActive = false;

    authoritativeDocumentsLookUp: GetAuthoritativeDocumentForViewDto[];
    saving = false;
    controlRequirement: CreateOrEditExternalAssessmentCRQuestionDto = new CreateOrEditExternalAssessmentCRQuestionDto();
    reviewDataResponseType = ReviewDataResponseType;
    controlStandards: GetControlStandardForViewDto[];
    controlRequirements = [];
    controlStandardName = "";
    allQuestions: ExternalRequirementQuestionDto[] = [];
    attachedQuestions: ExternalRequirementQuestionDto[] = [];
    prevQuestions = [];
    questionIdsToDeattach: number[] = [];
    filterText = "";
    codeFilter = "";
    nameFilter = "";
    descriptionFilter = "";
    description = "";
    constructor(
        injector: Injector,
        private _controlRequirementsServiceProxy: ControlRequirementsServiceProxy,
        private _controlStandardsServiceProxy: ControlStandardsServiceProxy,
        private _questionsServiceProxy: QuestionsServiceProxy,
        private _externalAssessmentProxy: ExternalAssessmentsServiceProxy,
        private _authoritativeDocumentsServiceProxy: AuthoritativeDocumentsServiceProxy
    ) {
        super(injector);
    }

    initializeAuthoritativeDocumentLookUp() {
        this._authoritativeDocumentsServiceProxy.getAllAuthoritativeDocument().subscribe(res => {
            this.authoritativeDocumentsLookUp = res;
        });
    }

    initializeControlStandards() {
        this._controlStandardsServiceProxy.getAllControlStandard().subscribe(res => {
            this.controlStandards = res;
        });
    }

    initializeControlRequirements() {
        this._controlRequirementsServiceProxy.getControlRequirementLists()
            .subscribe(result => {
                this.controlRequirements = result;
            });
    }

    initializeQuestions() {
        this._questionsServiceProxy.getAllExternalQuestions(this.filterText, undefined, 1000, 0).subscribe(res => {
            res.items.forEach(obj => {
                let item = new ExternalRequirementQuestionDto();
                item.questionId = obj.id;
                item.questionDescription = obj.description;
                this.allQuestions.push(item);
            });
        });
    }

    attachQuestion(event) {

    }

    deattachQuestions(event) {
        var array3 = event.items.filter((obj) => { return this.prevQuestions.indexOf(obj.questionId) > -1; });
        if (array3.length > 0) {
            array3.forEach(obj => {
                this.controlRequirement.removedQuestions.push(obj.questionId);
            });
        }
    }

    show(externalAssementId?: number, controlRequirementId?: number): void {
        this.initializeControlStandards();
        this.initializeQuestions();
        if (externalAssementId != undefined && controlRequirementId != undefined) {
            this._externalAssessmentProxy.getExternalAssessmentCRQuestions(externalAssementId, controlRequirementId)
                .subscribe(result => {
                    this.controlRequirement = result.controlRequirement;
                    this.controlStandardName = result.controlStandardName;
                    this.attachedQuestions =
                        result.controlRequirement.externalRequirementQuestions;
                    this.crActive = true;
                    this.etActive = false;
                    this.controlRequirement.removedQuestions = [];
                    this.modal.show();
                });
        } else {
            this.controlRequirement.removedQuestions = [];
            this.initializeAuthoritativeDocumentLookUp();
            //this.initializeControlRequirements();
            this.etActive = true;
            this.crActive = false;
            this.modal.show();
        }
    }


    showControlRequirements(docId) {
        this.spinnerService.show();
        this.prevQuestions = [];
        this.description = null;
        this.controlRequirement.controlRequirementId = null;
        this.attachedQuestions = [];
        this._controlRequirementsServiceProxy.getControlRequirementListByAuthDocumentId(docId)
            .subscribe(result => {
                this.spinnerService.hide();
                this.controlRequirements = result;
            });
    }

    showSelectedQuestionsByCR(crid) {
        this.spinnerService.show();
        let found = false;
        this.controlRequirements.forEach(obj => {
            obj.controlRequirementList.forEach(c => {
                if (c.id == crid) {
                    found = true;
                    this.description = c.description;
                }
            });
        });

        if (!found) { this.description = null }

        this._externalAssessmentProxy.getExternalCRQuestions(this.controlRequirement.authoritativeDocumentId, this.controlRequirement.controlRequirementId)
            .subscribe(result => {
                this.prevQuestions = result.controlRequirement.externalRequirementQuestions.map(item => item.questionId);
                this.attachedQuestions = result.controlRequirement.externalRequirementQuestions;
                let prevItems = this.allQuestions;
                var array3 = result.controlRequirement.externalRequirementQuestions.filter(function (obj) { return prevItems.indexOf(obj) == -1; });
                if (array3.length > 0) {
                    array3.forEach(obj => {
                        let index = this.allQuestions.findIndex(q => q.questionId == obj.questionId);
                        this.allQuestions.splice(index, 1);
                    });
                }
                this.spinnerService.hide();
            });
    }

    save(): void {
        this.saving = true;
        this.controlRequirement.externalRequirementQuestions = this.attachedQuestions;
        this._externalAssessmentProxy
            .addOrUpdateExternalAssessmentCRQuestions(this.controlRequirement)
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


    saveCrQuestions() {
        if (this.attachedQuestions.length == 0) {
            abp.message.warn("Please select atleast once question to attach");
            return;
        }
        this.saving = true;
        this.controlRequirement.externalRequirementQuestions = this.attachedQuestions;
        this._externalAssessmentProxy
            .addOrUpdateExternalCRQuestions(this.controlRequirement)
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
        this.controlRequirements = [];
        this.authoritativeDocumentsLookUp = [];
        this.attachedQuestions = [];
        this.prevQuestions = [];
        this.allQuestions = [];
        this.description = null;
        this.controlRequirement = new CreateOrEditExternalAssessmentCRQuestionDto();
        this.crActive = false;
        this.etActive = false;
        this.modal.hide();
    }
}
