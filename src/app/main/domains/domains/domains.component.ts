import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
    DomainsServiceProxy,
    DomainDto
} from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy } from "@shared/service-proxies/service-proxies";
import { CreateOrEditDomainModalComponent } from "./create-or-edit-domain-modal.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import * as moment from "moment";
import { ComplianceManagementServiceProxy } from "@shared/service-proxies/services/compliance-management.service";

@Component({
    templateUrl: "./domains.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DomainsComponent extends AppComponentBase {
    @ViewChild("createOrEditDomainModal", { static: true })
    createOrEditDomainModal: CreateOrEditDomainModalComponent;
    @ViewChild("dataTable", { static: true })
    dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = "";
    codeFilter = "";
    nameFilter = "";
    authoritativeDocumentNameFilter = "";
    selectedRowData: any[];
    allDelete: boolean;

    

    constructor(
        injector: Injector,
        private _domainsServiceProxy: DomainsServiceProxy,       
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _complianceManagementService: ComplianceManagementServiceProxy
    ) {
        super(injector);
    }
    columns = [{
        dataField: 'departmentName',
        caption: 'Actions',
        fixed: true,
        cellTemplate: "action",
        width: 100,
        dataType: ''
    }, {
            dataField: 'domain.code',
            caption: 'ADD ID',
            width: 100,
        dataType: ''
    }, {
            dataField: 'domain.name',
            caption: 'Domain Name',
        dataType: ''
    }, {
            dataField: 'authoritativeDocumentName',
            caption: 'Authoritative Document',
        dataType: ''
    }];
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
    getDomains(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._domainsServiceProxy
            .getAll(
                this.filterText,
                null,
                this.nameFilter,
                this.authoritativeDocumentNameFilter,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                if (this.codeFilter != "") {
                    this.primengTableHelper.records = result.items.filter(res => {
                        return res.domain.code.toLocaleLowerCase().match(this.codeFilter.toLocaleLowerCase().trim());
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

    createDomain(): void {
        this.createOrEditDomainModal.show();
    }

    deleteDomain(domain: DomainDto): void {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), isConfirmed => {
            if (isConfirmed) {
                this._domainsServiceProxy.delete(domain.id).subscribe(() => {
                    this.reloadPage();
                    this.notify.success(this.l("SuccessfullyDeleted"));
                });
            }
        });
    }

    exportToExcel(): void {
        this._domainsServiceProxy
            .getDomainsToExcel(
                this.filterText,
                this.codeFilter,
                this.nameFilter,
                this.authoritativeDocumentNameFilter
            )
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
    uploadFile(event) {
        let file = event.target.files[0];
        event.target.value = "";
        let formData: FormData = new FormData();
        formData.append("files", file, file.name);
        this._complianceManagementService
            .ImportAuthoritativeDocumentDomains(formData)
            .subscribe(
                () => {
                    this.reloadPage();
                },
                err => {
                    this.message.error(err.error.error.message);
                }
            );
    }
}
