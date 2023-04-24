import { Component, OnInit, Injector, ViewChild, ViewEncapsulation, } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { Router } from "@angular/router";
import * as moment from "moment";
import * as _ from "lodash";
import { PrimengTableHelper } from "../../../../../../shared/helpers/PrimengTableHelper";
import { AssementScheduleServiceProxy } from "../../../../../../shared/service-proxies/service-proxies";

@Component({
    selector: "grid-view-schedule-detail",
    templateUrl: "./grid-view-schedule-detail.component.html",
    styleUrls: ["./grid-view-schedule-detail.component.css"],
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.None,
})
export class GridViewScheduleDetailComponent extends AppComponentBase implements OnInit {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    scheduleDetailPrimengTableHelper: PrimengTableHelper;
    filterText = "";
    scheduleId: number;

    constructor(
        injector: Injector,
        private _assementScheduleAppService: AssementScheduleServiceProxy,
    ) {
        super(injector);
        this.scheduleDetailPrimengTableHelper = new PrimengTableHelper();

    }

    ngOnInit() {

    }

    getScheduledDetailAssessments(event?: any, loadTable?: boolean) {
        if (loadTable == false) {
            if (this.scheduleDetailPrimengTableHelper.shouldResetPaging(event)) {
                this.paginator.changePage(0);
                return;
            }
        }
        if (event != undefined) {
            this.dataTable._sortOrder = event.sortOrder;
            this.dataTable._sortField = event.sortField;
            this.dataTable.sortField = event.sortField;
            this.dataTable.sortOrder = event.sortOrder;
        }
        this.scheduleDetailPrimengTableHelper.showLoadingIndicator();
        this._assementScheduleAppService
            .getAllScheduledDetailAssessments(
                this.filterText,
                this.scheduleId,
                this.scheduleDetailPrimengTableHelper.getSorting(this.dataTable),
                this.scheduleDetailPrimengTableHelper.getMaxResultCount(
                    this.paginator,
                    event
                ),
                this.scheduleDetailPrimengTableHelper.getSkipCount(
                    this.paginator,
                    event
                )
            )
            .subscribe((result) => {
                this.scheduleDetailPrimengTableHelper.totalRecordsCount =
                    result.totalCount;
                this.scheduleDetailPrimengTableHelper.records = result.items;
                this.scheduleDetailPrimengTableHelper.hideLoadingIndicator();
            });
    }
}
