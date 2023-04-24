import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { AuditVendorsServiceProxy, CreateOrEditAuditVendorDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditAuditVendorModal',
    templateUrl: './create-or-edit-auditVendor-modal.component.html'
})
export class CreateOrEditAuditVendorModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    auditVendor: CreateOrEditAuditVendorDto = new CreateOrEditAuditVendorDto();



    constructor(
        injector: Injector,
        private _auditVendorsServiceProxy: AuditVendorsServiceProxy
    ) {
        super(injector);
    }

    show(auditVendorId?: number): void {

        if (!auditVendorId) {
            this.auditVendor = new CreateOrEditAuditVendorDto();
            this.auditVendor.id = auditVendorId;
            this.auditVendor.registrationDate = moment().startOf('day');

            this.active = true;
            this.modal.show();
        } else {
            this._auditVendorsServiceProxy.getAuditVendorForEdit(auditVendorId).subscribe(result => {
                this.auditVendor = result.auditVendor;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._auditVendorsServiceProxy.createOrEdit(this.auditVendor)
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
