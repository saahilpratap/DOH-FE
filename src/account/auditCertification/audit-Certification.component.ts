import { Component, Injector, OnInit, ViewContainerRef, ViewEncapsulation, ViewChild } from '@angular/core';

import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { GetFeedbackQuestionResponseList, GetCertificateImport, ResolveTenantIdInput, AccountServiceProxy, ActivateEmailInput, FeedbacksServiceProxy } from '../../shared/service-proxies/service-proxies';
import { string } from '@amcharts/amcharts4/core';


@Component({

    templateUrl: './audit-Certification.component.html',
    styleUrls: ['./audit-Certification.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class EntityCertitificationComponent extends AppComponentBase implements OnInit {

    active = false;
    saving = false;
    waitMessage: string;
    entityfeedbackId: any;
    display: boolean = false;
    entityCertificate: GetCertificateImport = new GetCertificateImport();
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    model: ActivateEmailInput = new ActivateEmailInput();

    flag: boolean;
    public constructor(
        injector: Injector, private _accountService: AccountServiceProxy,private _feedbacksServiceProxy: FeedbacksServiceProxy, private _router: Router, private _activatedRoute: ActivatedRoute,) {
        super(injector);
    }
    ngOnInit(): void {
       
        this.model.c = this._activatedRoute.snapshot.queryParams['auditCertificateId'];
        
        this._accountService.resolveCertificatId(new ResolveTenantIdInput({ c: this.model.c })).subscribe((tenantId) => {
          
            var id = tenantId.toString();
            //let reloadNeeded = this.appSession.changeTenantIfNeeded(
            //    tenantId
            //);

            //if (reloadNeeded) {
            //    return;
            //}

            this._feedbacksServiceProxy.getAllEntityCertificate(id).subscribe(res => {
               this.entityCertificate = res;
                });
        });

           
 }



    goToHome(): void {
        (window as any).location.href = '/';
    }

    close(): void {
        this.active = false;
    }

}
