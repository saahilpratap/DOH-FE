import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';

@Component({
    selector: 'certificate',
    templateUrl: './certificate.component.html',
    styleUrls: ['./certificate.component.css']
})
export class CertificateComponent extends AppComponentBase implements OnInit {

    constructor(_injector: Injector,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {
       
    }
}
