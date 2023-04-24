import { Component, Injector, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppUrlService } from '@shared/common/nav/app-url.service';
import { AccountServiceProxy, PreRegisterBusinessEntityInputDto, BusinessEntitiesServiceProxy, ResolveTenantIdInput } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { Location } from "@angular/common";

@Component({
    templateUrl: './pre-register-client-process.html',
    animations: [accountModuleAnimation()]
})
export class PreRegisterComponent extends AppComponentBase implements OnInit {

    model: PreRegisterBusinessEntityInputDto = new PreRegisterBusinessEntityInputDto();

    saving = false;
    waitMessage: string;
    showForm = false;
    constructor(
        injector: Injector,
        private _businessEntityServiceProxy: BusinessEntitiesServiceProxy,
        private _appUrlService: AppUrlService, private _location: Location,
        private _router: Router, private _activatedRoute: ActivatedRoute,
        private _accountService: AccountServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {

        this.waitMessage = this.l('PleaseWaitToConfirmYourEmailMessage');
        this.model.c = this._activatedRoute.snapshot.queryParams['c'];
        if (this.model.c == undefined) {
            this.showForm = true;
        } else {
            this._accountService.resolveTenantId(new ResolveTenantIdInput({ c: this.model.c })).subscribe((tenantId) => {
                let reloadNeeded = this.appSession.changeTenantIfNeeded(
                    tenantId
                );

                if (reloadNeeded) {
                    return;
                }

                this._businessEntityServiceProxy.verifyBusinessEnity(this.model)
                    .subscribe(res => {
                        if (res.verificationCode) {
                            this.notify.success(this.l('YourEmailIsConfirmedMessage'), '',
                                {
                                    onClose: () => {
                                        if (res.entityType == 0) {
                                            this._router.navigate(['account/app-entity-register'], { queryParams: { verificationCode: res.verificationCode } });
                                        } else {
                                            this._router.navigate(['account/app-external-audit-register'], { queryParams: { verificationCode: res.verificationCode } });
                                        }
                                     }
                                });
                        } else {
                            abp.message.warn("Link has already been verified for successful registration");
                            this._router.navigate(['account/login']);
                        }
                    });
            });
        }
    }


    backClicked() {
        this._location.back();
    }

    save(): void {
        this.saving = true;
        this._businessEntityServiceProxy.preRegistrationVerification(this.model)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.message.success(this.l('PreRegisterEntityMessage'), this.l('MailSent')).then(() => {
                    this._router.navigate(['account/login']);
                    this.hideMainSpinner();
                    this.spinnerService.hide();
                });
            });
    }
}
