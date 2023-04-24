import { Component, ViewEncapsulation, OnInit, Injector, ViewChild, Input, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { RemediationServiceProxy, ExternalAssessmentsServiceProxy } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';

@Component({
    selector: 'grid-audit-work-paper-information',
    templateUrl: "./grid-audit-work-paper-information.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class GridAuditWorkPaperInformationComponent extends AppComponentBase {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    workPaperTableHelper: PrimengTableHelper;
    constructor(_injector: Injector,
        private _externalAssessmentService: ExternalAssessmentsServiceProxy,
        private _router: Router,
    ) {
        super(_injector);
        this.primengTableHelper = new PrimengTableHelper();
    }

    ngOnInit() {

    }
    getData(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        this.primengTableHelper.totalRecordsCount = 0;
        this.primengTableHelper.records = []; 
    }
   
}
