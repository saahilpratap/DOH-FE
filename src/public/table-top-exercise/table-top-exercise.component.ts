import { Component, Injector, OnInit, ViewContainerRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import * as moment from 'moment';
import { TableTopExerciseServiceProxy, AccountServiceProxy, ResolveTenantIdInput, GetTTEEntityReponsesDto, TableTopExerciseEntityResponseDto, CodeNameDto, TableTopExerciseEntityAttachmentDto, SectionAttachmentQuestion } from '../../shared/service-proxies/service-proxies';
import { TableTopExerciseHomeComponent } from './table-top-exercise-home/table-top-exercise-home.component';
import { NgxSpinnerService } from "ngx-spinner";


export class DataClass {
    section: string;
    sectionAttachmentList: sectionAttachment[] = [];
    questionList: Question[] = [];
}

export class Question {
    tableTopExerciseEntityId!: number;
    tableTopExerciseSectionId!: number;
    tableTopExerciseQuestionId!: number;
    questionComment!: string | undefined;
    commentMandatory!: boolean;
    answerType!: string;
    response!: string | undefined;
    questionName!: string | undefined;
    responseOptions!: CodeNameDto[] | undefined;
    multiResponse!: CodeNameDto[] | undefined;
    id!: number | undefined;
}

export class sectionAttachment {
    tenantId!: number | undefined;
    fileName!: string | undefined;
    title!: string | undefined;
    code!: string | undefined;
    tableTopExerciseSectionId!: number;
    id!: number;
}

@Component({
    templateUrl: './table-top-exercise.component.html',
    styleUrls: ['./table-top-exercise.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class TableTopExerciseComponent extends AppComponentBase implements OnInit {

    private viewContainerRef: ViewContainerRef;
    tenancyId: number;
    currentYear: number = moment().year();
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    active = false;
    saving = false;
    waitMessage: string;
    tteId: any;
    display: boolean = false;
    tteEntitlyResponse: GetTTEEntityReponsesDto = new GetTTEEntityReponsesDto();
    tteEntitlyResponselist: TableTopExerciseEntityResponseDto[] = [];
    tableTopExerciseEntityResponses: TableTopExerciseEntityResponseDto[] = [];
    tableTopExerciseEntityAttachments: TableTopExerciseEntityAttachmentDto[] = [];
    sectionAttachmentQuestions: SectionAttachmentQuestion[] = [];
    showSection: boolean;
    flag: boolean;
    data1: DataClass[] = [];
    @ViewChild(TableTopExerciseHomeComponent) childHome: TableTopExerciseHomeComponent;
    ttxId: any;
    checkData: boolean = false;
    public constructor(
        injector: Injector,
        public _router: Router,
        viewContainerRef: ViewContainerRef,
        private _accountService: AccountServiceProxy,
        private _tableTopExerciseService: TableTopExerciseServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private spinner: NgxSpinnerService
    ) {
        super(injector);
        this.primengTableHelper.showLoadingIndicator();
        this.viewContainerRef = viewContainerRef;
    }
    data: any = [];

    ngOnInit(): void {
        this.getData();
        this.showSection = true;
        this.primengTableHelper.showLoadingIndicator();
    }
    getData() {
        this.tteId = this._activatedRoute.snapshot.queryParams['tteId'];      
        this._accountService.resolveTTXEntityResponse(new ResolveTenantIdInput({ c: this.tteId })).subscribe((tenantId) => {
            let reloadNeeded = tenantId;
            this.tteId = reloadNeeded;
            this.ttxId = reloadNeeded;
            this.display = true;
            this._tableTopExerciseService.getTTEEntityResponsesByTTEEntityId(this.tteId).subscribe(res => {
                this.tteEntitlyResponse = res;
                this.tableTopExerciseEntityAttachments = res.tableTopExerciseEntityAttachments;
                res.sectionAttachmentQuestions.forEach(y => {
                    y.tableTopExerciseEntityResponses.forEach(x => {
                        if (x.answerType == 4) {
                            if (x.response != null) {
                                var obj = x.response.split(',');
                                obj.forEach(y => {
                                    var temp = new CodeNameDto();
                                    temp.code = y;
                                    temp.name = y;
                                    x.multiResponse.push(temp);
                                });
                            }
                        }
                    });
                });
                this.sectionAttachmentQuestions = res.sectionAttachmentQuestions;
                this.flag = res.submitted;
                this.data = res;
                console.log(this.data);
                //this.childHome.bindAttachment(this.data);
                this.primengTableHelper.hideLoadingIndicator();
                this.checkData = true;

            });
        });
    }

}
