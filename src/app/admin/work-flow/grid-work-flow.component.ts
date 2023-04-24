import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import { finalize } from 'rxjs/operators';
import { ActionCategory, ActionTimeType, TemplateDto, WorkFlowPageDto, WorkFlowServiceProxy,} from "../../../shared/service-proxies/service-proxies";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { PrimengTableHelper } from '../../../shared/helpers/PrimengTableHelper';
import { Router } from '@angular/router';

@Component({
    selector: 'grid-work-flow',
    templateUrl: './grid-work-flow.component.html',
    styleUrls: ['./grid-work-flow.component.css']
})
export class GridWorkFlowComponent extends AppComponentBase implements OnInit {

    workFlow: any;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    type = [{ lable: 'Email Notification', value: '0' }, { lable: 'Field Update', value: '1' }]
    typeId: string;
    constructor(injector: Injector, private _router: Router, private _workflowService: WorkFlowServiceProxy) {
        super(injector);
        this.primengTableHelper = new PrimengTableHelper();
    }    

    ngOnInit()
    {
        this.typeId = '0';
    }

    getStateList(event?: LazyLoadEvent) {
        //if (this.primengTableHelper.shouldResetPaging(event)) {
        //    this.paginator.changePage(0);
        //    return;
        //}

        this.primengTableHelper.showLoadingIndicator();
        this._workflowService.getAllStates(this.typeId)
            .subscribe(result => {
                    this.primengTableHelper.totalRecordsCount = result.length;
                this.primengTableHelper.records = result;
                    this.primengTableHelper.hideLoadingIndicator();
                });
        }  
   

    getWorkFlow(event?: LazyLoadEvent) {
        this.workFlow = [
            { pageName: '', type: '', state: '', deadline: '', isActive:'' },
            { pageName: '', type: '', state: '', deadline: '', isActive: '' },
        ];
        this.primengTableHelper.totalRecordsCount = this.workFlow.length;
        this.primengTableHelper.records = this.workFlow;
    }

    createWorkFlow() {
        this._router.navigate(['/app/admin/work-flow'], {
            queryParams: {
                id: 0
            },
        });
    }

    editWorkFlow(val) {
        this._router.navigate(['/app/admin/work-flow'], {
            queryParams: {
                id: val
            },
        });
    }

    deleteWorkFlow(val) {  
        this.message.confirm("", this.l("AreYouSure"), isConfirmed => {
            if (isConfirmed) {
                this._workflowService.deleteState(val).subscribe(res => {
                    this.message.success("Delete sucessfully!");
                    this.getStateList();

                });
            }
        });
    }
    initializeTypeField(val: string) {
        this.typeId = val;
        this.getStateList();

    }
    
}
