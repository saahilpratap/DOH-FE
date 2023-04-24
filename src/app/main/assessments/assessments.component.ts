import {
    Component,
    OnInit,
    Injector,
    ViewChild,
    ViewEncapsulation,
    Output,
    EventEmitter,
} from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { CreateOrEditAssessmentModalComponent } from "./create-or-edit-assessment-modal.component";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { Router } from "@angular/router";
import * as moment from "moment";
import {
    AssessmentServiceProxy,
    AssessmentStatus,
    AssessmentDto,
    AssementScheduleServiceProxy,
    FacilityTypesServiceProxy,
    GetFacilityTypeForViewDto,
    DynamicNameValueDto,
    BusinessEntitiesServiceProxy,
    HealthCareLandingServiceProxy,
    IdNameDto,
    ChartValueDto,
} from "../../../shared/service-proxies/service-proxies";
import { CreateScheduleModalComponent } from "./create-schedule-modal.component";
import { PrimengTableHelper } from "../../../shared/helpers/PrimengTableHelper";
import * as _ from "lodash";
import { string } from "@amcharts/amcharts4/core";
import { GridScheduleDetailComponent } from "./assessments-grid-view/grid-schedule-detail/grid-schedule-detail.component";
import { AllAssessmentsViewComponent } from "./assessments-grid-view/all-assessments-view/all-assessments-view.component";
import { AppSessionService } from "../../../shared/common/session/app-session.service";
import { GridAssessmentsScheduleComponent } from "./assessments-grid-view/grid-assessments-schedule/grid-assessments-schedule.component";

@Component({
    selector: "app-assessments",
    templateUrl: "./assessments.component.html",
    styleUrls: ["./assessments.component.css"],
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.None,
})
export class AssessmentsComponent extends AppComponentBase implements OnInit {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild("createOrEditAssessmentModal", { static: true })
    createOrEditAssessmentModal: CreateOrEditAssessmentModalComponent;
    @ViewChild(GridScheduleDetailComponent) gridScheduleDetail: GridScheduleDetailComponent;
    @ViewChild(AllAssessmentsViewComponent) allAssessmentsView: AllAssessmentsViewComponent;
    @ViewChild(GridAssessmentsScheduleComponent) gridAssessmentsSchedule: GridAssessmentsScheduleComponent;
    
    @ViewChild("createScheduleModal", { static: true })
    createScheduleModals: CreateScheduleModalComponent;
    //@Output() showSchedules = new EventEmitter<string>();
    @Output() modalScheduleSave: EventEmitter<any> = new EventEmitter<any>();

    public dateRange: moment.Moment[] = [
        moment().startOf("day"),
        moment().endOf("day"),
    ];
    startDate: any;
    endDate: any;
    startDate1: any;
    endDate1: any;
    filter: string = '';
    ranges: any = [
        {
            value: [
                new Date(new Date().setDate(new Date().getDate() - 7)),
                new Date(),
            ],
            label: "Last 7 Days",
        },
        {
            value: [
                new Date(),
                new Date(new Date().setDate(new Date().getDate() + 7)),
            ],
            label: "Next 7 Days",
        },
    ];
    entityList: IdNameDto[] = [];
    entityId: number = 0;
    entityList2: IdNameDto[] = [];
    entityId2: number = 0;
    pieChartCount: ChartValueDto[] = [];
    schedulePrimengTableHelper: PrimengTableHelper;
    scheduleDetailPrimengTableHelper: PrimengTableHelper;
    allAssessmentSearchBox: boolean;
    deleteAll: boolean;
    index = 0;
    assessmentStatus = AssessmentStatus;
    selectedAssessmentStatusFilter: AssessmentStatus = null;
    facilityTypesLookUp: GetFacilityTypeForViewDto[];
    districtsDynamicParameter: DynamicNameValueDto[];
    facilityTypeFilter1: any;
    facilityTypeFilter: any;
    districtId1: any;
    districtId2: any;
    status: AssessmentStatus = undefined;
    businessEntityId: number;
    filterText = "";
    isScheduledDetails = false;
    allAssessments: boolean;
    scheduleCalendar: boolean;
    assessmentsSchedule: boolean;
    startDateValue: any;
    endDateValue: any;
    facilityId1: any;
    facilityId12: any;
    pie1Count: any;
    pie2Count: any;
    bar1Count: any;
    bar2Count: any;
    totalAssessmentCount: any;
    pendingAssessmentCount: any;
    sumitedAssessmentCount: any;
    percentageAssessment: any;
    nothingToshowText: any = "Nothing to show"; // "By default" => There are no events scheduled that day.
    format(data) {
        return data + '%';
    }
    colors: any = {
        red: {
            primary: "#ad2121",
            secondary: "#FAE3E3",
        },
        yellow: {
            primary: "#e3bc08",
            secondary: "#FDF1BA",
        },
        green: {
            primary: "#008000",
            secondary: "#ccebcc",
        },
        gray: {
            primary: "#808080",
            secondary: "#edebeb",
        },
    };
    actions = [];
    showCalendar = false;
    events = [];

