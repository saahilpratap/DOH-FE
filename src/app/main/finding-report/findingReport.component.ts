import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild,
    Injectable
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy, FindingReportServiceProxy, FindingReportType, ControlRequirementsServiceProxy, BusinessEntitiesServiceProxy, FindingReportClassificationDto, FindingReportClassificationsServiceProxy, CustomDynamicServiceProxy, DynamicNameValueDto } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import { ViewFindingReportModalComponent } from "./view-finding-report-modal.component";
import { CreateOrEditfindingReportModalComponent } from "./create-or-edit-findingReport-modal.component";

@Component({
    templateUrl: "./findingReport.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
@Injectable()
export class FindingReportsComponent extends AppComponentBase {
    @ViewChild("viewFindingReportModals", { static: true }) viewFindingReportModals: ViewFindingReportModalComponent;
    @ViewChild("createOrEditfindingReportModal", { static: true }) createOrEditfindingReportModal: CreateOrEditfindingReportModalComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    selectedRowData: any[];
    allDelete: boolean;
    auditprojectId: any;
    titleChange: boolean =true;
    categoryID: any;
    titleFilter: any;
    classificationId: any;
    criticalityId: any;
    criticalities: DynamicNameValueDto[];
    classificationsLookUp: FindingReportClassificationDto[] = [];
    exportButtonHide: boolean;
    constructor(
        injector: Injector,       
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _findingReportServiceProxy: FindingReportServiceProxy,
        private _classificationServiceProxy: FindingReportClassificationsServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy,
        private _router: Router
    ) {
        super(injector);
        this.initializeClassificationsLookUp();
        this.initializeCriticalities();
        this.categoryID = 0;
        this.classificationId = 0;
        this.criticalityId = 0;
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
    getFindingReports(event?: LazyLoadEvent) {
        this.isHeader();
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();
        this._findingReportServiceProxy
            .getAll(
                this.isInternal()
                    ? FindingReportType.Internal
                    : FindingReportType.External,
                this.auditprojectId,
                this.categoryID,
                this.classificationId,
                this.criticalityId,
                this.titleFilter,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount =
                    result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
                this.exportHide();
            });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createFindingReport(): void {
        let path = this.isInternal()
            ? "/app/main/findingReportings/findingReportings-internal/new"
            : "/app/main/findingReportings/findingReportings-external/new";
        this._router.navigate([path]);
    }

    editFindingReport(id: number): void {
        let path = this.isInternal()
            ? "/app/main/findingReportings/findingReportings-internal/new"
            : "/app/main/findingReportings/findingReportings-external/new";
        this._router.navigate([path], {
            queryParams: {
                id: id
            }
        });
    }

    hasCreatePermission(): boolean {
        return this.isInternal
            ? this.isGranted("Pages.HealthCareEntities.FindingReports.Create")
            : this.isGranted("Pages.AuditManagement.FindingReports.Create");
    }

    hasExportPermission(): boolean {
        return this.isInternal
            ? this.isGranted("Pages.HealthCareEntities.FindingReports.Export")
            : this.isGranted("Pages.AuditManagement.FindingReports.Export");
    }

    hasEditPermission(): boolean {
        return this.isInternal
            ? this.isGranted("Pages.HealthCareEntities.FindingReports.Edit")
            : this.isGranted("Pages.AuditManagement.FindingReports.Edit");
    }

    hasDeletePermission(): boolean {
        return this.isInternal
            ? this.isGranted("Pages.HealthCareEntities.FindingReports.Delete")
            : this.isGranted("Pages.AuditManagement.FindingReports.Delete");
    }

    hasViewPermission(): boolean {
        return this.isInternal
            ? this.isGranted("Pages.HealthCareEntities.FindingReports.View")
            : this.isGranted("Pages.AuditManagement.FindingReports.View");
    }

    isInternal(): boolean {
        return this._router.url.includes("internal");
    }
    

    exportToExcel(event): void {
        this._findingReportServiceProxy
            .getFindingReportToExcel(
                this.isInternal()
                    ? FindingReportType.Internal
                    : FindingReportType.External,
                this.auditprojectId,
                this.categoryID,
                this.classificationId,
                this.criticalityId,
                this.titleFilter,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
    isHeader() {
        var type = this.isInternal() ? FindingReportType.Internal
            : FindingReportType.External;
        if (type == 1) {
            this.titleChange = true;
        }
        else {
            this.titleChange = false;
        }

    }

    initializeClassificationsLookUp() {
        this._classificationServiceProxy.getAllForLookUp().subscribe(res => {
            this.classificationsLookUp = res;
        });
    }

    initializeCriticalities() {
        this._customDynamicService.getDynamicEntityDatabyName("Risk Critcality")
            .subscribe(res => {
                this.criticalities = res;
            });
    }

    exportHide() {
        if (this.primengTableHelper.totalRecordsCount == 0) {
            this.exportButtonHide = false;
        }
        else {
            this.exportButtonHide = true;
        }
    }
}
