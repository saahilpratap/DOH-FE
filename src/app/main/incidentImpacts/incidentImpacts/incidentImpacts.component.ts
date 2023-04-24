import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy, IncidentImpactsServiceProxy, IncidentImpactDto } from "@shared/service-proxies/service-proxies";
import { CreateOrEditIncidentImpactModalComponent } from "./create-or-edit-incidentImpact-modal.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash"; 

@Component({
    templateUrl: "./incidentImpacts.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class IncidentImpactsComponent extends AppComponentBase {
    @ViewChild("createOrEditIncidentImpactModal", { static: true })
    createOrEditIncidentImpactModal: CreateOrEditIncidentImpactModalComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = "";
    nameFilter = "";
    exportButtonHide: boolean;
    exceptionPermission: boolean;
    constructor(
        injector: Injector,
        private _incidentImpactsServiceProxy: IncidentImpactsServiceProxy,        
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
        this.exportPermission();
    }

    getIncidentImpacts(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._incidentImpactsServiceProxy
            .getAll(
                this.filterText,
                this.nameFilter,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
                this.exportHide();
            });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createIncidentImpact(): void {
        this.createOrEditIncidentImpactModal.show();
    }

    deleteIncidentImpact(incidentImpact: IncidentImpactDto): void {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), isConfirmed => {
            if (isConfirmed) {
                this._incidentImpactsServiceProxy
                    .delete(incidentImpact.id)
                    .subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l("SuccessfullyDeleted"));
                    });
            }
        });
    }

    exportToExcel(): void {
        this._incidentImpactsServiceProxy
            .getIncidentImpactsToExcel(this.filterText, this.nameFilter)
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
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
    exportPermission() {
        this.exceptionPermission = this.isGranted("Pages.SystemSetUp.Incidents.IncidentImpacts.Export");
    }
}
