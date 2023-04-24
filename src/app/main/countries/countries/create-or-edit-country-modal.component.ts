import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { CountriesServiceProxy, CreateOrEditCountryDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditCountryModal',
    templateUrl: './create-or-edit-country-modal.component.html'
})
export class CreateOrEditCountryModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    country: CreateOrEditCountryDto = new CreateOrEditCountryDto();



    constructor(
        injector: Injector,
        private _countriesServiceProxy: CountriesServiceProxy
    ) {
        super(injector);
    }

    show(countryId?: number): void {

        if (!countryId) {
            this.country = new CreateOrEditCountryDto();
            this.country.id = countryId;

            this.active = true;
            this.modal.show();
        } else {
            this._countriesServiceProxy.getCountryForEdit(countryId).subscribe(result => {
                this.country = result.country;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._countriesServiceProxy.createOrEdit(this.country)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }







    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
