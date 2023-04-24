import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'common-text-editor',
    templateUrl: './common-text-editor.component.html',
    styleUrls: ['./common-text-editor.component.css']
})
export class CommonTextEditorComponent extends AppComponentBase implements OnInit {
    @Input('textData') textData: any;

    constructor(_injector: Injector,

    ) {
        super(_injector);
    }

    ngOnInit() {    
        
    }

    ngAfterViewInit() {

    }
}
