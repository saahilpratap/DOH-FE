import { Component, Injector, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppUrlService } from '@shared/common/nav/app-url.service';
import { AccountServiceProxy, AuditProjectServiceProxy, PreRegisterBusinessEntityInputDto, BusinessEntitiesServiceProxy, ResolveTenantIdInput } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { Location } from "@angular/common";
import { string } from '@amcharts/amcharts4/core';

@Component({
    templateUrl: './audit-project.component.html',
    animations: [accountModuleAnimation()]
})
export class AuditProjectAcceptComponent extends AppComponentBase {

    waitMessage: string;
    auditProjectId: any;
    constructor(
        injector: Injector,
        private _appUrlService: AppUrlService, private _location: Location,
        private _router: Router, private _activatedRoute: ActivatedRoute, private _auditServiceProxy: AuditProjectServiceProxy,
        private _accountService: AccountServiceProxy,
        
    ) {
        super(injector);
    }

    ngOnInit(): void {
        
        this.waitMessage = this.l('PleaseWaitToConfirmYourEmailMessage');
        this.auditProjectId = this._activatedRoute.snapshot.queryParams['auditProjectId'];    
        if (this.auditProjectId == undefined) {
            
        } else {
            this._accountService.resolveAuditProjectId(new ResolveTenantIdInput({ c: this.auditProjectId })).subscribe((tenantId) => {
                
                let reloadNeeded = tenantId;
                this.auditProjectId = reloadNeeded;
                this._auditServiceProxy.auditProjectAccepted(this.auditProjectId)
                    .subscribe(res => {
                        if (res) {
                            var messageSuccess = 'Your Audit Project Acceptance <br/> is already notified To Authority.<br/> Please contact aamen@doh.gov.ae <br/> for any further assistance.'
                            abp.message.success(messageSuccess, null,
                                {
                                    onClose: () => {
                                        this._router.navigate(['account/login']);
                                    },
                                    isHtml: true
                                });
                        } else {
                            var message = 'Thank you for the acknowledgement.<br/> Any further clarifications or assistance,<br/> please do not hesitate to contact aamen@doh.gov.ae.';
                            abp.message.success(message, null, { isHtml: true });
                            this._router.navigate(['account/login']);
                        }
                    });
            });
        }
    }
}
