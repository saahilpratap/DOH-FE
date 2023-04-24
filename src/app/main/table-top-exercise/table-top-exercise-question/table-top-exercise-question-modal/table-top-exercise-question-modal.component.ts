import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CreateOrEditPatientAuthenticationPlatformDto, TableTopExerciseServiceProxy, GetTableTopExerciseQuestionDto, TableTopExerciseQuestionOptionDto, CreateOrEditTableTopExerciseQuestionDto } from '../../../../../shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';


@Component({
    selector: 'tableTopExerciseQuestionModals',
    templateUrl: './table-top-exercise-question-modal.component.html',
    styleUrls: ['./table-top-exercise-question-modal.component.css']
})


export class TableTopExerciseQuestionModalComponent extends AppComponentBase {
    active = false;
    saving = false;
    saving1 = false;
    questionform: FormGroup;
    @ViewChild('tableTopExerciseQuestionModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    questionDto: GetTableTopExerciseQuestionDto[] = [];
    ttxQuestion11: TableTopExerciseQuestionOptionDto[] = [];
    questionDto1: CreateOrEditTableTopExerciseQuestionDto[] = [];

    constructor(_injector: Injector,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _tableTopExerciseServiceProxy: TableTopExerciseServiceProxy
    ) {
        super(_injector);
        this.questionList();
    }
    questionList() {
        this.questionform = this._formBuilder.group({
            id: new FormControl(0),
            tenantId: new FormControl(abp.session.tenantId),
            name: new FormControl(null, [Validators.required]),
            description: new FormControl(null),
            mandatory: new FormControl(false),
            commentRequired: new FormControl(false),
            commentMandatory: new FormControl(false),
            answerType: new FormControl(null, [Validators.required]),
            tableTopExerciseQuestionOption: this._formBuilder.array([])
        });
    }
    tableTopExerciseQuestionOption(): FormArray {
        return this.questionform.get("tableTopExerciseQuestionOption") as FormArray
    }
    eventCheck(e) {
        this.questionform.get('commentMandatory').setValue(false);
    }
    newQuantity(id?: number): FormGroup {        
       if (id == 1) {
            return this._formBuilder.group({
                tableTopExerciseQuestionId: new FormControl(0),
                value: new FormControl(null, [Validators.required]),
                score: new FormControl(0, [Validators.required]),
                id: new FormControl(0)
            });   
       }
       else if (id == 2) {
            return this._formBuilder.group({
                tableTopExerciseQuestionId: new FormControl(0),
                value: new FormControl(null, [Validators.required]),
                score: new FormControl(0, [Validators.required]),
                id: new FormControl(0)
            });
       }
       else if (id == 3) {
            return this._formBuilder.group({
                tableTopExerciseQuestionId: new FormControl(0),
                value: new FormControl(null),
                score: new FormControl(0),
                id: new FormControl(0)
            });
       }
       else if (id == 4) {
            return this._formBuilder.group({
                tableTopExerciseQuestionId: new FormControl(0),
                value: new FormControl(null, [Validators.required]),
                score: new FormControl(0, [Validators.required]),
                id: new FormControl(0)
            });
        } else {
            return this._formBuilder.group({
                tableTopExerciseQuestionId: new FormControl(0),
                value: new FormControl(null, [Validators.required]),
                score: new FormControl(0, [Validators.required]),
                id: new FormControl(0)
            });    
        }      
    }

    show(Id?: number) {      
        this.questionform;
        this.questionform.reset();
        this.questionList();
        if (Id) {
            this.getByQuestion(Id);
        } else {
            this.addAnswerOption(Id);
            this.clearArray();
        }
        this.active = true;
        this.modal.show();

    }
   
    close(): void {
        this.active = false;
        this.modal.hide();
    }
    addAnswerOption(id?: number) {       
        this.tableTopExerciseQuestionOption().push(this.newQuantity(id));
    }

    deleteAnswerOption(i: number) {
        this.tableTopExerciseQuestionOption().removeAt(i);
    }
    onAnswerTypeChange(item, id) {      
        this.clearArray();       
        if (id == 2) {
            for (let i = 0; i <= 1; i++) {
                this.addAnswerOption(id);
            }            
        }
        else {
            this.addAnswerOption(id);
            this.tableTopExerciseQuestionOption().removeAt(1);          

        }
    }
    save(): void {
        this.questionform;
        this._tableTopExerciseServiceProxy.createOrUpdateTabletopExerciseQuestion(this.questionform.value)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
                this.questionform.clearValidators();
            });
    }
    getByQuestion(id: any) {
        this.clearArray();
        this.questionform.get('tableTopExerciseQuestionOption').reset();
        const question = this.questionform.get('tableTopExerciseQuestionOption') as FormArray;
        this._tableTopExerciseServiceProxy.getTabletopExerciseQuestionById(id).subscribe(res => {
            this.questionform.patchValue(res);
            res.tableTopExerciseQuestionOption.forEach(i => {
                question.push(
                    this._formBuilder.group({
                        tableTopExerciseQuestionId: i.tableTopExerciseQuestionId,
                        value: i.value,
                        score: i.score,
                        id: i.id
                    })
                );
            })
        });
    }
    clearArray() {
        let frmArray = this.questionform.get('tableTopExerciseQuestionOption') as FormArray;
        frmArray.clear();  
    }
}
