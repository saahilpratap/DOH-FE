import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild,
    Injectable
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy, ExceptionTypesServiceProxy, ExceptionTypeDto } from "@shared/service-proxies/service-proxies";
import { CreateOrEditExceptionTypeModalComponent } from "./create-or-edit-exceptionType-modal.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";

import * as _ from "lodash";

@Component({
    templateUrl: "./exceptionTypes.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
@Injectable()
export class ExceptionTypesComponent extends AppComponentBase {
    @ViewChild("createOrEditExceptionTypeModal", { static: true })
    createOrEditExceptionTypeModal: CreateOrEditExceptionTypeModalComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = "";
    nameFilter = "";
    exportButtonHide: boolean;
    exceptionPermission: boolean;
    constructor(
        injector: Injector,
        private _exceptionTypesServiceProxy: ExceptionTypesServiceProxy,

        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
        this.exportPermission();
    }

    getExceptionTypes(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._exceptionTypesServiceProxy
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

    createExceptionType(): void {
        this.createOrEditExceptionTypeModal.show();
    }

    deleteExceptionType(exceptionType: ExceptionTypeDto): void {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), isConfirmed => {
            if (isConfirmed) {
                this._exceptionTypesServiceProxy
                    .delete(exceptionType.id)
                    .subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l("SuccessfullyDeleted"));
                    });
            }
        });
    }

    exportToExcel(): void {
        this._exceptionTypesServiceProxy
            .getExceptionTypesToExcel(this.filterText, this.nameFilter)
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
        this.exceptionPermission = this.isGranted("Pages.SystemSetUp.Exceptions.ExceptionTypes.Export");
    }
}
