import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter, NgZone } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";
import * as _ from "lodash";
import {
    trigger,
    state,
    style,
    transition,
    animate
} from "@angular/animations";
import { AssessmentServiceProxy, ExternalAssessmentsServiceProxy, ReviewDataResponseType, AssessmentStatus, FilledQuestionDto, AttachmentDto, ApproveAssessmentInput, AssessmentDto, ExernalAssessmentWithQuestionsDto, SubmitAssessmentInput, FilledReviewDto, ReviewDataDto, AssessmentAgreementResponseInput, CommonLookupServiceProxy, SARDto, AuditProjectServiceProxy } from "../../../shared/service-proxies/service-proxies";
import { FileDownloadService } from "../../../shared/utils/file-download.service";
import { CreateOrEditExternalControlRequirementModalComponent } from "./create-or-edit-external-controlRequirement-modal.component";
import { ExternalComplianceQuestionaireModalComponent } from "./external-compliance-questionaire-modal/external-compliance-questionaire-modal.component";
import { CommonQuestionaireModalComponent } from "../common-component/common-questionaire/common-questionaire-modal.component";
import { AssessmentAgreementModalComponent } from "../compliance-questionaire/assessment-agreement-modal/assessment-agreement-modal.component";
import { AddExternalFindingAssessmentModalComponent, ExtFindingInput } from "./external-questionnaire-findings/add-external-finding-assessment-modal/add-external-finding-assessment-modal.component";
import { CreateOrEditfindingReportModalComponent } from "../finding-report/create-or-edit-findingReport-modal.component";
import { LastUpdateResponseModalComponent } from "./update-last-response-modal.component";
import { HttpClient } from "@angular/common/http";
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';
import { AppConsts } from "../../../shared/AppConsts";
import { async } from "@angular/core/testing";
import { NotificationServiceProxy, UserNotification } from '@shared/service-proxies/service-proxies';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { UserNotificationHelper } from "../../shared/layout/notifications/UserNotificationHelper";

