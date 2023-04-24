import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy, EntityGroupsServiceProxy, EntityGroupDto } from "@shared/service-proxies/service-proxies";
import { CreateOrEditEntityGroupModalComponent } from "./create-or-edit-entityGroup-modal.component";
import { ViewEntityGroupModalComponent } from "./view-entityGroup-modal.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";

@Component({
    templateUrl: "./entityGroups.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class EntityGroupsComponent extends AppComponentBase {
    @ViewChild("createOrEditEntityGroupModal", { static: true })
    createOrEditEntityGroupModal: CreateOrEditEntityGroupModalComponent;
    @ViewChild("viewEntityGroupModalComponent", { static: true })
    viewEntityGroupModal: ViewEntityGroupModalComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = "";
    nameFilter = "";
    exportButtonHide: boolean;
    constructor(
        injector: Injector,
        private _entityGroupsServiceProxy: EntityGroupsServiceProxy,

        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
        this.getEntityGroups;
    }

    getEntityGroups(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._entityGroupsServiceProxy
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

    createEntityGroup(): void {
        this.createOrEditEntityGroupModal.show();
    }

    deleteEntityGroup(entityGroup: EntityGroupDto): void {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), isConfirmed => {
            if (isConfirmed) {
                this.spinnerService.show();
                this._entityGroupsServiceProxy
                    .delete(entityGroup.id)
                    .subscribe(() => {
                        this.spinnerService.hide();
                        this.reloadPage();
                        this.notify.success(this.l("SuccessfullyDeleted"));
                    });
            }
            this.spinnerService.hide();
        });
    }

    exportToExcel(): void {
        this._entityGroupsServiceProxy
            .getEntityGroupsToExcel(this.filterText, this.nameFilter)
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    exportHide() {
        if (this.primengTableHelper.totalRecordsCount.toString() == '0') {
            this.exportButtonHide = false;
        }
        else {
            this.exportButtonHide = true;
        }
    }
}
