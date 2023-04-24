import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import { AuditProjectServiceProxy, TokenAuthServiceProxy, GetCertificateImport, HangfireCustomServiceProxy, CommonLookupServiceProxy } from "../../../shared/service-proxies/service-proxies";
import { AppConsts } from "../../../shared/AppConsts";
import { HttpClient } from "@angular/common/http";
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';
import { AuditcertificateHistoryModalComponent } from "./auditcertificate-history-modal.component";
import { async } from "@angular/core/testing";

@Component({
    templateUrl: "./Auditcertificate-grid.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class AuditCertificateComponent extends AppComponentBase {
  
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild('ExcelCertificateFileUpload', { static: false }) excelCertificateFileUpload: FileUpload;
    selectedRowData: GetCertificateImport[];
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
    uploadCertificateUrl = "";
    setInterval = setInterval;
    progressInterval: any;
    value: any;
    importcode: string;
    btnCopy: boolean;

    Customer1: any
    constructor(
        injector: Injector,
        private _auditServiceProxy: AuditProjectServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _httpClient: HttpClient,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
    ) {
        super(injector);
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Import/ImportContact';
        this.uploadCertificateUrl = AppConsts.remoteServiceBaseUrl + '/Import/ImportCertificateData';
       
    }

    @ViewChild("auditcertificateHistory", { static: true }) auditcertificateHistory: AuditcertificateHistoryModalComponent;


    onSelectionChange(selection: any[]) {
        this.selectedRowData = selection;
        if (selection.length >= 2) {
            this.allDelete = true;
        }
        else if (selection.length <= 1) {
            this.allDelete = false;
        }
        this.btnCopy = selection.length == 0 ? false : true;

    }
    

    async getCertiifcate(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._auditServiceProxy
            .getCertificateImport(
                this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
           
        });
       
    }
    downloadCertificates(filename: string) {
        const self = this;
        self._fileDownloadService.downloadCertificate(filename);
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    uploadCertificateExcel(data: { files: File }): void {
        const formData: FormData = new FormData();
        const file = data.files[0];
        var filename = file.name;
        var fileExtension = filename.split('.').pop();
        if (fileExtension.toLowerCase() == 'xlsx'.toLowerCase()) {
            this.message.confirm('', this.l('Are You Sure You Want To Import ' + file.name), (isConfirmed) => {
                if (isConfirmed) {
                    let teantid = this.appSession.tenantId;
                    let userid = this.appSession.userId;
                    formData.append('file', file, file.name);
                    formData.append('teantId', teantid.toString());
                    formData.append('userid', userid.toString());
                    this._httpClient
                        .post<any>(this.uploadCertificateUrl, formData)
                        .pipe(finalize(() => this.excelCertificateFileUpload.clear()))
                        .subscribe(response => {
                            if (response.success) {
                                this.notify.success(this.l('Import Process Start'));
                                this.importcode = response.result.getRandom;
                                this.setIntrvl(this.importcode);
                            } else if (response.error != null) {
                                this.notify.error(this.l('Import Process Failed'));
                            }

                        });
                }
            });
        }
        else {
            this.notify.error(this.l('Please use the correct file format - .xlsx is required'));
        }
    }

    RefreshComponent(code: string) {
        this._commonLookupServiceProxy.getCommonNotificationRefresh(this.appSession.userId, this.appSession.tenantId, code).subscribe(
            (result) => {
                this.value = result;
                let list = this.value;
                list.forEach((value, index) => {
                    if (value.match(code)) {
                        clearInterval(this.progressInterval);
                        this.getCertiifcate();
                    }
                })
            });
    }

    setIntrvl(code: string) {
        this.progressInterval = setInterval(() => this.RefreshComponent(code), 1000);
    }

    sendCertificate() {
        this._auditServiceProxy
            .sendImportCertificateEmail(this.selectedRowData)
            .subscribe(result => {
                this.primengTableHelper.hideLoadingIndicator();
                this.notify.info(this.l('Certificate Sent Successfully'));
                this.selectedRowData = [];
                this.btnCopy = false;
            });
    }

    viewCertificates(input: string) {
        this.auditcertificateHistory.show(input);
    }
  

 
}
