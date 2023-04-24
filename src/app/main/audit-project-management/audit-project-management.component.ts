import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateEditAuditProjectManagementComponent, } from './create-edit-audit-project-management/create-edit-audit-project-management.component';
import { AuditProjectServiceProxy, CommonLookupServiceProxy } from "../../../shared/service-proxies/service-proxies";
import { FileDownloadService } from '@shared/utils/file-download.service';
import { AppConsts } from "../../../shared/AppConsts";
import { HttpClient } from "@angular/common/http";
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';
import { GridAuditProjectManagementComponent } from '../common-component/grid-audit-project-management/grid-audit-project-management.component';
@Component({
    selector: 'audit-project-management',
    templateUrl: './audit-project-management.component.html',
})
export class AuditProjectManagementComponent extends AppComponentBase implements AfterViewInit {
    @ViewChild('createEditAuditProjectManagementModals', { static: true }) createEditAuditProjectManagementModals: CreateEditAuditProjectManagementComponent;
    @ViewChild('ExcelFileUpload', { static: false }) excelFileUpload: FileUpload;
    @ViewChild('ExcelCertificateFileUpload', { static: false }) excelCertificateFileUpload: FileUpload;
    @ViewChild(GridAuditProjectManagementComponent) gridAuditProjectManagementComponent: GridAuditProjectManagementComponent;
    uploadUrl = "";
    uploadCertificateUrl = "";
    setInterval = setInterval;
    progressInterval: any;
    value: any;
    importcode: string;
    constructor(
        injector: Injector,
        private _auditProjectServiceProxy: AuditProjectServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _httpClient: HttpClient,
    ) {
        super(injector);
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Import/ImportAuditReport';
        this.uploadCertificateUrl = AppConsts.remoteServiceBaseUrl + '/Import/ImportCertificateData';
    }

    ngAfterViewInit(): void {

    }
    exportToExcel(): void {
        this.gridAuditProjectManagementComponent.export();
    }

    uploadExcel(data: { files: File }): void {
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
                        .post<any>(this.uploadUrl, formData)
                        .pipe(finalize(() => this.excelFileUpload.clear()))
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
                        this.gridAuditProjectManagementComponent.refreshComponent();
                    }
                })
            });
    }
    setIntrvl(code: string) {
        this.progressInterval = setInterval(() => this.RefreshComponent(code), 1000);
    }
}
