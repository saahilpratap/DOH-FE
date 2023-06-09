import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EntityDtoOfInt64, UserListDto, UserServiceProxy, PermissionServiceProxy, BusinessEntitiesServiceProxy, FlatPermissionDto } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { LazyLoadEvent } from 'primeng/public_api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { CreateOrEditUserModalComponent } from './create-or-edit-user-modal.component';
import { EditUserPermissionsModalComponent } from './edit-user-permissions-modal.component';
import { ImpersonationService } from './impersonation.service';
import { HttpClient } from '@angular/common/http';
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';
import { PermissionTreeModalComponent } from '../shared/permission-tree-modal.component';

@Component({
    templateUrl: './users.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./users.component.less'],
    animations: [appModuleAnimation()]
})
export class UsersComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createOrEditUserModal', { static: true }) createOrEditUserModal: CreateOrEditUserModalComponent;
    @ViewChild('editUserPermissionsModal', { static: true }) editUserPermissionsModal: EditUserPermissionsModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('ExcelFileUpload', { static: false }) excelFileUpload: FileUpload;
    @ViewChild('permissionFilterTreeModal', { static: true }) permissionFilterTreeModal: PermissionTreeModalComponent;
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
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        public _impersonationService: ImpersonationService,
        private _userServiceProxy: UserServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _activatedRoute: ActivatedRoute,
        private _httpClient: HttpClient,
    ) {
        super(injector);
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
        this.skipBEUsers = this._activatedRoute.snapshot.queryParams['type'] != undefined ? true : false;
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Import/ImportUser';
    }

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
        this.exportPermission();
        
    }

    getUsers(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }        
        this.primengTableHelper.showLoadingIndicator();

        this._userServiceProxy.getUsers(
            
            this.filterText,
            this.permissionFilterTreeModal.getSelectedPermissions(),
            this.role !== '' ? parseInt(this.role) : undefined,
            this.onlyLockedUsers, this.skipBEUsers,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {           
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
            this.exportHide();
        });
    }

    unlockUser(record): void {
        this._userServiceProxy.unlockUser(new EntityDtoOfInt64({ id: record.id })).subscribe(() => {
            this.notify.success(this.l('UnlockedTheUser', record.userName));
        });
    }

    getRolesAsString(roles): string {
        let roleNames = '';

        for (let j = 0; j < roles.length; j++) {
            if (roleNames.length) {
                roleNames = roleNames + ', ';
            }

            roleNames = roleNames + roles[j].roleName;
        }

        return roleNames;
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    exportToExcel(): void {
        this._userServiceProxy.getUsersToExcel(
            this.filterText,
            this.permissionFilterTreeModal.getSelectedPermissions(),
            this.role !== '' ? parseInt(this.role) : undefined,
            this.onlyLockedUsers,
            this.primengTableHelper.getSorting(this.dataTable), this.skipBEUsers)
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    createUser(): void {
        this.createOrEditUserModal.show();
    }

    uploadExcel(data: { files: File }): void {
        const formData: FormData = new FormData();
        const file = data.files[0];
        formData.append('file', file, file.name);

        this._httpClient
            .post<any>(this.uploadUrl, formData)
            .pipe(finalize(() => this.excelFileUpload.clear()))
            .subscribe(response => {
                if (response.success) {
                    this.notify.success(this.l('ImportUsersProcessStart'));
                } else if (response.error != null) {
                    this.notify.error(this.l('ImportUsersUploadFailed'));
                }
            });
    }

    onUploadExcelError(): void {
        this.notify.error(this.l('ImportUsersUploadFailed'));
    }

    deleteUser(user: UserListDto): void {
        if (user.userName === AppConsts.userManagement.defaultAdminUserName) {
            this.message.warn(this.l('{0}UserCannotBeDeleted', AppConsts.userManagement.defaultAdminUserName));
            return;
        }

        this.message.confirm(
            this.l('UserDeleteWarningMessage', user.userName),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._userServiceProxy.deleteUser(user.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
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
        this.userPermission = this.isGranted("Pages.Administration.Users.Export");
    }
    onSelectionChange(selection: any[]) {
        if (selection.length >= 1) {
            this.userDetail = true;
        }
        else if (selection.length <= 0) {
            this.userDetail = false;
        }
    }

    inviteSelectedItems() {

        if (this.dataTable.selection.length > 0) {

            this.spinnerService.show();
            let items = this.dataTable.selection;           
            if (items.length > 0) {
                this._businessEntitiesServiceProxy.sendUSerDetails(items)
                    .subscribe(res => {
                        if (items.length < 2 && items.length > 0) {
                            this.message.success("" + items.length + " successfully Send User Reset Link ");
                        } else {
                            this.message.success("" + items.length + " successfully Send User Reset Link");
                        }
                        
                        this.spinnerService.hide();
                        this.getUsers();
                    });
            } else {
               
            }


        }
    }
}