@Component({
    selector: "app-external-questionaire",
    templateUrl: "./external-questionaire.component.html",
    styleUrls: ["./external-questionaire.component.css"],

})
export class ExternalQuestionaireComponent extends AppComponentBase
    implements OnInit {
    @ViewChild("createOrEditExternalQuestionModal", { static: true })
    createOrEditExternalQuestionModal: CreateOrEditExternalControlRequirementModalComponent;
    @ViewChild("createOrEditfindingReportModal", { static: true }) createOrEditfindingReportModal: CreateOrEditfindingReportModalComponent;
    @ViewChild('commonQuestionaireModals', { static: true }) commonQuestionaire: CommonQuestionaireModalComponent;
    @ViewChild("externalComplianceQuestionaireModals", { static: true })
    externalComplianceQuestionaireModals: ExternalComplianceQuestionaireModalComponent;
    @ViewChild("assessmentAgreementModal", { static: true }) assessmentAgreementModal: AssessmentAgreementModalComponent;
    @ViewChild('addUpdateExtAssessmentDataModal', { static: true }) addUpdateExtAssessmentDataModal: AddExternalFindingAssessmentModalComponent;
    @ViewChild('lastUpdateResponse') lastUpdateResponse: LastUpdateResponseModalComponent;
    @Output() changeExternalStatus: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Input() inputId: number = 0;
    @Input('associatementId') associatementId: any;
    @Input('assessmentFlag') assessmentFlag: any;
    @ViewChild('op', { static: false }) opModel;
    @Input('headerTab') headerTab: boolean;
    @Output() assementDetailReviewCount = new EventEmitter<number>();
    @Input('auditProjectId') auditProjectId: number;
    copyTochildButton: boolean = false;
    questionCount: number = 0;
    entityName: string = '';
    uploadUrl = "";
    setInterval = setInterval;
    progressInterval: any;
    value: any;
    input: any;
    hiddenFlag: boolean = false;
    endAssessmentPermission: boolean;
    vendorId: any;
    auditmanagerId: any;
    fileExtensionList = [] = ['jpeg', 'jpg', 'xls', 'xlsx', 'doc', 'docx', 'txt', 'pdf', 'png', 'pptx', 'ppt', 'rtf', 'zip', 'msg'];
    allDomainReviews: ReviewDataDto[] = [];
    externalStatusId: AssessmentStatus;
    constructor(
        injector: Injector, private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _assessmentServiceProxy: AssessmentServiceProxy,
        private _externalAssessmentProxy: ExternalAssessmentsServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _httpClient: HttpClient,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        public _zone: NgZone,
        private _notificationService: NotificationServiceProxy,
        private _userNotificationHelper: UserNotificationHelper,
        private _auditServiceProxy: AuditProjectServiceProxy,

    ) {
        super(injector);
        this.EndAssessmentButtonPermission();
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Import/ImportExternalAssessmentResponse';
        this.refreshImport();
    }

    isShow: boolean = true;
    canEditQuestionaire = true;
    assessmentId: number;
    assessmentSubmission: any;
    assessmentDetails: ExernalAssessmentWithQuestionsDto = {} as any;
    assessmentDetailsForExport: ExernalAssessmentWithQuestionsDto = {} as any;
    SARList: SARDto[] = [];
    originalAssessmentDetails: ExernalAssessmentWithQuestionsDto = {} as any;
    selectedResponseTypeFilter: ReviewDataResponseType = null;
    agreementAccepted: boolean = false;
    needsClarification: boolean = false;
    verticalView: boolean;
    horizontalView: boolean;
    assessmentStatus = AssessmentStatus;
    reviewDataResponseType = ReviewDataResponseType;
    activeDomain: string;
    selectedItem: any;
    showFinding = false;
    BusinessEntityId: any;
    encryptedAssessmentId: string = "";
    sendToAuthorityButtonFlag: boolean = true;
    reauditPermission: boolean;
    beforeJanPermission: boolean;
    fromDate: Date = null;
    stageEndDate = new Date();
    dropdownSettings =
        {
            singleSelection: true,
            idField: "id",
            textField: "name",
            selectAllText: "Select All",
            unSelectAllText: "UnSelect All",
            itemsShowLimit: 3,
            allowSearchFilter: false
        };

    answerDropdownSetting =
        {
            singleSelection: true,
            idField: "id",
            textField: "value",
            selectAllText: "Select All",
            unSelectAllText: "UnSelect All",
            itemsShowLimit: 3,
            allowSearchFilter: false
        };

    domainNames: any = [];
    lastSelected: any;
    overallProgress: any = 0;

    carouselOptions = {
        nav: false,
        items: 5
    };

    questionStatus = [
        {
            id: 2,
            name: "Clarifiation Needed"
        }
    ];



    responseTypes = [
        {
            id: 0,
            name: "Not Selected"
        },
        {

            id: 4,
            name: "Fully Compliant"
        },
        {
            id: 3,
            name: "Partially Compliant"
        },
        {
            id: 2,
            name: "Non Compliant"
        },
        {
            id: 1,
            name: "Not Applicable"
        }
    ];

    tableResponseTypes = [
        {
            id: 0,
            name: "Not Selected"
        },
        {
            id: 4,
            name: "Fully Compliant"
        },
        {
            id: 3,
            name: "Partially Compliant"
        }
    ];

    previousAnswers = [
        {
            id: true,
            name: "Changed Answers"
        },
        {
            id: false,
            name: "Same Answers"
        }
    ];

    ngOnInit() {
        this.reauditPermissionCheck();      
        this.getAuditProjectById(this.auditProjectId);
        if (this.associatementId) {
            this.assessmentFlag;
            this._assessmentServiceProxy.getDecriptAssessmentParameter(this.associatementId, " ").subscribe((ressult) => {
                if (ressult.assessmentId != 0) {                    
                    this.assessmentId = ressult.assessmentId;
                    this.getAssessmentQuestionares();
                    this.verticalView = true;
                    this.selectedItem = 0;
                }
                else {
                }
            });
        }      
        const routeParams = this._activatedRoute.snapshot.params;      
        if (routeParams.id) {
            this.encryptedAssessmentId = routeParams.id;
            this._assessmentServiceProxy.getDecriptAssessmentParameter(this.encryptedAssessmentId, " ").subscribe((ressult) => {
                if (ressult.assessmentId != 0) {
                    this.assessmentId = ressult.assessmentId;
                    this.getAssessmentQuestionares();
                    this.verticalView = true;
                    this.selectedItem = 0;
                }
                else {
                }
            });
        }
    }
    refreshImport() {
        let self = this;
        abp.event.on('abp.notifications.received', userNotification => {
            self._zone.run(() => {
                this.ngOnInit();
            });
        });
    }
    loadNotifications(): void {
        if (UrlHelper.isInstallUrl(location.href)) {
            return;
        }

        this._notificationService.getUserNotifications(undefined, undefined, undefined, 3, 0).subscribe(result => {

        });
    }
    changeAssessment(val: number) {
        this.assessmentId = val;
        this.getAssessmentQuestionares();
        this.verticalView = true;
        this.selectedItem = 0;
    }

    changeView(e) {
        if (e == 'VerticalView') {
            this.verticalView = true;
            this.horizontalView = false;
        }
        else if (e == 'HorizontalView') {
            this.verticalView = false;
            this.horizontalView = true;
        }
    }
    isInternal(): boolean {
        return this._router.url.includes("internal");
    }
    setDomainNames() {
        let domains = this.originalAssessmentDetails.reviews.filter(a => a.controlRequirementDomainName != null);
        let domainNames = domains
            .map(item => item.controlRequirementDomainName)
            .filter((value, index, self) => self.indexOf(value) === index);
        for (let i = 0; i < domainNames.length; i++) {
            let splitNames = domainNames[i].split("-");
            this.domainNames[i] = {};
            this.domainNames[i].fullText = domainNames[i];
            this.domainNames[i].text1 = splitNames[0];
            this.domainNames[i].text2 = splitNames[1];
            this.domainNames[i].width = this.setWidth(this.domainNames[i]);
        }
        this.domainNames = this.domainNames.sort(function (a, b) {
            let nameA = parseInt(a.text1.split(" ")[1]);
            let nameB = parseInt(b.text1.split(" ")[1]);
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
    }

    setAssessmentData() {
        this.setResponseTypes();
        this.setDomainNames();
        this.BusinessEntityId = this.originalAssessmentDetails.businessEntityId;
        this.activeDomain = this.domainNames[0].fullText;
        this.assessmentDetails.reviews = this.originalAssessmentDetails.reviews.filter(
            item => item.controlRequirementDomainName === this.activeDomain
        );



        if (this.domainNames.length > 0) {
            this.assessmentDetails.reviews = _.orderBy(this.assessmentDetails.reviews, ['sortData'], ['asc']);
            this.assessmentDetailsForExport = this.assessmentDetails;
            //this.assessmentDetails.reviews = this.assessmentDetails.reviews;
            this.assementDetailReviewCount.emit(this.assessmentDetails.reviews.length);
        }
        this.setProgressBar(0);
    }
    async getAssessmentQuestionares() {
        this.spinnerService.show();
        this._externalAssessmentProxy
            .getQuestionaire(
                this.assessmentId
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(async res => {           
            let data: any;
            data = res.exernalAssessmentWithQuestionsDto;
            this.changeExternalStatus.emit(data);
                this.vendorId = await res.exernalAssessmentWithQuestionsDto.vendorId;
                this.auditmanagerId = res.exernalAssessmentWithQuestionsDto.auditManagerId;
                if (res.exernalAssessmentWithQuestionsDto.status == AssessmentStatus.AuditApproved) {
                    this.sendToAuthorityButtonFlag = false;
                }
                this.questionCount = await res.exernalAssessmentWithQuestionsDto.reviews.length;
                this.entityName = await res.exernalAssessmentWithQuestionsDto.name;


                if (res.exernalAssessmentWithQuestionsDto.isApprover && (res.exernalAssessmentWithQuestionsDto.status == AssessmentStatus.SentToAuthority || res.exernalAssessmentWithQuestionsDto.status == AssessmentStatus.Approved)) {
                    this.showFinding = true;
                } else {
                    if (res.exernalAssessmentWithQuestionsDto.isReviewer || res.exernalAssessmentWithQuestionsDto.isAuditor) {
                        this.showFinding = true;
                    } else {
                        this.showFinding = false;
                    }
                }
                this.originalAssessmentDetails = await res.exernalAssessmentWithQuestionsDto;
                this.SARList = res.sarDto;
                this.allDomainReviews = this.originalAssessmentDetails.reviews;
                this.originalAssessmentDetails.reviews.forEach(x => {
                    var isExist = this.SARList.find(y => y.crqId == x.controlRequirementId);
                    if (isExist != null || isExist != undefined) {
                        x.assessmentName = isExist.comment;
                    }
                    else {
                        x.assessmentName = "";
                    }
                });

                this.setAssessmentData();
                if (res.exernalAssessmentWithQuestionsDto.status == AssessmentStatus.Approved) {
                    this.canEditQuestionaire = false;
                }
                this.spinnerService.hide();
            });
        this.spinnerService.hide();
    }

    exIsShows() {
        this.isShow = false;
    }

    copyAnswersFromPreviousAssessment() {
        this.spinnerService.show();
        this._externalAssessmentProxy
            .getExternalAssessmentWithPreviousAnswers(this.assessmentId)
            .subscribe(
                res => {
                    let prevData = this.originalAssessmentDetails;
                    this.originalAssessmentDetails = res;
                    this.originalAssessmentDetails.isAuditor = prevData.isAuditor;
                    this.originalAssessmentDetails.isReviewer = prevData.isApprover;
                    this.originalAssessmentDetails.isApprover = prevData.isApprover;
                    this.setAssessmentData();
                    this.spinnerService.hide();
                },
                err => {
                    this.spinnerService.hide();
                    this.message.error(err.error.error.message);
                }
            );
    }

    setWidth(dataObj: any) {
        let assessmentDetailsReviews = this.originalAssessmentDetails.reviews.filter(
            op => op.controlRequirementDomainName === dataObj.fullText
        );
        let count = assessmentDetailsReviews.filter(item => item.type);
        let percentage = (100 * count.length) / assessmentDetailsReviews.length;
        return percentage.toFixed(0);
    }

    setResponseTypes() {
        for (
            let j = 0;
            j < this.originalAssessmentDetails.reviews.length;
            j++
        ) {
            let index = this.responseTypes.findIndex(
                item =>
                    item.id === this.originalAssessmentDetails.reviews[j].type
            );
            if (index != -1) {
                this.originalAssessmentDetails.reviews[
                    j
                ].type = this.responseTypes[index].id;
            } else {
                this.originalAssessmentDetails.reviews[
                    j
                ].type = undefined;
            }
            for (
                let k = 0;
                k <
                this.originalAssessmentDetails.reviews[j].reviewQuestions
                    .length;
                k++
            ) {
                let index = this.originalAssessmentDetails.reviews[
                    j
                ].reviewQuestions[k].answerOptions.findIndex(
                    item =>
                        item.id ===
                        this.originalAssessmentDetails.reviews[j]
                            .reviewQuestions[k].selectedAnswerOptionId
                );
                if (index != -1) {
                    this.originalAssessmentDetails.reviews[j].reviewQuestions[
                        k
                    ].selectedAnswerOptionId = this.originalAssessmentDetails.reviews[
                        j
                    ].reviewQuestions[k].answerOptions[index].id;
                } else {
                    this.originalAssessmentDetails.reviews[j].reviewQuestions[
                        k
                    ].selectedAnswerOptionId = undefined;
                }
            }
        }
    }

    setProgressBar(idx: number) {
        let count = this.assessmentDetails.reviews.filter(
            item => item.type
        );
        let percentage =
            (100 * count.length) / this.assessmentDetails.reviews.length;
        this.domainNames[idx].width = percentage.toFixed(0);

        count = this.originalAssessmentDetails.reviews.filter(
            item => item.type
        );
        percentage =
            (100 * count.length) /
            this.originalAssessmentDetails.reviews.length;
        this.overallProgress = percentage.toFixed(2);
    }

    getData(dataObj: any, idx: number) {
        this.selectedItem = idx;
        this.spinnerService.show();
        this.assessmentDetails.reviews = this.originalAssessmentDetails.reviews.filter(
            op => op.controlRequirementDomainName === dataObj.fullText
        );
        this.assessmentDetails.reviews = _.orderBy(this.assessmentDetails.reviews, ['sortData'], ['asc']);
        this.activeDomain = dataObj.fullText;
        this.setProgressBar(idx);
        setTimeout(() => {
            this.spinnerService.hide();
        }, 1000);
    }

    attachReviewData(data: any) {
        let rev = this.assessmentDetails.reviews.filter(r => r.id == data.reviewData.id);
        if (rev.length > 0) {
            rev[0] = data.reviewData;
        }
    }


    onResponseSelectChange(event: any) {

        if (event != undefined) {
            this.selectedResponseTypeFilter = event.id;
            this.filterByReponseType();
        }
        else {
            this.selectedResponseTypeFilter = null;
            this.filterByReponseType();
        }
    }

    onSelfAssessmentReponseChange(event: any) {
        var domainReview = this.allDomainReviews.filter(
            item => item.controlRequirementDomainName === this.activeDomain
        );
        if (event != undefined) {
            this.selectedResponseTypeFilter = event.id;
            this.assessmentDetails.reviews = domainReview;
            var filterCrqId = this.SARList.filter(x => domainReview.find(y => y.controlRequirementId == x.crqId) && x.lastResponseType == event.id).map(x => x.crqId);
            this.assessmentDetails.reviews = domainReview.filter(x => filterCrqId.find(y => y == x.controlRequirementId));
        }
        else {
            this.assessmentDetails.reviews = domainReview;
        }
    }

    filterByEntityResponse() {

        if (this.selectedResponseTypeFilter == null) {
            this.assessmentDetails.reviews = this.originalAssessmentDetails.reviews.filter(
                item => item.controlRequirementDomainName === this.activeDomain
            );
        } else {
            this.assessmentDetails.reviews = this.originalAssessmentDetails.reviews.filter(
                r =>
                    r.updatedResponseType == this.selectedResponseTypeFilter &&
                    r.controlRequirementDomainName === this.activeDomain
            );
        }
        this.assessmentDetails.reviews = _.orderBy(this.assessmentDetails.reviews, ['sortData'], ['asc']);
    }

    onSelectChange(event) {
        if (event != null) {
            let index = this.domainNames.findIndex(
                item => item.fullText === this.activeDomain
            );
            if (index != -1) {
                this.setProgressBar(index);
            }
        }
    }
    filterByReponseType() {
        if (this.selectedResponseTypeFilter == null) {
            this.assessmentDetails.reviews = this.originalAssessmentDetails.reviews.filter(
                item => item.controlRequirementDomainName === this.activeDomain
            );
        } else {
            this.assessmentDetails.reviews = this.originalAssessmentDetails.reviews.filter(
                r =>
                    r.type == this.selectedResponseTypeFilter &&
                    r.controlRequirementDomainName === this.activeDomain
            );
        }
        this.assessmentDetails.reviews = _.orderBy(this.assessmentDetails.reviews, ['sortData'], ['asc']);
    }

    submit() {
        if (this.originalAssessmentDetails.reviews.find(e => e.type == 0 && e.controlRequirementId > 0)) {
            this.message.error(
                "Before submitting you have to answer every question!"
            );
        } else {
            this._externalAssessmentProxy
                .submitAssessment(this.assessmentId)
                .subscribe(() => {
                    this.originalAssessmentDetails.status = AssessmentStatus.InReview;
                    this.notify.info(this.l("Submitted Succesfully"));
                    this._router.navigate(["/app/main/externalAssessments/externalAssessments"]);
                });
        }
    }

    approve() {
        let input = new ApproveAssessmentInput();
        input.assessmentId = this.assessmentId;
        this.spinnerService.show();
        this._externalAssessmentProxy
            .approveAssessment(input)
            .subscribe(() => {
                this.originalAssessmentDetails.status = AssessmentStatus.Approved;
                this.notify.info(this.l("Approved Succesfully"));
                this.spinnerService.hide();
                this._router.navigate(["/app/main/externalAssessments/externalAssessments"]);
            }, err => {
                this.spinnerService.hide();
            });
    }

    publish() {
        this._externalAssessmentProxy
            .publishAssessmentReviews(this.assessmentId)
            .subscribe(() => {
                this.originalAssessmentDetails.status = AssessmentStatus.SentToAuthority;
                this.notify.info(this.l("Submitted Succesfully"));
                this._router.navigate(["/app/main/externalAssessments/externalAssessments"]);
            });
    }

    showAgreementModal(): void {
        var NonResponseCount = this.originalAssessmentDetails.reviews.filter(e => e.type == undefined).length;
        var ResponseCount = this.originalAssessmentDetails.reviews.length;
        if (ResponseCount == NonResponseCount) {
            this.message.error("Please provide responses to questions before submission!");
        }
        else {
            this.message.confirm("End Assessment will close the assessment and no further editing will be possible. Please do not select yes if you don't intend to end assessment!", this.l("Are you Sure?"), isConfirmed => {
                if (isConfirmed) {
                    this._externalAssessmentProxy.getExternalAssessment(this.assessmentId).subscribe(() => {
                        this.savePrimaryAssessmentReview();
                        this.getAssessmentQuestionares();
                    });
                }
            });
        }
    }

    hasAcceptedAgreement() {
        return this.assessmentAgreementModal.hasAcceptedAgreement();
    }

    tryPublish() {
        if (this.hasAcceptedAgreement()) {
            let input = new AssessmentAgreementResponseInput();
            input.signature = this.assessmentAgreementModal.signature;
            input.hasAccepted = this.assessmentAgreementModal.hasAccepted;
            input.assessmentId = this.assessmentId;

            this._externalAssessmentProxy
                .acceptAgreementTerms(input)
                .subscribe(() => {
                    this.message.info("Agreement acceptance saved succesfully!");
                    this.publish();
                });
        } else {
            this.message.error(
                "Before submission you have to agree terms of agreement!"
            );
        }
    }

    requestClarification() {
        this._externalAssessmentProxy
            .requestClarification(this.assessmentId)
            .subscribe(() => {
                this.originalAssessmentDetails.status = AssessmentStatus.Initialized;
                this.needsClarification = true;
                let data: any;
                data = this.originalAssessmentDetails.status;
                this.changeExternalStatus.emit(data);
                this.notify.info(this.l("Clarification Successfully requested!"));
                this._router.navigate(["/app/main/externalAssessments/externalAssessments"]);
            });
    }

    reverseResponseTypes() {
        for (
            let i = 0;
            i < this.originalAssessmentDetails.reviews.length;
            i++
        ) {
            if (this.originalAssessmentDetails.reviews[i].type) {
                this.originalAssessmentDetails.reviews[
                    i
                ].type = this.originalAssessmentDetails.reviews[i].type;
            }
            for (
                let j = 0;
                j <
                this.originalAssessmentDetails.reviews[i].reviewQuestions
                    .length;
                j++
            ) {
                if (
                    this.originalAssessmentDetails.reviews[i].reviewQuestions[j]
                        .selectedAnswerOptionId
                ) {
                    this.originalAssessmentDetails.reviews[i].reviewQuestions[
                        j
                    ].selectedAnswerOptionId = this.originalAssessmentDetails.reviews[
                        i
                    ].reviewQuestions[j].selectedAnswerOptionId;
                }
            }
        }
    }

    saveForm(copyToChild: boolean) {
        this.assessmentSubmission = new SubmitAssessmentInput();
        this.assessmentSubmission.assessmentId = this.assessmentId;
        this.reverseResponseTypes();
        this.assessmentSubmission.reviews = this.originalAssessmentDetails.reviews.map(
            r => {
                let reviewData = new FilledReviewDto();
                reviewData.comment = r.comment;
                reviewData.reviewDataResponseType = r.type == null ? undefined : r.type;
                reviewData.clarification = r.clarification;
                reviewData.crqId = r.controlRequirementId;
                reviewData.id = r.id;
                let fileQues = new FilledQuestionDto();
                reviewData.questions = r.reviewQuestions;
                return reviewData;
            }
        );
        this.spinnerService.show();
        this._externalAssessmentProxy
            .saveAssessmentReviews(copyToChild, this.assessmentSubmission)
            .subscribe(() => {
                this.spinnerService.hide();
                this.notify.info(this.l("SavedSuccessfully"));
                for (let i = 0; i < this.domainNames.length; i++) {
                    this.getData(this.domainNames[i], i);
                }
                this.getData(this.domainNames[this.lastSelected], this.lastSelected);
            });
    }
    lastClicked(e) {
        this.lastSelected = e;
    }
    savePrimaryAssessmentReview() {
        this.saveForm(false);
    }
    savePrimaryAndSecondaryAssessmentReview() {
        this.saveForm(true);
    }
    isAssessmentSentToAuthority(): boolean {
        if (this.originalAssessmentDetails != undefined) {
            if (this.originalAssessmentDetails.status == AssessmentStatus.SentToAuthority && !this.originalAssessmentDetails.isReviewer && !this.originalAssessmentDetails.isAuditor)
                return (
                    this.originalAssessmentDetails.status == AssessmentStatus.SentToAuthority
                );
        } else {
            false;
        }
    }
    isAssessmentApproved(): boolean {
        if (this.originalAssessmentDetails != undefined) {
            return (
                this.originalAssessmentDetails.status == AssessmentStatus.Approved
            );
        } else {
            false;
        }
    }

    getResponseColor(type: ReviewDataResponseType) {
        type = +type;
        switch (type) {
            case ReviewDataResponseType.FullyCompliant: {
                return "fullyCompliantColor";
            }
            case ReviewDataResponseType.NonCompliant: {
                return "nonCompliantColor";
            }
            case ReviewDataResponseType.NotApplicable: {
                return "notApplicableColor";
            }
            case ReviewDataResponseType.PartiallyCompliant: {
                return "partialyComplintColor";
            }
            default:
                return "notSelectedColor";
        }
    }

    getReviewById(id: number): ReviewDataDto {
        let review = this.assessmentDetails.reviews.find(r => r.id == id);
        return review;
    }

    uploadAttachment(event: any, reviewId: number) {
        const self = this;
        let file = event.target.files[0];
        let formData: FormData = new FormData();
        var fileExtension = file.name.split('.').pop();
        if (file.size > 4000000) {
            this.notify.error(this.l('File size should not be more than 4 MB'));
        }
        else {
            var extentionExist = this.fileExtensionList.find(x => x == fileExtension.toLowerCase());
            if (extentionExist != undefined) {
                formData.append("file", file, file.name);
                formData.append("reviewId", reviewId.toString());
                this.spinnerService.show();
                self._fileDownloadService
                    .addAttachment(reviewId, formData)
                    .subscribe(
                        res => {
                            let review = this.getReviewById(reviewId);
                            let attachment = new AttachmentDto();
                            attachment.code = res.result.code;
                            attachment.fileName = res.result.fileName;
                            review.attachments.push(attachment);
                            this.spinnerService.hide();
                        },
                        error => {
                            console.log(error);
                            this.spinnerService.hide();
                            this.message.error(
                                "Couldn't upload file at this time, try later :)!"
                            );
                        }
                    );
            }
            else {
                this.notify.error(this.l('Please use the correct file format'));
            }
        }
    }
    removeAttachment(code) {
        const self = this;
        self._fileDownloadService.removeAttachment(code).subscribe(() => {

            this.ngOnInit();
            this.notify.success("File removed Successfully");
        });
    }
    uploadQuestionAttachment(event: any, reviewQuestionId: number, reviewId: number) {
        const self = this;
        let file = event.target.files[0];
        let formData: FormData = new FormData();
        formData.append("file", file, file.name);
        formData.append("reviewQuestionId", reviewQuestionId.toString());
        this.spinnerService.show();
        self._fileDownloadService
            .addAttachmentToQuestion(reviewQuestionId, formData)
            .subscribe(
                res => {
                    let review = this.getReviewById(reviewId);
                    let reviewQuestion = review.reviewQuestions.find(
                        r => r.id == reviewQuestionId
                    );

                    let attachment = new AttachmentDto();
                    attachment.code = res.result.code;
                    attachment.fileName = res.result.fileName;
                    reviewQuestion.attachments.push(attachment);
                    this.spinnerService.hide();
                },
                error => {
                    console.log(error);
                    this.spinnerService.hide();
                    this.message.error(
                        "Couldn't upload file at this time, try later :)!"
                    );
                }
            );
    }

    downloadAttachment(code: string) {
        const self = this;
        self._fileDownloadService.downloadAttachment(code);
    }

    getPreviousReviewText(
        type: ReviewDataResponseType,
        isChanged: boolean
    ): string {
        if (type == ReviewDataResponseType.NotSelected) {
            return "";
        } else {
            if (isChanged) {
                return "Changed from " + this.reviewDataResponseType[type];
            } else {
                return this.reviewDataResponseType[type];
            }
        }
    }

    changePreviousAnswersSelect(event: any) {
        if (event == undefined) {
            this.assessmentDetails.reviews = this.originalAssessmentDetails.reviews.filter(r => r.controlRequirementDomainName == this.activeDomain);
        }
        else {
            let value: boolean = event.id === true;
            this.assessmentDetails.reviews = this.originalAssessmentDetails.reviews.filter(
                r =>
                    r.isChangedSinceLastResponse == value &&
                    r.controlRequirementDomainName == this.activeDomain
            );
        }
        this.assessmentDetails.reviews = _.orderBy(this.assessmentDetails.reviews, ['sortData'], ['asc']);
    }

    openExternalFinding(item: ReviewDataDto) {
        let input = new ExtFindingInput();
        input.assessmentId = this.originalAssessmentDetails.id;
        input.controlRequirementId = item.controlRequirementId;
        input.businessEntityId = this.originalAssessmentDetails.businessEntityId;
        input.vendorId = this.originalAssessmentDetails.vendorId;
        input.isAuditor = this.originalAssessmentDetails.isAuditor;
        input.isApprover = this.originalAssessmentDetails.isReviewer;
        input.isApprover = this.originalAssessmentDetails.isApprover;
        this.addUpdateExtAssessmentDataModal.show(input);
    }

    refreshSAR() {
        this._externalAssessmentProxy
            .containSingleResponse(this.assessmentId)
            .subscribe((res) => {
                if (res) {
                    this.message.error("Please fill at-least one response and save to retrieve Self Assessment Response (SAR) of Entity !!");
                }
                else {
                    this.getAssessmentQuestionares();
                }
            });
    }

    goToAuditProjectList() {
        this._router.navigate(["/app/main/audit-project-management"]);
    }

    savelastResponse(input: ReviewDataDto) {
        this.lastUpdateResponse.show(input, this.assessmentId);
    }

    getUpdatedResponse(input: number): string {


        if (input != null) {
            var result = input == 0 ? "" : this.responseTypes.find(x => x.id == input).name;
            return result;
        } else {
            return result = "";
        }
    }

    importExternalAssessmentResponse(data: { files: File }): void {

        const formData: FormData = new FormData();
        const file = data.files[0];
        var filename = file.name;
        var fileExtension = filename.split('.').pop();
        if (fileExtension.toLowerCase() == 'xlsx'.toLowerCase()) {
            this.message.confirm('', this.l('Are You Sure You Want To Import ' + file.name), (isConfirmed) => {
                if (isConfirmed) {
                    let teantid = this.appSession.tenantId;
                    let userid = this.appSession.userId;
                    formData.append('file', file, file.name);
                    formData.append('ExternalAssesmentId', this.assessmentId.toString());
                    formData.append('teantId', teantid.toString());
                    formData.append('userid', userid.toString());
                    this._httpClient
                        .post<any>(this.uploadUrl, formData)
                        .subscribe(response => {
                            if (response.success) {
                                this.notify.success(this.l('Import Process Start'));
                            } else if (response.error != null) {
                                this.notify.error(this.l('Import Process Failed'));
                            }

                        });
                }
            });
        }
        else {
            this.notify.error(this.l('Please use the correct file format - .xlsx is required'));
        }
    }
    checkFindingforControl(input: ReviewDataDto) {

        if (input.type == 2 || input.type == 3) {
            this._externalAssessmentProxy.getcheckControlforFinding(input.controlRequirementId, this.assessmentId).subscribe(res => {
                if (res) {

                }
                else {
                    this.message.warn("Finding details are missing," + " " + "Details of findings are mandatory to raise a finding.");
                }
            });
        }
    }

    updateResponse(input: ReviewDataDto) {
        this.assessmentId = this.assessmentId;
        this.input = input;
    }

    saveOverlayPanel(): void {
        if (this.input.updatedResponseType == null) {
            this.input.updatedResponseType = 0;
        }
        this._externalAssessmentProxy
            .updateLastResonse(this.assessmentId, this.input)
            .subscribe(() => {
                this.notify.info(this.l("LastResponseUpdatedSuccessfully"));
                this.opModel.hide();
            });
    }

    EndAssessmentButtonPermission() {
        this.endAssessmentPermission = this.isGranted("Pages.AuditManagement.ExternalAssessments.EndAssessmentButton");
    }

    getSAR(id: number): string {
        var temp = this.SARList.find(x => x.crqId == id);
        if (temp == undefined) {
            return "";
        } else {
            return this.reviewDataResponseType[temp.lastResponseType];
        }
    }

    exportToExcel(): void {
        this._externalAssessmentProxy.exportExternalAssessmentResponse(this.assessmentId, "" + this.overallProgress, this.assessmentDetailsForExport)
            .subscribe(
                (result) => {
                    this.spinnerService.hide();
                    this._fileDownloadService.downloadTempFile(result);
                },
                () => {
                    this.spinnerService.hide();
                    this.message.error(
                        'Couldn\'t download Business Entities Data for now, try later!'
                    );
                }
         );
    }

    ////External Assessments -> External Assessment Questionnaire
    reauditPermissionCheck() {
        this._commonLookupServiceProxy.getCurrentUserRoles().subscribe(
            (result) => {
                var roleList = result.map(x => x.roleName);
                this._auditServiceProxy.reauditPermissionCkeker().subscribe(res => {
                    var isExist = res.find(x => x.id == this.auditProjectId);
                    var isBEA = roleList.find(x => x.trim().toLowerCase() == "Business Entity Admin".trim().toLowerCase());
                    var isEAA = roleList.find(x => x.trim().toLowerCase() == "External Audit Admin".trim().toLowerCase());
                    var isEA = roleList.find(x => x.trim().toLowerCase() == "External Auditors".trim().toLowerCase());
                    var isIEA = roleList.find(x => x.trim().toLowerCase() == "Insurance Entity Admin".trim().toLowerCase());

                    if (isExist != undefined)
                    {
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
            .getAuditProjectForEdit(this.auditProjectId)
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
                    var isExist = res.find(x => x.id == this.auditProjectId);
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
