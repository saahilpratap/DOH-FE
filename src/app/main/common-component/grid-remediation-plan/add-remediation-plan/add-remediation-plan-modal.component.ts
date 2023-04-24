import { Injectable, Component, ViewChild, Output, EventEmitter, Injector, OnInit } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { ModalDirective } from "ngx-bootstrap";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { finalize } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { LazyLoadEvent } from "primeng/public_api";
import { RemediationServiceProxy} from "@shared/service-proxies/service-proxies";

@Component({
    selector: "addRemediationPlanModals",
    templateUrl: "./add-remediation-plan-modal.component.html", 
})
@Injectable()
export class AddRemediationPlanModalComponent extends AppComponentBase
    implements OnInit {
    @ViewChild("addRemediationPlanModal", { static: true }) modal: ModalDirective;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
   
   

   
    constructor(
        injector: Injector,private _remediationServiceProxy: RemediationServiceProxy,) {
        super(injector);
    }
    active = false;
    saving = false;
    filterText = "";
    selectedRowData: any[];
    ngOnInit() {

    }
    show(e): void {
        
        this.active = true;
        this.modal.show();
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
onSelectionChange(selection: any[]) {
        
    }
 remediationPlans(event?: LazyLoadEvent) {        
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();        
        this._remediationServiceProxy
            .getRemediationList(0,
                this.filterText,
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
    save() {

    }
}
