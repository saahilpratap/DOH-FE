import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild,
    OnInit
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import { BusinessEntitiesServiceProxy, EntityType, GetFacilityTypeForViewDto, DynamicNameValueDto, FacilityTypesServiceProxy, FacilitySubTypeDto, FacilitySubTypeServiceProxy, CommonLookupServiceProxy } from "../../../shared/service-proxies/service-proxies";
import { AppConsts } from "../../../shared/AppConsts";
import { HttpClient } from "@angular/common/http";
import { createOrEditPreRegisterModalComponent } from "./edit-preRegister-entity-modal.component";
import { FileUpload } from 'primeng/fileupload';
import { finalize } from "rxjs/operators";

@Component({
    templateUrl: "./pre-register-user.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PreRegistrationComponent extends AppComponentBase implements OnInit {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild('editPreEntityProcessModal', { static: true }) editPreEntityProcessModal: createOrEditPreRegisterModalComponent;
    @ViewChild('ExcelFileUpload', { static: false }) excelFileUpload: FileUpload;
    advancedFiltersAreShown = false;
    filterText = "";
    entityType = EntityType;
    facilityTypeId = 0;
    facilitySubTypeId = 0;
    districtId = 0;
    facilityTypesLookUp: GetFacilityTypeForViewDto[];
    facilitySubTypesDynamicParameter: DynamicNameValueDto[];
    districtsDynamicParameter: DynamicNameValueDto[];
    facilitySubType: FacilitySubTypeDto[] = [];
    uploadUrl = "";
    selectedItems = [];
    showBtn = false;
    isVerificationDone: any = "";
    isRequestApproved: any = "";
    importcode: string;
    value: any;
    progressInterval: any;
    constructor(
        injector: Injector, private _businessEntityServiceProxy: BusinessEntitiesServiceProxy,
        private _facilityTypesProxy: FacilityTypesServiceProxy, private _httpClient: HttpClient,
        private _preRegisterServiceProxy: BusinessEntitiesServiceProxy,
        private _facilitySubTypeServiceProxy: FacilitySubTypeServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy
    ) {
        super(injector);
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Import/ImportPreRegisterEntities';
    }

    ngOnInit() {
        this.initializeFacilityTypesLookUp();
        this.loadFacilitySubTypes();
        this.loadDistricts();
    }

    initializeFacilityTypesLookUp() {
        this._facilityTypesProxy.getAllFacilityType().subscribe(res => {
            this.facilityTypesLookUp = res;
        });
    }

    loadDistricts() {
        this._businessEntityServiceProxy.getDynamicEntityDatabyName("Districts")
            .subscribe(res => {
                this.districtsDynamicParameter = res;
            });
    }

    loadFacilitySubTypes() {
        this._businessEntityServiceProxy.getDynamicEntityDatabyName("Facility SubTypes")
            .subscribe(res => {
                this.facilitySubTypesDynamicParameter = res;
            });
    }

    inviteSelectedItems() {
        
        if (this.dataTable.selection.length > 0) {
            
            this.spinnerService.show();
            let items = this.dataTable.selection.filter(e => e.isRequestApproved == false && e.adminEmail!=null);
            let approveditems = this.dataTable.selection.filter(e => e.isVerificationDone == true);
            if (items.length > 0) {
                this._businessEntityServiceProxy.preRegistrationSelectedApprovals(items)
                    .subscribe(res => {
                        if (items.length < 2 && items.length > 0) {
                            this.notify.success("" + items.length + " entity has successfully Invited");
                        } else {
                            this.notify.success("" + items.length + " entities has successfully Invited");
                        }
                        setTimeout(() => {
                            if (approveditems.length < 2 && approveditems.length > 0) {
                                this.message.success("Link has already been verified for successful registration of " + approveditems.length + " entity");
                            } else {
                                if (approveditems.length > 0) {
                                    this.message.success("Link has already been verified for successful registration of " + approveditems.length + " entities");
                                }
                            }
                        }, 1000);
                        this.spinnerService.hide();
                        this.getPreRequests();
                    });
            } else {
                setTimeout(() => {
                    if (approveditems.length < 2 && items.length > 0) {
                        this.message.success("Link has already been verified for successful registration of " + approveditems.length + " entity");
                    } else {
                        if (items.length == 0) {
                            let getcheck = this.dataTable.selection.filter(e => e.isRequestApproved == true);
                            if (getcheck.length>0) {
                                this.message.success("Link has already been verified for successful registration of " + getcheck.length + " entities");

                            }
                         //   this.message.success("Please insert valid admin email");

                        }
                        else {
                            this.message.success("Link has already been verified for successful registration of " + approveditems.length + " entities");
                        }
                    }
                    this.spinnerService.hide();
                }, 1000);
            }


        }
    }

    businessEntityApproval() {

        if (this.dataTable.selection.length > 0) {
            this.message.confirm("", this.l("Are you sure ? You want to generate business entities for selected records."), isConfirmed => {
                if (isConfirmed) {
                    this.spinnerService.show();
                    let items = this.dataTable.selection.filter(e => e.isRequestApproved == true);
                    let approveditems = this.dataTable.selection.filter(e => e.isVerificationDone == true);
                    if (items.length > 0) {
                        this._businessEntityServiceProxy.businessEntityApproval(items)
                            .subscribe(res => {
                                if (items.length < 2 && items.length > 0) {
                                    this.notify.success("" + items.length + " Entity are successfully Approved");
                                } else {
                                    this.notify.success("" + items.length + " Entities are successfully Approved");
                                }
                                this.spinnerService.hide();
                                this.getPreRequests();
                            }); 
                    }
                    this.spinnerService.hide();
                }
            });
        }

      
    }

    deleteSelectedItems() {
        if (this.dataTable.selection.length > 0) {
            this.message.confirm("", this.l("AreYouSure"), isConfirmed => {
                if (isConfirmed) {
                    this.spinnerService.show();
                    let ids = this.dataTable.selection.map(({ id }) => id);
                    this._businessEntityServiceProxy.deleteSelectedPreRegEntry(ids)
                        .subscribe(res => {
                            this.spinnerService.hide();
                            this.message.success("Successfully Deleted " + ids.length + " records");
                            this.showBtn = false;
                            this.dataTable.selection = [];
                            this.getPreRequests();
                        });
                }
            });
        }
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    getPreRequests(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._preRegisterServiceProxy.getAllPreRegisterRequests(this.filterText, this.facilityTypeId, this.facilitySubTypeId, this.districtId,
            this.isVerificationDone ?? undefined, this.isRequestApproved ?? undefined,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)).subscribe(result => {
                
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    activateEntity(record) {
        record.isRequestApproved = true;
        this.message.success(this.l('Pre Register Entities Activate Successfully'));
        this.updateEntity(record);
    }

    deActivateEntity(record) {
        record.isRequestApproved = false;
        this.message.success(this.l('Pre Register Entities Deactivate Successfully'));
        this.updateEntity(record);
    }

    updateEntity(record) {
        this._preRegisterServiceProxy.preRegistrationApproval(record).subscribe(res =>
        {
            this.getPreRequests();
        });
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
                                this.notify.success(this.l('Import Pre Register Entities Process Start'));
                                this.importcode = response.result.getRandom;
                                this.setIntrvl(this.importcode);
                            } else if (response.error != null) {
                                this.notify.error(this.l('Import Pre Register Entities Failed'));
                            }

                        });
                }
            });
        }
        else {
            this.notify.error(this.l('Please use the correct file format - .xlsx is required'));
        }
    }

    onAllRowSelect(event) {
        if (this.dataTable.selection.length > 0) {
            this.showBtn = true;
        }
        else {
            this.showBtn = false;
        }
    }

    onRowSelect(event) {
        if (this.dataTable.selection.length > 0) {
            this.showBtn = true;
        }
    }

    onRowUnselect(event) {
        if (this.dataTable.selection.length === 0) {
            this.showBtn = false;
        }
    }

    deletePreEntry(id) {
        this.spinnerService.show();
        this._businessEntityServiceProxy.deletePreRegEntry(id).pipe(finalize(() => { this.spinnerService.hide(); }))
            .subscribe(res => {
                this.notify.success(this.l("SuccessfullyDeleted"));
            });
    }

    checkFacilitychange() {
        this.facilityTypeId = this.facilityTypeId;
        this.initilizationFacilitySubtype(this.facilityTypeId);

    }

    async initilizationFacilitySubtype(id: number) {
        this.facilitySubType = [];
        if (this.facilityTypeId == 0) {
            this.facilitySubTypeId = 0;
        }
        else {
            this._facilitySubTypeServiceProxy.getFacilitySubtypeAll(id).subscribe(res => {
                this.facilitySubType = res;
            });
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
                        this.getPreRequests();

                    }
                })
           
            });

    }

    setIntrvl(code: string) {
        this.progressInterval = setInterval(() => this.RefreshComponent(code), 1000);
    }
}
