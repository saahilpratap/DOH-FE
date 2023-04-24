import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";
 import { CreateOrEditContactModalComponent } from "./create-or-edit-contact-modal.component";
import { ViewContactModalComponent } from "./view-contact-modal.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash"; 
import { ContactsServiceProxy, TokenAuthServiceProxy, ContactDto, HangfireCustomServiceProxy } from "../../../../shared/service-proxies/service-proxies";
import { AppConsts } from "../../../../shared/AppConsts";
import { HttpClient } from "@angular/common/http";
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';
import { CommonDevExpressGridComponent } from "../../../shared/common/common-dev-express-grid/common-dev-express-grid.component";

@Component({
    templateUrl: "./contacts.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ContactsComponent extends AppComponentBase {
    @ViewChild("createOrEditContactModal", { static: true })
    createOrEditContactModal: CreateOrEditContactModalComponent;
    @ViewChild("viewContactModalComponent", { static: true })
    viewContactModal: ViewContactModalComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild('ExcelFileUpload', { static: false }) excelFileUpload: FileUpload;
    selectedRowData: any[];
    allDelete: boolean;
    advancedFiltersAreShown = false;
    filterText = "";
    codeFilter = "";
    firstNameFilter = "";
    lastNameFilter = "";
    jobTitleFilter = "";
    mobileFilter = "";
    directPhoneFilter = "";
    uploadUrl = "";
    exportButtonHide: boolean;
    exceptionPermission: boolean;
    @ViewChild(CommonDevExpressGridComponent) devExpressGrid: CommonDevExpressGridComponent;

    columHeader = [
        { dataField: 'contact.id', caption: 'Actions', width: 100, fixed: true },
        { dataField: 'contact.code', caption: 'ContactID', width: 200 },
        { dataField: 'contact.firstName', caption: 'First Name', width: 200 },
        { dataField: 'contact.lastName', caption: 'Last Name', width: 200 },
        { dataField: 'contact.jobTitle', caption: 'Job Title', width: 200 },
        { dataField: 'contact.mobile', caption: 'Mobile', width: 200 },
        { dataField: 'contact.directPhone', caption: 'Direct Phone',  width: 200 }
    ];

    Customer1:any
    constructor(
        injector: Injector,
        private _contactsServiceProxy: ContactsServiceProxy,
        private _hangfireCustomServiceProxy: HangfireCustomServiceProxy,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _httpClient: HttpClient
    ) {
        super(injector);
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Import/ImportContact';
        this.exportPermission();
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
    getContacts(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._contactsServiceProxy
            .getAll(
                this.filterText,
                this.codeFilter,
                this.firstNameFilter,
                this.lastNameFilter,
                this.jobTitleFilter,
                this.mobileFilter,
                this.directPhoneFilter,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
                this.exportHide();         
                this.devExpressGrid.getData(result.items);                
            });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createContact(): void {
        this.createOrEditContactModal.show();
    }

    deleteContact(contact: ContactDto): void {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), isConfirmed => {
            if (isConfirmed) {
                this._contactsServiceProxy.delete(contact.id).subscribe(() => {
                    this.reloadPage();
                    this.notify.success(this.l("SuccessfullyDeleted"));
                });
            }
        });
    }

    exportToExcel(): void {
        this._contactsServiceProxy
            .getContactsToExcel(
                this.filterText,
                this.codeFilter,
                this.firstNameFilter,
                this.lastNameFilter,
                this.jobTitleFilter,
                this.mobileFilter,
                this.directPhoneFilter
            )
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    uploadExcel(data: { files: File }): void {
        const formData: FormData = new FormData();
        const file = data.files[0];
        this.message.confirm('', this.l('Are You Sure You Want To Import ' + file.name), (isConfirmed) => {
            if (isConfirmed) {
                formData.append('file', file, file.name);

                this._httpClient
                    .post<any>(this.uploadUrl, formData)
                    .pipe(finalize(() => this.excelFileUpload.clear()))
                    .subscribe(response => {
                        if (response.success) {
                            this.notify.success(this.l('Import Process Start'));
                        } else if (response.error != null) {
                            this.notify.error(this.l('Import Process Failed'));
                        }

                    });
            }
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
        this.exceptionPermission = this.isGranted("Pages.Contacts.Export");
    }
    onButtonClick(event: MouseEvent): void {
        alert("Clicked Contacts !!");
    }
}
