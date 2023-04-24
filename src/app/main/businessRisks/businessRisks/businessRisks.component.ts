import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
    BusinessRisksServiceProxy,
    BusinessRiskDto
} from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy } from "@shared/service-proxies/service-proxies";
import { ViewBusinessRiskModalComponent } from "./view-businessRisk-modal.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import * as moment from "moment";

@Component({
    templateUrl: "./businessRisks.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class BusinessRisksComponent extends AppComponentBase {
    @ViewChild("viewBusinessRiskModalComponent", { static: true }) viewBusinessRiskModal: ViewBusinessRiskModalComponent;   
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    selectedRowData: any[];
    allDelete: boolean;
    advancedFiltersAreShown = false;
    filterText = "";
    titleFilter = "";
    maxIdentificationDateFilter: moment.Moment;
    minIdentificationDateFilter: moment.Moment;
    vulnerabilityFilter = "";
    remediationPlanFilter = "";
    maxExpectedClosureDateFilter: moment.Moment;
    minExpectedClosureDateFilter: moment.Moment;
    maxCompletionDateFilter: moment.Moment;
    minCompletionDateFilter: moment.Moment;
    isRemediationCompletedFilter = -1;

    constructor(
        injector: Injector,
        private _businessRisksServiceProxy: BusinessRisksServiceProxy,
        private _router: Router,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getBusinessRisks(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._businessRisksServiceProxy
            .getAll(
                this.filterText,
                this.titleFilter,
                this.maxIdentificationDateFilter,
                this.minIdentificationDateFilter,
                this.vulnerabilityFilter,
                this.remediationPlanFilter,
                this.maxExpectedClosureDateFilter,
                this.minExpectedClosureDateFilter,
                this.maxCompletionDateFilter,
                this.minCompletionDateFilter,
                this.isRemediationCompletedFilter,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }
    onSelectionChange(selection: any[]) {
        if (selection.length >= 2) {
            this.allDelete = true;
        }
        else if (selection.length <= 1) {
            this.allDelete = false;
        }
    }
    deleteAllRecord() {
        this.message.confirm("", this.l("AreYouSure"), isConfirmed => {
            if (isConfirmed) {

            }
        });
    }
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createBusinessRisk() {
        this._router.navigate(["/app/main/businessRisks/businessRisks/new"]);
    }

    editBusinessRisk(businessRiskId: any) {
        this._router.navigate(["/app/main/businessRisks/businessRisks/new"], {
            queryParams: {
                businessRiskId: businessRiskId
            }
        });
    }

    deleteBusinessRisk(businessRisk: BusinessRiskDto): void {
        this.message.confirm("You Want To Delete This Record", this.l("AreYouSure"), isConfirmed => {
            if (isConfirmed) {
                this._businessRisksServiceProxy
                    .delete(businessRisk.id)
                    .subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l("SuccessfullyDeleted"));
                    });
            }
        });
    }

    exportToExcel(): void {
        this._businessRisksServiceProxy
            .getBusinessRisksToExcel(
                this.filterText,
                this.titleFilter,
                this.maxIdentificationDateFilter,
                this.minIdentificationDateFilter,
                this.vulnerabilityFilter,
                this.remediationPlanFilter,
                this.maxExpectedClosureDateFilter,
                this.minExpectedClosureDateFilter,
                this.maxCompletionDateFilter,
                this.minCompletionDateFilter,
                this.isRemediationCompletedFilter
            )
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
}
