import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { CommonLookupServiceProxy, IRMUserSignatureDto } from "../../../../shared/service-proxies/service-proxies";
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: 'createEntityReviewApprovalSignatureModal',
    templateUrl: './create-entity-review-approval-signature-modal-component.html'
})
export class createEntityReviewApprovalSignatureModalComponent extends AppComponentBase {

    @ViewChild('createEntitySignatureModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    iRMUserSignature: IRMUserSignatureDto[] = [];
    active = false;
    saving = false;
    constructor(
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        injector: Injector,
        private _sanitizer: DomSanitizer
    ) {
        super(injector);

    }

    ngOnInit() {
    }

    show(id: number, pageid: number, entityUserId: number) {
        this._commonLookupServiceProxy.getEntityApprovalSignature(id, pageid, entityUserId).subscribe((result) => {
            this.iRMUserSignature = result;
        });

        this.active = true;
        this.modal.show();
    }

    close() {

        this.active = false;
        this.modalSave.emit(null);
        this.modal.hide();

    }
}
