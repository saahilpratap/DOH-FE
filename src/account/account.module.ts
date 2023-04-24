import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { LockthreatComplianceCommonModule } from '@shared/common/common.module';
import { FormsModule } from '@angular/forms';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { AccountRouteGuard } from './auth/account-route-guard';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';
import { AuditProjectAcceptComponent } from './audit-projectAccept/audit-project.component';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { LanguageSwitchComponent } from './language-switch.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { SendTwoFactorCodeComponent } from './login/send-two-factor-code.component';
import { ValidateTwoFactorCodeComponent } from './login/validate-two-factor-code.component';
import { ForgotPasswordComponent } from './password/forgot-password.component';
import { ResetPasswordComponent } from './password/reset-password.component';
import { PayPalPurchaseComponent } from './payment/paypal/paypal-purchase.component';
import { StripePurchaseComponent } from './payment/stripe/stripe-purchase.component';
import { BuyEditionComponent } from './payment/buy.component';
import { UpgradeEditionComponent } from './payment/upgrade.component';
import { ExtendEditionComponent } from './payment/extend.component';
import { RegisterTenantResultComponent } from './register/register-tenant-result.component';
import { RegisterTenantComponent } from './register/register-tenant.component';
//import { RegisterComponent } from './register/register.component';
import { SelectEditionComponent } from './register/select-edition.component';
import { TenantRegistrationHelperService } from './register/tenant-registration-helper.service';
import { TenantChangeModalComponent } from './shared/tenant-change-modal.component';
import { TenantChangeComponent } from './shared/tenant-change.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { PaymentHelperService } from './payment/payment-helper.service';
import { LocaleMappingService } from '@shared/locale-mapping.service';
import { PasswordModule } from 'primeng/password';
import { StripePaymentResultComponent } from './payment/stripe/stripe-payment-result.component';
import { StripeCancelPaymentComponent } from './payment/stripe/stripe-cancel-payment.component';
import { PaymentCompletedComponent } from './payment/payment-completed.component';
import { SessionLockScreenComponent } from './login/session-lock-screen.component';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { ExternalAuditRegisterComponent } from './external-audit-register/external-audit-register.component';
import { EntityRegisterComponent } from './entity-register/entity-register.component';
import { RegisterClientComponent } from './register-client/register-client.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';
import { PreRegisterComponent } from './register-client/pre-register-client-process';
import { RegisterClientProcessModalComponent } from './register-client/register-client-process-modal.component'
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TermsAndConditionsModalsComponent } from './login/terms-and-conditions-modal.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FeedbackEntityResponseComponent } from './feedback-entity-response/feedback-entity-response.component';
import { TTEEntityResponseComponent } from './tte-entity-response/tte-entity-response.component';
import { EntityCertitificationComponent } from './auditCertification/audit-Certification.component';

import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';

export function getRecaptchaLanguage(): string {
    return new LocaleMappingService().map('recaptcha', abp.localization.currentLanguage.name);
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    // suppressScrollX: true
};

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        NgxCaptchaModule,
        ModalModule.forRoot(),
        LockthreatComplianceCommonModule,
        UtilsModule,
        ServiceProxyModule,
        AccountRoutingModule,
        OAuthModule.forRoot(),
        PasswordModule,
        NgSelectModule,
        GooglePlaceModule,
        AppBsModalModule,
        PerfectScrollbarModule,
        DialogModule,
        MultiSelectModule,
        AngularEditorModule
    ],
    declarations: [
        AccountComponent,
        TenantChangeComponent,
        TenantChangeModalComponent,
        LoginComponent,
        //RegisterComponent,
        RegisterTenantComponent,
        RegisterTenantResultComponent,
        SelectEditionComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        EmailActivationComponent,
        ConfirmEmailComponent,
        SendTwoFactorCodeComponent,
        ValidateTwoFactorCodeComponent,
        LanguageSwitchComponent,
        BuyEditionComponent,
        UpgradeEditionComponent,
        ExtendEditionComponent,
        PayPalPurchaseComponent,
        StripePurchaseComponent,
        StripePaymentResultComponent,
        StripeCancelPaymentComponent,
        PaymentCompletedComponent,
        SessionLockScreenComponent,
        ExternalAuditRegisterComponent,
        EntityRegisterComponent,
        RegisterClientComponent,
        PreRegisterComponent,
        RegisterClientProcessModalComponent,
        FeedbackEntityResponseComponent,
        TTEEntityResponseComponent,
        TermsAndConditionsModalsComponent,
        AuditProjectAcceptComponent, EntityCertitificationComponent
    ],
    providers: [
        LoginService,
        TenantRegistrationHelperService,
        PaymentHelperService,
        AccountRouteGuard,
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
    ]
})
export class AccountModule {

}
