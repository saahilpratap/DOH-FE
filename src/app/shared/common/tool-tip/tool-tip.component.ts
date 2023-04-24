import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';


@Component({
    selector: 'tool-tip',
    templateUrl: './tool-tip.component.html',
    styleUrls: ['./tool-tip.component.css']
})
export class ToolTipComponent extends AppComponentBase implements OnInit {
    @Input('data') data: any;
    @Input('index') index: number;
    @Input('showLength') showLength: number;
    progressVisible = false;
    defaultVisible = false;
    defaultVisible1: number;

    withTemplateVisible = false;

    withAnimationVisible = false;
    constructor(_injector: Injector,        
    ) {
        super(_injector);
    }

    ngOnInit() {        
        
    }
  
    ngAfterViewInit() {

    }
    toggleDefault(e) {       
        this.defaultVisible1 = e;
        this.defaultVisible = !this.defaultVisible;
    }
    toggleWithTemplate(e) {     
        this.defaultVisible1 = e;
        this.withTemplateVisible = !this.withTemplateVisible;
    }

    toggleWithAnimation() {
        this.withAnimationVisible = !this.withAnimationVisible;
    }    
}
