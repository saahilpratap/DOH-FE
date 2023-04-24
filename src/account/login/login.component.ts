import { AbpSessionService } from 'abp-ng2-module';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SessionServiceProxy, UpdateUserSignInTokenOutput, EntityApplicationSettingServiceProxy } from '@shared/service-proxies/service-proxies';
import { UrlHelper } from 'shared/helpers/UrlHelper';
import { ExternalLoginProvider, LoginService } from './login.service';
import { ReCaptcha2Component } from 'ngx-captcha';
import { AppConsts } from '@shared/AppConsts';
import { RegisterClientProcessModalComponent } from '../register-client/register-client-process-modal.component'
import { TermsAndConditionsModalsComponent } from './terms-and-conditions-modal.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
    templateUrl: './login.component.html',
    animations: [accountModuleAnimation()],
    styleUrls: ['./login.component.less']
})
export class LoginComponent extends AppComponentBase implements OnInit {
    @ViewChild('recaptchaRef') recaptchaRef: ReCaptcha2Component;
    @ViewChild('registerClientProcessModals', { static: true }) registerClientProcessModals: RegisterClientProcessModalComponent;
    @ViewChild('termsAndConditionsModals', { static: true }) termsAndConditionsModals: TermsAndConditionsModalsComponent;

    submitting = false;
    isMultiTenancyEnabled: boolean = this.multiTenancy.isEnabled;
    recaptchaSiteKey: string = AppConsts.recaptchaSiteKey;
    captchaResponse?: string;
    tenancyId: number;
    textMessage: any;
    showShortDesciption: boolean = true;


    editorConfig: AngularEditorConfig = {
        editable: false,
        spellcheck: false,
        height: 'auto',
        minHeight: '0',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: false,
        showToolbar: false,
        
        defaultParagraphSeparator: '',
        defaultFontName: '',
        defaultFontSize: '',
        fonts: [
            { class: 'arial', name: 'Arial' },
            { class: 'times-new-roman', name: 'Times New Roman' },
            { class: 'calibri', name: 'Calibri' },
            { class: 'comic-sans-ms', name: 'Comic Sans MS' }
        ],
        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
        uploadUrl: 'v1/image',
        uploadWithCredentials: false,
        sanitize: true,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            ['bold', 'italic'],
            ['fontSize']
        ]

    }



    constructor(
        injector: Injector,
        public loginService: LoginService,
        private _router: Router,
        private _sessionService: AbpSessionService,
        private _sessionAppService: SessionServiceProxy,
        private _entityApplicationSettingService: EntityApplicationSettingServiceProxy,
    ) {
        super(injector);
    }

    get multiTenancySideIsTeanant(): boolean {
        return this._sessionService.tenantId > 0;
    }

    get isTenantSelfRegistrationAllowed(): boolean {
        return this.setting.getBoolean('App.TenantManagement.AllowSelfRegistration');
    }

    get isSelfRegistrationAllowed(): boolean {
        if (!this._sessionService.tenantId) {
            return false;
        }

        return this.setting.getBoolean('App.UserManagement.AllowSelfRegistration');
    }

    ngOnInit(): void {
        if (this._sessionService.userId > 0 && UrlHelper.getReturnUrl() && UrlHelper.getSingleSignIn()) {
            this._sessionAppService.updateUserSignInToken()
                .subscribe((result: UpdateUserSignInTokenOutput) => {
                    const initialReturnUrl = UrlHelper.getReturnUrl();
                    const returnUrl = initialReturnUrl + (initialReturnUrl.indexOf('?') >= 0 ? '&' : '?') +
                        'accessToken=' + result.signInToken +
                        '&userId=' + result.encodedUserId +
                        '&tenantId=' + result.encodedTenantId;

                    location.href = returnUrl;
                });
        }

        let state = UrlHelper.getQueryParametersUsingHash().state;
        if (state && state.indexOf('openIdConnect') >= 0) {
            this.loginService.openIdConnectLoginCallback({});
        }
        this.tenancyId = this.appSession.tenant.id;
        this._entityApplicationSettingService.getApplicationSettings().subscribe(res => {            
            this.textMessage = res.loginScreenDisclaimerMesg;
        });      
    }

    login(): void {
        if (this.useCaptcha && !this.captchaResponse) {
            this.message.warn(this.l('CaptchaCanNotBeEmpty'));
            return;
        }

        this.showMainSpinner();

        this.submitting = true;
        this.loginService.authenticate(
            () => {
                this.submitting = false;
                this.hideMainSpinner();

                if (this.recaptchaRef) {
                    this.recaptchaRef.resetCaptcha();
                }
            },
            null,
            this.captchaResponse
        );
    }

    externalLogin(provider: ExternalLoginProvider) {
        this.loginService.externalAuthenticate(provider);
    }

    get useCaptcha(): boolean {
        return this.setting.getBoolean('App.UserManagement.UseCaptchaOnLogin');
    }
    alterDescriptionText() {
        this.showShortDesciption = !this.showShortDesciption
    }
}