    viewDate: Date = new Date();
    themecolor: any = "#0a5ab3";
    scheduleAssessmentDetails: any;
    schArray = [];
    scheduleId: number;
    isAdminFlag: boolean;
    assessmentsScheduleBackButton: boolean;
    multi = [
        {
            name: "Other",
            series: [
                {
                    name: "400",
                    value: 400,
                },
                {
                    name: "2011",
                    value: 70,
                },
            ],
        },
        {
            name: "PHARMACIES",
            series: [
                {
                    name: "2010",
                    value: 500,
                },
                {
                    name: "2011",
                    value: 100,
                },
            ],
        },
        {
            name: "CLINICS",
            series: [
                {
                    name: "2010",
                    value: 400,
                },
                {
                    name: "2011",
                    value: 200,
                },
            ],
        },
        {
            name: "CENTERS",
            series: [
                {
                    name: "2010",
                    value: 350,
                },
                {
                    name: "2011",
                    value: 150,
                },
            ],
        },
        {
            name: "HOSPITAL SUBMITTED",
            series: [
                {
                    name: "2010",
                    value: 100,
                },
                {
                    name: "2011",
                    value: 50,
                },
            ],
        },
    ];
    singleHorizontal = [
        {
            name: "Other",
            value: 400,
        },
        {
            name: "PHARMACIES",
            value: 500,
        },
        {
            name: "CLINICS",
            value: 200,
        },
        {
            name: "CENTERS",
            value: 150,
        },
        {
            name: "HOSPITAL SUBMITTED",
            value: 100,
        },
    ];
    singlePie = [
        {
            name: "Hospital Pending",
            value: 10.5,
        },
        {
            name: "Hospital Submitted",
            value: 50.5,
        },
    ];
    singleOverAllPie = [
        {
            name: "Total Submitted",
            value: 1000,
        },
        {
            name: "Pending",
            value: 300,
        },
        {
            name: "Pending",
            value: 300,
        },
    ];
    view: any[] = [500, 300];
    view2: any[] = [350, 300];
    hview: any[] = [500, 300];
    pieView: any[] = [350, 300];
    // options
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    legendPosition: string = "below";
    showXAxisLabel: boolean = true;
    yAxisLabel: string = "Country";
    showYAxisLabel: boolean = true;
    xAxisLabel = "Population";
    colorScheme1 = {
        domain: ['#4fa6b0', '#fd397a', '#AAAAAA', '#AAAAAA'],
    };
    colorScheme2 = {
        domain: ['#67b6db', '#6794dc', '#67b6db', '#6794dc'],
    };
    colorScheme = {
        domain: ["#a367dc", "#a367dc", "#a367dc", "#a367dc"],
    };
    colorScheme3 = {
        domain: ["#a367dc", "#6771dc", "#a367dc", "#6771dc"],
    };
    colorScheme4 = {
        domain: ["#a367dc", "#6771dc", "#67b6db", "#a367dc"],
    };
    schemeType: string = "linear";
    showChart = true;
    showMoreChart = false;
    showXAxisLabelHorizontal = "Coverage";
    showXAxisLabelHorizontalSubmission = "Submission";
    selectedItem: number = 3;
    controlTypeResult: any;
    controlTypeResult2: any;
    piechart1Result: any;
    piechart2Result: any;
    single: any[];
    totalcount: number;
    average: number;
    remain: number;
    assesmentChartView: any[] = [300, 200];
    assesmentChartValue = [
        {
            name: "Germany",
            value: 70,
        },
    ];
    constructor(
        injector: Injector,
        private _assessmentServiceProxy: AssessmentServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _router: Router,
        private _assementScheduleAppService: AssementScheduleServiceProxy,
        private _facilityTypesProxy: FacilityTypesServiceProxy,
        private _businessEntityServiceProxy: BusinessEntitiesServiceProxy,
        private _healthCareServiceProxy: HealthCareLandingServiceProxy,
        private _appSessionService: AppSessionService
    ) {
        super(injector);
        this.schedulePrimengTableHelper = new PrimengTableHelper();
        this.scheduleDetailPrimengTableHelper = new PrimengTableHelper();
        this.initializeFacilityTypesLookUp();
        this.loadDistricts();
        this.districtId2 = 0;
        this.facilityTypeFilter = 0;
        this.districtId1 = 0;
    }

