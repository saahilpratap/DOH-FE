import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'createEditCertificationProposalModals',
    templateUrl: './create-edit-certification-proposal-modal.component.html',
    styleUrls: ['./create-edit-certification-proposal-modal.component.css']
})
export class CreateEditCertificationProposalModalComponent extends AppComponentBase implements OnInit {
    active = false;
    saving = false;
   
    @ViewChild('createEditCertificationProposalModal', { static: true }) modal: ModalDirective;
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
