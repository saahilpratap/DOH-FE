import { Component, OnInit, Injector, ViewChild, ViewEncapsulation, Input, Output, EventEmitter, } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { Router } from "@angular/router";
import * as moment from "moment";
import * as _ from "lodash";
import { PrimengTableHelper } from "../../../../../shared/helpers/PrimengTableHelper";
import { AssementScheduleServiceProxy } from "../../../../../shared/service-proxies/service-proxies";
import { CreateScheduleModalComponent } from "../../create-schedule-modal.component";

@Component({
    selector: "grid-assessments-schedule",
    templateUrl: "./grid-assessments-schedule.component.html",
    styleUrls: ["./grid-assessments-schedule.component.css"],
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.None,
})
export class GridAssessmentsScheduleComponent extends AppComponentBase implements OnInit {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    primengTableHelper: PrimengTableHelper;
    @Input('scheduleId') scheduleId: any;
    @Output() showSchedules = new EventEmitter<string>();
    @ViewChild("createScheduleModal", { static: true })
    createScheduleModals: CreateScheduleModalComponent;
    filterText = "";
    constructor(
        injector: Injector,
        private _assementScheduleAppService: AssementScheduleServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {

    }
    scheduleSave() {
        this.reloadPage();
    }
    reloadPage(): void {       
        this.paginator.changePage(this.paginator.getPage());
    }
    getScheduledAssessments(event?: LazyLoadEvent, loadTable?: boolean) {
        if (loadTable == false) {
            if (this.primengTableHelper.shouldResetPaging(event)) {
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
        this.primengTableHelper.showLoadingIndicator();
        this._assementScheduleAppService
            .getAllScheduledAssessments(
                this.filterText,
                this.scheduleId,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(
                    this.paginator,
                    event
                ),
                this.primengTableHelper.getSkipCount(this.paginator, event)
            )
            .subscribe((result) => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    showAllSchedulesDetails(e) {
        this.showSchedules.next(e);
    }
    deleteScheduleAssessment(id) {
        this.message.confirm(
            "This action cant be irreversable",
            this.l("AreYouSure"),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._assementScheduleAppService
                        .deleteScheduledAssessment(id)
                        .subscribe((res) => {
                            this.reloadPage();
                            this.notify.success(this.l("SuccessfullyDeleted"));
                        });
                }
            }
        );
    }
}
