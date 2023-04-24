import { Component, OnInit, Injector, ViewChild, ViewEncapsulation, Input, } from "@angular/core";
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
import { finalize } from "rxjs/operators";
import { CreateScheduleModalComponent } from "../../create-schedule-modal.component";

@Component({
    selector: "grid-schedule-detail",
    templateUrl: "./grid-schedule-detail.component.html",
    styleUrls: ["./grid-schedule-detail.component.css"],
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.None,
})
export class GridScheduleDetailComponent extends AppComponentBase implements OnInit {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild("createScheduleModal", { static: true })
    createScheduleModals: CreateScheduleModalComponent;
    filterText = "";

    @Input('scheduleId') scheduleId: any;
    primengTableHelper: PrimengTableHelper;
    constructor(
        injector: Injector,
        private _assementScheduleAppService: AssementScheduleServiceProxy,
    ) {
        super(injector);
        this.primengTableHelper = new PrimengTableHelper();
        //this.primengTableHelper = new PrimengTableHelper();
    }

    ngOnInit() {

    }
    getData(event) {
        this.paginator.changePage(this.paginator.getPage());
        let a = event.id;
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._assementScheduleAppService
            .getAllScheduledDetailAssessments(
                this.filterText,
                a,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event)
            ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }
    getScheduledDetailAssessments(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._assementScheduleAppService
            .getAllScheduledDetailAssessments(
                this.filterText,
                this.scheduleId,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event)
            ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    deleteScheduleDetailAssessment(id) {
        this.message.confirm(
            "This action cant be irreversable. If Assements are Schduled it also gets deleted.",
            this.l("AreYouSure"),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._assementScheduleAppService
                        .deleteScheduledAssessmentDetails(id)
                        .subscribe((res) => {
                            this.notify.success(this.l("SuccessfullyDeleted"));
                            this.reloadPage();
                        });
                }
            }
        );
    }
}
