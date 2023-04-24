import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    Injectable,
    OnInit,
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import * as moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import {
    BusinessEntitiesServiceProxy,
    DynamicNameValueDto,
    ControlType,
    FacilitySubTypeDto,
    CustomDynamicServiceProxy,
    AuthorityDepartmentsServiceProxy,
    CountriesServiceProxy,
    FacilityTypeDto,
    FacilityTypesServiceProxy,
    EntityGroupsServiceProxy,
    CreateOrEditBusinessEntityDto,
    GetCountryForViewDto,

    GetFacilityTypeForViewDto,
    GetBusinessEntitiesExcelDto,
    EntityGroupDto,
    BusinessEntityUserDto,
    EntityType,
    ContactsServiceProxy,
    AuthoritativeDocumentDto,
    AuthoritativeDocumentsServiceProxy,
    ContactDto,
    WorkFlowPageDto,
    GetContactForViewDto,
    FacilitySubTypeServiceProxy,
} from "../../../../shared/service-proxies/service-proxies";
import { async } from "@angular/core/testing";
import { number } from "@amcharts/amcharts4/core";
import { AppSessionService } from "@shared/common/session/app-session.service";

@Component({
    selector: "createOrEditBusinessEntityModal",
    templateUrl: "./create-or-edit-businessEntity-modal.component.html",
    styleUrls: ["./create-or-edit-businessEntity-modal.component.less"],
})
@Injectable()
export class CreateOrEditBusinessEntityModalComponent extends AppComponentBase implements OnInit {


    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    type: any;
    active = false;
    saving = false;
    logo: any;
    districtsDynamicParameter: DynamicNameValueDto[];
    connectivityDynamicParameter: DynamicNameValueDto[];
    controlType = ControlType;
    facilities: GetFacilityTypeForViewDto[];
    subfaclility: GetFacilityTypeForViewDto[];
    businessEntity: CreateOrEditBusinessEntityDto = new CreateOrEditBusinessEntityDto();
    countriesLookUp: GetCountryForViewDto[];
    facilityTypesLookUp: FacilityTypeDto[];
    businessEntitiesLookUp: GetBusinessEntitiesExcelDto[];
    notifiersEntitiesLookup: GetContactForViewDto[];
    entityGroupsLookUp: EntityGroupDto[];
    beUsers: BusinessEntityUserDto[] = [];
    authorityUsers: BusinessEntityUserDto[] = [];
    facilitySubType: FacilitySubTypeDto[] = [];
    businessTypeName = "";
    facilityTypeName = "";
    filterText = "";
    codeFilter = "";
    firstNameFilter = "";
    lastNameFilter = "";
    jobTitleFilter = "";
    mobileFilter = "";
    directPhoneFilter = "";
    sameForAdmin = false;
    showFsTypeSize = false;
    accept: any;
    facilityTypeId: any;
    workflow: WorkFlowPageDto[];
    authoritavuieDocuments: AuthoritativeDocumentDto[];
    facilityInsuranceId: any;
    editEntityPersonalDetailsPermission: boolean;
    editContactInfoPermission: boolean;
    editEntityInfoPermission: boolean;
    editBackUpInfoPermission: boolean;
    editWorkFlowPermission: boolean;
    showAuditstatusButton: boolean = false;
    isAdminorAuditorFlag: boolean;
    regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private _facilitySubtypeServiceProxiy: FacilitySubTypeServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _countriesServiceProxy: CountriesServiceProxy,
        private _authoritativeDocumentsServiceProxy: AuthoritativeDocumentsServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy,

