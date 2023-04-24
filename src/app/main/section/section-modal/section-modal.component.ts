import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
declare var $;
import { SectionServiceProxy, SectionRelatedQuestionDto, TokenAuthServiceProxy, SectionQuestionDto, QuestionGroupDto, QuestionsServiceProxy, ExternalRequirementQuestionDto} from "../../../../shared/service-proxies/service-proxies";

@Component({
    selector: 'SectionModals',
    templateUrl: './section-modal.component.html',
    styleUrls: ['./section-modal.component.css']
})
export class SectionModalComponent extends AppComponentBase {
    active = false;
    saving = false;
    @ViewChild('SectionModal', { static: true }) modal: ModalDirective;
    businessEntitiesLookUp: any;
    groupedEntities: any;
    sectionCreate: SectionQuestionDto = new SectionQuestionDto();
    allExternalQuestions: ExternalRequirementQuestionDto[] = [];
    attachedExternalQuestions: ExternalRequirementQuestionDto[] = [];
    id: any;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    constructor(_injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _questionsServiceProxy: QuestionsServiceProxy,
        private _sectionServiceProxy: SectionServiceProxy,
        private _router: Router,
    ) {
        super(_injector);
        this.sectionCreate = new SectionQuestionDto();
    }

    show(id: number) {
        
        this.id = id;
        if (id == undefined) {
            this.sectionCreate = new SectionQuestionDto();
            this.initializeExternalQuestions();
          
        }
        else {
            this.spinnerService.show();
            this._sectionServiceProxy.getSectionQuestionForEdit(this.id).subscribe(result => {

                this.spinnerService.hide();
                this.sectionCreate = result;
                this.initializeExternalQuestions();
            }, error => {
                this.spinnerService.hide();
            });
        }
        this.active = true;
        this.modal.show();
    }


    initializeExternalQuestions()
    {
        
        this.allExternalQuestions = [];
        this.attachedExternalQuestions = [];
        this._questionsServiceProxy.getAllExternalQuestions("", undefined, 1000, 0).subscribe(res => {
            res.items.forEach(obj => {
                let item = new ExternalRequirementQuestionDto();
                item.questionId = obj.id;
                item.questionDescription = obj.description;
                this.allExternalQuestions.push(item);
            });
            if (this.id > 0) {
                this.sectionCreate.sectionQuestions.forEach(q => {
                    let item = this.allExternalQuestions.filter(e => e.questionId == q.externalAssessmentQuestionId);
                    if (item.length > 0) {
                        this.attachedExternalQuestions.push(item[0]);
                    }
                });

                this.sectionCreate.sectionQuestions.forEach(q => {
                    let item = this.attachedExternalQuestions.filter(e => e.questionId == q.externalAssessmentQuestionId);
                    if (item.length > 0) {
                        this.allExternalQuestions.splice(this.allExternalQuestions.findIndex(a => a.questionId == item[0].questionId), 1);
                    }
                });
            }
        });
    }
  

    close(): void {
        this.active = false;
        this.modal.hide();
    }


    save() {

        this.sectionCreate.sectionQuestions = [];
       
        if (this.attachedExternalQuestions.length == 0) {
            this.saving = false;
            this.message.warn("Please Select Questions to Add in Group");
            return;
        }

        this.attachedExternalQuestions.forEach(q => {
            let question = new SectionRelatedQuestionDto();
            question.id = 0;
            question.externalAssessmentQuestionId = q.questionId;
            this.sectionCreate.sectionQuestions = this.sectionCreate.sectionQuestions == undefined ? [] : this.sectionCreate.sectionQuestions;
            this.sectionCreate.sectionQuestions.push(question);
        });

        this.sectionCreate.tenantId = this.appSession.tenantId;
        this.saving = true;
        this.spinnerService.show();
        this._sectionServiceProxy.addOrUpdateSection(this.sectionCreate).subscribe(res => {
           
            this.saving = false;
            this.spinnerService.hide();
            this.modalSave.emit(null);
            this.close();         
        }, error => {
            this.saving = false;
            this.spinnerService.hide();
        });
    }
 
}
