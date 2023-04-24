import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuditVendorsServiceProxy, AuditVendorDto  } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditAuditVendorModalComponent } from './create-or-edit-auditVendor-modal.component';
import { ViewAuditVendorModalComponent } from './view-auditVendor-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
//import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl:'./auditVendors.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class AuditVendorsComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createOrEditAuditVendorModal', { static: true }) createOrEditAuditVendorModal: CreateOrEditAuditVendorModalComponent;
    @ViewChild('viewAuditVendorModalComponent', { static: true }) viewAuditVendorModal: ViewAuditVendorModalComponent;
 
    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    maxRegistrationDateFilter : moment.Moment;
	minRegistrationDateFilter : moment.Moment;
    phoneFilter = '';
    emailFilter = '';
    websiteFilter = '';
    addressFilter = '';
    cityFilter = '';
    stateFilter = '';
    postalCodeFilter = '';
    countryFilter = '';
    descriptionFilter = '';

    constructor(
        injector: Injector,
        private _auditVendorsServiceProxy: AuditVendorsServiceProxy,      
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getAuditVendors(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();
        this._auditVendorsServiceProxy.getAll(
            this.filterText,
            this.nameFilter,
            this.maxRegistrationDateFilter,
            this.minRegistrationDateFilter,
            this.phoneFilter,
            this.emailFilter,
            this.websiteFilter,
            this.addressFilter,
            this.cityFilter,
            this.stateFilter,
            this.postalCodeFilter,
            this.countryFilter,
            this.descriptionFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createAuditVendor(): void {
        this.createOrEditAuditVendorModal.show();
    }

    deleteAuditVendor(auditVendor: AuditVendorDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._auditVendorsServiceProxy.delete(auditVendor.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._auditVendorsServiceProxy.getAuditVendorsToExcel(
        this.filterText,
            this.nameFilter,
            this.maxRegistrationDateFilter,
            this.minRegistrationDateFilter,
            this.phoneFilter,
            this.emailFilter,
            this.websiteFilter,
            this.addressFilter,
            this.cityFilter,
            this.stateFilter,
            this.postalCodeFilter,
            this.countryFilter,
            this.descriptionFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }

}