        private _facilityTypesProxy: FacilityTypesServiceProxy,
        private _businessEntitiesProxy: BusinessEntitiesServiceProxy,
        private _entityGroupsProxy: EntityGroupsServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _contactsServiceProxy: ContactsServiceProxy,
        private _authorityDepartmentsServiceProxy: AuthorityDepartmentsServiceProxy,
        private _router: Router
    ) {
        super(injector);
        this.type = this._activatedRoute.snapshot.queryParams["type"] || "";
    }

    isEmail(search: string): boolean {
        var serchfind: boolean;
        serchfind = this.regexp.test(search);
        return serchfind;
    }

    ngOnInit(): void {

        let businessEntityId = this._activatedRoute.snapshot.queryParams[
            "businessEntityId"
        ];
        this.checkType();
        this.checkUserType();
        this.show(businessEntityId);
    }
    checkType() {
        var checktype = this._appSessionService.user.type;
        switch (checktype) {
            case 0:
                {
                    this.showAuditstatusButton = true;
                    break;
                }
            case 1:
                {
                    this.showAuditstatusButton = false;
                    break;
                }
            case 2:
                {

                    this.showAuditstatusButton = false;
                    break;
                }
            case 3:
                {
                    this.showAuditstatusButton = true;
                    break;
                }
            case 4:
                {
                    this.showAuditstatusButton = false;
                    break;
                }
        }
    }


    loadDistricts() {
        this._businessEntitiesServiceProxy.getDynamicEntityDatabyName("Districts")
            .subscribe(res => {
                this.districtsDynamicParameter = res;
            });
    }

    loadConnectivity() {
        this._businessEntitiesServiceProxy.getDynamicEntityDatabyName("Connectivity")
            .subscribe(res => {
                this.connectivityDynamicParameter = res;
            });
    }
    initializeCountriesForLookUp() {
        this._countriesServiceProxy.getallCountry().subscribe((res) => {
            this.countriesLookUp = res;
        });
    }

    initializeRelatedUsers() {
        this._businessEntitiesServiceProxy
            .getAllUsers(this.businessEntity.id)
            .subscribe((res) => {
                this.beUsers = res;
            });
    }

    async initializeinsuranceFacilitiesType() {
        this.facilityTypesLookUp = [];
        this._facilityTypesProxy.getAllFacilityTypes().subscribe((res) => {

            this.facilityTypesLookUp = res.filter(x => x.name.trim().toLowerCase() == "Insurance Facility".trim().toLowerCase() || x.name.trim().toLowerCase() == "Payers".trim().toLowerCase());
            //res.forEach(obj => {
            //    if (obj.name == "Insurance Facility".toString()) {
            //        this.facilityTypesLookUp.push(obj);
            //    }
            //});


        });
    }

    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    async initializeFacilityTypesForLookUp() {
        this.facilityTypesLookUp = [];
        this._facilityTypesProxy.getAllFacilityTypes().subscribe(async (res) =>
        {
            
            this.facilityTypesLookUp = res.filter(x => x.name.trim().toLowerCase() != "Insurance Facility".trim().toLowerCase() && x.name.trim().toLowerCase()!= "Payers".trim().toLowerCase());
            //res.forEach(obj => {
            //    if (obj.name.trim().toLowerCase() != "Insurance Facility".trim().toLowerCase()) {
            //        this.facilityTypesLookUp.push(obj);
            //    }
            //});

        });
    }

    initializeWorkFlow() {
        this._authorityDepartmentsServiceProxy.getAllPages()
            .subscribe(res => {
                this.workflow = res;
                let id = this.workflow.find(x => x.pageName.trim().toLowerCase() == 'Global'.trim().toLowerCase()).id;
                this.businessEntity.workFlowNameId = id;
            });
    }



    initializeEntityGroupsLookUp() {
        this._entityGroupsProxy.getAllForLookUp().subscribe((res) => {
            this.entityGroupsLookUp = res;
        });
    }

    initializeBusinessTypeForLookUp() {
        //this._businessTypesProxy.getAllBusinessType().subscribe((res) => {
        //  this.businessTypesLookUp = res;
        //});
    }



    initializeBusinessEntitiesLookUp() {
        this._businessEntitiesProxy.getAllForLookups().subscribe((res) => {
            this.businessEntitiesLookUp = res;
        });
    }

    async initilizationFacilitySubtype(id: number) {
        this.facilitySubType = [];
        this._facilitySubtypeServiceProxiy.getFacilitySubtypeAll(id).subscribe(res => {
            this.facilitySubType = res;
        });
    }

    initializeNotifiers(businessEntityId?: number) {
        this._contactsServiceProxy
            .getAll(
                this.filterText,
                this.codeFilter,
                this.firstNameFilter,
                this.lastNameFilter,
                this.jobTitleFilter,
                this.mobileFilter,
                this.directPhoneFilter,
                undefined,
                0,
                1000
            )
            .subscribe((result) => {
               
                this.notifiersEntitiesLookup = result.items.filter(x => x.contact.businessEntityId == businessEntityId);
            });
    }

    getAllAuthorativeUserLookup(businessEntityId: number) {
        this._businessEntitiesProxy.getTechnicalCommiteuser(businessEntityId).subscribe(res => {
            this.authorityUsers = res;

        });
    }

    async show(businessEntityId?: number) {

        this.active = true;
        this.initializeCountriesForLookUp();
        //this.initializeBusinessTypeForLookUp();
        this.checkBusinessTypePersonalDetailsPermission();
        this.checkContactInfoPermission();
        this.checkEntityInfoPermission();
        this.checkPrimaryandBackUpInfoPermission();
        this.checkWorkFlowPermission();
        this.initializeBusinessEntitiesLookUp();
        this.initializeEntityGroupsLookUp();
        this.initializeNotifiers(businessEntityId);
        this.loadDistricts();
        this.loadConnectivity();

        if (!businessEntityId) {
            this.businessEntity = new CreateOrEditBusinessEntityDto();
            this.businessEntity.id = businessEntityId;
            this.businessTypeName = "";
            this.facilityTypeName = "";
            this.active = true;
            this.businessEntity.entityType = EntityType.HealthcareEntity;
            if (this.businessEntity.entityType == EntityType.HealthcareEntity) {
                await this.initializeFacilityTypesForLookUp();
            }

            this.businessEntity.isLicensed = true;
            if (this.modal != undefined) {
                this.modal.show();
            }
        } else {
            this.spinnerService.show();
            setTimeout(() => {
                this.initializeAuthoritativeDocumentLookUp();
            }, 1000);

            this._businessEntitiesServiceProxy
                .getBusinessEntityForEdit(businessEntityId)
                .subscribe(async (result) => {
                    this.businessEntity = result.businessEntity;
                    if (this.businessEntity.entityType == EntityType.HealthcareEntity) {

                        await this.initializeFacilityTypesForLookUp();

                    }
                    else {
                        await this.initializeinsuranceFacilitiesType();
                    }


                    // this.businessEntity.address = JSON.parse(this.businessEntity.address);
                    this.logo = result.businessEntity.logo;
                    this.businessTypeName = result.businessTypeName;
                    this.facilityTypeName = result.facilityTypeName;
                    this.facilityTypeId = result.businessEntity.facilityTypeId;

                    await this.checkFacilitySize();
                    this.spinnerService.hide();
                    this.initializeWorkFlow();
                    this.getAllAuthorativeUserLookup(businessEntityId);

                    this.initializeRelatedUsers();
                    if (this.modal != undefined) {
                        this.modal.show();
                    }
                });
        }
    }

    initializeAuthoritativeDocumentLookUp() {
        this.authoritavuieDocuments = [];
        this._authoritativeDocumentsServiceProxy.getallAuthorativeDocuments().subscribe(async res => {
            this.authoritavuieDocuments = await res;
        });
    }

    businessentityChange(val: number) {
        if (val == 0) {
            this.businessEntity.entityType = EntityType.HealthcareEntity;
            this.facilitySubType = [];
            this.businessEntity.facilitySubTypeId = null;
            this.businessEntity.facilityTypeId = null;
            this.initializeFacilityTypesForLookUp();
        }
        else if (val == 1) {
            this.businessEntity.entityType = EntityType.ExternalAudit;
            this.businessEntity.facilitySubTypeId = null;
            this.businessEntity.facilityTypeId = null;
            this.facilitySubType = [];
        }
        else {
            this.businessEntity.entityType = EntityType.InsuranceFacilities;
            this.facilitySubType = [];
            this.businessEntity.facilitySubTypeId = null;
            this.businessEntity.facilityTypeId = null;
            this.initializeinsuranceFacilitiesType();
        }
    }

    setPrimaryReviewerId(id) {
        this.businessEntity.primaryReviewerId = id;
    }

    setPrimaryApproverId(id) {
        this.businessEntity.primaryApproverId = id;
    }

    checkFacilitySize() {

        this.facilityTypeId = this.businessEntity.facilityTypeId;
        if (this.facilityTypesLookUp != undefined) {
            let fst = this.facilityTypesLookUp.filter((f) => f.name.trim().toLowerCase() == 'Hospital'.trim().toLowerCase());
            if (fst.length > 0) {
                if (
                    fst[0].id == this.businessEntity.facilityTypeId &&
                    this.appSession.appSettings.facilityTypeSizeSettings.find(
                        (f) => f.facilityTypeId == this.businessEntity.facilityTypeId
                    )
                ) {
                    this.businessEntity.facilityTypeId = this.facilityTypeId;
                    this.showFsTypeSize = true;
                } else {
                    this.businessEntity.facilityTypeId = this.facilityTypeId;
                    this.showFsTypeSize = false;
                }
            }
        }
        this.initilizationFacilitySubtype(this.facilityTypeId);

    }

    setControlType() {
        if (
            this.businessEntity.facilityTypeSize >
            this.appSession.appSettings.facilityTypeSizeSettings.filter(
                (f) => f.facilityTypeId == this.businessEntity.facilityTypeId
            )[0].maxSize
        ) {
            this.businessEntity.complianceType = 2;
        } else {
            this.businessEntity.complianceType = 1;
        }
    }

    checkFacility() {

        this.businessEntity.facilityTypeId = this.facilityInsuranceId;
        this.businessEntity.complianceType = this.controlType.Advanced;
        // this.initilizationFacilitySubtype(this.businessEntity.facilityTypeId);
    }

    save(): void {
        if (this.businessEntity.complianceType == null) {
            this.businessEntity.complianceType = this.controlType.Advanced;
        }
        this.businessEntity.facilityTypeId = this.facilityTypeId;
        if (this.businessEntity.backupOfficialEmail != null) {
            if (this.businessEntity.backupOfficialEmail.length != 0) {
                if (this.businessEntity.backupOfficialEmail[this.businessEntity.backupOfficialEmail.length - 1] == ',' || this.businessEntity.backupOfficialEmail[this.businessEntity.backupOfficialEmail.length - 1] == ';')
                    this.businessEntity.backupOfficialEmail = this.businessEntity.backupOfficialEmail.substr(0, this.businessEntity.backupOfficialEmail.length - 1);
                var backupOfficialEmailList = this.businessEntity.backupOfficialEmail.split(',');
                for (var i = 0; i < backupOfficialEmailList.length; i++) {
                    var result = this.isEmail(backupOfficialEmailList[i]);
                    if (result == false) {
                        this.message.warn("Please check backup Official Email");
                        return;
                    }
                }
            }
        }
        if (this.businessEntity.officialEmail != null) {
            if (this.businessEntity.officialEmail.length != 0) {
                if (this.businessEntity.officialEmail[this.businessEntity.officialEmail.length - 1] == ',' || this.businessEntity.officialEmail[this.businessEntity.officialEmail.length - 1] == ';')
                    this.businessEntity.officialEmail = this.businessEntity.officialEmail.substr(0, this.businessEntity.officialEmail.length - 1);
                var officialEmailList = this.businessEntity.officialEmail.split(',');
                for (var i = 0; i < officialEmailList.length; i++) {
                    var result = this.isEmail(officialEmailList[i]);
                    if (result == false) {
                        this.message.warn("Please check Official Email");
                        return;
                    }
                }
            }
        }
        if (this.businessEntity.owner_Email != null) {
            if (this.businessEntity.owner_Email.length != 0) {
                if (this.businessEntity.owner_Email[this.businessEntity.owner_Email.length - 1] == ',' || this.businessEntity.owner_Email[this.businessEntity.owner_Email.length - 1] == ';')
                    this.businessEntity.owner_Email = this.businessEntity.owner_Email.substr(0, this.businessEntity.owner_Email.length - 1);
                var owner_EmailList = this.businessEntity.owner_Email.split(',');
                for (var i = 0; i < owner_EmailList.length; i++) {
                    var result = this.isEmail(owner_EmailList[i]);
                    if (result == false) {
                        this.message.warn("Please check Owner Email");
                        return;
                    }
                }
            }
        }
        if (this.businessEntity.director_Incharge_Email != null) {
            if (this.businessEntity.director_Incharge_Email.length != 0) {
                if (this.businessEntity.director_Incharge_Email[this.businessEntity.director_Incharge_Email.length - 1] == ',' || this.businessEntity.director_Incharge_Email[this.businessEntity.director_Incharge_Email.length - 1] == ';')
                    this.businessEntity.director_Incharge_Email = this.businessEntity.director_Incharge_Email.substr(0, this.businessEntity.director_Incharge_Email.length - 1);
                var director_Incharge_EmailList = this.businessEntity.director_Incharge_Email.split(',');
                for (var i = 0; i < director_Incharge_EmailList.length; i++) {
                    var result = this.isEmail(director_Incharge_EmailList[i]);
                    if (result == false) {
                        this.message.warn("Please check Director Incharge Email");
                        return;
                    }
                }
            }
        }
        if (this.businessEntity.pro_Email != null) {
            if (this.businessEntity.pro_Email.length != 0) {
                if (this.businessEntity.pro_Email[this.businessEntity.pro_Email.length - 1] == ',' || this.businessEntity.pro_Email[this.businessEntity.pro_Email.length - 1] == ';')
                    this.businessEntity.pro_Email = this.businessEntity.pro_Email.substr(0, this.businessEntity.pro_Email.length - 1);
                var pro_EmailList = this.businessEntity.pro_Email.split(',');
                for (var i = 0; i < pro_EmailList.length; i++) {
                    var result = this.isEmail(pro_EmailList[i]);
                    if (result == false) {
                        this.message.warn("Please check Pro Emails");
                        return;
                    }
                }
            }
        }
        if (this.businessEntity.cisO_Email != null) {
            if (this.businessEntity.cisO_Email.length != 0) {
                if (this.businessEntity.cisO_Email[this.businessEntity.cisO_Email.length - 1] == ',' || this.businessEntity.cisO_Email[this.businessEntity.cisO_Email.length - 1] == ';')
                    this.businessEntity.cisO_Email = this.businessEntity.cisO_Email.substr(0, this.businessEntity.cisO_Email.length - 1);
                var cisO_EmailList = this.businessEntity.cisO_Email.split(',');
                for (var i = 0; i < cisO_EmailList.length; i++) {
                    var result = this.isEmail(cisO_EmailList[i]);
                    if (result == false) {
                        this.message.warn("Please check CISO or CCISO Emails");
                        return;
                    }
                }
            }
        }

        this.saving = true;
        this._businessEntitiesServiceProxy
            .createOrEdit(this.businessEntity)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l("SavedSuccessfully"));
                this.close();
                this.modalSave.emit(null);
            });
    }

    fileimageUpload() {
        const filePanCardUpload = document.getElementById(
            "fileimageUpload"
        ) as HTMLInputElement;
        filePanCardUpload.onchange = () => {
            var size = (filePanCardUpload.files[0].size / 1024).toFixed(2);
            var Checksizes = parseInt(size);
            if (Checksizes <= 200) {
                for (let index = 0; index < filePanCardUpload.files.length; index++) {
                    var reader = new FileReader();
                    reader.onload = (e: any) => {
                        this.logo = e.target.result;
                        this.businessEntity.logo = e.target.result;
                    };
                    reader.readAsDataURL(filePanCardUpload.files[index]);
                }
            } else {
                this.message.info("Please select Image below 200 KB");
            }
        };
        filePanCardUpload.click();
    }

    setBusinessTypeIdNull() {
        // this.businessEntity = null;
        this.businessTypeName = "";
    }

    setFacilityTypeIdNull() {
        // this.businessEntity.facilityTypeId = null;
        // this.facilityTypeName = "";
    }

    setAdminDetail() {
        if (this.sameForAdmin == true) {
            this.businessEntity.adminEmail =
                this.businessEntity.pro_Email == null
                    ? this.businessEntity.adminEmail
                    : this.businessEntity.pro_Email;
            this.businessEntity.adminMobile =
                this.businessEntity.pro_Mobile == null
                    ? this.businessEntity.adminMobile
                    : this.businessEntity.pro_Mobile;
        }
    }

    isBusinessEntityTypeSelected(): boolean {

        //  this.businessEntity.complianceType = null;
        //  this.businessEntity.facilityTypeId = null;
        if (this.businessEntity.entityType == 0) {
            return this.businessEntity.entityType == EntityType.HealthcareEntity;
        } else if (this.businessEntity.entityType == 2) {
            return this.businessEntity.entityType == EntityType.InsuranceFacilities;
        } else {
            return this.businessEntity.entityType == EntityType.ExternalAudit;
        }
    }

    checkBusinessTypePersonalDetailsPermission() {
        if (this.type == 0) {
            this.editEntityPersonalDetailsPermission = this.isGranted("Pages.HealthCareEntities.EditEntityPersonalDetail");
        } else if (this.type == 2) {
            this.editEntityPersonalDetailsPermission = this.isGranted("Pages.HealthCareEntities.EditEntityPersonalDetail");
        } else {
            this.editEntityPersonalDetailsPermission = this.isGranted("Pages.AuditManagement.EditEntityPersonalDetail");
        }
    }

    checkContactInfoPermission() {       
        if (this.type == 0) {

            this.editContactInfoPermission = this.isGranted("Pages.HealthCareEntities.EditEntityContactInfo");
        } else if (this.type == 2) {

            this.editContactInfoPermission = this.isGranted("Pages.HealthCareEntities.EditEntityContactInfo");
        } else {

            this.editContactInfoPermission = this.isGranted("Pages.AuditManagement.EditEntityContactInfo");
        }
    }

    checkEntityInfoPermission() {
        if (this.type == 0) {
            this.editEntityInfoPermission = this.isGranted("Pages.HealthCareEntities.EditEntityInformation");
        } else if (this.type == 2) {

            this.editEntityInfoPermission = this.isGranted("Pages.HealthCareEntities.EditEntityInformation");
        } else {

            this.editEntityInfoPermission = this.isGranted("Pages.AuditManagement.EditEntityInformation");
        }
    }

    checkPrimaryandBackUpInfoPermission() {
        if (this.type == 0) {
            this.editBackUpInfoPermission = this.isGranted("Pages.HealthCareEntities.EditPBContactInfo");
        } else if (this.type == 2) {

            this.editBackUpInfoPermission = this.isGranted("Pages.HealthCareEntities.EditPBContactInfo");
        } else {

            this.editBackUpInfoPermission = this.isGranted("Pages.AuditManagement.EditPBContactInfo");
        }
    }

    checkWorkFlowPermission() {
        if (this.type == 0) {
            this.editWorkFlowPermission = this.isGranted("Pages.HealthCareEntities.WorkFlow");
        } else if (this.type == 2) {

            this.editWorkFlowPermission = this.isGranted("Pages.HealthCareEntities.WorkFlow");
        } else {

            this.editWorkFlowPermission = this.isGranted("Pages.AuditManagement.WorkFlow");
        }
    }

    close() {
        this.active = false;
        if (this.type == 0 || this.type == 2) {
            this._router.navigate(["/app/main/businessEntities/healthcare"], {
                queryParams: {
                    type: 0,
                },
            });
        }
        else {
            this._router.navigate(["/app/main/businessEntities/externalaudit"], {
                queryParams: {
                    type: 1,
                },
            });
        }
    }

    esriSearchAddress(event) {
        this.businessEntity.address = JSON.stringify(event);
    }

    checkUserType() {       
        var checktype = this._appSessionService.user.type;       
        switch (checktype) {
            case 0:
                {
                    this.isAdminorAuditorFlag = true;
                    break;
                }
            case 1: {
                this.isAdminorAuditorFlag = false;
                break;
            }
            case 2:
                {
                    this.isAdminorAuditorFlag = true;
                    break;
                }
            case 3: {
                this.isAdminorAuditorFlag = true;
                break;
            }
            case 4: {
                this.isAdminorAuditorFlag = false;
                break;
            }

            default:
                {
                    this.isAdminorAuditorFlag = false;
                    break;
                }

        }
    }

} 
