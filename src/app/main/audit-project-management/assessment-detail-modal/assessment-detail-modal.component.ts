import { AfterViewChecked, Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateUserInput, OrganizationUnitDto, PasswordComplexitySetting, ProfileServiceProxy, UserEditDto, UserRoleDto, UserServiceProxy, AssessmentServiceProxy, AssessmentStatus } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({ 
    selector: 'assessmentDetailModals',
    templateUrl: './assessment-detail-modal.component.html',
    styleUrls: ['./assessment-detail-modal.component.scss']
})
export class AssessmentDetailModalComponent extends AppComponentBase {

    @ViewChild('assessmentDetailModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    assessmentId: any;
    assessmentType: any;
    assessmentFlag: any;
    assessmentStatus = AssessmentStatus;
    statusId: number;
    auditProId: number;
    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _profileService: ProfileServiceProxy,
        private _assessmentServiceProxy: AssessmentServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }
   
    show(id, type, auditProID): void {
        this.auditProId = auditProID;
        this.assessmentType = type;
        this._assessmentServiceProxy.getEncryptAssessmentParameter(id, true).subscribe((encryptRessult) => {
            this.assessmentId = encryptRessult.assessmentId;
            this.assessmentFlag = encryptRessult.flag;
            this.active = true;
            this.modal.show();            
        });     
    }   

    close(): void {
        this.active = false;       
        this.modal.hide();
    }
    save() {

    }
    changeStatus(id) {       
        this.statusId = id.status;       
    }
   
}
