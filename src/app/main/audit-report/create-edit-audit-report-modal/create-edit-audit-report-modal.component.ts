import { AfterViewChecked, Component, ElementRef, EventEmitter, Injector, Output, ViewChild, OnInit } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateUserInput, OrganizationUnitDto, PasswordComplexitySetting, ProfileServiceProxy, UserEditDto, UserRoleDto, UserServiceProxy, UserOriginType, BusinessEntitiesServiceProxy, GetBusinessEntitiesExcelDto, EntityType } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { PermissionCheckerService } from 'abp-ng2-module';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'createEditAuditReportModals',
    templateUrl: './create-edit-audit-report-modal.component.html',
    styleUrls: ['./create-edit-audit-report-modal.component.css']
})

export class CreateEditAuditReportModal1Component extends AppComponentBase  {
    active = false;
    saving = false;
   
    @ViewChild('createEditAuditReportModal', { static: true }) modal: ModalDirective;
    constructor(_injector: Injector,      
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {
     
    }
    show(): void {
        this.active = true;
        this.modal.show();
    }
    onShown(): void {
    }
    close(): void {
        this.active = false;        
        this.modal.hide();
    }
}
