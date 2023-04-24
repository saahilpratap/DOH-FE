import { Component, Injector, ViewEncapsulation, ViewChild, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacilityTypesServiceProxy, ControlType, FacilitySubTypeServiceProxy, FacilitySubTypeList, FacilityTypeDto, CommonLookupServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditFacilitysubTypeModalComponent } from './create-or-edit-facilitySubType-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { HttpClient } from "@angular/common/http";
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';
import { AppConsts } from '@shared/AppConsts';

@Component({
    templateUrl: './facilitySubTypes.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

@Injectable()
export class FacilitySubTypesComponent extends AppComponentBase {

    @ViewChild('CreateOrEditFacilitysubTypeModalComponent', { static: true }) CreateOrEditFacilitysubTypeModalComponent: CreateOrEditFacilitysubTypeModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('ExcelFileUpload', { static: false }) excelFileUpload: FileUpload;

    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    importcode: string;
    value: any;
    progressInterval: any;
    uploadUrl = "";
    facilityTypeId: any;
    controlTypeId: any;
    controlType = ControlType;
    exportButtonHide: boolean;
    facilitys: FacilityTypeDto[] = []
    constructor(
        injector: Injector,
        private _facilityTypesServiceProxy: FacilityTypesServiceProxy,
        private _facilitysubTypesServiceProxy: FacilitySubTypeServiceProxy,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _httpClient: HttpClient,
        private _commonLookupServiceProxy: CommonLookupServiceProxy
    ) {
        super(injector);
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Import/ImportFacilitySubTypes';
        this.facilityTypeId = 0;
        this.controlTypeId = -1;
        this.getFacilityInitalization();
    }

    getFacilitysubTypes(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();
         
        this._facilitysubTypesServiceProxy.getFacilitySubTypeList(
            this.filterText,
            this.facilityTypeId,
            this.controlTypeId,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)          
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
            this.exportHide();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

  

    deleteFacilityType(facilityType: FacilitySubTypeList): void {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._facilitysubTypesServiceProxy.deleteFacilitySubType(facilityType.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(event?: LazyLoadEvent): void {
        this._facilitysubTypesServiceProxy.getFacilitySubTypesToExcel(
            this.filterText,
            this.facilityTypeId,
            this.controlTypeId,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event) 
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
                let tenantid = this.appSession.tenantId;
                let userid = this.appSession.userId;
                formData.append('file', file, file.name);
                formData.append('tenantId', tenantid.toString());
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

    getFacilityInitalization() {
        this._facilitysubTypesServiceProxy.getFacilityAll().subscribe(res => {

            this.facilitys = res;
        });
    }

    RefreshComponent(code: string) {
        this._commonLookupServiceProxy.getCommonNotificationRefresh(this.appSession.userId, this.appSession.tenantId, code).subscribe(
            (result) => {
                this.value = result;
                let list = this.value;
                list.forEach((value, index) => {
                    if (value.match(code)) {
                        clearInterval(this.progressInterval);
                        this.getFacilitysubTypes();

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
