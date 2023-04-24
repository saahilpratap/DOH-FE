import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AttachmentWithTitleDto } from '../../../../shared/service-proxies/service-proxies';
import { StorageServiceProxy } from '../../../../shared/service-proxies/services/storage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SummernoteTextEditorService } from './summernote-text-editor.service';
import { debuglog } from 'util';
declare var $;

@Component({
    selector: 'summernote-text-editor',
    templateUrl: './summernote-text-editor.component.html',
    styleUrls: ['./summernote-text-editor.component.css']
})
export class SummernoteTextEditorComponent extends AppComponentBase implements OnInit {
    getSummerNoteData = this.summernoteTextEditorService.getDataSummernote(); 
    @Input('name') name: any;
    @Output() setSummerNoteData: EventEmitter<string[]> = new EventEmitter<string[]>();

    form: FormGroup = new FormGroup({
        html: new FormControl('', Validators.required)
    });
    
    config: any = {
        airMode: false,
        tabDisable: true,
        popover: {
            table: [
                ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
                ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
            ],
            image: [
                ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
                ['float', ['floatLeft', 'floatRight', 'floatNone']],
                ['remove', ['removeMedia']]
            ],
            link: [
                ['link', ['linkDialogShow', 'unlink']]
            ],
            air: [['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],],
            print: {
                'stylesheetUrl': 'url_of_stylesheet_for_printing'
            }
        },
        height: '350px',
        uploadImagePath: '/api/upload',
        toolbar: [
            ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
            ['font',['bold','italic','underline','strikethrough','superscript','subscript','clear']],
            ['fontsize', ['fontname', 'fontsize', 'color']],
            ['para', ['style0', 'ul', 'ol', 'paragraph', 'height', 'lineheight']],
            ['insert', ['table', 'picture', 'link', 'video', 'hr']],
            ['customButtons', ['testBtn']],
            ['headline', ['style']],            
            ['view', ['fullscreen']],
            ['help', ['help']],
            ['misc', ['print']]
        ],
        lineHeights: ['0.2', '0.3', '0.4', '0.5', '0.6', '0.8', '0.9', '1.0', '1.2', '1.4', '1.5', '1.7', '1.9', '2.0', '2.2', '2.4', '2.6', '2.8', '3.0', '3.2', '3.4', '3.6'],
        codeviewFilter: true,
        codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
        codeviewIframeFilter: true,
        focus: true,
        disableResizeEditor: true
    };
    editorDisabled = false;
    focus: true;
    disableResizeEditor: true

    get sanitizedHtml() {
        return this.sanitizer.bypassSecurityTrustHtml(this.form.get('html').value);
    }

    constructor(_injector: Injector,
        private sanitizer: DomSanitizer,
        private summernoteTextEditorService: SummernoteTextEditorService,
    ) {
        super(_injector);
    }

    ngOnInit() {    
        
    }

    ngAfterViewInit() {
    }
    getData(e) {
        switch (this.name) {
            case "New SummerNote":
                if (this.getSummerNoteData == undefined) {
                    this.getSummerNoteData = e;
                } else {
                    this.getSummerNoteData = e;
                }   
                break;
            case "Edit SummerNote":
                if (this.getSummerNoteData == undefined) {
                    this.getSummerNoteData = e;
                } else {
                    this.getSummerNoteData = this.getSummerNoteData + e;
                }   
                break;
               
        }     
    }
    dataChanged(e) {       
        this.setSummerNoteData.emit(e)
    }
    print() {
        $('#summernote').print();
    }
    pdfFile() {
        
    }
}
