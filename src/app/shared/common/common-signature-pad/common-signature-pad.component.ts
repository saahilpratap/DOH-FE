import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'common-signature-pad',
    templateUrl: './common-signature-pad.component.html',
    styleUrls: ['./common-signature-pad.component.css']
})
export class SignaturePadComponent extends AppComponentBase implements OnInit {

    @Input() signatureShow: boolean;
    @Input() MinWidth: any;
    @Input() CanvasWidth: any;
    @Input() CanvasHeight: any;
    @Input() PenColor: any;
    @Input() imgUrl: any;
    @Output() signatureUrl: EventEmitter<any> = new EventEmitter<any>();
    showSignaturePad: boolean;
    @ViewChild("riginsign") private signaturePad: SignaturePad;

    signaturePadOptions: Object = {
        'minWidth': 0.1,
        'canvasWidth': 305,
        'canvasHeight': 100,
        penColor: "rgb(0, 0, 128)",
    };

    constructor(_injector: Injector,
        private _router: Router,
        private _sanitizer: DomSanitizer
    ) {
        super(_injector);
    }

    ngOnInit() {        
        if (this.imgUrl) {
            this.signaturePad.fromDataURL(this.imgUrl);           
        }  
    }
    clickSignature() {
        this.signaturePad.clear();
        this.signatureUrl.emit('');  
    }

    ngAfterViewInit() {
        if (this.imgUrl) {
            this.signaturePad.fromDataURL(this.imgUrl);           
        }  
    }
    ngAfterViewChecked() {
       
    }

    drawComplete() {        
        this.signatureUrl.emit(this.signaturePad.toDataURL());       
    }

    drawStart() {

    }
    showSignature() {
        this.showSignaturePad = true;
    }   
}
