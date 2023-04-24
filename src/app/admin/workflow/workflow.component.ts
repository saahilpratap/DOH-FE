import { Component, OnInit, Injector, Inject } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import { EntityApplicationSettingServiceProxy, EntityApplicationSettingDto, GetFacilityTypeForViewDto, FacilityTypesServiceProxy, FacilityTypeSizeSettingDto } from '../../../shared/service-proxies/service-proxies';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { finalize } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-workflow',
    templateUrl: './workflow.component.html',
    styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent extends AppComponentBase implements OnInit {

    summerNoteData: any;
    hiddenFlag: boolean = false;
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: 'auto',
        minHeight: '0',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '200',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'Enter text here...',
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
    };
    getSummerNoteData: any;
    getSummerNoteData1: any;
    contentSettings = [
        { id: 0, title: 'All Allow' },
        { id: 1, title: 'Can Edit Questionaire' },
        { id: 2, title: 'Can Attach Documents' },
        { id: 3, title: 'Can Add/Request For Clarifications' },
        { id: 4, title: 'Can Save Current Assessment Data' },
        { id: 5, title: 'Can Copy Previous Assessment Data' }
    ];

    settings = new EntityApplicationSettingDto();
    facilities = [];
    selectedFacilities: string[] = [];
    saveHide: boolean;
    constructor(injector: Injector,
        private _entityApplicationSettingService: EntityApplicationSettingServiceProxy,
        private _facilityTypesProxy: FacilityTypesServiceProxy,
        @Inject(DOCUMENT) private document: Document
    ) {
        super(injector);

    }

    initializeFacilityTypesForLookUp() {
        this._facilityTypesProxy.getAllFacilityType().subscribe(res => {
            let facilityTypesLookUp = res.map(f => f.facilityType);
            facilityTypesLookUp.forEach(fs => {
                let fst = new FacilityTypeSizeSettingDto();
                fst.tenantId = this.appSession.tenantId;
                fst.appSettingId = this.appSession.appSettings.id;
                fst.facilityTypeId = fs.id;
                fst.name = fs.name;
                if (this.appSession.appSettings.facilityTypeSizeSettings.find(f => f.facilityTypeId == fs.id)) {
                    fst.minSize = this.appSession.appSettings.facilityTypeSizeSettings.filter(f => f.facilityTypeId == fs.id)[0].minSize;
                    fst.maxSize = this.appSession.appSettings.facilityTypeSizeSettings.filter(f => f.facilityTypeId == fs.id)[0].maxSize;
                    fst.isSelected = this.appSession.appSettings.facilityTypeSizeSettings.filter(f => f.facilityTypeId == fs.id)[0].isSelected;
                    this.selectedFacilities.push(fs.name);
                } else {
                    fst.minSize = 0;
                    fst.maxSize = 0;
                    fst.isSelected = false;
                }
                this.facilities.push(fst);
            });
        });
    }

    ngOnInit() {
        if (this.appSession.appSettings != undefined) {
            this.settings = this.appSession.appSettings;           
        }

        this.initializeFacilityTypesForLookUp();
        this.savePermission();
    }

    addUpdateSettings() {
        this.spinnerService.show();
        this.settings.initialiazeSettingIds = this.settings.initialiazeSettingIds == undefined ? [] : this.settings.initialiazeSettingIds;
        this.settings.inReviewSettingsIds = this.settings.inReviewSettingsIds == undefined ? [] : this.settings.inReviewSettingsIds;
        this.settings.needsClarificationSettingsIds = this.settings.needsClarificationSettingsIds == undefined ? [] : this.settings.needsClarificationSettingsIds;
        this.settings.approvedSettingsIds = this.settings.approvedSettingsIds == undefined ? [] : this.settings.approvedSettingsIds;
        this.settings.beAdminReviewSettingsIds = this.settings.beAdminReviewSettingsIds == undefined ? [] : this.settings.beAdminReviewSettingsIds;
        this.settings.entityGroupAdminReviewSettingsds = this.settings.entityGroupAdminReviewSettingsds == undefined ? [] : this.settings.entityGroupAdminReviewSettingsds;
        this.settings.sentToAuthoritySettingsIds = this.settings.sentToAuthoritySettingsIds == undefined ? [] : this.settings.sentToAuthoritySettingsIds;

        let i1 = this.settings.initialiazeSettingIds.filter(e => e == 0);
        this.settings.initialiazeSettingIds = i1.length > 0 ? [] : this.settings.initialiazeSettingIds;

        let i2 = this.settings.inReviewSettingsIds.filter(e => e == 0);
        this.settings.inReviewSettingsIds = i2.length > 0 ? [] : this.settings.inReviewSettingsIds;

        let i3 = this.settings.needsClarificationSettingsIds.filter(e => e == 0);
        this.settings.needsClarificationSettingsIds = i3.length > 0 ? [] : this.settings.needsClarificationSettingsIds;

        let i4 = this.settings.approvedSettingsIds.filter(e => e == 0);
        this.settings.approvedSettingsIds = i4.length > 0 ? [] : this.settings.approvedSettingsIds;

        let i5 = this.settings.beAdminReviewSettingsIds.filter(e => e == 0);
        this.settings.beAdminReviewSettingsIds = i5.length > 0 ? [] : this.settings.beAdminReviewSettingsIds;

        let i6 = this.settings.entityGroupAdminReviewSettingsds.filter(e => e == 0);
        this.settings.entityGroupAdminReviewSettingsds = i6.length > 0 ? [] : this.settings.entityGroupAdminReviewSettingsds;

        let i7 = this.settings.sentToAuthoritySettingsIds.filter(e => e == 0);
        this.settings.sentToAuthoritySettingsIds = i7.length > 0 ? [] : this.settings.sentToAuthoritySettingsIds;


        if (this.settings.enablePreRegVerification) {
            if (this.settings.preRegVerificationList == undefined || this.settings.preRegVerificationList == "") {
                this.spinnerService.hide();
                abp.message.warn("Please add atleast one verifier Email, for multiple pass comma in between.");
                return;
            }
        }
        this.settings.tenantId = this.appSession.tenantId;
        this.settings.facilityTypeSizeSettings = this.facilities;       
        if (this.settings.id > 0) {
            this._entityApplicationSettingService.addOrUpdateSettings(this.settings).pipe(finalize(() => { this.spinnerService.hide(); }))
                .subscribe(result => {
                    this.spinnerService.hide();
                    this.notify.info(this.l('SavedSuccessfully'));
                    window.location.reload();
                });
        } else {
            this._entityApplicationSettingService.addSettings(this.settings).subscribe(result => {
                this._entityApplicationSettingService.addOrUpdateSettings(result).pipe(finalize(() => { this.spinnerService.hide(); }))
                    .subscribe(result => {
                        this.notify.info(this.l('SavedSuccessfully'));
                        window.location.reload();
                    });
            });
        }
        this.settings       
    }
    setSummerNoteDatas(e) {

    }
    setSummerNoteData(e) {

    }
    setSummerNoteAgreement(e) {

    }

    savePermission() {   
        if (this.isGranted("Pages.Administration.ApplicationSettings.BusinessEntity") == false && this.isGranted("Pages.Administration.ApplicationSettings.FacilityType") == false && this.isGranted("Pages.Administration.ApplicationSettings.SelfAssessment") == false && this.isGranted("Pages.Administration.ApplicationSettings.ExternalAssessment") == false && this.isGranted("Pages.Administration.ApplicationSettings.SystemMessages") == false && this.isGranted("Pages.Administration.ApplicationSettings.AcceptanceAgreement") == false && this.isGranted("Pages.Administration.ApplicationSettings.RootUnits") == false && this.isGranted("Pages.Administration.ApplicationSettings.DocumentPath") == false && this.isGranted("Pages.Administration.ApplicationSettings.WorkFlow") == false) {
            this.saveHide = false;
        }
        else {
            this.saveHide = true;
        }
    }
    toggleLeftAside(): void {
        this.document.body.classList.toggle('kt-aside--minimize');
        this.triggerAsideToggleClickEvent();
    }
    triggerAsideToggleClickEvent(): void {
        abp.event.trigger('app.kt_aside_toggler.onClick');
    }
}
