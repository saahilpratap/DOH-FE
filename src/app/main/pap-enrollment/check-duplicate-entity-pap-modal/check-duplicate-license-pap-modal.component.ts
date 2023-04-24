import { Component, Injector, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { PatientAuthenticationPlatformServiceProxy } from '../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'checkDuplicateLicensePAPModals',
    templateUrl: './check-duplicate-license-pap-modal.component.html',
    styleUrls: ['./check-duplicate-license-pap-modal.component.css']
})


export class CheckDuplicateLicensePAPModalComponent extends AppComponentBase {
    active = false;
    saving = false;
    saving1 = false;
    @ViewChild('checkDuplicateLicensePAPModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    duplicateLicense: any;
    bindingDatas: any;
    message1 = "PAP Enrollment request for the below facility(s) already exists for the selected option";
    message2 = "therefore it will be skipped whereas the request will be created for the rest of the selected facilities. Display List Do you want to Continue?";
    message: any;

    constructor(_injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _patientAuthenticationPlatformServiceProxy: PatientAuthenticationPlatformServiceProxy

    ) {
        super(_injector);
    }
    show(data?: any, bindingData?: any, id?: number, patientAuthentication?: boolean) {       
        this.duplicateLicense = data;
        this.bindingDatas = bindingData;
        this.message = "<p>" + this.message1 + + '<strong class="pr-1 pl-1">' + + bindingData.connecting + + '</strong>' + + this.message2 + + '</p>';       
        this.active = true;
        this.modal.show();
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
    submit() {
        this._patientAuthenticationPlatformServiceProxy.createPAPwithSkip(null, null).subscribe(res => {

        })
    }
}
