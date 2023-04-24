import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild,
    Input,
    OnInit,
    EventEmitter,
    Output
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy, ExternalAssessmentsServiceProxy, ExternalAssessmentType, AssementScheduleServiceProxy, AssessmentStatus, AssessmentServiceProxy, ExtAssementScheduleServiceProxy, CommonLookupServiceProxy, AuditProjectServiceProxy, AccessPermission } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CreateOrEditExternalControlRequirementModalComponent } from '../../external-questionaire/create-or-edit-external-controlRequirement-modal.component';
import { PrimengTableHelper } from '../../../../shared/helpers/PrimengTableHelper';
import { CreateEditAuditProjectManagementComponent } from '../../audit-project-management/create-edit-audit-project-management/create-edit-audit-project-management.component';
import { CreateExtScheduleModalComponent } from '../../externalAssessments/externalAssessments/ext-schedule/create-ext-schedule-modal.component';
import { AssessmentDetailModalComponent } from '../../audit-project-management/assessment-detail-modal/assessment-detail-modal.component';

@Component({
    templateUrl: './grid-external-assessment.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
    selector: 'grid-external-assessment',
})
export class GridExternalAssessmentsComponent extends AppComponentBase implements OnInit {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    externalAssessmentType = ExternalAssessmentType;
    @ViewChild('createOrEditExternalQuestionModal', { static: true })
    createOrEditExternalQuestionModal: CreateOrEditExternalControlRequirementModalComponent;
    @Input('auditProId') auditProID: any;
    @ViewChild('createExtScheduleModal', { static: true }) createExtScheduleModals: CreateExtScheduleModalComponent;
    //@ViewChild('assessmentDetailModals', { static: true }) assessmentDetailModals: AssessmentDetailModalComponent;
    @ViewChild('assessmentDetailModals', { static: true }) assessmentDetailModals: AssessmentDetailModalComponent;
    
    @ViewChild('createEditAuditProjectManagementModals', { static: true }) createEditAuditProjectManagementModals: CreateEditAuditProjectManagementComponent;
    selectedRowData: any[];
    allDelete: boolean;
    schedulePrimengTableHelper: PrimengTableHelper;
    scheduleDetailPrimengTableHelper: PrimengTableHelper;
    allAssessmentSearchBox: boolean;
    deleteAll: boolean;
    @Output() isShow1 = new EventEmitter();
    assessmentStatus = AssessmentStatus;
    selectedAssessmentStatusFilter: AssessmentStatus = null;
    status: AssessmentStatus = undefined;
    businessEntityId: number;
    filterText = '';
    isScheduledDetails = false;
    allAssessments: boolean;
    scheduleCalendar: boolean;
    assessmentsSchedule: boolean;
    auditProgramsSchedule: boolean = false;
    //@Input("reauditPermission") reauditPermission: boolean;
    reauditPermission: boolean = true;
    beforeJanPermission: boolean = true;
    fromDate: Date = null;
    stageEndDate = new Date();

    nothingToshowText: any = 'Nothing to show'; // "By default" => There are no events scheduled that day.
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

    actions = [];
    showCalendar = false;
    events = [];
    viewDate: Date = new Date();
    themecolor: any = '#0a5ab3'
    scheduleAssessmentDetails: any;
    schArray = [];
    scheduleId: number;
    assessmentsScheduleBackButton: boolean;
    index = 0;
    selectedTabControl: string;
    constructor(
        injector: Injector,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _externalAssessmentService: ExternalAssessmentsServiceProxy, private _assessmentServiceProxy: AssessmentServiceProxy,
        private _router: Router, private _assementScheduleAppService: ExtAssementScheduleServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _auditServiceProxy: AuditProjectServiceProxy
    ) {
        super(injector);
        this.schedulePrimengTableHelper = new PrimengTableHelper();
        this.scheduleDetailPrimengTableHelper = new PrimengTableHelper();
        this.selectedTabControl = "IT Service Management";
    }

