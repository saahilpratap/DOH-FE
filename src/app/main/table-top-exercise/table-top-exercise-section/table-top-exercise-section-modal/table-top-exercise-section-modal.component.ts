import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { TableTopExerciseSectionServiceProxy, GetQuestionListDto, AttachmentWithTitleDto } from '../../../../../shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { getBaseURI } from '@amcharts/amcharts4/.internal/core/utils/Utils';
import {
    StorageServiceProxy
} from "@shared/service-proxies/services/storage.service";
import { FileUploadComponent } from '../../../../shared/common/file-upload/file-upload.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'tableTopExerciseSectionModals',
    templateUrl: './table-top-exercise-section-modal.component.html',
    styleUrls: ['./table-top-exercise-section-modal.component.css']
})

export class TableTopExerciseSectionModalComponent extends AppComponentBase {
    active = false;
    saving = false;
    saving1 = false;
    @ViewChild('tableTopExerciseSectionModal', { static: true }) modal: ModalDirective;
    @ViewChild(FileUploadComponent) fileUplad: FileUploadComponent;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    sectionform: FormGroup;
    tempQuestionList: GetQuestionListDto[] = [];
    questionList: GetQuestionListDto[] = [];
    questionList1: GetQuestionListDto[] = [];
    sectionId: number = 0;
    attachedFileCodes: any[] = [];
    attachmentData: any;
    showAttachment: boolean = false;
    fileExtensionList = ['jpeg', 'jpg', 'png', 'gif', 'tiff', 'psd', 'eps'];
    counter = 60;
    interval = 1000;
    constructor(_injector: Injector,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _storageService: StorageServiceProxy,
        private _tableTopExerciseSectionServiceProxy: TableTopExerciseSectionServiceProxy

    ) {
        super(_injector);
        this.sectionList();
    }
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: 'auto',
        minHeight: '0',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,

