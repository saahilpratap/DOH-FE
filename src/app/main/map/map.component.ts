import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';

@Component({
    selector: 'map.component',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent extends AppComponentBase implements OnInit {

    public searchOptions = {
        enableButtonMode: true, //this enables the search widget to display as a single button
        enableLabel: false,
        enableInfoWindow: true,
        showInfoWindowOnSelect: false,
    };

    constructor(_injector: Injector,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {

    }
}
