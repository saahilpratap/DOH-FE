import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild,
    Injectable,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    BusinessEntitiesServiceProxy,
    BusinessEntityDto,
    EntityTypeStatus,
    EntityType,
    EntityDto,
    FacilityTypesServiceProxy,
    GetFacilityTypeForViewDto,
    FacilitySubTypeDto,CreateTTXEntityRequestDto,
    FacilitySubTypeServiceProxy,
    CommonLookupServiceProxy,
    GetBusinessEntitiesExcelDto, BusinessEntityFeedbackIds
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditBusinessEntityModalComponent } from './create-or-edit-businessEntity-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import { AppConsts } from '../../../../shared/AppConsts';
import { HttpClient } from '@angular/common/http';
import { CreateOrEditNewEntityGroupModalComponent } from './create-or-edit-newEntityGroup-modal.component';
import { UpdateEntityProfileModalComponent } from './update-entity-profile-modal.component';
import { CreateEntityFeedbackModalComponent } from './Create-EntiyFeedback-modal.component';
import { AppSessionService } from "@shared/common/session/app-session.service";
import { BusinessEntityAdminChangeRequestModalComponent } from './business-entity-admin-change-request-modal/business-entity-admin-change-request-modal.component';
import { Item } from 'angular2-multiselect-dropdown';
import { TTXEntitiesModalComponent } from './ttx-entities/ttx-entities-modal.component';
export class Entitytypes {
    id: number;
    Name: string;
}
@Component({
    templateUrl: './businessEntities.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./businessEntities.component.css'],
    animations: [appModuleAnimation()],
})
@Injectable()
export class BusinessEntitiesComponent extends AppComponentBase {
    @ViewChild('createOrEditBusinessEntityModal', { static: true }) createOrEditBusinessEntityModal: CreateOrEditBusinessEntityModalComponent;
    @ViewChild('CreateEntityFeedbackModal', { static: true }) CreateEntityFeedbackModal: CreateEntityFeedbackModalComponent;
    @ViewChild('createOrEditNewEntityGroupModal', { static: true }) createOrEditNewEntityGroupModal: CreateOrEditNewEntityGroupModalComponent;
    @ViewChild('updateEntityProfileModal', { static: true }) updateEntityProfileModal: UpdateEntityProfileModalComponent;
    @ViewChild('businessEntityAdminChangeRequestModals', { static: true }) businessEntityAdminChangeRequestModals: BusinessEntityAdminChangeRequestModalComponent;
    @ViewChild('ttxEntitiesModals', { static: true }) ttxEntitiesModals: TTXEntitiesModalComponent;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    createttxEntity: CreateTTXEntityRequestDto = new CreateTTXEntityRequestDto();
    entityFeedback: BusinessEntityFeedbackIds = new BusinessEntityFeedbackIds();
    showChart = true;
    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    addressFilter = '';
    entityTypesId: any;
    maxNumberOfYearsInBusinessFilter: any;
    minNumberOfYearsInBusinessFilter: any;
    websiteUrlFilter = '';
    legalNameFilter = '';
    isGovernmentOwnedFilter = null;
    isLicensedFilter = null;
    licenseNumberFilter = '';
    isAuditableFilter = null;
    businessTypeNameFilter = '';
    facilityTypeFilter = 0;
    facilitySubTypeFilter = 0;
    status: EntityTypeStatus = undefined;
    showOnlyDeleted: boolean = false;
    entityTypeStatus = EntityTypeStatus;
    entityTypex = EntityType;
    baseUrl: string;
    uploadUrl: string;
    type: any;
    healthCareEntityCount: any;
    insuranceEntityCount: any;
    externalAuditEntityCount: any;
    cityWiseChart: any[];
    facilityTypeWiseChart: any[];
    allDelete: boolean;
    selectedRowData: any[];
    facilityTypesLookUp: GetFacilityTypeForViewDto[];
    facilitySubType: FacilitySubTypeDto[] = [];
    list: any;
    grid: any;
    view: any[] = [300, 250];
    hview: any[] = [300, 250];
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = 'Entities Citywise';
    showXAxisLabelHorizontal = 'Facility Type';
    showYAxisLabel = true;
    yAxisLabel = '';
    isHealthcareFlag: boolean;
    importcode: string;
    value: any;
    progressInterval: any;
    exportButtonHide: boolean;
    businessEntitiesIdList: number[] = [];
    single = [
        {
            name: 'CSA',
            value: 89,
        },
        {
            name: 'Inc',
            value: 50,
        },
        {
            name: 'Aud',
            value: 72,
        },
        {
            name: 'Aud1',
            value: 72,
        },
        {
            name: 'Aud2',
            value: 72,
        },
    ];
    singleHorizontal = [
        {
            name: 'CSA',
            value: 89,
        },
        {
            name: 'Inc',
            value: 50,
        },
        {
            name: 'Aud',
            value: 72,
        },
        {
            name: 'CSAA',
            value: 89,
        },
        {
            name: 'IncA',
            value: 50,
        },
        {
            name: 'AudA',
            value: 72,
        },
        {
            name: 'CSAB',
            value: 89,
        },
        {
            name: 'IncB',
            value: 50,
        },
        {
            name: 'AudB',
            value: 72,
        },
        {
            name: 'CSAC',
            value: 89,
        },
        {
            name: 'IncC',
            value: 50,
        },
        {
            name: 'AudC',
            value: 72,
        },
    ];
    showLabels: boolean = true;
    feedbackbutton: boolean = false;
    orphanFlag: boolean = false;
    dropdownOptions: any;
    EntityTypes: EntityType;
    EntitysDetails = [
        {
            Id: 0,
            Name: 'Healthcare Entities',
        },
        {
            Id: 2,
            Name: 'Insurance Facilities',
        },
    ];
    config = {
        displayKey: 'description',
        search: true,
        height: 'auto',
        placeholder: 'Select',
        customComparator: () => { },
        limitTo: 0,
        moreText: 'more',
        noResultsFound: 'No results found!',
        searchPlaceholder: 'Search',
        searchOnKey: 'name',
        clearOnSelection: false,
        inputDirection: 'ltr',
    };