        defaultParagraphSeparator: '',
        defaultFontName: '',
        defaultFontSize: '',
        fonts: [
            { class: 'arial', name: 'Arial' },
            { class: 'times-new-roman', name: 'Times New Roman' },
            { class: 'calibri', name: 'Calibri' },
            { class: 'comic-sans-ms', name: 'Comic Sans MS' }
        ],
        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
    }
    sectionList() {
        this.sectionform = this._formBuilder.group({
            id: new FormControl(0),
            tenantId: new FormControl(abp.session.tenantId),
            sectionName: new FormControl(null, [Validators.required]),
            counterLimit: new FormControl("00:00:00"),
            tableTopExerciseSectionQuestions: this._formBuilder.array([]),
            tableTopExerciseSectionAttachement: this._formBuilder.array([])
        });
    }
    ttxSection(): FormArray {
        return this.sectionform.get("tableTopExerciseSectionQuestions") as FormArray
    }
    ttxAttachment(): FormArray {
        return this.sectionform.get("tableTopExerciseSectionAttachement") as FormArray
    }
    newTTXSection(): FormGroup {
        return this._formBuilder.group({
            tenantId: new FormControl(abp.session.tenantId),
            id: new FormControl(0),
            tableTopExerciseQuestionId: new FormControl(0),
            tableTopExerciseSectionId: new FormControl(0)
        });
    }
    newAttachment(): FormGroup {
        return this._formBuilder.group({
            fileName: new FormControl(null),
            title: new FormControl(null),
            code: new FormControl(null),
            tenantId: new FormControl(abp.session.tenantId),
            id: new FormControl(0),
            tableTopExerciseSectionId: new FormControl(0),
        })
    }
    show(Id?: number) {
        this.sectionform.reset();
        this.sectionList();
        this.sectionform;
        if (Id) {
            this.sectionId = Id;
            this.getBySection(Id);
            this.attachedFileCodes = [];
        }
        else {
            this.getAllSection();
            this.showAttachment = true;
        }
        this.active = true;
        this.modal.show();

    }
    getBySection(id) {

        this.sectionform;
        this.resetForm();
        this.spinnerService.show();
        this._tableTopExerciseSectionServiceProxy.getAllQuestionList().subscribe(questions => {
            this.questionList = questions;
            this._tableTopExerciseSectionServiceProxy.getTabletopExerciseSectionById(id).subscribe(res => {
                this.sectionform.patchValue(res);
                this.questionList1 = [];
                res.tableTopExerciseSectionQuestions.forEach(x => {
                    var temp = new GetQuestionListDto();
                    temp.id = x.tableTopExerciseQuestionId;
                    temp.name = this.questionList.find(y => y.id == x.tableTopExerciseQuestionId).name;
                    this.questionList1.push(temp);
                });
                res.tableTopExerciseSectionAttachement.forEach(i => {
                    this.attachedFileCodes.push({
                        code: i.code,
                        fileName: i.fileName,
                        id: i.id,
                        tableTopExerciseSectionId: i.tableTopExerciseSectionId,
                    });
                });
                this.fillquestions(this.questionList1);
                this.tempQuestionList = _.differenceWith(this.questionList, this.questionList1, (a, b) => _.eq(a.id, b.id));
                this.questionList = this.tempQuestionList;
                this.spinnerService.hide();
                this.fileUplad.getData(this.attachedFileCodes);
            });
        });
    }
    resetForm() {
        this.sectionform.reset();
        let attachmentArray = this.sectionform.get('tableTopExerciseSectionAttachement') as FormArray;
        attachmentArray.reset();
        let clearArray = this.sectionform.get('tableTopExerciseSectionQuestions') as FormArray;
        clearArray.reset();
        this.questionList1 = [];
        this.attachedFileCodes = [];

    }

    clearArray() {
        let frmArray = this.sectionform.get('tableTopExerciseSectionQuestions') as FormArray;
        frmArray.clear();
    }

    getAllSection() {
        this._tableTopExerciseSectionServiceProxy.getAllQuestionList().subscribe(res => {
            this.questionList = res;
        });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
        this.sectionform.reset('id');
        this.resetForm();
        this.showAttachment = false;
    }
    save(): void {

        this.clearArray();
        this.fillquestions(this.questionList1);


        this._tableTopExerciseSectionServiceProxy.createOrUpdateTabletopExerciseSection(this.sectionform.value)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
                this.sectionform.clearValidators();
                this.resetForm();
            });
    }
    passTargetQue(item) {
        const que_section = this.sectionform.get('tableTopExerciseSectionQuestions') as FormArray;
        item.items.forEach(i => {
            que_section.push(
                this._formBuilder.group({
                    id: 0,
                    tableTopExerciseQuestionId: i.id,
                    tableTopExerciseSectionId: this.sectionId
                })
            );
            console.log(this.sectionform.value);
        });
    }

    fillquestions(item: GetQuestionListDto[]) {

        var que_section = this.sectionform.get('tableTopExerciseSectionQuestions') as FormArray;
        item.forEach(i => {
            que_section.push(
                this._formBuilder.group({
                    id: 0,
                    tableTopExerciseQuestionId: i.id,
                    tableTopExerciseSectionId: this.sectionId
                })
            );
        });
    }


    getAttachment(e) {
        this.attachmentData = e;
        this.attachmentData.forEach(item => {
            this.spinnerService.show();
            if (!item.code) {
                let blob = new Blob([item], { type: item.extention });
                let formData: FormData = new FormData();
                formData.append("File", blob, item.name);
                this._storageService.AddTtxSectionAttachment(formData).subscribe(
                    res => {
                        this.spinnerService.hide();
                        const que_section = this.sectionform.get('tableTopExerciseSectionAttachement') as FormArray;
                        res.result.forEach(i => {
                            que_section.push(
                                this._formBuilder.group({
                                    fileName: i.fileName,
                                    code: i.code,
                                    id: 0,
                                    tableTopExerciseSectionId: this.sectionId,
                                })
                            );
                            console.log(this.sectionform.value);
                        });
                    },
                    error => {
                        console.log(error);
                        this.spinnerService.hide();
                        this.message.error(
                            "Please contact Admin to fix this.)!"
                        );
                    }
                );
            }
            else {
                const que_section = this.sectionform.get('tableTopExerciseSectionAttachement') as FormArray;
                que_section.push(
                    this._formBuilder.group({
                        fileName: item.name1,
                        code: item.code,
                        id: 0,
                        tableTopExerciseSectionId: this.sectionId
                    })

                );
            }
        });
        this.spinnerService.hide();
    }
    deleteAttachment(e) {

    }

    uploadAttachment(event: any, attachment: AttachmentWithTitleDto) {


    }
}
