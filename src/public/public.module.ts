import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { LockthreatComplianceCommonModule } from '@shared/common/common.module';
import { FormsModule } from '@angular/forms';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ModalModule } from 'ngx-bootstrap/modal';
import { OAuthModule } from 'angular-oauth2-oidc';
import { LocaleMappingService } from '@shared/locale-mapping.service';
import { PasswordModule } from 'primeng/password';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { PublicComponent } from './public.component';
import { TableTopExerciseComponent } from './table-top-exercise/table-top-exercise.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { RouterModule } from '@angular/router';
import { PublicRoutingModule } from './public-routing.module';
import { TableTopExerciseHomeComponent } from './table-top-exercise/table-top-exercise-home/table-top-exercise-home.component';
import { TableTopExerciseSectionomeComponent } from './table-top-exercise/table-top-exercise-section/table-top-exercise-section.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CounterDirective } from './directive/counter.directive';
import { CountDownComponent } from './table-top-exercise/table-top-exercise-section/count-down/count-down.component';


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
        OAuthModule.forRoot(),
        PasswordModule,
        NgSelectModule,
        GooglePlaceModule,
        AppBsModalModule,
        PerfectScrollbarModule,
        DialogModule,
        MultiSelectModule,
        AngularEditorModule, RouterModule, PublicRoutingModule,
        FileUploadModule, ReactiveFormsModule, NgxSpinnerModule, ProgressSpinnerModule,
    ],
    declarations: [
        PublicComponent, TableTopExerciseComponent, FeedbackComponent, TableTopExerciseHomeComponent, CountDownComponent,
        TableTopExerciseSectionomeComponent, CounterDirective
    ],
    providers: [        
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
    ],
  
})
export class PublicModule {

}
