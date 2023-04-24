import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { Router } from '@angular/router';
import { TemplateChecklistServiceProxy} from "@shared/service-proxies/service-proxies";
import { finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { CreateEditTemplateTypeComponent } from './create-edit-template-type/create-edit-template-type.component';
import { GridTemplateTypeComponent } from '../common-component/grid-template-type/grid-template-type.component';

@Component({
    selector: 'template-type',
    templateUrl: './template-type.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class TemplateTypeComponent extends AppComponentBase implements AfterViewInit {
    @ViewChild("createEditTemplateTypeModals", { static: true }) createEditTemplateTypeModals: CreateEditTemplateTypeComponent;
    
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    //@ViewChild('createEditAuditProjectManagementModals', { static: true }) createEditAuditProjectManagementModals: CreateEditAuditProjectManagementComponent;
    auditProjectManagementDetail: any;
    filterText = "";
    teamplateTypeId: number = 0;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(GridTemplateTypeComponent) gridTemplateType: GridTemplateTypeComponent;

    constructor(
        injector: Injector,
        private _templateservice: TemplateChecklistServiceProxy,
        private _router: Router,
    ) {
        super(injector);
      
        this.primengTableHelper = new PrimengTableHelper();
    }

    createRemediationPlan(): void {
        this._router.navigate(['/app/main/create-edit-remediation-plan']);
    }

    ngAfterViewInit(): void {

    }
    templateType() {
        this._router.navigate(['/app/main/create-edit-template-type']);
    }
    getAllData() {
        //this.modalSave.emit(null);
        this.gridTemplateType.getAllTemplatecheck();
    }
}
