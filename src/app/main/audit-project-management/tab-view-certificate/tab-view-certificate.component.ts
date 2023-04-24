import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { CertificateQRCodeServiceProxy, CertificateQRCodeDto, AuditProjectServiceProxy, GetCertificateImport, CommonLookupServiceProxy } from '../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'tab-view-certificate',
    templateUrl: './tab-view-certificate.component.html',
})
export class TabViewCertificateComponent extends AppComponentBase implements OnInit {
    @Output() closeModal = new EventEmitter();

    @Input('auditProjectId') auditProID: any;
    buttonDisable: boolean = true;
    certificateQRCodeInput: CertificateQRCodeDto[] = [];
    @Input('reauditPermission') reauditPermission: boolean;
  

    constructor(_injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _auditServiceProxy: AuditProjectServiceProxy,
        public _certificationQRCodeService: CertificateQRCodeServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {
        this.getData(this.auditProID);
        
    }
    getAuditProjectManager(auditId, businessEntityId, entityGroupId) {

    }

    getData(auditId) {
        this._certificationQRCodeService.getCertificateQRCodeByAuditProjectId(auditId).subscribe(res => {
            if (res.length != 0) {
                this.certificateQRCodeInput = res;
                var result = res.find(x => x.isCertificateGenerate == true);
                if (result == undefined) {
                    this.buttonDisable = false;
                }
            }
            else {
                this.buttonDisable = false; 
            }
            this.spinnerService.hide();
        }, err => {
            this.spinnerService.hide();
            this.message.error(err.error.error.message);
        });
    }

    generateCertificate() {
       
        this._certificationQRCodeService.createOrEdit(this.certificateQRCodeInput).subscribe(res =>
        {
            abp.notify.success(this.l('SavedSuccessfully'));
            this.spinnerService.hide();
            this.getData(this.auditProID);
        }, err => {
            this.spinnerService.hide();
            this.message.error(err.error.error.message);
        });
    }

    sendCertificate() {

        this._auditServiceProxy
            .sendAuditProjectCertificate(this.auditProID,this.certificateQRCodeInput)
            .subscribe(result => {
                this.primengTableHelper.hideLoadingIndicator();
                this.notify.info(this.l('Certificate Sent Successfully'));
            });
    }
  

}
