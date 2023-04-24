import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { AuditProjectCloneServiceProxy, GetRestrictedEntitiesOutputDto, InnerDto, CreateCloneAuditProjectDto } from '../../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'CloneSelectModals',
    templateUrl: './clone-select-modal.component.html',
    styleUrls: ['./clone-select-modal.component.css']
})
export class CloneSelectModelComponent extends AppComponentBase {

    active = false;
    saving = false;
    btncopyToChild: boolean;
    data: CreateCloneAuditProjectDto = new CreateCloneAuditProjectDto();
    selectedExternalAssessmentId: number;
    auditProjectId: number;
    @ViewChild('CloneSelectModal', { static: true }) modal: ModalDirective;
    assessmentSubmission: any;
    selectedRowData: any[];
    questionaryGenerated: boolean = false;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();


    constructor(_injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _auditProjectClone: AuditProjectCloneServiceProxy,
    ) {
        super(_injector);
    }

    show(para: CreateCloneAuditProjectDto): void {
        this.data = para;
        this.auditProjectId = para.apId;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    save() {
        var selectObj = this.data.validEntitiesList.find(x => x.externalAssessmentId == this.selectedExternalAssessmentId);
        if (selectObj != undefined) {
            this.data.new_EAId = selectObj.externalAssessmentId;
        }

        this.active = true;
        this.saving = true;

        this._auditProjectClone.getCloneForAuditProject(this.data.apId, this.data.validEntitiesList,
            this.data.new_EAId, this.data.old_EAId, this.data.old_EAFlag, this.data.new_EAFlag)
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
