import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ActivatedRoute } from "@angular/router";
import { TokenAuthServiceProxy, DynamicParameterServiceProxy, DynamicParameterValueServiceProxy, CommonLookupServiceProxy } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FileUpload } from 'primeng/fileupload';
import { AppConsts } from '@shared/AppConsts';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from "lodash";
import { CreateOrEditDynamicParameterModalComponent } from './create-or-edit-dynamic-parameter-modal.component';


@Component({
  selector: 'app-dynamic-parameter',
    templateUrl: './dynamic-parameter.component.html',
    encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class DynamicParameterComponent extends AppComponentBase {
  @ViewChild('createOrEditDynamicParameter', { static: true }) createOrEditDynamicParameterModal: CreateOrEditDynamicParameterModalComponent;
    @ViewChild('ExcelFileDynamicParaUpload', { static: false }) excelFileDynamicParaUpload: FileUpload;
    @ViewChild('ExcelFileDynamicValueUpload', { static: false }) excelFileDynamicValueUpload: FileUpload;

    uploadDynamicParametersUrl = "";
    uploadDynamicParameterValueUrl = "";
    importcode: string;
    value: any;
    progressInterval: any;
    exportButtonHide: boolean;
  constructor(
    injector: Injector,
      private _dynamicParameterService: DynamicParameterServiceProxy,
      private _dynamicParameterValueService: DynamicParameterValueServiceProxy,
    private _router: Router,
      private _httpClient: HttpClient,
      private _fileDownloadService: FileDownloadService,
      private _tokenAuth: TokenAuthServiceProxy,
      private _activatedRoute: ActivatedRoute,
      private _commonLookupServiceProxy: CommonLookupServiceProxy
  ) {
      super(injector);
      this.uploadDynamicParametersUrl = AppConsts.remoteServiceBaseUrl + '/Import/ImportDynamicParameters';
      this.uploadDynamicParameterValueUrl = AppConsts.remoteServiceBaseUrl + '/Import/ImportDynamicValues';
  }

  getDynamicParameters(): void {
    this.showMainSpinner();
    this._dynamicParameterService.getAll().subscribe(
      (result) => {
        this.primengTableHelper.totalRecordsCount = result.items.length;
        this.primengTableHelper.records = result.items;
        this.primengTableHelper.hideLoadingIndicator();
        this.hideMainSpinner();
        this.exportHide();
      },
      (err) => {
          this.hideMainSpinner();
         
      }
    );
  }

  goToDetail(id: string): void {
    this._router.navigate(['app/admin/dynamic-parameter-detail'],
      {
        queryParams: {
          id: id,
        }
      });
  }

  addNewDynamicParameter(): void {
    this.createOrEditDynamicParameterModal.show();
    }

    uploadDynamicParaExcel(data: { files: File }): void {
        const formData: FormData = new FormData();
        const file = data.files[0];
        this.message.confirm('', this.l('Are You Sure You Want To Import ' + file.name), (isConfirmed) => { 
            if (isConfirmed) {
                let teantid = this.appSession.tenantId;
                let userid = this.appSession.userId;
                formData.append('file', file, file.name);
                formData.append('teantId', teantid.toString());
                formData.append('userid', userid.toString());
                this._httpClient
                    .post<any>(this.uploadDynamicParametersUrl, formData)
                    .pipe(finalize(() => this.excelFileDynamicParaUpload.clear()))
                    .subscribe(response => {
                        if (response.success) {
                            this.notify.success(this.l('Import Dynamic Parameter Definitions Started'));
                            this.importcode = response.result.getRandom;
                            this.setIntrvl(this.importcode);
                        } else if (response.error != null) {
                            this.notify.error(this.l('Import Dynamic Parameter Definitions - Failed'));
                        }
                        this.getDynamicParameters();
                    });
            }
        });
    }

    uploadDynamicValueExcel(data: { files: File }): void {
        const formData: FormData = new FormData();
        const file = data.files[0];
        this.message.confirm('', this.l('Are You Sure You Want To Import ' + file.name), (isConfirmed) => {
            if (isConfirmed) {             
                let teantid = this.appSession.tenantId;
                let userid = this.appSession.userId;
                formData.append('file', file, file.name);
                formData.append('teantId', teantid.toString());
                formData.append('userid', userid.toString());
                this._httpClient
                    .post<any>(this.uploadDynamicParameterValueUrl, formData)
                    .pipe(finalize(() => this.excelFileDynamicValueUpload.clear()))
                    .subscribe(response => {
                        if (response.success) {
                            this.notify.success(this.l('Import Dynamic Parameter Definition Values Started'));
                        } else if (response.error != null) {
                            this.notify.error(this.l('Import Dynamic Parameter Definition Values Failed'));
                        }
                        this.getDynamicParameters();
                    });
            }
            else {
                this._httpClient
                    .post<any>(this.uploadDynamicParameterValueUrl, formData)
                    .pipe(finalize(() => this.excelFileDynamicValueUpload.clear()))
            }
        });
    }


    exportDynamicParaToExcel(): void {
        this.spinnerService.show();
        this._dynamicParameterService.getDynamicParameterEntitiesToExcel()
            .subscribe(
                result => {
                    this.spinnerService.hide();
                    this._fileDownloadService.downloadTempFile(result);
                },
                error => {
                    this.spinnerService.hide();
                    this.message.error(
                        "Couldn't download Dynamic Parameter Definition Data for now, try later!"
                    );
                }
            );
    }
    exportDynamicParaValuesToExcel(): void {
        this.spinnerService.show();
        this._dynamicParameterValueService.getDynamicParaValueEntitiesToExcel()
            .subscribe(
                result => {
                    this.spinnerService.hide();
                    this._fileDownloadService.downloadTempFile(result);
                },
                error => {
                    this.spinnerService.hide();
                    this.message.error(
                        "Couldn't download Dynamic Parameter Value Data for now, try later!"
                    );
                }
            );
    }
    RefreshComponent(code: string) {
        this._commonLookupServiceProxy.getCommonNotificationRefresh(this.appSession.userId, this.appSession.tenantId, code).subscribe(
            (result) => {
                this.value = result;
                let list = this.value;
                list.forEach((value, index) => {
                    if (value.match(code)) {
                        clearInterval(this.progressInterval);
                        this.getDynamicParameters();

                    }
                })

            });

    }

    setIntrvl(code: string) {
        this.progressInterval = setInterval(() => this.RefreshComponent(code), 1000);
    }

    exportHide() {
        if (this.primengTableHelper.totalRecordsCount == 0) {
            this.exportButtonHide = false;
        }
        else {
            this.exportButtonHide = true;
        }
    }
}
