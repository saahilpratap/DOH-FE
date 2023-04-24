import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy, ControlStandardsServiceProxy, ControlStandardDto } from "@shared/service-proxies/service-proxies";
import { CreateOrEditControlStandardModalComponent } from "./create-or-edit-controlStandard-modal.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import { ComplianceManagementServiceProxy } from "@shared/service-proxies/services/compliance-management.service";
import { HttpClient } from "@angular/common/http";
import { AppConsts } from "../../../../shared/AppConsts";
import { NULL_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
    templateUrl: "./controlStandards.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ControlStandardsComponent extends AppComponentBase {
    @ViewChild("createOrEditControlStandardModal", { static: true })
    createOrEditControlStandardModal: CreateOrEditControlStandardModalComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = "";
    codeFilter = "";
    originalControlIdFilter = "";
    domainNameFilter = "";
    nameFilter = "";
    descriptionFilter = "";
    uploadUrl = "";
    selectedRowData: any[];
    allDelete: boolean;

    constructor(
        injector: Injector, private _httpClient: HttpClient,
        private _controlStandardsServiceProxy: ControlStandardsServiceProxy,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _complianceManagementService: ComplianceManagementServiceProxy
    ) {
        super(injector);
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/File/ImportControlStandards';
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
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), isConfirmed => {
            if (isConfirmed) {

            }
        });
    }
    getControlStandards(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._controlStandardsServiceProxy
            .getAll(
                this.filterText,
                "",
                this.originalControlIdFilter,
                this.domainNameFilter,
                this.nameFilter,
                this.descriptionFilter,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                if (this.codeFilter != "") {
                    this.primengTableHelper.records = result.items.filter(res => {
                        return res.controlStandard.code.toLocaleLowerCase().match(this.codeFilter.toLocaleLowerCase().trim());
                    });
                }
                else {
                    this.primengTableHelper.records = result.items;
                }
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createControlStandard(): void {
        this.createOrEditControlStandardModal.show();
    }

    deleteControlStandard(controlStandard: ControlStandardDto): void {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), isConfirmed => {
            if (isConfirmed) {
                this._controlStandardsServiceProxy
                    .delete(controlStandard.id)
                    .subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l("SuccessfullyDeleted"));
                    });
            }
        });
    }

    exportToExcel(): void {
        this._controlStandardsServiceProxy
            .getControlStandardsToExcel(
                this.filterText,
                this.codeFilter,
                this.originalControlIdFilter,
                this.domainNameFilter,
                this.nameFilter,
                this.descriptionFilter
            )
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    uploadFile(event) {
        let file = event.target.files[0];
        let formData: FormData = new FormData();
        formData.append("files", file, file.name);
        this._httpClient
            .post<any>(this.uploadUrl, formData)
            .subscribe(response => {
                if (response.success) {
                    this.notify.success(this.l('Import Process Start'));
                } else if (response.error != null) {
                    this.notify.error(this.l('Import Process Failed'));
                }
            });
    }
}
