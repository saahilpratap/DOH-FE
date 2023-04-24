import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';


@Component({
    selector: 'releationAssessmentAuditProject',
    templateUrl: './releation-assessment-audit-project-modal.component.html',
    styleUrls: ['./releation-assessment-audit-project-modal.component.css']
})
export class ReleationAssessmentAuditProjectModalComponent extends AppComponentBase {

    active = false;
    saving = false;
    modalTitel: any;
    @ViewChild('releationAssessmentAuditProjectModal', { static: true }) modal: ModalDirective;
    result: any[];
    constructor(_injector: Injector,      
        private _router: Router,
      
    ) {
        super(_injector);
    }

    show(title?: string, item?:any): void {   
        
        this.modalTitel = title;
        this.result = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }


}
