import { Component, Injector, OnInit, ViewContainerRef, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { GetTTEEntityReponsesDto, TableTopExerciseServiceProxy, TableTopExerciseEntityResponseDto, AttachmentWithTitleDto } from '../../../shared/service-proxies/service-proxies';
import { StorageServiceProxy } from '../../../shared/service-proxies/services/storage.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { FileDownloadService } from '../../../shared/utils/file-download.service';
import Swal from 'sweetalert2'
import { timer, Subscription } from "rxjs";

const counter = timer(0, 2000);

@Component({
    selector: 'table-top-exercise-section',
    templateUrl: './table-top-exercise-section.component.html',
    styleUrls: ['./table-top-exercise-section.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class TableTopExerciseSectionomeComponent extends AppComponentBase implements OnInit {
    questionform: FormGroup;
    userGroupForm: FormGroup;
    employerBasicsForm: FormGroup;
    private viewContainerRef: ViewContainerRef;
    tenancyId: number;
    currentYear: number = moment().year();
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    @Input() sectionData: any;
    sectionShow: any;
    arrayCount: number = 0;
    tteId: number = 0;
    tteEntitlyResponselist: TableTopExerciseEntityResponseDto[] = [];
    attachmentCode: AttachmentWithTitleDto[] = [];
    @Input() ttxId: any;
    counter: any;
      tick = 1000;
    interval = 1000;
    countDown: Subscription;
   

    

    public constructor(
        injector: Injector,
        public _router: Router,
        private readonly _storageService: StorageServiceProxy,
        private _tableTopExerciseService: TableTopExerciseServiceProxy,
        viewContainerRef: ViewContainerRef,
        private _activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _fileDownloadService: FileDownloadService,
    ) {
        super(injector);
        console.log(this.sectionData);
        this.viewContainerRef = viewContainerRef;
    }

    ngOnInit(): void {
        this.sectionShow = 0;
        this.tteId = this._activatedRoute.snapshot.queryParams['tteId'];
        this.sectionData;
       
    }
   
    //ngAfterViewInit() {

    //}

    isFieldRequired(e): boolean {
        return e
    }
    returnTick(item): number {       
        this.countDown = timer(0, this.tick).subscribe(() => --item);
        return Number(item);
        
    }
    clickQuestion(i) {
        this.sectionShow = i + 1;
    }
    nextStep(i) {
        this.sectionShow = i + 1;
        console.log("Questio Length : " + this.sectionData.sectionAttachmentQuestions.length);
    }
    previousStep(i) {
        this.sectionShow = i - 1;
        console.log("Questio Length : " + this.sectionData.sectionAttachmentQuestions.length);
    }   
    Save(): void {
        this.arrayCount = 0;
        this.attachmentCode = [];
        if (this.sectionData.attachedfiles == undefined || this.sectionData.attachedfiles == 0) {
            this.updateRecord();
        }
        else {
            this.sectionData.attachedfiles.forEach(item => {
                if (!item.code) {
                    let blob = new Blob([item], { type: item.extention });
                    let formData: FormData = new FormData();
                    formData.append("File", blob, item.name);
                    formData.append("Title", item.name + "," + this.ttxId);
                    this.spinnerService.show();                  
                    this._storageService.AddTTEEntityAttachment(formData).subscribe(
                        res => {
                            this.arrayCount++;
                            this.spinnerService.hide();
                            let items = new AttachmentWithTitleDto();
                            items.code = res.result.code;
                            items.title = item.name;                          
                            this.attachmentCode.push(items);
                            if (this.sectionData.attachedfiles.length == this.arrayCount) {
                                this.updateRecord();
                            }
                        },
                        error => {
                            console.log(error);
                            this.spinnerService.hide();
                            this.message.error(
                                "Couldn't upload file at this time, try later :)!"
                            );
                        });
                }
                else {
                    this.arrayCount++;
                }
            });
        }
    }
    downloadAttachment(code: string) {
        const self = this;
        self._fileDownloadService.downloadTTXFile(code);
    }
    updateRecord() {
        this.sectionData.sectionAttachmentQuestions.forEach(y => {
            y.tableTopExerciseEntityResponses.forEach(x => {
                if (x.answerType == 4) {
                    x.response = _.join(x.multiResponse.map(yy => yy.code), ';');
                }
                this.tteEntitlyResponselist.push(x);
            });
        });
        this._tableTopExerciseService.updateTTEEntityResponses(this.tteEntitlyResponselist).subscribe(res => {
            //this.message.success("Thank you for your valuable Response");
            Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'Thank you for your valuable Response',
                showConfirmButton: false,
                timer: 1500
            });
            window.location.reload();
        });
    }
    progressBar(e, i): number {        
        let per = (i * 100) / e;
        return per;
    }
    SetData(e) {
        this.sectionData = e;
    }
}
