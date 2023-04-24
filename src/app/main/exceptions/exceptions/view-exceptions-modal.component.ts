import { Component, OnInit, Injector, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { IncidentsServiceProxy, ExceptionsServiceProxy, CreateOrEditExceptionDto } from '../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'viewExceptionsModals',
    templateUrl: './view-exceptions-modal.component.html',
})
export class ViewExceptionsModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('viewExceptionsModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    exception = new CreateOrEditExceptionDto();
    busy = false;
    active = false;
    constructor(_injector: Injector,
        private _router: Router,
        private _exceptionsServiceProxy: ExceptionsServiceProxy,
    ) {
        super(_injector);
    }

    ngOnInit() {

    }

    show(id): void {
        this.active = true;
        this.modal.show();
        if (id) {
            this.getData(id)
        }
    }
    getData(id) {
        this.busy = true;
        abp.ui.setBusy(true);
        abp.ui.setBusy( 
            null,
        this._exceptionsServiceProxy
            .getExceptionForEdit(id)
            .subscribe(
                result => {
                    setTimeout(() => {
                        this.exception = result.exception;
                        this.busy = false;
                    }, 1000);
                },
                error => {
                    this.spinnerService.hide();
                    this.message.error(
                        "Couldn't load exception at this time!"
                    );
                    this.close();
                }
            ));
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
    save() {

    }
}
