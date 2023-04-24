import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'createEditSurviellanceProgramModals',
    templateUrl: './create-edit-surviellance-program-modal.component.html',
    styleUrls: ['./create-edit-surviellance-program-modal.component.css']
})
export class CreateEditSurviellanceProgramModalComponent extends AppComponentBase implements OnInit {
    active = false;
    saving = false;
   
    @ViewChild('createEditSurviellanceProgramModal', { static: true }) modal: ModalDirective;
    constructor(_injector: Injector,      
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {
     
    }
    show() {
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
