import { Component, Injector, ViewEncapsulation, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditExternalControlRequirementModalComponent } from '../external-questionaire/create-or-edit-external-controlRequirement-modal.component';
import { CreateExtScheduleModalComponent } from '../externalAssessments/externalAssessments/ext-schedule/create-ext-schedule-modal.component';
import { CreateEditAuditProjectManagementComponent } from '../audit-project-management/create-edit-audit-project-management/create-edit-audit-project-management.component';
import { AssessmentServiceProxy, ExternalAssessmentsServiceProxy, AssessmentStatus } from '../../../shared/service-proxies/service-proxies';
import { ScheduleDetailModalComponent } from '../externalAssessments/externalAssessments/grid-view/schedule-detail-modal/schedule-detail-modal.component';
import * as _ from 'lodash';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/public_api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';

@Component({
    selector: 'external-assessment',
    templateUrl: './external-assessment.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ExternalsAssessmentComponent extends AppComponentBase implements OnInit {

    @ViewChild('createOrEditExternalQuestionModal', { static: true }) createOrEditExternalQuestionModal: CreateOrEditExternalControlRequirementModalComponent;
    @ViewChild('createExtScheduleModal', { static: true }) createExtScheduleModals: CreateExtScheduleModalComponent;
    @ViewChild('createEditAuditProjectManagementModals', { static: true }) createEditAuditProjectManagementModals: CreateEditAuditProjectManagementComponent;
    @ViewChild('ScheduleDetailModals', { static: true }) ScheduleDetailModals: ScheduleDetailModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    allAssessmentSearchBox: boolean;
    themecolor: any = '#0a5ab3';
    events = [];
    selectedItem: any;
    actions = [];
    showCalendar = false;
    assessmentStatus = AssessmentStatus;   
    colors: any = {
        red: {
            primary: '#ad2121',
            secondary: '#FAE3E3'
        },
        yellow: {
            primary: '#e3bc08',
            secondary: '#FDF1BA'
        },
        green: {
            primary: '#008000',
            secondary: '#ccebcc'
        },
        gray: {
            primary: '#808080',
            secondary: '#edebeb'
        }
    };
    nothingToshowText: any = 'Nothing to show'; // "By default" => There are no events scheduled that day.
    viewDate: Date = new Date();
    schArray = [];
    constructor(
        injector: Injector,       
        private _router: Router, private _assessmentServiceProxy: AssessmentServiceProxy,
        private _externalAssessmentService: ExternalAssessmentsServiceProxy,
    ) {
        super(injector);
     
    }      
    ngOnInit() {       
        this.selectedItem = 1;
        this.getCalenderAssessments();
    }
    selectTab(e) {       
        this.selectedItem = e;       
    }
    eventClicked(event) {
        //console.log(event);
    }
    actionClicked(event) {
        if (event.action == 'View') {
            this._assessmentServiceProxy.getEncryptAssessmentParameter(event.event.id, true).subscribe((encryptRessult) => {
                this._router.navigate(['/app/main/externalAssessments/externalAssessments/' + encryptRessult.assessmentId + '/compliance-questionaire'])
            });
        }
    }
    getCalenderAssessments() {        
        this.events = [];
        this._externalAssessmentService
            .getAll(null, null, null, null, null, null, 0, null, null, null, null, null,
                null, null, null, null, null, null,
                undefined,
                0,
                1000
            )
            .subscribe(result => {
                if (result.items.length > 0) {
                    result.items.forEach(item => {
                        this.actions = [{
                            label: '<a routerLink="/app/main/externalAssessments/externalAssessments/' + item.id + '/compliance-questionaire">' +
                                '<i class="la la-question-circle icon-question"> </i>' +
                                '</a></br>',
                            name: 'View'
                        }];
                        this.events.push({
                            start: new Date(item.startDate.toDate()),
                            end: new Date(item.endDate.toDate()),
                            title: item.name,
                            id: item.id,
                            color: this.getColorByStatus(AssessmentStatus.Initialized),
                            actions: this.actions
                        });
                    });
                    this.showCalendar = true;

                } else {
                    this.showCalendar = true;
                }
            });
    }

    getColorByStatus(status: AssessmentStatus): any {
        switch (status) {
            case AssessmentStatus.Approved: {
                return this.colors.green;
            }
            case AssessmentStatus.InReview: {
                return this.colors.yellow;
            }
            case AssessmentStatus.BEAdminReview: {
                return this.colors.yellow;
            }
            case AssessmentStatus.EntityGroupAdminReview: {
                return this.colors.yellow;
            }
            case AssessmentStatus.Initialized: {
                return this.colors.gray;
            }
            case AssessmentStatus.NeedsClarification: {
                return this.colors.red;
            }
            case AssessmentStatus.SentToAuthority: {
                return this.colors.yellow;
            }
        }
    }

   
}
