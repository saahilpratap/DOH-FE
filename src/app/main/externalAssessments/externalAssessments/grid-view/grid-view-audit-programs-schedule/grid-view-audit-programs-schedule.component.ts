import { Component, OnInit, Injector, ViewChild, ViewEncapsulation, Output, EventEmitter, } from "@angular/core";
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
import { ExtAssementScheduleServiceProxy } from "../../../../../../shared/service-proxies/service-proxies";
import { ExternalAssessmentsComponent } from "../../externalAssessments.component";
import { CreateExtScheduleModalComponent } from "../../ext-schedule/create-ext-schedule-modal.component";
import { ScheduleDetailModalComponent } from "../schedule-detail-modal/schedule-detail-modal.component";

@Component({
    selector: "grid-view-audit-programs-schedule",
    templateUrl: "./grid-view-audit-programs-schedule.component.html",
    styleUrls: ["./grid-view-audit-programs-schedule.component.css"],
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.None,
})
export class GridViewAuditProgramsScheduleComponent extends AppComponentBase implements OnInit {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    @Output() showSchedules = new EventEmitter<string>();
    @ViewChild('createExtScheduleModal', { static: true }) createExtScheduleModals: CreateExtScheduleModalComponent;
    @ViewChild('externalAssessments', { static: true }) externalAssessments: ExternalAssessmentsComponent;
    @ViewChild('ScheduleDetailModals', { static: true }) ScheduleDetailModals: ScheduleDetailModalComponent;

    

    schedulePrimengTableHelper: PrimengTableHelper;
    filterText = '';

    constructor(
        injector: Injector,
        private _assementScheduleAppService: ExtAssementScheduleServiceProxy
    ) {
        super(injector);
        this.schedulePrimengTableHelper = new PrimengTableHelper();
    }

    ngOnInit() {

    }

    getScheduledAssessments(event?: LazyLoadEvent, loadTable?: boolean) {
        if (loadTable == false) {
            if (this.schedulePrimengTableHelper.shouldResetPaging(event)) {
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
        //this.schedulePrimengTableHelper.showLoadingIndicator();
        this._assementScheduleAppService.getAllScheduledAssessments(this.filterText, undefined,
            this.schedulePrimengTableHelper.getSorting(this.dataTable),
            this.schedulePrimengTableHelper.getMaxResultCount(this.paginator, event),
            this.schedulePrimengTableHelper.getSkipCount(this.paginator, event))
            .subscribe(result => {
                this.schedulePrimengTableHelper.totalRecordsCount = result.totalCount;
                this.schedulePrimengTableHelper.records = result.items;
                //this.schedulePrimengTableHelper.hideLoadingIndicator();


            });
    }

    deleteScheduleAssessment(id) {

        this.message.confirm('This action cant be irreversable', this.l('AreYouSure'), isConfirmed => {
            if (isConfirmed) {
                this._assementScheduleAppService.deleteScheduledAssessment(id).subscribe(res => {
                    this.getScheduledAssessments(undefined, true);
                    this.notify.success(this.l('SuccessfullyDeleted'));
                });
            }
        });
    }
    showAllSchedulesDetails(e) {
        this.showSchedules.next(e);
    }
    deleteScheduleDetailAssessment(id) {
        this.message.confirm('This action cant be irreversable. If Assements are Schduled it also gets deleted.', this.l('AreYouSure'), isConfirmed => {
            if (isConfirmed) {
                this._assementScheduleAppService.deleteScheduledAssessmentDetails(id).subscribe(res => {                   
                    this.notify.success(this.l('SuccessfullyDeleted'));
                });
            }
        });
    }
}
