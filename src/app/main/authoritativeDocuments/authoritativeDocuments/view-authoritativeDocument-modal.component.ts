import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetAuthoritativeDocumentForViewDto, AuthoritativeDocumentDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewAuthoritativeDocumentModal',
    templateUrl: './view-authoritativeDocument-modal.component.html'
})
export class ViewAuthoritativeDocumentModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetAuthoritativeDocumentForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetAuthoritativeDocumentForViewDto();
        this.item.authoritativeDocument = new AuthoritativeDocumentDto();
    }

    show(item: GetAuthoritativeDocumentForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
