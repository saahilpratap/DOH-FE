import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { TableTopExerciseGroupServiceProxy, TableTopExerciseGroupSectionDto, GetAllSectionListDto } from '../../../../../shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';



@Component({
    selector: 'tableTopExerciseGroupModals',
    templateUrl: './table-top-exercise-group-modal.component.html',
    styleUrls: ['./table-top-exercise-group-modal.component.css']
})


export class TableTopExerciseGroupModalComponent extends AppComponentBase {
    active = false;
    saving = false;
    saving1 = false;
    @ViewChild('tableTopExerciseGroupModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    groupform: FormGroup;
    groupDto: any[] = [];
    sectionList: GetAllSectionListDto[] = [];
    sectionListGroup: GetAllSectionListDto[] = [];
    sectionListGroup1: GetAllSectionListDto[] = [];
    tempSectionList: GetAllSectionListDto[] = [];
    groupId: any;
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
    constructor(_injector: Injector,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _tableTopExerciseGroupServiceProxy: TableTopExerciseGroupServiceProxy

    ) {
        super(_injector);
        this.groupList();
    }
    groupList() {
        this.groupform = this._formBuilder.group({
            id: new FormControl(0),
            tenantId: new FormControl(abp.session.tenantId),
            tableTopExerciseGroupName: new FormControl('', [Validators.required]),
            tableTopExerciseDescription: new FormControl('', [Validators.required]),            
            tableTopExerciseGroupSection: this._formBuilder.array([])
        });    
    }
    ttxGroup(): FormArray {
        return this.groupform.get("tableTopExerciseGroupSection") as FormArray
    }
    newTTXGroup(): FormGroup {
        return this._formBuilder.group({
            id: new FormControl(0),  
            tableTopExerciseSectionId: new FormControl(null, [Validators.required]),
            tableTopExerciseGroupId: new FormControl(null, [Validators.required])
          
        })
    }

    show(Id?: number) {        
        this.resetForm();
        this.groupList();
        this.groupform.reset('tableTopExerciseGroupName');
        if (Id) {
            this.getBySection(Id);
            this.groupId = Id;
        }
        else {
            this.groupId = 0;
            this.getSectionList();
        }
        this.active = true;
        this.modal.show();
        this.clearArray();

        this.setVal();
    }    
    getSectionList() {
        this._tableTopExerciseGroupServiceProxy.getSectionList().subscribe(res => {
            this.sectionList = res;
        });
    }
    getBySection(id) {
        this._tableTopExerciseGroupServiceProxy.getSectionList().subscribe(result => {
            this.sectionList = result;
            this._tableTopExerciseGroupServiceProxy.getTabletopExerciseQuestionById(id).subscribe(res => {
                this.groupform.patchValue(res);
                this.sectionListGroup1 = [];
                res.tableTopExerciseGroupSection.forEach(x => {
                    var temp = new GetAllSectionListDto();
                    temp.id = x.tableTopExerciseSectionId;
                    temp.sectionName = this.sectionList.find(y => y.id == x.tableTopExerciseSectionId).sectionName;
                    this.sectionListGroup1.push(temp);
                });
                this.fillquestions(this.sectionListGroup1);
                this.tempSectionList = _.differenceWith(this.sectionList, this.sectionListGroup1, (a, b) => _.eq(a.id, b.id));
                this.sectionList = this.tempSectionList;
            });
        });
    }
    fillquestions(item: GetAllSectionListDto[]) {
        const section = this.groupform.get('tableTopExerciseGroupSection') as FormArray;
        item.forEach(i => {
            section.push(
                this._formBuilder.group({
                    id: 0,                  
                    tableTopExerciseSectionId: i.id,
                    tableTopExerciseGroupId: this.groupId,
                })
            );
            console.log(this.groupform.value);
        });
    }
    close(): void {
        this.active = false;
        this.modal.hide();
        this.resetForm();
    }
    resetForm() {
        this.groupform.reset();
        let frmArray = this.groupform.get('tableTopExerciseGroupSection') as FormArray;
        frmArray.clear();
        this.sectionListGroup1 = [];
    }
    save(): void {       
        this.clearArray();
        this.fillquestions(this.sectionListGroup1);
        if (this.sectionListGroup1.length != 0) {
            this._tableTopExerciseGroupServiceProxy.createOrUpdateTabletopExerciseGroup(this.groupform.value)
                .pipe(finalize(() => { this.saving = false; }))
                .subscribe(() => {
                    this.notify.info(this.l('SavedSuccessfully'));
                    this.close();
                    this.modalSave.emit(null);
                    this.groupform.clearValidators();
                    this.resetForm();
                });
        }
        else {
            this.notify.error('At Least Select One Section');            
        }
    }
    passTargetQue(item) {
        const section = this.groupform.get('tableTopExerciseGroupSection') as FormArray;
        item.items.forEach(i => {
            section.push(
                this._formBuilder.group({
                    id: 0,                 
                    tableTopExerciseSectionId: i.id,
                    tableTopExerciseGroupId: this.groupId
                   
                })
            );
            console.log(this.groupform.value);
        });
    }
    clearArray() {
        let frmArray = this.groupform.get('tableTopExerciseGroupSection') as FormArray;
        frmArray.clear();
    }
    setVal() {
        if (this.groupId == 0 && !this.groupId) {
            this.groupform.get('id').setValue(0);
        }
        this.groupform.get('tenantId').setValue(abp.session.tenantId);
        const sectionList = this.groupform.get('tableTopExerciseGroupSection') as FormArray;
        this.groupform.value.tableTopExerciseGroupSection.forEach((item: any, i: number) => {
            sectionList.controls[i].get('id').setValue(0);
            sectionList.controls[i].get('tableTopExerciseGroupId').setValue(0);
            sectionList.controls[i].get('tableTopExerciseSectionId').setValue(0);
        });
    }
}
