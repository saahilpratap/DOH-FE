import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';

@Component({
    selector: 'common-date-picker',
    templateUrl: './common-date-picker.component.html',
    styleUrls: ['./common-date-picker.component.css']
})
export class CommonDatePickerComponent extends AppComponentBase implements OnInit {

    startDate: Date;
    endDate: Date;

    constructor(_injector: Injector,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {

    }
}
