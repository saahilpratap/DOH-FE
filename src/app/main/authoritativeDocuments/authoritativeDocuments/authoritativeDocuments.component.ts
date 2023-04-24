import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
    AuthoritativeDocumentsServiceProxy,
    AuthoritativeDocumentDto
} from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy } from "@shared/service-proxies/service-proxies";
import { CreateOrEditAuthoritativeDocumentModalComponent } from "./create-or-edit-authoritativeDocument-modal.component";
import { ViewAuthoritativeDocumentModalComponent } from "./view-authoritativeDocument-modal.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api"
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import * as moment from "moment";
import { ComplianceManagementServiceProxy } from "@shared/service-proxies/services/compliance-management.service";
import { DomSanitizer } from '@angular/platform-browser';
import { string, number } from "@amcharts/amcharts4/core";

@Component({
    templateUrl: "./authoritativeDocuments.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class AuthoritativeDocumentsComponent extends AppComponentBase {
    @ViewChild("createOrEditAuthoritativeDocumentModal", { static: true })
    createOrEditAuthoritativeDocumentModal: CreateOrEditAuthoritativeDocumentModalComponent;
    @ViewChild("viewAuthoritativeDocumentModalComponent", { static: true })
    viewAuthoritativeDocumentModal: ViewAuthoritativeDocumentModalComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    allDelete: boolean;
    advancedFiltersAreShown = false;
    filterText = "";
    codeFilter = "";
    nameFilter = "";
    nameFilter2 = "";
    list: any;
    grid: any;
    data: AuthoritativeDocumentDto = new AuthoritativeDocumentDto();
    selectedRowData: any[];
    constructor(
        injector: Injector,
        public _DomSanitizationService: DomSanitizer,
        private _authoritativeDocumentsServiceProxy: AuthoritativeDocumentsServiceProxy,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _complianceManagementService: ComplianceManagementServiceProxy
    ) {
        super(injector);
    }
    dataSource = [
        { id: '0011', name: 'AAAA', dept: '', cat: '', },
        { id: '0012', name: 'BBBB', dept: '', cat: '', },
        { id: '0013', name: 'CCCC', dept: '', cat: '', },
        { id: '0014', name: 'AAAA', dept: '', cat: '', },
        { id: '0015', name: 'XXXX', dept: '', cat: '', },
        { id: '0016', name: 'YYYY', dept: '', cat: '', },
        { id: '0017', name: 'SSSS', dept: '', cat: '', },
    ]
    columns = [{
        dataField: 'departmentName',
        caption: 'Actions',
        fixed: true,
        cellTemplate: "action",
        width: 100,
        dataType: number
    }, {
        dataField: 'authoritativeDocument.code',
        caption: 'ID',
        dataType: ''
    }, {
        dataField: 'authoritativeDocument.name',
        caption: 'Name',
        dataType: ''
    }, {
        dataField: 'departmentName',
        caption: 'Department',
        dataType: ''
    }, {
        dataField: 'authoritativeDocument.category.value',
        caption: 'Category',
        dataType: ''
    }];
    ngOnInit() {
        this.list = true;
    }
    showGrid() {
        this.grid = true;
        this.list = false;
    }
    showList() {
        this.grid = false;
        this.list = true;
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
    getData() {
        this._authoritativeDocumentsServiceProxy
            .getAll(this.filterText, this.codeFilter, this.nameFilter2, null, null, null)
            .subscribe(result => {
                this.primengTableHelper.records = result.items;
            });
    }
    getAuthoritativeDocuments(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._authoritativeDocumentsServiceProxy
            .getAll(
                this.filterText, null, this.nameFilter2,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event)
            )
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                if (this.codeFilter != "") {
                    this.primengTableHelper.records = result.items.filter(res => {
                        return res.authoritativeDocument.code.toLocaleLowerCase().match(this.codeFilter.toLocaleLowerCase().trim());
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

    createAuthoritativeDocument(): void {
        this.createOrEditAuthoritativeDocumentModal.show();
    }

    deleteAuthoritativeDocument(
        authoritativeDocument: AuthoritativeDocumentDto
    ): void {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), isConfirmed => {
            if (isConfirmed) {
                this._authoritativeDocumentsServiceProxy
                    .delete(authoritativeDocument.id)
                    .subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l("SuccessfullyDeleted"));
                    });
            }
        });
    }

    exportToExcel(): void {
        this._authoritativeDocumentsServiceProxy
            .getAuthoritativeDocumentsToExcel(
                this.filterText,
                this.codeFilter,
                this.nameFilter
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
            .ImportAuthoritativeDocuments(formData)
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
