import { Component, OnInit, Injector, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import { finalize } from 'rxjs/operators';
import { AfterModalComponent } from './after-modal/after-modal.component';
import { EscalationModalComponent } from './escalation-modal/escalation-modal.component';
import { BeforeModalComponent } from './before-modal/before-modal.component';
import { OnDayModalComponent } from './on-day-modal/on-day-modal.component';

import { AuthorityDepartmentsServiceProxy, ActionCategory, ActionTimeType, IdAndNameDto, WorkFlowServiceProxy, TemplateDto, StateApplicability, WorkFlowPageDto, CreateOrUpdateStateDto, GetContactForViewDto, BusinessEntityUserDto, AuthoritativeDocumentsServiceProxy, AuthoritativeDocumentDto, DynamicNameValueDto, CustomDynamicServiceProxy, BusinessEntitiesServiceProxy, CreateOrEditAuthorityDepartmentDto, ContactsServiceProxy, StateActionListDto } from "../../../shared/service-proxies/service-proxies";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { PrimengTableHelper } from '../../../shared/helpers/PrimengTableHelper';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'work-flow',
    templateUrl: './work-flow.component.html',
    styleUrls: ['./work-flow.component.css']
})
export class Work_FlowComponent extends AppComponentBase implements OnInit {

    @ViewChild('afterModal', { static: true }) afterModal: AfterModalComponent;
    @ViewChild('beforeModal', { static: true }) beforeModal: BeforeModalComponent;
    @ViewChild('escalationModal', { static: true }) escalationModal: EscalationModalComponent;
    @ViewChild('onDayModal', { static: true }) onDayModal: OnDayModalComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @Output() saveWorkFlow: EventEmitter<string[]> = new EventEmitter<string[]>();
    actionCategory = ActionCategory;
    actionTimeTypes = ActionTimeType;
    workflow: WorkFlowPageDto[] = [];
    active = false;
    saving = false;
    propertiesName: string[] = [];
    auditStatus: IdAndNameDto[] = [];
    auditStatusList: IdAndNameDto[] = [];
    assessmentStatus: IdAndNameDto[] = [];
    businessRiskStatus: IdAndNameDto[] = [];
    createworkFlow: CreateOrUpdateStateDto = new CreateOrUpdateStateDto();
    workFlow: any;
    actionTimeType: { id: number; name: string }[] = [];
    state: { id: number; name: String }[] = [];
    checked: boolean;
    selectedBtn: number;
    stateId: number;
    template: TemplateDto[] = [];
    filter: any;
    isFilter: any;
    constructor(injector: Injector, private _workFlowServiceProxy: WorkFlowServiceProxy,
        private _authorityDepartmentsServiceProxy: AuthorityDepartmentsServiceProxy,
        private _router: Router, private _activatedRoute: ActivatedRoute,
    ) {
        super(injector);
        this.primengTableHelper = new PrimengTableHelper();
        this.bindAuditStatus();
        this.assessmentStatus = this.bindEnumStatus(2);
        this.bindBusinessRisktatus();
    }
    ngOnInit() {
        this.isFilter = false;
        let stateParamId = Number(this._activatedRoute.snapshot.queryParams["id"]);
        this.propertiesName = [];
        if (stateParamId == 0) {
            this.initializeWorkFlow(this.createworkFlow.isStateOpen);
            this.getActionTypeTime();
            this.getState();
            this.createworkFlow.targetFiled = 0;
        }
        else {
            this.getActionTypeTime();
            this.getState();
            this._workFlowServiceProxy.getStateById(stateParamId).subscribe(res => {
                this.createworkFlow = res;
                this.stateId = this.createworkFlow.id;
                this.initializeWorkFlow(this.createworkFlow.isStateOpen);
                this.bindProperties(this.createworkFlow.workFlowPageId);
                this._workFlowServiceProxy.getStateActionList("", this.createworkFlow.id, "", 10, 0).subscribe(result => {
                    this.primengTableHelper.totalRecordsCount = result.totalCount;
                    this.primengTableHelper.records = result.items;
                    this.filterStatusByPage();
                });
            });
        }
    }


    filterStatusByPage() {
        if (this.createworkFlow.workFlowPageId == 2) {
            this.auditStatus = this.auditStatusList;
        }
        else if (this.createworkFlow.workFlowPageId == 6) {
            this.auditStatus = this.assessmentStatus;
        }
        else if (this.createworkFlow.workFlowPageId == 3) {
            this.auditStatus = this.businessRiskStatus;
        }
        else {
            this.createworkFlow.auditProjectStatus = 0;
        }
    }

    onWorkflowChange() {
        this.propertiesName = [];
        this.filterStatusByPage();
        this.bindProperties(this.createworkFlow.workFlowPageId);
    }

    bindProperties(stateId) {
        this._workFlowServiceProxy.getFilterFiledByStateId(stateId)
            .subscribe(res => {
                this.propertiesName = res;
            });
    }

    bindAuditStatus() {
        this._workFlowServiceProxy.getDynamicParameterStatusList('Audit Status')
            .subscribe(res => {
                this.auditStatusList = res;
            });
    }



    bindBusinessRisktatus() {
        this._workFlowServiceProxy.getDynamicParameterStatusList('Risk Status')
            .subscribe(res => {
                this.businessRiskStatus = res;
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

    getState() {
        this.state = [];
        for (var n in StateApplicability) {
            if (typeof StateApplicability[n] === 'number') {
                this.state.push({ id: <any>StateApplicability[n], name: n });
            }
        }
    }

    initializeWorkFlow(val: boolean) {
        this._authorityDepartmentsServiceProxy.getAllPages()
            .subscribe(res => {
                if (val) {
                    this.workflow = res.filter(x => x.pageName == 'Audit Project');
                }
                else {
                    this.workflow = res;

                }
            });
    }

    saveState() {
        this.active = true;
        this.saving = true;
        this._workFlowServiceProxy.createOrUpdateState(this.createworkFlow).subscribe(res => {
            this.stateId = res;
            this.message.success("Save sucessfully!")
        });
    }

    getAction(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();
        this._workFlowServiceProxy
            .getStateActionList(this.filter, this.stateId,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event)
            )
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    selectBtn(e) {
        this.selectedBtn = e;
    }
    back() {
        this._router.navigate(["/app/admin/grid-work-flows"]);
    }

    editStateAction(val: StateActionListDto) {
        if (val.actionCategory == 1) {
            this.beforeModal.show(this.stateId, val.id);
        } else if (val.actionCategory == 2) {
            this.onDayModal.show(this.stateId, val.id);
        } else if (val.actionCategory == 3) {
            this.afterModal.show(this.stateId, val.id);
        } else {
            this.escalationModal.show(this.stateId, val.id);
        }
    }

    deleteStateAction(val: StateActionListDto, event) {
        this.message.confirm("", this.l("AreYouSure"), isConfirmed => {
            if (isConfirmed) {
                this._workFlowServiceProxy.deleteStateAction(val.id).subscribe(res => {
                    this.message.success("Delete sucessfully!");
                    this.getAction(event);
                });
            }
        });

    }

    bindEnumStatus(val: number): any {
        this._workFlowServiceProxy.getEnumStatusList(val).subscribe(res => {
            this.assessmentStatus = res;
        });
    }
    onItemChange(event, id) {
        switch (id) {
            case 1: {
                this.createworkFlow.isStateOpen = true;
                this.isFilter = true;

                break;
            }
            case 2: {
                this.createworkFlow.isStateOpen = false;
                this.isFilter = false;
                break;
            }
        }
        this.initializeWorkFlow(this.createworkFlow.isStateOpen);
    }

}
