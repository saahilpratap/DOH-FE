import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild,

    OnInit,
    EventEmitter,
    Output
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy, ExternalAssessmentsServiceProxy, ExternalAssessmentType, AssementScheduleServiceProxy, AssessmentStatus, AssessmentServiceProxy, ExtAssementScheduleServiceProxy } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CreateOrEditExternalControlRequirementModalComponent } from '../../external-questionaire/create-or-edit-external-controlRequirement-modal.component';
import { CreateExtScheduleModalComponent } from './ext-schedule/create-ext-schedule-modal.component';
import { PrimengTableHelper } from '../../../../shared/helpers/PrimengTableHelper';
import { CapitalizePipe } from '../../../../shared/common/pipes/capitalize.pipe';
import { CreateEditAuditProjectManagementComponent } from '../../audit-project-management/create-edit-audit-project-management/create-edit-audit-project-management.component';
import { GridViewAuditProgramsScheduleComponent } from './grid-view/grid-view-audit-programs-schedule/grid-view-audit-programs-schedule.component';

@Component({
    templateUrl: './externalAssessments.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
    selector: 'external-assessments',
})
export class ExternalAssessmentsComponent extends AppComponentBase implements OnInit {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    externalAssessmentType = ExternalAssessmentType;
    @ViewChild('createOrEditExternalQuestionModal', { static: true })
    createOrEditExternalQuestionModal: CreateOrEditExternalControlRequirementModalComponent;
    @ViewChild('createExtScheduleModal', { static: true }) createExtScheduleModals: CreateExtScheduleModalComponent;
    @ViewChild('createEditAuditProjectManagementModals', { static: true }) createEditAuditProjectManagementModals: CreateEditAuditProjectManagementComponent;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(GridViewAuditProgramsScheduleComponent) viewSchedule: GridViewAuditProgramsScheduleComponent;
    
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
    question: boolean = true;
    nothingToshowText: any = 'Nothing to show'; // "By default" => There are no events scheduled that day.
    scheduledDetails: any;
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
    selectedItem: any;
    constructor(
        injector: Injector,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _externalAssessmentService: ExternalAssessmentsServiceProxy, private _assessmentServiceProxy: AssessmentServiceProxy,
        private _router: Router, private _assementScheduleAppService: ExtAssementScheduleServiceProxy
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
        this.selectedAssessmentStatusFilter = 0;
        this.getCalenderAssessments();
        this.assessmentsSchedule = true;
        this.selectedItem = 1;
        this.scheduledDetails = true;
    }
    selectTab(e) {
        this.assessmentsScheduleBackButton = false;
        this.selectedItem = e;
        if (this.selectedItem == 1) {
            this.assessmentsSchedule = true;
            this.isScheduledDetails = false;
        }
    }
    isShow() {
        //this.isShow1 = true;
    }
    hideAllAssessment() {
        this.allAssessmentSearchBox = false;
    }
    getdata(e) {
        this.modalSave.emit();
        this.viewSchedule.getScheduledAssessments(e)
    }
    getScheduledAssessments(event?: LazyLoadEvent, loadTable?: boolean) {
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
        this._assementScheduleAppService.getAllScheduledAssessments(this.filterText, undefined,
            this.schedulePrimengTableHelper.getSorting(this.dataTable),
            this.schedulePrimengTableHelper.getMaxResultCount(this.paginator, event),
            this.schedulePrimengTableHelper.getSkipCount(this.paginator, event))
            .subscribe(result => {
                this.schedulePrimengTableHelper.totalRecordsCount = result.totalCount;
                this.schedulePrimengTableHelper.records = result.items;
            });
    }

    showAllSchedules() {
        this.isScheduledDetails = false;
        this.getScheduledAssessments();
        this.assessmentsScheduleBackButton = false;
        this.auditProgramsSchedule = false;
        this.assessmentsSchedule = true;
    }

    showAllSchedulesDetails(record) {
        this.scheduledDetails = false;
        this.auditProgramsSchedule = true;
        this.assessmentsScheduleBackButton = true;
        this.isScheduledDetails = true;
        this.scheduleId = record.id;
        this.getScheduledDetailAssessments();
        this.getScheduledAssessments();
        this.assessmentsSchedule = false;
       
    }

    getScheduledDetailAssessments(event?: any, loadTable?: boolean) {
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

    loadAllTables() {
        this.getScheduledAssessments();
        this.getCalenderAssessments();
        this.getExternalAssessments();
    }

    getCalenderAssessments() {
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

    getExternalAssessments(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();
        this._externalAssessmentService
            .getAll(null, null, null, null, null, null, 0, null, null, null, null, null,
                null, null, null, null, null, null,
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
        this.primengTableHelper.hideLoadingIndicator();
    }

    deleteScheduleAssessment(id) {
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


    refresh(event?: LazyLoadEvent) {
        this.getExternalAssessments(event);
    }

    generateQuestionaire(externalAssessmentId): void {
        this.message.confirm('', this.l('AreYouSure'), isConfirmed => {
            if (isConfirmed) {
                this.spinnerService.show();
                this._externalAssessmentService
                    .generateQuestionaire(externalAssessmentId)
                    .subscribe(
                        () => {

                            this.spinnerService.hide();
                            this.reloadPage();
                            abp.message.success('Successfully Generated!');
                            this.refresh();
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
                            this.reloadPage();
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

}
