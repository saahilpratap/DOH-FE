import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetFacilityTypeForViewDto, FacilityTypeDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewFacilityTypeModal',
    templateUrl: './view-facilityType-modal.component.html'
})
export class ViewFacilityTypeModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetFacilityTypeForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetFacilityTypeForViewDto();
        this.item.facilityType = new FacilityTypeDto();
    }

    show(item: GetFacilityTypeForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
