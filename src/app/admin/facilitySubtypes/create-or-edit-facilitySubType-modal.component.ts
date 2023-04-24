import { Component, ViewChild, Injector, Output, EventEmitter, Injectable } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { FacilityTypesServiceProxy, FacilityTypeDto, FacilitySubTypeServiceProxy, CreateorEditFacilitySubTypeDto, CreateOrEditFacilityTypeDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditFacilitySubTypeModal',
    templateUrl: './create-or-edit-facilitySubType-modal.component.html'
})

@Injectable()
export class CreateOrEditFacilitysubTypeModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    facilitys: FacilityTypeDto[]=[]
    active = false;
    saving = false;

    facilityType: CreateorEditFacilitySubTypeDto = new CreateorEditFacilitySubTypeDto();



    constructor(
        injector: Injector,
        private _facilityTypesServiceProxy: FacilityTypesServiceProxy,
        private _facilitySubtypeServiceProxiy: FacilitySubTypeServiceProxy
    ) {
        super(injector);
    }

    show(facilityTypeId?: number)
    {
        
        this.getFacilityInitalization();
        if (!facilityTypeId) {
            this.facilityType = new CreateorEditFacilitySubTypeDto();
            this.facilityType.id = facilityTypeId;

            this.active = true;
            this.modal.show();
        } else {
            this.facilityType.id = facilityTypeId;
            this._facilitySubtypeServiceProxiy.getFacilityTypeForEdit(this.facilityType.id).subscribe(result => {
                this.facilityType = result;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
        this.saving = true;


        this._facilitySubtypeServiceProxiy.createOrUpdateFacilitySubType(this.facilityType)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }


    getFacilityInitalization() {
        this._facilitySubtypeServiceProxiy.getFacilityAll().subscribe(res => {
            
            this.facilitys = res;
        });
    }






    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
