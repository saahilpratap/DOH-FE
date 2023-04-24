import { AfterViewChecked, Component, ElementRef, EventEmitter, Injector, Output, ViewChild, OnInit } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateUserInput, OrganizationUnitDto, FacilitySubTypeDto, FacilitySubTypeServiceProxy, PasswordComplexitySetting, ProfileServiceProxy, UserEditDto, UserRoleDto, UserServiceProxy, BusinessEntitiesServiceProxy, PreRegisterBusinessEntityInputDto, DynamicNameValueDto, EntityType, FacilityTypesServiceProxy, GetFacilityTypeForViewDto, FacilityTypeDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: "EditPreRegisterModal",
    templateUrl: "./edit-preRegister-entity-modal.component.html"
})
export class createOrEditPreRegisterModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('editPreEntityProcessModal', { static: true }) modal: ModalDirective;
    active = false;
    saving = false;
    busy = false;
    sameForAdmin = false;
    preRegisterBusinessEntity: PreRegisterBusinessEntityInputDto = new PreRegisterBusinessEntityInputDto();
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    facilityTypesLookUp: FacilityTypeDto[];
    thirdPartyDynamicParameter: DynamicNameValueDto[];
    districtsDynamicParameter: DynamicNameValueDto[];
    facilitySubTypesDynamicParameter: DynamicNameValueDto[];
    facilitySubType: FacilitySubTypeDto[] = [];
    facilityTypeId: any;
    constructor(
        injector: Injector,
        private _router: Router,
        private _facilitySubtypeServiceProxiy: FacilitySubTypeServiceProxy,
        private _activatedRoute: ActivatedRoute, private _facilityTypesProxy: FacilityTypesServiceProxy,
        private _businessEntityServiceProxy: BusinessEntitiesServiceProxy,
    ) {
        super(injector);
    }
    ngOnInit(): void {

    }

    loadThirdparties() {
        this._businessEntityServiceProxy.getDynamicEntityDatabyName("Third Parties")
            .subscribe(res => {
                this.thirdPartyDynamicParameter = res;
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

    initializeFacilityTypesForLookUp() {
        this._facilityTypesProxy.getAllFacilityTypes().subscribe(res => {
            this.facilityTypesLookUp = res;
        });
    }
    checkFacilitySize() {
        this.facilityTypeId = this.preRegisterBusinessEntity.facilityTypeId;  
        this.initilizationFacilitySubtype(this.facilityTypeId);

    }
    async initilizationFacilitySubtype(id: number) {
        this.facilitySubType = [];
        this._facilitySubtypeServiceProxiy.getFacilitySubtypeAll(id).subscribe(res => {
            this.facilitySubType = res;
        });
    }

    setModal(val) {
        var modal = document.getElementById("entityModal");

        if (val == 0) {
            modal.classList.add("modal-lg");
        } else {
            modal.classList.remove("modal-lg");
        }
    }

    setAdminDetail() {
        if (this.sameForAdmin == true) {
            this.preRegisterBusinessEntity.adminEmail = this.preRegisterBusinessEntity.pro_Email;
            this.preRegisterBusinessEntity.adminMobile = this.preRegisterBusinessEntity.pro_Mobile;
        } else {
            this.preRegisterBusinessEntity.adminEmail = null;
            this.preRegisterBusinessEntity.adminMobile = null;
        }
    }

    show(id: number): void {
        if (!id) {
            this.active = false;
        }
        this.active = true;

        this._businessEntityServiceProxy.getPreRegEntryForEdit(id).subscribe(result => {
            this.preRegisterBusinessEntity = result;
            this.setModal(this.preRegisterBusinessEntity.entityType);
            this.loadThirdparties();
            this.loadDistricts();
            this.initilizationFacilitySubtype(result.facilityTypeId);
            this.initializeFacilityTypesForLookUp();
        });

        this.modal.show();
    }

    
    save(): void {
        if (this.preRegisterBusinessEntity.entityType == null || this.preRegisterBusinessEntity.entityType == undefined) {
            this.message.warn("Please select Entity Type");
            return;
        }
        if (this.preRegisterBusinessEntity.entityType == 1) {
            if (this.preRegisterBusinessEntity.thirdPartyId == undefined) {
                this.message.warn("Please select Thirdparty Type");
                return;
            }
        }
        this.spinnerService.show();
        this.saving = true;
        this.busy = true;
        this._businessEntityServiceProxy.checkUserEmail(this.preRegisterBusinessEntity).subscribe(data => {
            if (data) {
                this.spinnerService.hide();
                this.message.error("Another Entity with same Email is Already registered");
                this.saving = false;
            } else {
                //this._businessEntityServiceProxy.preRegistrationVefication(this.preRegisterBusinessEntity)
                this._businessEntityServiceProxy.savePreRegEntry(this.preRegisterBusinessEntity)
                    .pipe(finalize(() => { this.saving = false; }))
                    .subscribe(() => {
                        this.modal.hide();
                        this.spinnerService.hide();
                        this.modalSave.emit(null);
                        this.close();
                        this.busy = false;
                    });
            }
        });
    }

    close(): void {
        this.preRegisterBusinessEntity = null;
        this.thirdPartyDynamicParameter = [];
        this.districtsDynamicParameter = [];
        this.facilitySubTypesDynamicParameter = [];
        this.facilityTypesLookUp = [];
        this.active = false;
        this.modal.hide();
    }
}