    ngOnInit() {
        this.selectedAssessmentStatusFilter = 0;
        this.getCalenderAssessments();
        this.assessmentsSchedule = true;
        this.getGridDataCount();
        this.loadData();
        this.loadData2();
        this.getRecords2();
        this.getRecords3();
        this.quaterdate();
        this.allAssessmentSearchBox = true;
        this.checkType();
    }
    hideAllAssessment() {
        this.allAssessmentSearchBox = false;
        this.isScheduledDetails = false;
        this.assessmentsScheduleBackButton = false;
    }
    ShowAllAssessment() {
        this.allAssessmentSearchBox = true;
        this.isScheduledDetails = false;
        this.assessmentsScheduleBackButton = false;
    }
    onSelectionChange(selection: any[]) {
        if (selection.length >= 2) {
            this.deleteAll = true;
        } else if (selection.length <= 1) {
            this.deleteAll = false;
        }
    }

    loadData() {
        this._assessmentServiceProxy.assessmentBusinessEntity().subscribe(res => {
            this.entityList = res;
            if (res.length != 0) {
                this.entityId = this.entityList[0].id;
                this.onEntityChange(this.entityId);
            }
        });
    }
    onEntityChange(val) {
        if (val != null) {
            this._assessmentServiceProxy.getReviewDataChartByBusinessEntityId(val).subscribe(res => {
                this.controlTypeResult = res.entityControlTypeCount;
            });
        }
    }
    loadData2() {
        this._assessmentServiceProxy.assessmentBusinessEntity().subscribe(res => {
            this.entityList2 = res;
            if (res.length != 0) {
                this.entityId2 = this.entityList[0].id;
                this.onEntityChange2(this.entityId2);
            }
        });
    }
    onEntityChange2(val) {
        this.totalcount = 0;
        this.average = 0;
        this.remain = 0;
        this.pieChartCount = [];
        if (val != null) {
            this._assessmentServiceProxy.getReviewDataChartByBusinessEntityId(val).subscribe(res => {
                this.controlTypeResult2 = res.entityControlTypeCount;
                this.controlTypeResult2.forEach(obj => {
                    this.totalcount += parseInt(obj.value);
                });
                if (this.totalcount != 0) {
                    this.average = this.totalcount / 3;
                    this.remain = 100 - this.average;
                    var chart1 = new ChartValueDto();
                    chart1.name = 'Implemented Control - ' + parseInt(this.average.toString());
                    chart1.value = parseInt(this.average.toString());
                    this.pieChartCount.push(chart1);
                    var chart2 = new ChartValueDto();
                    chart2.name = 'Gap - ' + parseInt(this.remain.toString());
                    chart2.value = parseInt(this.remain.toString());
                    this.pieChartCount.push(chart2);
                }
                else {
                    var chart1 = new ChartValueDto();
                    chart1.name = 'Implemented Control - ' + this.average.toString();
                    chart1.value = this.average;
                    this.pieChartCount.push(chart1);
                    var chart2 = new ChartValueDto();
                    chart2.name = 'Gap - ' + this.remain.toString();
                    chart2.value = this.remain;
                    this.pieChartCount.push(chart2);
                }
            });
        }
    }   
    selectTab(e) {
        this.selectedItem = e;
    }

    showAllSchedules() {
        this.isScheduledDetails = false;
        this.assessmentsScheduleBackButton = false;
    }

