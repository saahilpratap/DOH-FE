import { AfterViewChecked, Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateUserInput, OrganizationUnitDto, PasswordComplexitySetting, ProfileServiceProxy, UserEditDto, UserRoleDto, UserServiceProxy, BusinessEntitiesServiceProxy, PreRegisterBusinessEntityInputDto, DynamicNameValueDto, EntityApplicationSettingServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'termsAndConditionsModals',
    templateUrl: './terms-and-conditions-modal.component.html',

})
export class TermsAndConditionsModalsComponent extends AppComponentBase {

    @ViewChild('termsAndConditionsModal', { static: true }) modal: ModalDirective;
    active = false;
    saving = false;
    textData: any;


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
        placeholder: '',
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
        sanitize: false,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            ['bold', 'italic'],
            ['fontSize']
        ]

    }
 
    constructor(
        injector: Injector,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _entityApplicationSettingService: EntityApplicationSettingServiceProxy,
    ) {
        super(injector);
    }

   
    ngOnInit() {
       
    }
    show(data): void {      
        this.active = true;
        this.modal.show();
        this.textData = data;

        //this._entityApplicationSettingService.getApplicationSettings().subscribe(res => {
        //    this.textData = res.loginScreenDisclaimerMesg;
        //});  
    }   
    close(): void {    
        this.active = false;
        this.modal.hide();
    }
}
