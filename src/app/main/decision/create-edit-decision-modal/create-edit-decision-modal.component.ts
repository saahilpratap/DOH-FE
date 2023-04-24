import { Component, OnInit, Injector, ViewChild, Input, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'createEditDecisionModals',
    templateUrl: './create-edit-decision-modal.component.html',
    styleUrls: ['./create-edit-decision-modal.component.css']
})
export class CreateEditDecisionModalComponent extends AppComponentBase implements OnInit {

    active = false;
    saving = false;

    documentsList = [
        { id: '1', name: 'Certification Proposal' },
        { id: '2', name: 'Reports' },
        { id: '3', name: 'Evidences' },
        { id: '4', name: 'Corrective Action Plan' },
        { id: '5', name: 'Facility Comments' },
        { id: '6', name: 'Any Confidential Report' }
    ];
    certifiableExcept = [
        { id: '1', name: 'Group is Certifiable' },
        { id: '2', name: 'Group is certifiable' },
        { id: '3', name: 'Individual is certifiable' },
    ];
    @ViewChild("signaturen", { read: ElementRef }) signaturen: ElementRef;
    @ViewChild("signaturen1", { read: ElementRef }) signaturen1: ElementRef;
    signaturePadOptions: Object = {
        'minWidth': 0.1,
        'canvasWidth': 350,
        'canvasHeight': 100,
        'penColor': 'rgb(0, 0, 128)'
    };
    @ViewChild('createEditDecisionModal', { static: true }) modal: ModalDirective;
    imgUrl: any;
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
