import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewBusinessTypeModal',
    templateUrl: './view-businessType-modal.component.html'
})
export class ViewBusinessTypeModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    //item: GetBusinessTypeForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        //this.item = new GetBusinessTypeForViewDto();
        //this.item.businessType = new BusinessTypeDto();
    }

    //show(item: GetBusinessTypeForViewDto): void {
    //    this.item = item;
    //    this.active = true;
    //    this.modal.show();
    //}

    //close(): void {
    //    this.active = false;
    //    this.modal.hide();
    //}
}
