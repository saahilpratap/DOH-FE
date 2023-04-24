import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { AuditProjectCloneServiceProxy, GetRestrictedEntitiesOutputDto, InnerDto, CreateCloneAuditProjectDto } from '../../../../../shared/service-proxies/service-proxies';
import { CloneSelectModelComponent } from './clone-select-modal.component';

@Component({
    selector: 'CloneOneModals',
    templateUrl: './clone-one-modal.component.html',
    styleUrls: ['./clone-one-modal.component.css']
})
export class CloneOneModelComponent extends AppComponentBase {

    active = false;
    saving = false;
    btncopyToChild: boolean;
    data: GetRestrictedEntitiesOutputDto = new GetRestrictedEntitiesOutputDto();
    datainput: CreateCloneAuditProjectDto = new CreateCloneAuditProjectDto();
    questionaryGeneratedExternalAssessmentInfo: InnerDto = new InnerDto();
    @ViewChild('CloneSelectModals', { static: true }) CloneSelectModals: CloneSelectModelComponent;

    @ViewChild('CloneOneModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    assessmentSubmission: any;
    selectedRowData: any[];
    questionaryGenerated: boolean = false;
    auditProjectId: number;
    code: string = "";


    constructor(_injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _auditProjectClone: AuditProjectCloneServiceProxy,
    ) {
        super(_injector);
    }

    show(apId: number, code: string): void {
        this.auditProjectId = apId;
        this.code = code;
        this._auditProjectClone.getRestrictedEntities(this.auditProjectId)
            .subscribe((result) => {
                this.data = result;
                this.datainput.validEntitiesList = result.validEntitiesList;

                this.datainput.apId = this.auditProjectId;
                this.auditProjectId = this.auditProjectId;
                this.active = true;
                this.modal.show();
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    save() {
        this.questionaryGeneratedExternalAssessmentInfo = this.data.allEntitiesList.find(x => x.hasQuestionaireGenerated == true);
        var isExist = this.data.validEntitiesList.find(x => x.hasQuestionaireGenerated == true);

        if (this.questionaryGeneratedExternalAssessmentInfo != undefined) {
            this.datainput.old_EAId = this.questionaryGeneratedExternalAssessmentInfo.externalAssessmentId;
            this.datainput.old_EAFlag = this.questionaryGeneratedExternalAssessmentInfo.hasQuestionaireGenerated;
        }
        else {
            this.datainput.old_EAId = 0;
            this.datainput.old_EAFlag = false;
        }

        if (isExist != undefined) {
            this.questionaryGenerated = true;
        }
        else {
            this.questionaryGenerated = false;
        }

        this.datainput.new_EAFlag = this.questionaryGenerated;

        if (this.questionaryGenerated) {
            this.active = true;
            this.saving = true;
            this._auditProjectClone.getCloneForAuditProject(this.datainput.apId, this.datainput.validEntitiesList,
                0, this.datainput.old_EAId, this.datainput.old_EAFlag, this.datainput.new_EAFlag)
                .subscribe(result => {
                    this._auditProjectClone.createAuditProjectClone(result)
                        .subscribe(result1 => {
                            this.active = false;
                            this.saving = false;
                            this.notify.success(this.l('Clone of Audit Project Done'));
                            this.modalSave.emit(null);
                            this.modal.hide();
                        });
                });

        }
        else {
            if (this.questionaryGeneratedExternalAssessmentInfo != undefined) {
                this.active = false;
                this.modal.hide();
                this.CloneSelectModals.show(this.datainput);
            }
            else {
                this._auditProjectClone.getCloneForAuditProject(this.datainput.apId, this.datainput.validEntitiesList,
                    0, this.datainput.old_EAId, this.datainput.old_EAFlag, this.datainput.new_EAFlag)
                    .subscribe(result => {
                        this._auditProjectClone.createAuditProjectClone(result)
                            .subscribe(result1 => {
                                this.active = false;
                                this.saving = false;
                                this.notify.success(this.l('Clone of Audit Project Done'));
                                this.modalSave.emit(null);
                                this.modal.hide();
                            });
                    });
            }
        }


    }
    goBack() {
        this.modalSave.emit(null);
    }

}