    onSelectionChange(selection: any[]) {
        if (selection.length >= 2) {
            this.allDelete = true;
        }
        else if (selection.length <= 1) {
            this.allDelete = false;
        }
    }
    deleteAllRecord() {
        this.message.confirm('', this.l('AreYouSure'), isConfirmed => {
            if (isConfirmed) {

            }
        });
    }

    ngOnInit() {
        this.reauditPermissionCheck();
        this.selectedAssessmentStatusFilter = 0;
        this.getCalenderAssessments();
        this.assessmentsSchedule = true;      
    }
   
    isShow() {
        //this.isShow1 = true;
    }
    hideAllAssessment() {
        this.allAssessmentSearchBox = false;
        //this.isScheduledDetails = false;
    }

    getScheduledAssessments(event?: LazyLoadEvent, loadTable?: boolean)
    {
        
        if (loadTable == false) {
            if (this.schedulePrimengTableHelper.shouldResetPaging(event)) {
                this.paginator.changePage(0);
                return;
            }
        }
        if (event != undefined) {
            this.dataTable._sortOrder = event.sortOrder;
            this.dataTable._sortField = event.sortField;
            this.dataTable.sortField = event.sortField;
            this.dataTable.sortOrder = event.sortOrder;
        }
        this.schedulePrimengTableHelper.showLoadingIndicator();
        this._assementScheduleAppService.getAllScheduledAssessments(this.filterText, undefined,
            this.schedulePrimengTableHelper.getSorting(this.dataTable),
            this.schedulePrimengTableHelper.getMaxResultCount(this.paginator, event),
            this.schedulePrimengTableHelper.getSkipCount(this.paginator, event))
            .subscribe(result => {
                
                this.schedulePrimengTableHelper.totalRecordsCount = result.totalCount;
                this.schedulePrimengTableHelper.records = result.items;
                this.schedulePrimengTableHelper.hideLoadingIndicator();

               
            });
        this.schedulePrimengTableHelper.hideLoadingIndicator();
    }

    showAllSchedules() {
        this.isScheduledDetails = false;
        this.getScheduledAssessments();
        this.assessmentsScheduleBackButton = false;
        this.auditProgramsSchedule = false;
        this.assessmentsSchedule = true;
    }

    showAllSchedulesDetails(record) {      
        this.auditProgramsSchedule = true;
        this.assessmentsScheduleBackButton = true;
        this.isScheduledDetails = true;
        this.scheduleId = record.id;
        this.getScheduledAssessments();
        this.getScheduledDetailAssessments();
        this.assessmentsSchedule = false;
    }

    getScheduledDetailAssessments(event?: any, loadTable?: boolean)
    {        
        if (loadTable == false) {
            if (this.scheduleDetailPrimengTableHelper.shouldResetPaging(event)) {
                this.paginator.changePage(0);
                return;
            }
        }
        if (event != undefined) {
            this.dataTable._sortOrder = event.sortOrder;
            this.dataTable._sortField = event.sortField;
            this.dataTable.sortField = event.sortField;
            this.dataTable.sortOrder = event.sortOrder;
        }
        this.scheduleDetailPrimengTableHelper.showLoadingIndicator();
        this._assementScheduleAppService.getAllScheduledDetailAssessments(this.filterText, this.scheduleId,
            this.scheduleDetailPrimengTableHelper.getSorting(this.dataTable),
            this.scheduleDetailPrimengTableHelper.getMaxResultCount(this.paginator, event),
            this.scheduleDetailPrimengTableHelper.getSkipCount(this.paginator, event))
            .subscribe(result => {
                this.scheduleDetailPrimengTableHelper.totalRecordsCount = result.totalCount;
                this.scheduleDetailPrimengTableHelper.records = result.items;
                this.scheduleDetailPrimengTableHelper.hideLoadingIndicator();
            });
        this.scheduleDetailPrimengTableHelper.hideLoadingIndicator();
    }

