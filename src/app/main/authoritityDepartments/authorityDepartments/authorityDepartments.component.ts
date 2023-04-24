import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild,
    Injectable
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy, AuthorityDepartmentsServiceProxy, AuthorityDepartmentDto } from "@shared/service-proxies/service-proxies";
import { CreateOrEditAuthorityDepartmentModalComponent } from "./create-or-edit-authorityDepartment-modal.component";
import { ViewAuthorityDepartmentModalComponent } from "./view-authorityDepartment-modal.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import * as moment from "moment";
@Component({
    templateUrl: "./authorityDepartments.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
@Injectable()
export class AuthorityDepartmentsComponent extends AppComponentBase {
    @ViewChild("createOrEditAuthorityDepartmentModal", { static: true })
    createOrEditAuthorityDepartmentModal: CreateOrEditAuthorityDepartmentModalComponent;
    @ViewChild("viewAuthorityDepartmentModalComponent", { static: true })
    viewAuthorityDepartmentModal: ViewAuthorityDepartmentModalComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    allDelete: boolean;
    advancedFiltersAreShown = false;
    filterText = "";
    nameFilter = "";
    selectedRowData: any[];
    exportButtonHide: boolean;
    exceptionPermission: boolean;
    constructor(
        injector: Injector,
        private _authorityDepartmentsServiceProxy: AuthorityDepartmentsServiceProxy,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
        this.exportPermission();
    }
    onSelectionChange(selection: any[]) {
        if (selection.length >= 2) {
            this.allDelete=true;
        }
        else if (selection.length <= 1) {
            this.allDelete = false;
        }
    }
    deleteAllRecord() {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), isConfirmed => {
            if (isConfirmed) {

            }
        });
    }
    getAuthorityDepartments(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._authorityDepartmentsServiceProxy
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

    createAuthorityDepartment(): void {
        this.createOrEditAuthorityDepartmentModal.show();
    }

    deleteAuthorityDepartment(
        authorityDepartment: AuthorityDepartmentDto
    ): void {
        this.message.confirm(`You want to delete ${authorityDepartment.name}`, this.l("AreYouSure"), isConfirmed => {
            if (isConfirmed) {
                this._authorityDepartmentsServiceProxy
                    .delete(authorityDepartment.id)
                    .subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l("SuccessfullyDeleted"));
                    });
            }
        });
    }

    exportToExcel(): void {
        this._authorityDepartmentsServiceProxy
            .getAuthorityDepartmentsToExcel(this.filterText, this.nameFilter)
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
        this.exceptionPermission = this.isGranted("Pages.OrganizationSetup.AuthorityDepartments.Export");
    }
}
