import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateEditSurviellanceProgramModalComponent } from './create-edit-surviellance-program-modal/create-edit-surviellance-program-modal.component';

@Component({
    selector: 'surviellance-programs',
    templateUrl: './surviellance-program.component.html',
    styleUrls: ['./surviellance-program.component.css']
})
export class SurviellanceProgramGridComponent extends AppComponentBase implements OnInit {

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
