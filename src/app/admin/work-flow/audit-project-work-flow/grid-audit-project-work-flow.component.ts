import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuditProjectWorkFlowModalComponent } from './audit-project-work-flow-modal/audit-project-work-flow-modal.component';


@Component({
    selector: 'grid-audit-project-work-flow',
    templateUrl: './grid-audit-project-work-flow.component.html',
    styleUrls: ['./grid-audit-project-work-flow.component.scss']
})
export class GridAuditProjectWorkFlowComponent extends AppComponentBase implements OnInit {
    @ViewChild('auditProjectWorkFlowModals', { static: true }) auditProjectWorkFlowModals: AuditProjectWorkFlowModalComponent;
    @Output() bulkEditEvent = new EventEmitter();
    selectedRowData: any[];
    auditProjectWorkFlow: Array<any> = [];
    display: boolean;
    @Input('editOrgID') OrgId: any;
    @Input('showPopup') showPopupBtn: boolean;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    constructor(_injector: Injector,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {
    }
    getAuditProjectWorkFlow(event?: LazyLoadEvent) {
        this.auditProjectWorkFlow = [
            { id: 'APW-1', name: 'Procure to Pay ', owner: '-', comName: 'Asian Technologies Limited', status: 'In Production', },
            { id: 'APW-2', name: 'Procure to Pay ', owner: '-', comName: 'Asian Technologies Limited', status: 'In Production', },
            { id: 'APW-3', name: 'Procure to Pay ', owner: '-', comName: 'Asian Technologies Limited', status: 'In Production', },
            { id: 'APW-4', name: 'Procure to Pay ', owner: '-', comName: 'Asian Technologies Limited', status: 'In Production', },
            { id: 'APW-5', name: 'Procure to Pay ', owner: '-', comName: 'Asian Technologies Limited', status: 'In Production', },
            { id: 'APW-6', name: 'Procure to Pay ', owner: '-', comName: 'Asian Technologies Limited', status: 'In Production', },
        ];
        this.primengTableHelper.totalRecordsCount = this.auditProjectWorkFlow.length;
        this.primengTableHelper.records = this.auditProjectWorkFlow;
    }
    onSelectionChange(selection: any[]) {
        if (selection.length >= 2) {
            this.bulkEditEvent.emit(true);
        }
        else if (selection.length <= 1) {
            this.bulkEditEvent.emit(false);
        }
    }
    addEditPage() {

    }
}
