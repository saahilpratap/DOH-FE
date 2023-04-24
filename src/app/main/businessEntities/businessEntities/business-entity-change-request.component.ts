import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EntityDtoOfInt64, UserListDto, UserServiceProxy, PermissionServiceProxy, BusinessEntitiesServiceProxy, FlatPermissionDto, BusinessEntityAdminChangeRequestServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { LazyLoadEvent } from 'primeng/public_api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './business-entity-change-request.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class BusinessEntityAdminChangeRequestComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    uploadUrl: string;

    //Filters
    advancedFiltersAreShown = false;
    filterText = '';
    role = '';
    onlyLockedUsers = false;
    skipBEUsers = false;
    exportButtonHide: boolean;
    userPermission: boolean;
    selectedRowData: any[];
    userDetail: boolean;
    constructor(
        injector: Injector,
        private _businessEntityAdminChangeRequestServiceProxy: BusinessEntityAdminChangeRequestServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _httpClient: HttpClient,
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getUsers(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();

        this._businessEntityAdminChangeRequestServiceProxy.getAllBusinessEntityAdminChangeRequest(
            null,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }


    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    accept(val: number) {
        this._businessEntityAdminChangeRequestServiceProxy.acceptRequest(val).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe(result => {
                this.primengTableHelper.hideLoadingIndicator();
                this.notify.info(this.l("Request Accepted"));
                this.getUsers();
            });
    }

    reject(val: number) {
        this._businessEntityAdminChangeRequestServiceProxy.rejectRequest(val).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe(result => {
                this.primengTableHelper.hideLoadingIndicator();
                this.notify.info(this.l("Request Rejected"));
                this.getUsers();
            });
    }

}
