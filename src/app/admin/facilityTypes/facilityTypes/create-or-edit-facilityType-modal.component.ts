import { Component, ViewChild, Injector, Output, EventEmitter, Injectable} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { FacilityTypesServiceProxy, CreateOrEditFacilityTypeDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditFacilityTypeModal',
    templateUrl: './create-or-edit-facilityType-modal.component.html'
})

@Injectable()
export class CreateOrEditFacilityTypeModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    facilityType: CreateOrEditFacilityTypeDto = new CreateOrEditFacilityTypeDto();



    constructor(
        injector: Injector,
        private _facilityTypesServiceProxy: FacilityTypesServiceProxy
    ) {
        super(injector);
    }

    show(facilityTypeId?: number): void {

        if (!facilityTypeId) {
            this.facilityType = new CreateOrEditFacilityTypeDto();
            this.facilityType.id = facilityTypeId;

            this.active = true;
            this.modal.show();
        } else {
            this._facilityTypesServiceProxy.getFacilityTypeForEdit(facilityTypeId).subscribe(result => {
                this.facilityType = result.facilityType;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._facilityTypesServiceProxy.createOrEdit(this.facilityType)
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
