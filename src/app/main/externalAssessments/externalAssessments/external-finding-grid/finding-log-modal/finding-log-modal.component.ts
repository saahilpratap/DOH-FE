import {Component, ViewChild, Injector, Output, EventEmitter, OnInit} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import * as moment from "moment";
import { AppSessionService } from "@shared/common/session/app-session.service";
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from "primeng/public_api";
import { FindingReportServiceProxy } from "@shared/service-proxies/service-proxies";


@Component({
    selector: "findingLogModal",
    templateUrl: "./finding-log-modal.component.html",
    styleUrls: ["./finding-log-modal.component.css"]
})
export class FindingLogModalComponent extends AppComponentBase
    implements OnInit {
    @ViewChild("gridViewModal", { static: true }) modal: ModalDirective;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    active = false;
    saving = false;
    selectedRowData: any[];
    advancedFiltersAreShown = false;
    filterText = "";
    exportButtonHide: boolean;
    exceptionPermission: boolean;
    auditprojectId: number;
    constructor(
        injector: Injector,      
        private _appSessionService: AppSessionService,
        private _findingReportServiceProxy: FindingReportServiceProxy,
    ) {
        super(injector);
     

    }

    ngOnInit(): void {      
      
    }


    show(Id?: number,): void {     
        this.active = true;
        this.auditprojectId = Id;
        this.modal.show();
    }

    getFindinglog(event?: LazyLoadEvent) {

        
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        this._findingReportServiceProxy
            .getAllFindingLogs(this.auditprojectId, this.filterText,
              null,0,100              
               ).subscribe(result => {
                    this.primengTableHelper.totalRecordsCount = result.totalCount;
                    this.primengTableHelper.records = result.items;
                    this.primengTableHelper.hideLoadingIndicator();

                });

    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
