import { Component, OnInit, Injector, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'auditProjectWorkFlowModals',
    templateUrl: './audit-project-work-flow-modal.component.html',
    styleUrls: ['./audit-project-work-flow-modal.component.scss']
})
export class AuditProjectWorkFlowModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('auditProjectWorkFlowModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    test1 = [
        { name: '' },
        { name: '' },
        { name: '' },
        { name: '' },
    ]
    test2 = [
        { name: '' },
        { name: '' },
        { name: '' },
        { name: '' },
    ]
    active = false;
    constructor(_injector: Injector,
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

    close(): void {
        this.active = false;
        this.modal.hide();
    }
    save() {

    }
}
