import { Component, Injector, OnInit, ViewContainerRef, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { FileSizePipe } from '../../../shared/common/pipes/file-size.pipe';
import Swal from 'sweetalert2'
import { GetTTEEntityReponsesDto } from '../../../shared/service-proxies/service-proxies';
import { TableTopExerciseSectionomeComponent } from '../table-top-exercise-section/table-top-exercise-section.component';

@Component({
    selector: 'table-top-exercise-home',
    templateUrl: './table-top-exercise-home.component.html',
    styleUrls: ['./table-top-exercise-home.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class TableTopExerciseHomeComponent extends AppComponentBase implements OnInit {

    private viewContainerRef: ViewContainerRef;
    @ViewChild(TableTopExerciseSectionomeComponent) childSection: TableTopExerciseSectionomeComponent;

    tenancyId: number;
    currentYear: number = moment().year();
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    counter = 1;
    height: any;
    width: any;
    nextActive = true;
    backActive = true;
    sliderPosition = 0;
    fileExtensionList = [] ;
    value: any[] = [];
    images = [];
    attachedfileSize: any = '10500000';
    @Input() data: any;
    @Input() ttxId: any;
    _fileSize: any;
    showSection: boolean;
    public constructor(
        injector: Injector,
        public _router: Router,
        viewContainerRef: ViewContainerRef,
        private _fileSizePipe: FileSizePipe
    ) {
        super(injector);
        this.viewContainerRef = viewContainerRef;     
        console.log(this.data);
        this.fileExtensionList = ['jpeg', 'jpg', 'xls', 'xlsx', 'doc', 'docx', 'txt', 'pdf', 'png', 'pptx', 'ppt', 'rtf', 'zip', 'msg'];
    }

    ngOnInit() {
        this._fileSize = this._fileSizePipe.transform(this.attachedfileSize);
        if (this.width === undefined || this.width === '') {
            this.width = '700';
        } else {
            return;
        }
        this.height = (this.width / 2) + 50;
        this.showSection = false;
        
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.height = (this.width / 2) + 50;
        }, 1);
    }

    deleteAttachment(i) {
        this.value.splice(i, 1);       
    }
    moveSlider(dir) {
        if (dir === 'next' && this.counter !== this.images.length) {
            this.sliderPosition = this.counter * this.width;
            this.counter++;
        } else if (dir === 'back' && this.counter !== 1) {
            this.counter--;
            this.sliderPosition = (this.counter - 1) * this.width;
        }
    }
    thumbsLeft(wrapperWidth) {
        const extra = ((((wrapperWidth / 100) % 1) * 100).toFixed(0)) as any;
        const moveTime = ((wrapperWidth / 100).toFixed(0)) as any;
        const loops = (this.images.length / moveTime).toFixed(0) as any;
        if (this.counter <= Number(moveTime)) {
            return 0 + 'px';
        } else {
            for (let i = 1; i < loops; i++) {
                if (this.counter > (Number(moveTime) * i) && this.counter <= Number(moveTime) * (i + 1)) {
                    return '-' + ((wrapperWidth - extra)) * i + 'px';
                }
            }
        }
    }
    selectThumb(index) {
        const dir = index > this.counter ? 'next' : 'back';
        this.counter = dir === 'next' ? (index - 1) : (index + 1);
        this.moveSlider(dir);

    }
    myUploader(event) {
        event.files.forEach(i => {
            let cont = 0;
            var fileExtension = i.name.split('.').pop();
            var extentionExist = this.fileExtensionList.find(x => x == fileExtension.toLowerCase());          
            if (i.size > this.attachedfileSize) {
                Swal.fire({
                    icon: 'error',
                    html:
                        'File size <b>' + this._fileSizePipe.transform(i.size) + '</b> should not be more than<b> ' + this._fileSizePipe.transform(this.attachedfileSize) + '</b>',
                    showCloseButton: false,
                    showCancelButton: false,
                    focusConfirm: false
                });
            }
            else {
                var extentionExist = this.fileExtensionList.find(x => x == fileExtension.toLowerCase());
                if (extentionExist != undefined) {
                    var checkFile = this.value.find(x => x.name == i.name);
                    if (checkFile == undefined) {
                        this.value.push(i);
                    }
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        html:
                            '<b>Please use the correct file format</b>',
                        showCloseButton: false,
                        showCancelButton: false,
                        focusConfirm: false
                    });

                }
            }
            cont++
            if (event.files.length == cont) {
                event.files.forEach(i => {
                    event.files.splice(i, 1);
                });
            }
        });       
        this.data.attachedfiles = this.value;
    }

    nextStep() {
        this.showSection = true;
    }

    renderingHome(e) {
        this.data = e;
    }

    bindAttachment(e) {
        this.data = e;
        this.value = [];
        this.data.tableTopExerciseEntityAttachments.forEach(x => {
            var temp = { name: x.fileName }
            this.value.push(temp);
        });
    }
}