    colorScheme = {
        domain: ['#00c5dc', '#ffb822', '#716aca'],
    };
    data: any;
    displayAdvancedFiltersModal: boolean;
    dataList: BusinessEntityDto[] = [];
    show: boolean = false;
    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _httpClient: HttpClient,
        private _fileDownloadService: FileDownloadService,
        private _router: Router,
        private _facilityTypesProxy: FacilityTypesServiceProxy,
        private _facilitySubTypeServiceProxy: FacilitySubTypeServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy
    ) {
        super(injector);

        this.type = this._activatedRoute.snapshot.queryParams['type'] || '';
        this.EntityTypes = this.type;
        this.baseUrl =
            AppConsts.remoteServiceBaseUrl + '/File/ImportBusinessEntities';
        this.uploadUrl =
            AppConsts.remoteServiceBaseUrl + '/Import/ImportBusinessEntities';
        this.initializeFacilityTypesLookUp();
        this.show = false;
    }

    ngOnInit() {
        this.list = true;
        if (this.type != 1) {
            this.checkType();
        }

        this.isHealthcareFlag = this.isHealthcare();
        this.getEntityDashboardCount();
        this.checkBusinessEntityType();

        // this.getBusinessEntities();
        this.getData();
    }

    getData() {
        this._businessEntitiesServiceProxy.getAllList().subscribe((result) => {
            this.dataList = result;
        });
    }      
    checkType() {

        var checktype = this._appSessionService.user.type;
        switch (checktype) {
            case 0:
                {
                    this.EntityTypes = EntityType.HealthcareEntity;
                    this.type = EntityType.HealthcareEntity;
                    this.feedbackbutton = true;
                    this.orphanFlag = true;
                      break;
                }
            case 1:
                {
                    this.EntityTypes = EntityType.HealthcareEntity;
                    this.type = EntityType.HealthcareEntity;
                    this.feedbackbutton = false;
                    this.orphanFlag = false;
                    break;
                }
            case 2:
                {
                    this.EntityTypes = EntityType.ExternalAudit;
                    this.type = EntityType.ExternalAudit;
                    this.feedbackbutton = false;
                    this.orphanFlag = false;
                    break;

                }
            case 3:
                {
                    this.EntityTypes = EntityType.HealthcareEntity;
                    this.type = EntityType.HealthcareEntity;
                    this.feedbackbutton = true;
                    this.orphanFlag = true;
                    break;
                }
            case 4:
                {
                    this.EntityTypes = EntityType.InsuranceFacilities;
                    this.type = EntityType.InsuranceFacilities;
                    this.feedbackbutton = false;
                    this.orphanFlag = false;
                    break;
                }
        }
    }

    entityInform() {

        if (this.dataTable.selection.length > 0) {
            this.message.confirm("", this.l("Are you sure ? You want to inform business entities for selected records."), isConfirmed => {
                if (isConfirmed) {

                    this.spinnerService.show();

                    let items = this.dataTable.selection.map(x => x.businessEntity.id);
                    if (this.dataTable.selection.length > 0) {
                        this._businessEntitiesServiceProxy.sendEntityInform(items)
                            .subscribe(res => {
                                if (items.length < 2 && items.length > 0) {
                                    this.notify.success("" + items.length + " Entity are successfully Inform");
                                } else {
                                    this.notify.success("" + items.length + " Entities are successfully Inform");
                                }
                                this.spinnerService.hide();
                                // this.getPreRequests();
                            });
                    }
                    this.spinnerService.hide();
                }
            });
        }
    }

    showGrid() {
        this.grid = true;
        this.list = false;
        this.getBusinessEntities(null);
    }

    showList() {
        this.grid = false;
        this.list = true;
        this.getBusinessEntities(null);
    }

    initializeFacilityTypesLookUp() {
        this._facilityTypesProxy.getAllFacilityType().subscribe((res) => {
            this.facilityTypesLookUp = res;
        });
    }

    onSelectionChange(selection: any) {      
       
        this.businessEntitiesIdList = [];
        selection.forEach(data => {             
            this.businessEntitiesIdList.push(data.businessEntity.id);          
        });
       
        if (selection.length > 0) {
            this.show = true;

        }
        else {
            this.show = false;
        }

    }
    ontypeChange(entityTypesId: any) {
        if (entityTypesId != undefined) {
            if (entityTypesId == 0) {
                this.type = EntityType.HealthcareEntity;
                this.getBusinessEntities(null);
            } else if (entityTypesId == 2) {
                this.type = EntityType.InsuranceFacilities;
                this.getBusinessEntities(null);
            }
        }
        this.entityTypesId = null;
    }

    deleteAllRecord() {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), (isConfirmed) => {
            if (isConfirmed) {
            }
        });
    }

    getBusinessEntities(event?: LazyLoadEvent) {

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();

        if (this.list == true) {
            this._businessEntitiesServiceProxy
                .getAll(
                    this.filterText,
                    this.nameFilter,
                    this.addressFilter,
                    this.maxNumberOfYearsInBusinessFilter ?? undefined,
                    this.minNumberOfYearsInBusinessFilter ?? undefined,
                    this.websiteUrlFilter,
                    this.legalNameFilter,
                    this.isGovernmentOwnedFilter ?? undefined,
                    this.isLicensedFilter ?? undefined,
                    this.licenseNumberFilter,
                    this.isAuditableFilter ?? undefined,
                    this.facilityTypeFilter,
                    this.facilitySubTypeFilter,
                    this.status,
                    this.type,
                    this.showOnlyDeleted,
                    this.primengTableHelper.getSorting(this.dataTable),
                    this.primengTableHelper.getSkipCount(this.paginator, event),
                    this.primengTableHelper.getMaxResultCount(this.paginator, event)
                )
                .subscribe((result) => {

                    this.data = result.items;
                    this.primengTableHelper.totalRecordsCount = result.totalCount;
                    this.primengTableHelper.records = result.items;
                    this.primengTableHelper.hideLoadingIndicator();
                    this.exportHide();
                });
        }

        else {
            this._businessEntitiesServiceProxy
                .getGridAll(
                    this.filterText,
                    this.nameFilter,
                    this.addressFilter,
                    this.maxNumberOfYearsInBusinessFilter ?? undefined,
                    this.minNumberOfYearsInBusinessFilter ?? undefined,
                    this.websiteUrlFilter,
                    this.legalNameFilter,
                    this.isGovernmentOwnedFilter ?? undefined,
                    this.isLicensedFilter ?? undefined,
                    this.licenseNumberFilter,
                    this.isAuditableFilter ?? undefined,
                    this.facilityTypeFilter,
                    this.facilitySubTypeFilter,
                    this.status,
                    this.type,
                    this.showOnlyDeleted,
                    this.primengTableHelper.getSorting(this.dataTable),
                    this.primengTableHelper.getSkipCount(this.paginator, event),
                    this.primengTableHelper.getMaxResultCount(this.paginator, event)
                )
                .subscribe((result) => {                  
                    this.primengTableHelper.totalRecordsCount = result.totalCount;
                    this.primengTableHelper.records = result.items;
                    this.primengTableHelper.hideLoadingIndicator();
                    this.exportHide();
                });
        }
        this.displayAdvancedFiltersModal = false;
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createBusinessEntity(): void {
        this._router.navigate(['/app/main/businessEntities/businessEntities/new'], {
            queryParams: {
                type: this.type,
            },
        });
    }

    funGoTobusinessentityDetail(businessEntityId: number) {
        this._router.navigate(['/app/main/businessEntities/businessEntities/new'], {
            queryParams: {
                businessEntityId: businessEntityId,
                type: this.type,
            },
        });
    }

    editBusinessEntity(businessEntityId: number): void {

        this._router.navigate(['/app/main/businessEntities/businessEntities/new'], {
            queryParams: {
                businessEntityId: businessEntityId,
                type: this.type,
            },
        });
    }

    createAdminAccount(businessEntityId: number): void {
        var par = new EntityDto();
        par.id = businessEntityId;
        this.message.confirm('', this.l('AreYouSure'), (isConfirmed) => {
            if (isConfirmed) {
                this._businessEntitiesServiceProxy.createAdmin(par).subscribe(() => {
                    this.reloadPage();
                    this.notify.success(this.l('Successfully Created!'));
                });
            }
        });
    }

    deleteBusinessEntity(businessEntity: BusinessEntityDto): void {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), (isConfirmed) => {
            if (isConfirmed) {
                this._businessEntitiesServiceProxy
                    .delete(businessEntity.id)
                    .subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
            }
        });
    }

    deactivate(businessEntityId: number) {

        this.message.confirm("You Want To Deactivate This Entity", this.l("Are you Sure?"), (isConfirmed) => {
            if (isConfirmed) {
                this._businessEntitiesServiceProxy
                    .deactivate(businessEntityId)
                    .subscribe(() => {
                        this.reloadPage();
                        //this.getData();
                        this.notify.success(this.l('Sucessfully Deactivated'));
                    })
            }

        });
    }
    

    activate(record) {
        if (!record.businessEntity.hasAdminGenerated) {
            this.message.warn('Please create an admin account first');
            return;
        }
        this.message.confirm("You Want To Activate This Entity", this.l("Are you Sure?"), (isConfirmed) => {
            if (isConfirmed) {
                this._businessEntitiesServiceProxy
                    .activate(record.businessEntity.id)
                    .subscribe(() => {
                        this.reloadPage();
                        //this.getData();
                        this.notify.success(this.l('Sucessfully Activated'));
                    });
            }
        });
    }

    showAll() {
        this.showOnlyDeleted = false;
        this.status = undefined;
        this.reloadPage();
    }

    showDeleted() {
        this.showOnlyDeleted = true;
        this.reloadPage();
    }

    showNotApproved() {
        this.status = EntityTypeStatus.NotApproved;
        this.reloadPage();
    }

    exportToExcel(event?: LazyLoadEvent): void {
        this.spinnerService.show();
        this._businessEntitiesServiceProxy
            .getBusinessEntitiesToExcel(
                this.filterText,
                this.nameFilter,
                this.addressFilter,
                this.maxNumberOfYearsInBusinessFilter ?? undefined,
                this.minNumberOfYearsInBusinessFilter ?? undefined,
                this.websiteUrlFilter,
                this.legalNameFilter,
                this.isGovernmentOwnedFilter ?? undefined,
                this.isLicensedFilter ?? undefined,
                this.licenseNumberFilter,
                this.isAuditableFilter ?? undefined,
                this.facilityTypeFilter,
                this.facilitySubTypeFilter,
                this.status,
                this.type,
                this.showOnlyDeleted,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe(
                (result) => {
                    this.spinnerService.hide();
                    this._fileDownloadService.downloadTempFile(result);
                },
                () => {
                    this.spinnerService.hide();
                    this.message.error(
                        'Couldn\'t download Business Entities Data for now, try later!'
                    );
                }
            );
        this.spinnerService.hide();
    }

    uploadFile(event): void {
        let file = event.target.files[0];
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        this.spinnerService.show();
        this._httpClient.post<any>(this.baseUrl, formData).subscribe(
            () => {
                this.reloadPage();
                this.spinnerService.hide();
            },
            (err) => {
                this.message.error(err.error.error.message);
            }
        );
    }

    createTTXentitymodel()
    {      
        if (this.dataTable.selection.length > 0) {
            this.createttxEntity.businessEntityId = [];
            this.spinnerService.show();
            let items = this.dataTable.selection;
            for (let i = 0; i < this.dataTable.selection.length; i++) {
                var ids = this.dataTable.selection[i].businessEntity;
                this.createttxEntity.businessEntityId.push(ids.id)
            }
            if (items.length > 0) {
                this.ttxEntitiesModals.show(this.createttxEntity);
                this.spinnerService.hide();
            }
            else {

            }
            this.dataTable.selection = [];
            this.spinnerService.hide();
        }
    }

    createFeedbackEntity() {

        if (this.dataTable.selection.length > 0) {
            this.entityFeedback.businessEntityId = [];
            this.spinnerService.show();
            let items = this.dataTable.selection;
            for (let i = 0; i < this.dataTable.selection.length; i++) {
                var ids = this.dataTable.selection[i].businessEntity;
                this.entityFeedback.businessEntityId.push(ids.id)
            }
            if (items.length > 0) {
                this.CreateEntityFeedbackModal.show(this.entityFeedback);
                this.spinnerService.hide();
            }
            else {

            }
            this.dataTable.selection = [];

        }
    }

    importFile(data: { files: File }): void {
        const file = data.files[0];
        const formData: FormData = new FormData();
        var filename = file.name;
        var fileExtension = filename.split('.').pop();
        if (fileExtension.toLowerCase() == 'xlsx'.toLowerCase()) {
            this.message.confirm('', this.l('Are You Sure You Want To Import ' + file.name),
                (isConfirmed) => {
                    if (isConfirmed) {
                        let teantid = this.appSession.tenantId;
                        let userid = this.appSession.userId;
                        formData.append('file', file, file.name);
                        formData.append('teantId', teantid.toString());
                        formData.append('userid', userid.toString());
                        this._httpClient
                            .post<any>(this.uploadUrl, formData)
                            .subscribe((response) => {
                                if (response.success) {
                                    this.notify.success(
                                        this.l('Import Business Entity Process Start')
                                    );
                                    this.importcode = response.result.getRandom;
                                    this.setIntrvl(this.importcode);
                                } else if (response.error != null) {
                                    this.notify.error(
                                        this.l('Import Business Entity Process Failed')
                                    );
                                }
                            });
                    }
                }
            );
        }
        else {
            this.notify.error(this.l('Please use the correct file format - .xlsx is required'));
        }
    }

    createEntityGroup(): void {       
        var businessEntitiesList = this.primengTableHelper.records.map(
            (x) => x.businessEntity.id
        );
        this._businessEntitiesServiceProxy
            .entityGroupExistOrNot(businessEntitiesList)
            .subscribe((result) => {

                if (result.roleName.trim().toLowerCase() != 'business entity admin' && result.roleName.trim().toLowerCase() != 'insurance entity admin') {
                    this.message.info('Login as Entity Admin to setup group');
                } else {
                    this._businessEntitiesServiceProxy.getGroupInfoByUserId()
                        .subscribe((res) => {
                            var parameter = true;
                            if (res.isGroup && res.isPrimary) {
                                parameter = false;
                            }
                            else if (res.isGroup == false) {
                                parameter = false;
                            }
                            this.createOrEditNewEntityGroupModal.show(parameter, result.createOrEditEntityGroupDto.id);
                        });
                }
            });
    }

    updateEntityProfile() {       
        this.updateEntityProfileModal.show(this.businessEntitiesIdList);
    }

    getEntityDashboardCount() {
        var getdashboard = this._businessEntitiesServiceProxy.getBusinessEntityChartValue(this.type).subscribe((result) => {
            this.healthCareEntityCount = result.healthCareEntityCount;
            this.insuranceEntityCount = result.insuranceFacilitiesCount;
            this.externalAuditEntityCount = result.externalAuditCount;
            this.cityWiseChart = result.cityValueChart;
            this.facilityTypeWiseChart = result.facilityTypeValueChart;
        });

    }

    isHealthcare(): boolean {
        return this._router.url.includes("healthcare");
    }

    hasCreatePermission(): boolean {
        return this.isHealthcareFlag
            ? this.isGranted("Pages.HealthCareEntities.Create")
            : this.isGranted("Pages.AuditManagement.Entities.Create");
    }

    hasDeletePermission(): boolean {
        return this.isHealthcareFlag
            ? this.isGranted("Pages.HealthCareEntities.Delete")
            : this.isGranted("Pages.AuditManagement.Entities.Delete");
    }

    hasActivateDectivePermission(): boolean {
        return this.isHealthcareFlag
            ? this.isGranted("Pages.HealthCareEntities.ActivateDeActivate")
            : this.isGranted("Pages.AuditManagement.ActivateDeActivate");
    }


    hasExportPermission(): boolean {
        return this.isHealthcareFlag
            ? this.isGranted("Pages.HealthCareEntities.Export")
            : this.isGranted("Pages.AuditManagement.Entities.Export");
    }

    hasImportPermission(): boolean {
        return this.isHealthcareFlag
            ? this.isGranted("Pages.HealthCareEntities.Import")
            : this.isGranted("Pages.AuditManagement.Entities.Import");
    }

    hasEditPermission(): boolean {
        return this.isHealthcareFlag
            ? this.isGranted("Pages.HealthCareEntities.Edit")
            : this.isGranted("Pages.AuditManagement.Entities.Edit");
    }

    checkBusinessEntityType(): number {
        return this.isHealthcareFlag ? 1 : 0
    }

    isChartPermission(): boolean {
        return this.isHealthcareFlag
            ? true
            : false;
    }

    checkFacilitychange() {
        this.facilityTypeFilter = this.facilityTypeFilter;
        this.initilizationFacilitySubtype(this.facilityTypeFilter);

    }

    async initilizationFacilitySubtype(id: number) {
        this.facilitySubType = [];
        if (this.facilityTypeFilter == 0) {
            this.facilitySubTypeFilter = 0;
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
                        this.getBusinessEntities();

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

    OrphanActive(businessEntityId: number)
    {        
        this.message.confirm('', this.l('Are You Sure You Want To make entity Orphan ?'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._businessEntitiesServiceProxy.orphanEntity(businessEntityId)
                        .subscribe(() => {
                            this.reloadPage();
                            //Swal.fire('Thank you...', 'Sucessfully set as in Orphan', 'success')
                            this.notify.success(this.l('Sucessfully Set as in Orphan'));
                        });
                }
            }
        );
    }

    OrphanDeactive(businessEntityId: number) {
        this.notify.success("" + businessEntityId);
        this.message.confirm('', this.l('Are You Sure You Want To remove entity Orphan ?'),
            (isConfirmed) => {
                if (isConfirmed) {
                    if (isConfirmed) {
                        this._businessEntitiesServiceProxy.removeOrphanEntityField(businessEntityId)
                            .subscribe(() => {
                                this.reloadPage();
                                this.notify.success(this.l('Sucessfully Remove Orphan field to this entity'));
                            });
                    }
                    
                }
            }
        );
    }

}
