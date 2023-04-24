import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'tab-view-external-audit',
    templateUrl: './tab-view-external-audit.component.html',   
})
export class TabViewExternalAuditComponent extends AppComponentBase implements OnInit {

    @Output() activeM = new EventEmitter();
    @Output() popupModal = new EventEmitter();
    @Output() closeModal = new EventEmitter();
    constructor(_injector: Injector,      
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {
     
    }
    getAuditProjectManager(id) {

    }
    tabSave() {
       
    }
}
