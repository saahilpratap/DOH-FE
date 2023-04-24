import { Component, OnInit, Output, Injector, ViewChild, Input, ElementRef, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { AuthorityDepartmentsServiceProxy, ActionCategory, CreateOrUpdateStateActionDto, WorkFlowServiceProxy, TemplateDto, StateApplicability, WorkFlowPageDto, ActionTimeType, CreateOrUpdateStateDto, GetContactForViewDto, BusinessEntityUserDto, AuthoritativeDocumentsServiceProxy, AuthoritativeDocumentDto, DynamicNameValueDto, CustomDynamicServiceProxy, BusinessEntitiesServiceProxy, CreateOrEditAuthorityDepartmentDto, ContactsServiceProxy } from "../../../../shared/service-proxies/service-proxies";
import { LazyLoadEvent } from 'primeng/public_api';
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";

@Component({
    selector: 'beforeModals',
    templateUrl: './before-modal.component.html',
    styleUrls: ['./before-modal.component.css']
})
export class BeforeModalComponent extends AppComponentBase implements OnInit {

    active = false;
    saving = false;

    @ViewChild('beforeModal', { static: true }) modal: ModalDirective;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    template: TemplateDto[] = [];
    createAction: CreateOrUpdateStateActionDto = new CreateOrUpdateStateActionDto();
    actionTimeType: { id: number; name: string }[] = [];
   
    constructor(_injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _workFlowServiceProxy: WorkFlowServiceProxy,
        private _router: Router,
    ) {
        super(_injector);      
    }

    ngOnInit()
    {
        this.getTemplate();
        this.getActionTypeTime();
    }

    getTemplate()
    {
        this._workFlowServiceProxy.getAllTemplate().subscribe(res => {
            this.template = res;
        });
    }

    show(stateId: number, actionId: number) {
        if (stateId != undefined && stateId != 0) {
            if (actionId != 0) {
                this.createAction.stateId = stateId;
                this.createAction.actionCategory = ActionCategory.Before;
                this._workFlowServiceProxy.getStateActionById(actionId).subscribe(res => {
                    this.createAction = res;
                    this.active = true;
                    this.modal.show();
                });               
            } else {
                this.createAction.stateId = stateId;
                this.createAction.actionCategory = ActionCategory.Before;
                this.active = true;
                this.modal.show();
            }         
        }
        else {
            this.message.info("Please Save State Information!")
        }
    }

    onShown(): void
    {

    }

    close(): void {
        this.active = false;
        this.modal.hide();
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
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

   
}
