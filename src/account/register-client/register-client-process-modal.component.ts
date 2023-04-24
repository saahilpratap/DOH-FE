import { AfterViewChecked, Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateUserInput, OrganizationUnitDto, PasswordComplexitySetting, ProfileServiceProxy, UserEditDto, UserRoleDto, UserServiceProxy, BusinessEntitiesServiceProxy, PreRegisterBusinessEntityInputDto, DynamicNameValueDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'registerClientProcessModals',
    templateUrl: './register-client-process-modal.component.html',

})
export class RegisterClientProcessModalComponent extends AppComponentBase {

    @ViewChild('registerClientProcessModal', { static: true }) modal: ModalDirective;
    active = false;
    saving = false;
    busy = false;
    preRegisterBusinessEntity: PreRegisterBusinessEntityInputDto = new PreRegisterBusinessEntityInputDto();
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    dynamicParameter: DynamicNameValueDto[];
    constructor(
        injector: Injector,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _businessEntityServiceProxy: BusinessEntitiesServiceProxy,
    ) {
        super(injector);
    }

    loadThirdparties() {
        this._businessEntityServiceProxy.getDynamicEntityDatabyName("Third Parties")
            .subscribe(res => {
                this.dynamicParameter = res;
            });
    }
    ngOnInit() {
        this.preRegisterBusinessEntity.entityType = 0;
    }
    show(): void {
        this.loadThirdparties();
        this.active = true;
        this.modal.show();
    }
    save(): void {
        
        if (this.preRegisterBusinessEntity.entityType == null || this.preRegisterBusinessEntity.entityType == undefined) {
            this.message.warn("Please select Entity Type");
            return;
        }
        if (this.preRegisterBusinessEntity.entityType == 1) {
            if (this.preRegisterBusinessEntity.thirdPartyId == undefined) {
                this.message.warn("Please select Thirdparty Type");
                return;
            }
        }
        this.spinnerService.show();
        this.saving = true;
        this.busy = true;
        this._businessEntityServiceProxy.checkUserEmail(this.preRegisterBusinessEntity).subscribe(data => {
            if (data) {
                this.spinnerService.hide();
                this.message.error("Another Entity with same Email is Already registered");
                this.saving = false;
                this.busy = false;
                this.hideMainSpinner();
            } else {
                this._businessEntityServiceProxy.preRegistrationVerification(this.preRegisterBusinessEntity)
                    .pipe(finalize(() => { this.saving = false; }))
                    .subscribe(() => {
                        if (this.appSession.appSettings.enablePreRegVerification) {
                            this.message.success("You will receive an verification message after approval.", "Approval Mail sent to Authority Admin").then(() => {
                                this.modal.hide();
                                this.preRegisterBusinessEntity.name = '';
                                this.preRegisterBusinessEntity.companyName = '';
                                this.preRegisterBusinessEntity.adminEmail = '';
                                this.preRegisterBusinessEntity.adminMobile = '';
                                this.spinnerService.hide();
                                this.hideMainSpinner();
                                this.modalSave.emit(null);
                                this.busy = false;
                            });
                        }
                        else
                        {
                            this.message.success("Verification mail sent to your Email Id", "Verify you email to register").then(() => {
                                this.modal.hide();
                                this.preRegisterBusinessEntity.name = '';
                                this.preRegisterBusinessEntity.companyName = '';
                                this.preRegisterBusinessEntity.adminEmail = '';
                                this.preRegisterBusinessEntity.adminMobile = '';
                                this.spinnerService.hide();
                                this.hideMainSpinner();
                                this.modalSave.emit(null);
                                this.busy = false;
                            });
                        }
                        this.spinnerService.hide();
                    });
            }
        });
    }

    close(): void {
        this.preRegisterBusinessEntity = new PreRegisterBusinessEntityInputDto();
        this.dynamicParameter = [];
        this.active = false;
        this.modal.hide();
    }
}
