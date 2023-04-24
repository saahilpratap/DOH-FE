import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { TableTopExerciseServiceProxy, GetTTEEntityReponsesDto, TableTopExerciseEntityResponseDto, TableTopExerciseEntityAttachmentDto, SectionAttachmentQuestion, CodeNameDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { FileDownloadService } from '../../../../../shared/utils/file-download.service';


@Component({
    selector: 'tableTopExerciseResponseModals',
    templateUrl: './table-top-exercise-response-modal.component.html',
    styleUrls: ['./table-top-exercise-response-modal.component.css']
})

export class TableTopExerciseResponseModalComponent extends AppComponentBase {
    active = false;
    saving = false;
   
    questionform: FormGroup;
    @ViewChild('tableTopExerciseResponseModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    tenancyId: number;
    waitMessage: string;
    tteId: any;
    display: boolean = false;
    tteEntitlyResponse: GetTTEEntityReponsesDto = new GetTTEEntityReponsesDto();
    tteEntitlyResponselist: TableTopExerciseEntityResponseDto[] = [];
    tableTopExerciseEntityResponses: TableTopExerciseEntityResponseDto[] = [];
    tableTopExerciseEntityAttachments: TableTopExerciseEntityAttachmentDto[] = [];
    sectionAttachmentQuestions: SectionAttachmentQuestion[] = [];   
    flag: boolean;
    data: any;
    sectionShow: any;
    showSection: boolean = false;
    totalRecord: any;
    resSelected = [];
    selectedVal: any;
    constructor(_injector: Injector,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _tableTopExerciseServiceProxy: TableTopExerciseServiceProxy,
        private _fileDownloadService: FileDownloadService
    ) {
        super(_injector);       
    }
  

    show(Id?: number) {
        this.sectionShow = -1;
        this.showSection = false;

        this.active = true;
        this.modal.show();
        if (Id) {
            this.getData(Id)
        }
        this.selectedVal = true;
    }
   
    close(): void {
        this.active = false;
        this.modal.hide();
    }    
    getData(Id: number) {       
        this._tableTopExerciseServiceProxy.getTTEEntityResponsesByTTEEntityId(Id).subscribe(res => {
            this.tteEntitlyResponse = res;
            this.tableTopExerciseEntityAttachments = res.tableTopExerciseEntityAttachments;           
            res.sectionAttachmentQuestions.forEach(y => {
                y.tableTopExerciseEntityResponses.forEach(x => {
                    if (x.answerType == 4) {
                        if (x.response != null) {
                            var obj = x.response.split(';');
                            this.resSelected = [];
                            x.responseOptions.filter(item => {
                                if (obj.find(listName => listName === item.name)) {
                                    this.resSelected.push({ name: item.name, code: item.code, selected: true });
                                } else {
                                    this.resSelected.push({ name: item.name, code: item.code, selected: false })
                                }
                            });
                            x.responseOptions = this.resSelected;                            
                        } 
                    } else if (x.answerType == 1) {                       
                        this.resSelected = [];
                        x.responseOptions.filter(item => {
                            if (x.response === item.name) {
                                this.resSelected.push({ name: item.name, code: item.code, selected: true });
                            } else {
                                this.resSelected.push({ name: item.name, code: item.code, selected: false })
                            }
                        });
                        x.responseOptions = this.resSelected;
                    }                    
                });
            });
            this.totalRecord = res.sectionAttachmentQuestions.length;
            this.sectionAttachmentQuestions = res.sectionAttachmentQuestions;
            this.flag = res.submitted;
            this.data = res.sectionAttachmentQuestions;
        });
    }
    downloadTTEENtityAttachment(code: string) {
        const self = this;
        self._fileDownloadService.DownloadTTEENtityAttachment(code);
    }
    nextStep(i) {        
        this.sectionShow = i + 1;        
    }
    previousStep(i) {        
        this.sectionShow = i - 1;       
    }
}
