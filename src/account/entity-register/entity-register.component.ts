import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    Injector
} from "@angular/core";
import {
    CreateOrEditBusinessEntityDto,
    CreateOrEditAuditVendorDto,
    GetCountryForViewDto,
    CountriesServiceProxy,
    BusinessEntitiesServiceProxy,
    GetFacilityTypeForViewDto,
    FacilityTypesServiceProxy,
    PreRegisterBusinessEntityInputDto
} from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/common/app-component-base";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
    selector: "app-entity-register",
    templateUrl: "./entity-register.component.html",
    styleUrls: ["./entity-register.component.css"]
})
export class EntityRegisterComponent extends AppComponentBase
    implements OnInit {
    businessEntity: CreateOrEditBusinessEntityDto = new CreateOrEditBusinessEntityDto();
    countriesLookUp: GetCountryForViewDto[];
    facilityTypesLookUp: GetFacilityTypeForViewDto[];
    entityType: number;
    saving = false;
    @ViewChild("placesRef") placesRef: GooglePlaceDirective;
    model: PreRegisterBusinessEntityInputDto = new PreRegisterBusinessEntityInputDto();
    VerificationCode: string;
    nameExist = false;
    legalNameExist = false;
    constructor(
        injector: Injector,
        private _countriesServiceProxy: CountriesServiceProxy, private _activatedRoute: ActivatedRoute,
        private _businessEntityServiceProxy: BusinessEntitiesServiceProxy,
        private _facilityTypesProxy: FacilityTypesServiceProxy,
        private _location: Location, private _router: Router
    ) {
        super(injector);
        this.VerificationCode = this._activatedRoute.snapshot.queryParams['verificationCode'] || '';

    }

    ngOnInit() {
        if (this.VerificationCode != undefined) {
            this.model.verificationCode = this.VerificationCode;
            this._businessEntityServiceProxy.verifyBusinessEnity(this.model)
                .subscribe(res => {
                    if (res.verificationCode) {
                        this.businessEntity.legalName = res.companyName;
                        this.businessEntity.adminEmail = res.adminEmail;
                        this.businessEntity.adminMobile = res.adminMobile;
                        this.businessEntity.name = res.name;
                        this.businessEntity.licenseNumber = res.licenseNumber;
                        this.businessEntity.thirdPartyId = res.thirdPartyId;
                        this.businessEntity.thirdParties = res.thirdParties;
                        this.businessEntity.facilityTypeId = res.facilityTypeId;

                        this.nameExist = !res.name ? false : true;
                        this.legalNameExist = !res.companyName ? false : true;
                    } else {
                        this._router.navigate(['account/login']);
                    }
                });
        }

        this.initializeCountriesForLookUp();
        this.initializeFacilityTypesLookUp();
    }

    backClicked() {
        this._router.navigate(['account/login']);
    }

    initializeCountriesForLookUp() {
        this._countriesServiceProxy.getallCountry().subscribe(res => {
            this.countriesLookUp = res;
            console.log(this.countriesLookUp);
        });
    }

    initializeFacilityTypesLookUp() {
        this._facilityTypesProxy.getAllFacilityType().subscribe(res => {
            this.facilityTypesLookUp = res;
        });
    }

    registerClient() {
        console.log("register action");
    }

    setEntityType(entityTypeString): void {
        if (entityTypeString == "businessentity") this.entityType = 1;
        else this.entityType = 2;
    }
    getChoosenEntityType(): number {
        return this.entityType;
    }

    handleAddressChange(address: Address, isPrimaryContact: boolean) {
        if (isPrimaryContact) this.businessEntity.address = "";
        //else this.businessEntity.secondaryAddress = '';
        address.address_components.forEach(x => {
            switch (x.types[0]) {
                case "premise":
                case "sublocality_level_3":
                case "sublocality_level_2":
                case "sublocality_level_1":
                case "locality":
                    if (isPrimaryContact) {
                        if (this.businessEntity.address !== "")
                            this.businessEntity.address += ", ";
                        this.businessEntity.address += x.long_name;
                    }
                    break;
                case "administrative_area_level_2":
                    if (isPrimaryContact)
                        this.businessEntity.cityOrDistrict = x.long_name;
                    else this.businessEntity.cityOrDistrict = x.long_name;
                    break;
                //case 'administrative_area_level_1':
                //    if (isPrimaryContact) this.businessEntity..state = x.long_name;
                //    else this.businessEntity.secondaryState = x.long_name;
                //    break;
                case "country":
                    let tempCountry = this.countriesLookUp.find(
                        c => c.country.name.toLowerCase() === x.long_name.toLowerCase()
                    );
                    if (tempCountry == null) {
                        this.businessEntity.countryId = 1;
                    } else {
                        this.businessEntity.countryId = tempCountry.country.id;
                    }
                    break;
                case "postal_code":
                    if (isPrimaryContact)
                        this.businessEntity.postalCode = x.long_name;
                    else this.businessEntity.postalCode = x.long_name;
                    break;
            }
        });
    }

    register() {
        this.businessEntity.entityType = 0;
        this.businessEntity.thirdPartyId = 0;
        this.businessEntity.thirdParties = [];
        this.businessEntity.verificationCode = this.VerificationCode;
        console.log(this.businessEntity);
        this.spinnerService.show();
        this._businessEntityServiceProxy
            .register(this.businessEntity)
            .subscribe(
                () => {
                    this._router.navigate(['account/login']);
                    this.spinnerService.hide();
                    this.message.success(
                        "You Request Was Received! We'll Notify Approval On Email!"
                    );
                },
                error => {
                    this.spinnerService.hide();
                    this.message.error(
                        "You Request Was not Received! Try Later!"
                    );
                }
            );
    }
}
