import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'certification-proposals',
    templateUrl: './certification-proposal.component.html',
    styleUrls: ['./certification-proposal.component.css']
})
export class CertificationProposalGridComponent extends AppComponentBase implements OnInit {
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