    eventClicked(event) {
        //console.log(event);
    }

    actionClicked(event) {
        if (event.action == 'View') {
            this._router.navigate(['/app/main/assessments/assessments/' + event.event.id + '/compliance-questionaire'])
        }
    }

    loadAllTables() {
        this.getScheduledAssessments();
        this.getCalenderAssessments();
        this.getExternalAssessments();
    }

    getCalenderAssessments()
    {
        this.showCalendar = false;
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
                            label: '<a routerLink="/app/main/assessments/assessments/' + item.id + '/compliance-questionaire">' +
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

    getExternalAssessments(event?: LazyLoadEvent) {
        
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._externalAssessmentService
            .getAllExternalAssementByProjectId(this.filterText, this.auditProID,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount =
                    result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
         
        this.primengTableHelper.showLoadingIndicator();
       
    }

    deleteScheduleAssessment(id)
    {
        this.message.confirm('This action cant be irreversable', this.l('AreYouSure'), isConfirmed => {
            if (isConfirmed) {
                this._assementScheduleAppService.deleteScheduledAssessment(id).subscribe(res => {
                    this.getScheduledAssessments(undefined, true);
                    this.notify.success(this.l('SuccessfullyDeleted'));
                });
            }
        });
    }

    deleteScheduleDetailAssessment(id) {
        this.message.confirm('This action cant be irreversable. If Assements are Schduled it also gets deleted.', this.l('AreYouSure'), isConfirmed => {
            if (isConfirmed) {
                this._assementScheduleAppService.deleteScheduledAssessmentDetails(id).subscribe(res => {
                    this.getScheduledDetailAssessments(undefined, true);
                    this.getExternalAssessments();
                    this.notify.success(this.l('SuccessfullyDeleted'));
                });
            }
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createExternalAssessment(): void {
        this._router.navigate([
            '/app/main/externalAssessments/externalAssessments/new'
        ]);
    }

    editExternalAssessment(id: number, buttonstatus?: any): void {
        this._router.navigate(
            ['/app/main/externalAssessments/externalAssessments/new'],
            {
                queryParams: {
                    id: id,
                    buttonstatus: buttonstatus
                }
            }
        );
    }

    generateQuestionaire(externalAssessmentId): void {
        this.message.confirm('', this.l('AreYouSure'), isConfirmed => {
            if (isConfirmed)
            {
                this.spinnerService.show();
                this._externalAssessmentService
                    .generateQuestionaire(externalAssessmentId)
                    .subscribe(
                        () => {                                                      
                            this.spinnerService.hide();
                            this.reloadPage();
                            this.getExternalAssessments();
                            this.message.success('Successfully Generated!');
                        },
                        error => {
                            //this.message.error(
                            //    'Couldn\'t Generate Questionaire at this time!'
                            //);
                            this.spinnerService.hide();
                        }
                    );
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

    deleteExternalAssessment(externalAssessmentId): void {
        this.message.confirm('', this.l('AreYouSure'), isConfirmed => {
            if (isConfirmed) {
                this.spinnerService.show();
                this._externalAssessmentService
                    .delete(externalAssessmentId)
                    .subscribe(
                        () => {
                            this.spinnerService.hide();
                            abp.message.success('Successfully Delete!');
                            this.ngOnInit();
                        },
                        error => {
                            this.message.error(
                                'Couldn\'t Delete  at this time!'
                            );
                            this.spinnerService.hide();
                        }
                    );
            }
        });
    }

    gotocomplianceQuestion(res) {
        this._assessmentServiceProxy.getEncryptAssessmentParameter(res, true).subscribe((encryptRessult) => {
            this._router.navigate([
                "/app/main/externalAssessments/externalAssessments/" +
                encryptRessult.assessmentId +
                "/compliance-questionaire/",
            ]);
        });
    }
    assessmentDetails(id) {
        //this.assessmentDetailModals.show(id);
    }

    tabAuditProjectId(id) {

    }


    //External Assessments
    reauditPermissionCheck() {
        this._commonLookupServiceProxy.getCurrentUserRoles().subscribe(
            (result) => {
                var roleList = result.map(x => x.roleName);
                this._auditServiceProxy.reauditPermissionCkeker().subscribe(res => {
                    var isExist = res.find(x => x.id == this.auditProID);
                    var isBEA = roleList.find(x => x.trim().toLowerCase() == "Business Entity Admin".trim().toLowerCase());
                    var isEAA = roleList.find(x => x.trim().toLowerCase() == "External Audit Admin".trim().toLowerCase());
                    var isEA = roleList.find(x => x.trim().toLowerCase() == "External Auditors".trim().toLowerCase());
                    var isIEA = roleList.find(x => x.trim().toLowerCase() == "Insurance Entity Admin".trim().toLowerCase());
                    if (isExist != undefined) {
                        switch (isExist.accessPermission) {

                            case 0:
                                {
                                    this.reauditPermission = true;
                                    break;
                                }
                            case 1:
                                {
                                    if (isBEA != undefined || isIEA != undefined)
                                        this.reauditPermission = false;
                                    else
                                        this.reauditPermission = true;
                                    break;
                                }
                            case 2:
                                {
                                    if (isEAA != undefined)
                                        this.reauditPermission = false;
                                    else
                                        this.reauditPermission = true;
                                    break;
                                }
                            case 3:
                                {
                                    if (isEAA != undefined || isBEA != undefined)
                                        this.reauditPermission = false;
                                    else
                                        this.reauditPermission = true;
                                    break;
                                }
                            case 4:
                                {

                                    if (isEA != undefined)
                                        this.reauditPermission = false;
                                    else
                                        this.reauditPermission = true;
                                    break;
                                }
                            case 5:
                                {
                                    if (isEA != undefined || isBEA != undefined)
                                        this.reauditPermission = false;
                                    else
                                        this.reauditPermission = true;
                                    break;
                                }
                            case 6:
                                {
                                    if (isEA != undefined || isEAA != undefined)
                                        this.reauditPermission = false;
                                    else
                                        this.reauditPermission = true;
                                    break;
                                }
                            case 7:
                                {
                                    this.reauditPermission = false;
                                    break;
                                }
                        }
                    }
                    else {
                        this.reauditPermission = false;
                    }
                    

                    if (this.appSession.user.isAdmin)
                        this.reauditPermission = false;
                });
                
            });
    }





    setDates(date: Date): Date {
        date.setDate(date.getDate());
        return date;
    }

    getAuditProjectById(id) {
        this._auditServiceProxy
            .getAuditProjectForEdit(this.auditProID)
            .subscribe((result) => {
                var fdate = result.stageEndDate;
                let fromDates: Date = new Date("2022-01-01");
                this.fromDate = fromDates;
                if (result.stageEndDate != null) {
                    this.stageEndDate = this.setDates(new Date(Date.parse(result.stageEndDate.toString())))
                }
                this.ReauditPermissionCheck_BeforeJan();
            });

    }

    ReauditPermissionCheck_BeforeJan() {
        this._commonLookupServiceProxy.getCurrentUserRoles().subscribe(
            (result) => {
                var roleList = result.map(x => x.roleName);
                this._auditServiceProxy.reauditPermissionCkeker().subscribe(res => {
                    var isExist = res.find(x => x.id == this.auditProID);
                    if (isExist != undefined) {
                        if (this.fromDate > this.stageEndDate) {
                            this.beforeJanPermission = false;
                        }
                        else {
                            this.beforeJanPermission = true;
                        }
                    }
                    else {
                        this.beforeJanPermission = true;
                    }
                    if (this.appSession.user.isAdmin)
                        this.beforeJanPermission = false;
                });
            });
    }



}




