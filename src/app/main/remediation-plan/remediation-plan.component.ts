import { Component, ViewEncapsulation, OnInit, Injector, ViewChild, Input, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { RemediationServiceProxy } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';

@Component({
    selector: 'remediation-plan',
    templateUrl: "./remediation-plan.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class RemediationPlanComponent extends AppComponentBase {
    remediationPlansDetail: Array<any> = [];
    display: boolean;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    filterText = "";

    itemList = [];
    selectedItems = [];
    settings = {};


    constructor(_injector: Injector,
        private _remediationServiceProxy: RemediationServiceProxy,
        private _changeDetector: ChangeDetectorRef,
        private _router: Router,
    ) {
        super(_injector);
        this.primengTableHelper = new PrimengTableHelper();
    }

    ngOnInit() {

    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    remediationPlans(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();
        this._remediationServiceProxy
            .getRemediationList(0,this.filterText,
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

    addEditPage() {

    }

    editremedition(remediationId: any, buttonStatus?: any) {
        this._router.navigate(['/app/main/create-edit-remediation-plan'], {
            queryParams: {
                remediationId: remediationId,
                buttonStatus: buttonStatus
            }
        });
    }

    removeremediation(Id) {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), isConfirmed => {
            if (isConfirmed) {
                this._remediationServiceProxy
                    .removeRemediation(Id)
                    .subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l("SuccessfullyDeleted"));
                    });
            }
        });
        // this._remediationServiceProxy.removeRemediation(Id)
    }

    createRemediationPlan(): void {
        this._router.navigate(['/app/main/create-edit-remediation-plan']);
    }
}
