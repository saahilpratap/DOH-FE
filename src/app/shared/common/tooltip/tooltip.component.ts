import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';


@Component({
    selector: 'tooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.css']
})
export class ToolTipsComponent extends AppComponentBase implements OnInit {
    @Input('data') data: any;    
    progressVisible = false;

    constructor(_injector: Injector,


        
    ) {
        super(_injector);
    }

    ngOnInit() {        
        
    }
  
    ngAfterViewInit() {

    }
}
