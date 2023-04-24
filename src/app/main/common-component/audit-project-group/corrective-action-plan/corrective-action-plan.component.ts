import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';

@Component({
    selector: 'corrective-action-plan',
    templateUrl: './corrective-action-plan.component.html',
    styleUrls: ['./corrective-action-plan.component.css']
})
export class CorrectiveActionPlanComponent extends AppComponentBase implements OnInit {

    constructor(_injector: Injector,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {
       
    }
}
