import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateEditCertificateModalComponent } from './certificate-modal/create-edit-certificate-modal.component';

@Component({
    selector: 'certificate-grid',
    templateUrl: './certificate-grid.component.html',
    styleUrls: ['./certificate-grid.component.css']
})
export class CertificateGridComponent extends AppComponentBase implements OnInit {
    @ViewChild('createcreateEditCertificateModalsEditAuditReportModals', { static: true }) createEditCertificateModals: CreateEditCertificateModalComponent;

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
