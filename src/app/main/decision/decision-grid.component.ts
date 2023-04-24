import { Component, OnInit, Injector, ViewChild, Input, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateEditDecisionModalComponent } from './create-edit-decision-modal/create-edit-decision-modal.component';

@Component({
    selector: 'decision-grid',
    templateUrl: './decision-grid.component.html',
    styleUrls: ['./decision-grid.component.css']
})
export class DecisionGridComponent extends AppComponentBase implements OnInit {

    @ViewChild('createEditDecisionModals', { static: true }) createEditDecisionModals: CreateEditDecisionModalComponent;

    type: any;
    auditProjectId: any;
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

    constructor(_injector: Injector,      
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {
     
    }  
}