    showAllSchedulesDetails(record) {
        this.gridScheduleDetail.getData(record);
        this.assessmentsScheduleBackButton = true;
        this.isScheduledDetails = true;
        this.scheduleId = record.id;
        this.gridScheduleDetail.ngOnInit();
    }
    actionClicked(event) {
        if (event.action == "View") {
            this._assessmentServiceProxy.getcheckAssessment(event.event.id).subscribe((ressult) => {
                this._assessmentServiceProxy.getEncryptAssessmentParameter(event.event.id, true).subscribe((encryptRessult) => {

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
    }

    gotocomplianceQuestion(res) {
        this._assessmentServiceProxy
            .getcheckAssessment(res).subscribe((ressult) => {
                this._assessmentServiceProxy.getEncryptAssessmentParameter(res, ressult).subscribe((encryptRessult) => {
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

    loadAllTables() {        
        this.gridAssessmentsSchedule.reloadPage();        
        this.gridScheduleDetail
        this.getCalenderAssessments();       
    }
    saveScheduledAssessments() {
        
    }
    getCalenderAssessments() {
        this.showCalendar = false;
        this.events = [];
        this._assessmentServiceProxy
            .getAll(
                this.selectedAssessmentStatusFilter,
                this.appSession.user.businessEntityId,
                "",
                null,
                null,
                undefined,
                null,
                0,
                1000
            )
            .subscribe((result) => {
                if (result.items.length > 0) {
                    result.items.forEach((item) => {
                        this.actions = [
                            {
                                label:
                                    '<a routerLink="/app/main/assessments/assessments/' +
                                    item.id + '/' + result +
                                    '/compliance-questionaire">' +
                                    '<i class="la la-question-circle icon-question"> </i>' +
                                    "</a></br>",
                                name: "View",
                            },
                        ];
                        this.events.push({
                            start: new Date(item.assessmentDate.toDate()),
                            end: new Date(item.reportingDate.toDate()),
                            title: item.name,
                            id: item.id,
                            color: this.getColorByStatus(item.status),
                            actions: this.actions,
                        });
                    });
                    this.showCalendar = true;
                } else {
                    this.showCalendar = true;
                }
            });
    }

    getAssessments(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();
        this._assessmentServiceProxy
            .getAll(
                this.selectedAssessmentStatusFilter,
                this.appSession.user.businessEntityId,
                "",
                null,
                null,
                null,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe((result) => {
                var asessments = result.items;
                var filterAssessment = _.chain(result.items)
                    .groupBy("name")
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
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    deleteScheduleAssessment(id) {
        this.message.confirm(
            "This action cant be irreversable",
            this.l("AreYouSure"),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._assementScheduleAppService
                        .deleteScheduledAssessment(id)
                        .subscribe((res) => {
                            //this.getScheduledAssessments(undefined, true);
                            this.notify.success(this.l("SuccessfullyDeleted"));
                        });
                }
            }
        );
    }

    deleteScheduleDetailAssessment(id) {
        this.message.confirm(
            "This action cant be irreversable. If Assements are Schduled it also gets deleted.",
            this.l("AreYouSure"),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._assementScheduleAppService
                        .deleteScheduledAssessmentDetails(id)
                        .subscribe((res) => {
                            //this.getScheduledDetailAssessments(undefined, true);
                            this.getAssessments();
                            this.notify.success(this.l("SuccessfullyDeleted"));
                        });
                }
            }
        );
    }

    deleteAssessment(assessment: AssessmentDto): void {
        this.message.confirm("", this.l("AreYouSure"), (isConfirmed) => {
            if (isConfirmed) {
            }
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createAssessment(): void {
        this._router.navigate(["/app/main/assessments/assessments/new"]);
    }

    editAssessment(id: number) {
        this._router.navigate(["/app/main/assessments/assessments/new"], {
            queryParams: {
                id: id,
            },
        });
    }

    filterByStatus() {
        this.getAssessments();
    }

    exportToExcel(event?: LazyLoadEvent): void {
        this.spinnerService.show();
        this._assessmentServiceProxy.getAssessmentExportToExcel(
            this.selectedAssessmentStatusFilter,
            this.appSession.user.businessEntityId,
            this.filter,
            this.startDate1,
            this.endDate1,
            1,
            "",
            1,
            1
        ).subscribe(
            (result) => {
                this.spinnerService.hide();
                this._fileDownloadService.downloadTempFile(result);
            },
            (error) => {
                this.spinnerService.hide();
                this.message.error(
                    "Couldn't download assessment data for now, try later!"
                );
            }
        );
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

    getGridDataCount() {
        this._assessmentServiceProxy
            .getAssessmentChartValue(
                this.startDateValue,
                this.endDateValue,
                this.facilityId1,
                this.districtId1,
                this.districtId2
            )
            .subscribe((result) => {
                this.pie1Count = result.assesmentStatusChartCount;
                this.pie2Count = result.assesmentStatusChart2Count;
                this.bar1Count = result.assesmentFacilityCount;
                this.bar2Count = result.assesmentFacility2Count;
                this.pendingAssessmentCount = result.pendingAssessmentCount;
                this.totalAssessmentCount = result.totalAssessmentCount;
                this.sumitedAssessmentCount = result.sumitedAssessmentCount;
                this.percentageAssessment = result.percentage;
            });
    }

    OndateChange(dateRangeText: any) {
        if (dateRangeText != undefined && dateRangeText != "") {
            var date1 = dateRangeText + "";
            var t = date1.split(",");
            var startD = moment(t[0]).format("MM/DD/YYYY");
            var endD = moment(t[1]).format("MM/DD/YYYY");
            this.startDateValue = startD;
            this.endDateValue = endD;
        }
        this.getGridDataCount();
    }

    initializeFacilityTypesLookUp() {
        this._facilityTypesProxy.getAllFacilityType().subscribe((res) => {

            this.facilityTypesLookUp = res;
        });
    }

    loadDistricts() {
        this._businessEntityServiceProxy
            .getDynamicEntityDatabyName("Districts")
            .subscribe((res) => {
                this.districtsDynamicParameter = res;
            });
    }

    ontypeChange(facilityTypeID: any) {
        if (facilityTypeID != undefined) {
            this.facilityId1 = facilityTypeID;
        }
        this.getGridDataCount();
    }

    onDistrictChange1(districtId: any) {
        if (districtId != undefined) {
            this.districtId1 = districtId;
        }
        this.getGridDataCount();
    }

    onDistrictChange2(districtId2: any) {
        if (districtId2 != undefined) {
            this.districtId2 = districtId2;
        }
        this.getGridDataCount();
    }    
    getRecords2() {
        this._healthCareServiceProxy.getAllHealthCareEntityComplianceCount().subscribe(res => {
            this.piechart1Result = res.healthCareEntityCompCount;
        })
    }
    getRecords3() {
        this._healthCareServiceProxy.getAllEntityComplianceCount().subscribe(res => {
            this.piechart2Result = res.overAllEntityCompCount;
        })
    }

    refreshDate() {
        this.quaterdate();
    }

    quaterdate() {
        var month = new Date().getMonth() + 1;
        var quarter;
        if (month < 4)
            quarter = 1;
        else if (month < 7)
            quarter = 4;
        else if (month < 10)
            quarter = 7;
        else if (month < 13)
            quarter = 10;
        var quarterstartMonth = (Math.floor(new Date().getMonth() / 3) * 3) + 1;
        var quaterEndMonth = quarter + 2;
        var endday = "";
        if (quarter == 4 || quarter == 7) {
            endday = "30"
        }
        else {
            endday = "31"
        }
        var firstdate = quarter + "/1/" + "/" + new Date().getFullYear();
        var lastdate = quaterEndMonth + "/" + endday + "/" + "/" + new Date().getFullYear();
        var date = new Date(firstdate);
        var date2 = new Date(lastdate);
        this.startDateValue = date;
        this.endDateValue = date2;
        this.startDate1 = date;
        this.endDate1 = date2;
        this.startDate = date;
        this.endDate = date2;      
        this.getGridDataCount();

    }

    getDate() {
        if (this.startDate == null || this.startDate.toString() == 'Invalid Date') {
            this.startDate = null;
            this.endDate = null;
        }
        else {
            if (this.endDate == null || this.endDate.toString() == 'Invalid Date') {
                this.endDate = this.startDate;
            }
        }
        this.startDateValue = this.startDate;
        this.endDateValue = this.endDate;
        this.getGridDataCount();       
    }

    globalSearch(event?: any) {
        this.allAssessmentsView.setAllAssessmentData(this.selectedAssessmentStatusFilter, this.filter, this.startDate1, this.endDate1, event);
    }
    sendNonSubmitted(event?: any) {
        this.allAssessmentsView.sendNotSubmitted();
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
}
