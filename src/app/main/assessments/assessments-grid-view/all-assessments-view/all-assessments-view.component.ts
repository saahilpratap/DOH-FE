import { Component, OnInit, Injector, ViewChild, ViewEncapsulation, } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { Router } from "@angular/router";
import * as moment from "moment";
import * as _ from "lodash";
import { PrimengTableHelper } from "../../../../../shared/helpers/PrimengTableHelper";
import { AssessmentServiceProxy, AssessmentStatus, SetAssessmentStatusInputDto, AssessmentWIthPrimaryEnrityDto } from "../../../../../shared/service-proxies/service-proxies";
import { CreateOrEditAssessmentModalComponent } from "../../create-or-edit-assessment-modal.component";
import { CreateScheduleModalComponent } from "../../create-schedule-modal.component";
import { AppSessionService } from "../../../../../shared/common/session/app-session.service";

@Component({
    selector: "all-assessments-view",
    templateUrl: "./all-assessments-view.component.html",
    styleUrls: ["./all-assessments-view.component.css"],
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.None,
})
export class AllAssessmentsViewComponent extends AppComponentBase implements OnInit {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    assessmentStatus = AssessmentStatus;
    selectedAssessmentStatusFilter: AssessmentStatus = null;
    deleteAll: boolean;
    @ViewChild("createOrEditAssessmentModal", { static: true })
    createOrEditAssessmentModal: CreateOrEditAssessmentModalComponent;
    @ViewChild("createScheduleModal", { static: true })
    createScheduleModals: CreateScheduleModalComponent;
    filter: string = "";
    startDateValue: any = null;
    endDateValue: any = null;
    selectedAssessment: AssessmentWIthPrimaryEnrityDto[];
    setAssessmentStatusInput: SetAssessmentStatusInputDto = new SetAssessmentStatusInputDto();
    asessmentsRes: any;
    checkBoxesMode: string;
    auditProjectId: any;
    todayDate: any;
    isAdminFlag: boolean;
    events: any;
    isArray: boolean;
    tempData: string;
    records: any[];
    isAllCheckbox: boolean;
    constructor(
        injector: Injector,
        private _assessmentServiceProxy: AssessmentServiceProxy,
        private _appSessionService: AppSessionService,
        private _router: Router,
    ) {
        super(injector);
        this.checkBoxesMode = 'onClick'
    }

    ngOnInit() {
        this.selectedAssessmentStatusFilter = 0;
        this.todayDate = Date.now;
        this.checkType();
        //this.selectedAssessmentStatusFilter = AssessmentStatus.SentToAuthority;
    }

