import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { AuthorityDepartmentsServiceProxy, ActionCategory, WorkFlowServiceProxy, CreateOrUpdateStateActionDto, TemplateDto, StateApplicability, WorkFlowPageDto, ActionTimeType, CreateOrUpdateStateDto, GetContactForViewDto, BusinessEntityUserDto, AuthoritativeDocumentsServiceProxy, AuthoritativeDocumentDto, DynamicNameValueDto, CustomDynamicServiceProxy, BusinessEntitiesServiceProxy, CreateOrEditAuthorityDepartmentDto, ContactsServiceProxy } from "../../../../shared/service-proxies/service-proxies";

@Component({
    selector: 'escalationModals',
    templateUrl: './escalation-modal.component.html',
    styleUrls: ['./escalation-modal.component.css']
})
export class EscalationModalComponent extends AppComponentBase implements OnInit {

    active = false;
    saving = false;

    template: TemplateDto[] = [];
    createAction: CreateOrUpdateStateActionDto = new CreateOrUpdateStateActionDto();
    actionTimeType: { id: number; name: string }[] = [];

    @ViewChild('escalationModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    constructor(_injector: Injector, private _workFlowServiceProxy: WorkFlowServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {
        this.getTemplate();
        this.getActionTypeTime();
    }

    show(stateId: number, actionId: number) {
        if (stateId != undefined && stateId != 0) {
            if (actionId != 0) {
                this.createAction.stateId = stateId;
                this.createAction.actionCategory = ActionCategory.Escalation;
                this._workFlowServiceProxy.getStateActionById(actionId).subscribe(res => {
                    this.createAction = res;
                    this.active = true;
                    this.modal.show();
                });
            } else {
                this.createAction.stateId = stateId;
                this.createAction.actionCategory = ActionCategory.Escalation;
                this.active = true;
                this.modal.show();
            }
        }
        else {
            this.message.info("Please Save State Information!")
        }
    }

    onShown(): void {

    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    getTemplate() {
        this._workFlowServiceProxy.getAllTemplate().subscribe(res => {
            this.template = res;
        });
    }

    getActionTypeTime() {
        this.actionTimeType = [];
        for (var n in ActionTimeType) {
            if (typeof ActionTimeType[n] === 'number') {
                this.actionTimeType.push({ id: <any>ActionTimeType[n], name: n });
            }
        }
    }

    save(): void {
        this._workFlowServiceProxy.creteOrUpdateStateAction(this.createAction).subscribe(res => {
            this.message.success("Save SucessFully!");
            this.createAction = new CreateOrUpdateStateActionDto();
            this.close();
            this.modalSave.emit(null);
        });
    }
}

