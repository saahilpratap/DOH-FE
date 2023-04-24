import { Component, OnInit, ViewEncapsulation, ViewChild, Injector } from "@angular/core";
import {
    CreateOrEditBusinessEntityDto,
    CreateOrEditAuditVendorDto,
    GetCountryForViewDto,
    CountriesServiceProxy,
    BusinessEntitiesServiceProxy,
    PreRegisterBusinessEntityInputDto
} from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from '@shared/common/app-component-base';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
    selector: "app-register-client",
    templateUrl: "./register-client.component.html",
    styleUrls: ["./register-client.component.css"]
})
export class RegisterClientComponent implements OnInit {
    businessEntity: CreateOrEditBusinessEntityDto = new CreateOrEditBusinessEntityDto();
    auditVendor: CreateOrEditAuditVendorDto = new CreateOrEditAuditVendorDto();
    countriesLookUp: GetCountryForViewDto[];
    entityType: number;
    VerificationCode: string;

    @ViewChild('placesRef') placesRef: GooglePlaceDirective;
    constructor(private _countriesServiceProxy: CountriesServiceProxy,
        private _activatedRoute: ActivatedRoute, 
        private _location: Location, private _router: Router) {
        this.VerificationCode = this._activatedRoute.snapshot.queryParams['verificationCode'] || '';

    }

    ngOnInit() {
        this.initializeCountriesForLookUp();
    }

    backClicked() {
        this._router.navigate(['account/login']);
    }
    initializeCountriesForLookUp() {
        this._countriesServiceProxy.getallCountry().subscribe(res => {
            this.countriesLookUp = res;
        });
    }

    registerClient() {
    }

    healthCare() {
        this._router.navigate(['account/app-entity-register'], { queryParams: { verificationCode: this.VerificationCode } });
    }

    externalAudit() {
        this._router.navigate(['account/app-external-audit-register'], { queryParams: { verificationCode: this.VerificationCode } });
    }

    setEntityType(entityTypeString): void {

        if (entityTypeString == "businessentity") this.entityType = 1;
        else
            this.entityType = 2;
    }
    getChoosenEntityType(): number {
        return this.entityType;
    }

    handleAddressChange(address: Address, isPrimaryContact: boolean) {
        if (isPrimaryContact) this.businessEntity.address = '';
        //else this.businessEntity.secondaryAddress = '';
        address.address_components.forEach(x => {
            switch (x.types[0]) {
                case 'premise':
                case 'sublocality_level_3':
                case 'sublocality_level_2':
                case 'sublocality_level_1':
                case 'locality':
                    if (isPrimaryContact) {
                        if (this.businessEntity.address !== '') this.businessEntity.address += ", ";
                        this.businessEntity.address += x.long_name;
                    }
                    break;
                case 'administrative_area_level_2':
                    if (isPrimaryContact) this.businessEntity.cityOrDistrict = x.long_name;
                    else this.businessEntity.cityOrDistrict = x.long_name;
                    break;
                //case 'administrative_area_level_1':
                //    if (isPrimaryContact) this.businessEntity..state = x.long_name;
                //    else this.businessEntity.secondaryState = x.long_name;
                //    break;
                case 'country':
                    let tempCountry = this.countriesLookUp.find(c => c.country.name === x.long_name);
                    if (tempCountry == null) this.businessEntity.countryId = 1;
                    if (isPrimaryContact) this.businessEntity.countryId = tempCountry.country.id;
                    else this.businessEntity.countryId = tempCountry.country.id;
                    break;
                case 'postal_code':

                    if (isPrimaryContact) this.businessEntity.postalCode = x.long_name;
                    else this.businessEntity.postalCode = x.long_name;
                    break;
            }
        });
    }



}
