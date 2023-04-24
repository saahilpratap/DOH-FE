import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateEditAuditReportModal1Component } from './create-edit-audit-report-modal/create-edit-audit-report-modal.component';

@Component({
    selector: 'audit-report-group',
    templateUrl: './audit-report.component.html',
    styleUrls: ['./audit-report.component.css']
})
export class AuditReportGridComponent extends AppComponentBase implements OnInit {
    @ViewChild('createEditAuditReportModals', { static: true }) createEditAuditReportModals: CreateEditAuditReportModal1Component;
    selectedItem: any;
    type: any;
    auditProjectId: any;

    constructor(_injector: Injector,      
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {
     
    }

   
}
