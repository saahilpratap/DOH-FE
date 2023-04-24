import { Component, OnInit, Injector, ViewChild, Input, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { AssessmentServiceProxy, AuditProjectServiceProxy, GetCertificateImport } from '../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'auditcertificateHistoryModals',
    templateUrl: './auditcertificate-history-modal.component.html',
    styleUrls: ['./auditcertificate-history-modal.component.css']
})
export class AuditcertificateHistoryModalComponent extends AppComponentBase {
    active = false;
    saving = false;
    @ViewChild('auditcertificateHistoryModal', { static: true }) modal: ModalDirective;
    data: GetCertificateImport[] = [];
    constructor(_injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _auditServiceProxy: AuditProjectServiceProxy,
        private _assessmentServiceProxy: AssessmentServiceProxy,
    ) {
        super(_injector);
    }

    show(input: string): void {
        this._auditServiceProxy
            .getCertificateImportByLicenseNumber(null, input, null, 10, 0)
            .subscribe(result => {
                this.data = result.items;
                this.active = true;
                this.modal.show();
                console.log(this.data);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
