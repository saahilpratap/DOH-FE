import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetAuditVendorForViewDto, AuditVendorDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewAuditVendorModal',
    templateUrl: './view-auditVendor-modal.component.html'
})
export class ViewAuditVendorModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetAuditVendorForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetAuditVendorForViewDto();
        this.item.auditVendor = new AuditVendorDto();
    }

    show(item: GetAuditVendorForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