    getAssessments(event?: LazyLoadEvent) {
        this.events = event;
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();
        this._assessmentServiceProxy
            .getAll(
                this.selectedAssessmentStatusFilter,
                this.appSession.user.businessEntityId,
                this.filter,
                this.startDateValue,
                this.endDateValue,
                this.auditProjectId,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe((result) => {
                
                var asessments = result.items;
                this.asessmentsRes = result.items;
                var filterAssessment = _.chain(result.items)
                    .groupBy("info")
                    .map(function (v, i) {
                        return {
                            name: i,
                            asessments: _.chain(v)
                                .groupBy("info")
                                .map(function (v) {
                                    return {
                                        asessmentlist: v
                                            .filter((x) => x.isPrimaryEntity == true)
                                            .concat(
                                                v.filter((y) => y.isPrimaryEntity == false)
                                            ) /*   _.sortBy(v, (e) => { return e.isPrimaryEntity })*/,
                                    };
                                })
                                .value(),
                        };
                    })
                    .value();
               
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = filterAssessment;
                this.records = asessments;
                this.primengTableHelper.hideLoadingIndicator();
                this.onSelectionChange([]);
            });
    }

    onSelectionChange(selection: any[]) {
       
        this.isAllCheckbox = false;
        if (selection.length >= 2) {
            this.deleteAll = true;
        } else if (selection.length <= 1) {
            this.deleteAll = false;
        }
        this.selectedAssessment = selection;
        this.isArray = selection.length == 0 ? false : true;
    }
    eventClicked(event) {
        this.createOrEditAssessmentModal.show();
    }

    gotocomplianceQuestion(res) {

        this._assessmentServiceProxy.getcheckAssessment(res).subscribe((result) => {
            this._assessmentServiceProxy.getEncryptAssessmentParameter(res, result).subscribe((encryptRessult) => {
                this._router.navigate([
                    "/app/main/assessments/assessments/" +
                    encryptRessult.assessmentId +
                    "/" +
                    encryptRessult.flag +
                    "/compliance-questionaire/",
                ]);
            });
        });
    }

    setAllAssessmentData(status: AssessmentStatus, filter: string, fromDate: Date, endDate: Date, event?: any) {
        if (fromDate == null || fromDate.toString() == 'Invalid Date') {
            endDate = null;
            fromDate = null;
        }
        else {
            if (endDate == null || endDate.toString() == 'Invalid Date') {
                endDate = fromDate;
            }
        }

        this.filter = filter;
        this.selectedAssessmentStatusFilter = status;
        this.startDateValue = fromDate;
        this.endDateValue = endDate;
        this.getAssessments(event);
    }

    setStatus(status: AssessmentStatus) {
        this.setAssessmentStatusInput.assessmentIds = [];
        this.setAssessmentStatusInput.assessmentIds.push(1);
        this.setAssessmentStatusInput.assessmentIds.push(2);
        this.setAssessmentStatusInput.assessmentStatus = status;
        this._assessmentServiceProxy.setAssessmentStatus(this.setAssessmentStatusInput)
            .subscribe((res) => {
            });
    }

    activeDeactive(assessmentid: any, status: any) {

        var tempstatus = status == 1 ? true : false;
        this._assessmentServiceProxy.assessmentActiveDeactive(assessmentid, tempstatus).subscribe((res) => {
            if (res == true) {
                this.getAssessments(this.events);
            }
        });

    }

    checkType() {
        var checktype = this._appSessionService.user.type;
        switch (checktype) {
            case 0:
                {
                    this.isAdminFlag = true;
                    break;
                }
            case 1:
            case 2:
            case 3:
            case 4:
            default:
                {
                    this.isAdminFlag = false;
                    break;
                }

        }
    }

    sendNotSubmitted() {
        
        if (this.isArray == true && this.selectedAssessment.length != 0) {
            this.message.confirm('', this.l('Are You Sure You Want To Change the Status '), (isConfirmed) => {
                if (isConfirmed) {
                    this.selectedAssessment;
                    this.spinnerService.show();
                    this._assessmentServiceProxy.sendNotSubmittedEmail(this.selectedAssessment).subscribe(result => {
                        if (result == "true") {
                            this.deleteAll = false;
                            this.onSelectionChange([]);
                            this.selectedAssessment = [];
                            this.getAssessments(null);
                            this.spinnerService.hide();
                            this.ngOnInit();
                            this.notify.success(this.l('Mail Send Successfully'));
                            this.deleteAll = false;
                            this.ngOnInit();
                            this.onSelectionChange([]);
                            this.selectedAssessment = [];
                        }
                        else {
                            this.spinnerService.hide();
                            this.message.info(this.l("Please Configure Template"));
                        }
                    });
                }
                else {
                    this.onSelectionChange([]);
                }
            });
        }
        else {
            this.message.info(this.l("Please Select Assessment"));
        }
        //this._auditServiceProxy
        //    .sendImportCertificateEmail(this.selectedRowData)
        //    .subscribe(result => {
        //        this.primengTableHelper.hideLoadingIndicator();
        //        this.notify.info(this.l('Certificate Sent Successfully'));
        //        this.selectedRowData = [];
        //        this.btnCopy = false;
        //    });
       
    }
    selectAll(evt) {
        this.isAllCheckbox = evt.target.checked;
        if (this.isAllCheckbox == true) {
            this.selectedAssessment = this.records;
            this.isArray = this.selectedAssessment.length == 0 ? false : true;
        }
        else {
            this.onSelectionChange([]);
        }
    }

}

