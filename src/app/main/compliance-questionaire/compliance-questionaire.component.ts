import { Component, OnInit, Injector, ViewChild, Input, EventEmitter, ElementRef, Output, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";
import { AssessmentAgreementModalComponent } from "./assessment-agreement-modal/assessment-agreement-modal.component";
import * as _ from "lodash";
import * as XLSX from 'ts-xlsx';
import {
    trigger,
    state,
    style,
    transition,
    animate
} from "@angular/animations";
import { AssessmentServiceProxy, ReviewDataResponseType, AssessmentStatus, FilledQuestionDto, AttachmentDto, AssessmentAgreementResponseInput, ApproveAssessmentInput, AssessmentDto, ImportAssessmentResponse, ReviewDataDto, SubmitAssessmentInput, FilledReviewDto, AssessmentRequestClarificationDto, ClarificationCommentType, ClarificationType, AssessmentWithBusinessEntityNameDto, CopyToChildInputDto, CommonLookupServiceProxy, SetAssessmentStatusInputDto, ClarificationOutPutDto, FindingReport, FindingReportServiceProxy, LatestFindingByEntitIdDto, OpenFindingValidationInputDto, AuditProjectServiceProxy } from "../../../shared/service-proxies/service-proxies";
import { FileDownloadService } from "../../../shared/utils/file-download.service";
import { any } from "@amcharts/amcharts4/.internal/core/utils/Array";
import { ComplianceQuestionaireModalComponent } from "./compliance-questionaire-modal/compliance-questionaire-modal.component";
import { CommonQuestionaireModalComponent } from "../common-component/common-questionaire/common-questionaire-modal.component";
import { number, string } from "@amcharts/amcharts4/core";
import { AppConsts } from "../../../shared/AppConsts";
import { HttpClient } from "@angular/common/http";
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';
import { CopyToChildModalComponent } from "./copy-to-child-modal/copy-to-child-modal.component";
import { SendToAuthorityModalModalComponent } from "./send-to-authority-modal/send-to-authority-modal.component";
import { AppSessionService } from "../../../shared/common/session/app-session.service";
import { AbpSessionService } from "abp-ng2-module";
import Swal from 'sweetalert2'
import { ReleationAssessmentAuditProjectModalComponent } from "./releation-assessment-audit-project-modal/releation-assessment-audit-project-modal.component";
import { DOCUMENT } from '@angular/common';


declare var $: any;
@Component({
    selector: "app-compliance-questionaire",
    templateUrl: "./compliance-questionaire.component.html",
    styleUrls: ["./compliance-questionaire.component.css"],
    animations: [
        trigger("rowExpansionTrigger", [
            state(
                "void",
                style({
                    transform: "translateX(-10%)",
                    opacity: 0
                })
            ),
            state(
                "active",
                style({
                    transform: "translateX(0)",
                    opacity: 1
                })
            ),
            transition(
                "* <=> *",
                animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
            )
        ])
    ]
})
export class ComplianceQuestionaireComponent extends AppComponentBase implements OnInit {
    uploadUrl = "";
    setInterval = setInterval;
    progressInterval: any;
    value: any;
    reauditPermission: boolean = false;
    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute, private _router: Router,
        private _assessmentServiceProxy: AssessmentServiceProxy,
        private _findingReportServiceProxy: FindingReportServiceProxy,
        private _appSessionService: AppSessionService,
        private _fileDownloadService: FileDownloadService,
        private _httpClient: HttpClient,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _auditServiceProxy: AuditProjectServiceProxy,
        @Inject(DOCUMENT) private document: Document
    ) {
        super(injector);
        this.GetUserAllRoles();
        this.RequestClarificationButtonPermission();
        this.CopytoChildButtonPermission();
        this.SenttoAuthorityButtonPermission();
        this.ApproveQuestionaryButtonPermission();
        this.SubmitReviewButtonPermission();
        this.SubmitBEReviewButtonPermission();
        this.SubmitGroupButtonPermission();
        this.GetLatestFindings();


        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Import/importSelfAssessmentResponse';
    }
    @ViewChild('labelImport')
    labelImport: ElementRef;
    @ViewChild('commonQuestionaireModals', { static: true }) commonQuestionaire: CommonQuestionaireModalComponent;
    @ViewChild('complianceQuestionaireModals', { static: true }) complianceQuestionaireModals: ComplianceQuestionaireModalComponent;
    @ViewChild("assessmentAgreementModal", { static: true }) assessmentAgreementModal: AssessmentAgreementModalComponent;
    @ViewChild("copyToChild", { static: true }) copyToChild: CopyToChildModalComponent;
    @ViewChild("sendToAuthorityModalModal", { static: true }) sendToAuthorityModalModal: SendToAuthorityModalModalComponent;
    @ViewChild("releationAssessmentAuditProject", { static: true }) releationAssessmentAuditProject: ReleationAssessmentAuditProjectModalComponent;
    showFilters = false;
    @Input('auditProjectId') auditProjectId: number;
    @Input() inputId: number = 0;
    @Input('associatementId') associatementId: any;
    @Input('headerTab') headerTab: boolean;
    @Input('assessmentFlag') assessmentFlag: any;
    @Output() assementDetailReviewCount = new EventEmitter<number>();
    assessmentId: number;
    assessmentSubmission: any;
    assessmentDetails: AssessmentDto = {} as any;
    originalAssessmentDetails: AssessmentDto = {} as any;
    selectedResponseTypeFilter: ReviewDataResponseType = null;
    agreementAccepted: boolean = false;
    needsClarification: boolean = false;
    statusValue = null;
    readonly = false;
    verticalView: boolean;
    horizontalView: boolean;
    selectedItem: any;
    selectedData: [];
    display: boolean = false;
    assessmentStatus = AssessmentStatus;
    reviewDataResponseType = ReviewDataResponseType;
    requestClarifications = [];
    activeDomain: string;
    clearRC = false;
    showResponeRC = false;
    showAddToRC = false;
    addField: boolean;
    rcCollection = [];
    canEditQuestionaire = true;
    canAttachDocuments = true;
    canAddORRequestForClarifications = true;
    canSaveCurrentAssessmentData = true;
    canCopyPreviousAssessmentData = true;
    copyTochildButton: boolean = false;
    questionCount: number = 0;
    progressPer: number = 0;
    entityName: string = '';
    masterOrSecondary: string = '';
    arrayBuffer: any;
    excelData: ImportAssessmentResponse[] = [];
    LatestFindingByEntitIdList: LatestFindingByEntitIdDto[] = [];
    LatestFindingControlNamesList: string[] = [];
    temp: any;
    fileToUpload: File = null;
    @Input() showResponseType: boolean;
    tabButton: boolean;
    copyToChildFlag: boolean;
    copyToChildBusinessEntity: AssessmentWithBusinessEntityNameDto[] = [];
    selectedCopyToChildBusinessEntity: AssessmentWithBusinessEntityNameDto[] = [];
    BEAdminReview: boolean = false;
    EntityGroupAdminReview: boolean = false;
    isAssestInitialized: boolean = false;
    showSentToAuthority1: boolean = false;
    showSentToAuthority2: boolean = false;
    isAdminFlag: boolean = false;
    isImportButtonFlag: boolean;
    encryptedAssessmentId: string = "";
    encryptedFlag: string = "";
    requestClarificationPermission: boolean;
    copytoChildPermission: boolean;
    sentToAuthorityPermission: boolean;
    approveQuestionaryPermission: boolean;
    submitReviewPermission: boolean;
    submitBeReviewPermission: boolean;
    submitGroupPermission: boolean;
    clarificationActionMethod: string = '';
    lastSelected: any;
    testData = [
        { id: '1', name: 'a' },
        { id: '2', name: 'b' },
        { id: '3', name: 'c' },
        { id: '4', name: 'Other' },
    ]
    partiallyCompliantPer: any = '100%';

    dropdownSettings = {
        singleSelection: true,
        idField: "id",
        textField: "name",
        selectAllText: "Select All",
        unSelectAllText: "UnSelect All",
        itemsShowLimit: 3,
        allowSearchFilter: false
    };
    percentage: number;
    answerDropdownSetting = {
        singleSelection: true,
        idField: "id",
        textField: "value",
        selectAllText: "Select All",
        unSelectAllText: "UnSelect All",
        itemsShowLimit: 3,
        allowSearchFilter: false
    };
    domainNames: any = [];
    domainNames1: any = [];
    overallProgress: any = 0;

    questionStatus = [{
        id: 2,
        name: 'Clarification Needed'
    }];

    responseTypes = [{
        id: 4,
        name: 'Fully Compliant',
        short: 'FC'
    }, {
        id: 3,
        name: 'Partially Compliant',
        short: 'PC'
    }, {
        id: 2,
        name: 'Non Compliant',
        short: 'NC'
    }, {
        id: 1,
        name: 'Not Applicable',
        short: 'NA'
    }];

    tableResponseTypes = [{
        id: 4,
        name: 'Fully Compliant'
    }, {
        id: 3,
        name: 'Partially Compliant'
    }, {
        id: 2,
        name: 'Non Compliant'
    }, {
        id: 1,
        name: 'Not Applicable'
    }];

    previousAnswers = [{
        id: true,
        name: 'Changed Answers'
    }, {
        id: false,
        name: 'Same Answers'
    }];
    private fieldArray: Array<any> = [];
    private newAttribute: any = {};
    readonlyflag: any;
    @Output() changeSelfStatus: EventEmitter<any[]> = new EventEmitter<any[]>();
    sendToAuthority: boolean = false;
    BEAdmin: boolean = false;
    BEGAdmin: boolean = false;
    isSentToAuthority: boolean = false;

    submitForReviewButton: boolean = false;
    BEAdminReviewButton: boolean = false;
    EGAdminReviewButton: boolean = false;
    saveButton: boolean = true;
    requestForClarificationButton: boolean = false;
    sendToAuthorityButton: boolean = false;
    approveQuestionaireButton: boolean = false;
    clarificationcountFlag: boolean = false;
    clarificationInfoList: ClarificationOutPutDto = new ClarificationOutPutDto();

    requestedCrqIs: number[] = [];
    responseCrqIs: number[] = [];

    overAllprogressPer: any;

    basicTotal = 0.0;
    transitionalTotal = 0.0;
    advanceTotal = 0.0;
    basicCount = 0;
    transitionalCount = 0;
    advanceCount = 0;
    userRoles: string[] = [];
    copyTochildRoles: string[] = ['Admin', 'Business Entity Admin', 'Insurance Entity Admin',];
    fileExtensionList = [] = ['jpeg', 'jpg', 'xls', 'xlsx', 'doc', 'docx', 'txt', 'pdf', 'png', 'pptx', 'ppt', 'rtf', 'zip', 'msg'];
    selectedDomainIndex: number = 0;
    selectedDomainName: string = '';
    openFindingValidationInput: OpenFindingValidationInputDto = new OpenFindingValidationInputDto();
    IsAdmin: boolean;

    ngOnInit() {
        this.IsAdmin = this.appSession.user.isAdmin;
        const routeParams = this._activatedRoute.snapshot.params;
        if (this.associatementId != undefined) {
            this.encryptedAssessmentId = this.associatementId;
            this.encryptedFlag = this.assessmentFlag;
        }
        else {
            if (routeParams.id) {
                this.encryptedAssessmentId = (this.inputId != 0) ? this.inputId : routeParams.id;
                this.encryptedFlag = routeParams.flag;
            }
        }
        if (this.encryptedAssessmentId != "") {
            this._assessmentServiceProxy.getDecriptAssessmentParameter(this.encryptedAssessmentId, this.encryptedFlag).subscribe((ressult) => {
                if (ressult.assessmentId != 0) {
                    this.assessmentId = ressult.assessmentId;
                    this.readonlyflag = '' + ressult.flag;
                    this.getAssessmentQuestionares();
                    this.verticalView = true;
                    this.selectedItem = 0;
                    this.tabButton = true;
                    this.showcopyToChildDropdown();
                    this.GetLatestFindings();
                    this.toggleLeftAside();
                }
            });
        }
       // this.ReauditPermissionCheck();
    }

    changeAssessment(val: number) {
        this.assessmentId = val;
        this.getAssessmentQuestionares();
        this.verticalView = true;
        this.selectedItem = 0;
    }

    addFieldValue() {
        this.fieldArray.push(this.newAttribute)
        this.newAttribute = {};
    }

    deleteFieldValue(index) {
        this.fieldArray.splice(index, 1);
    }

    changeOtherField(event: any) {
        let a = event.name;
        if (a == 'Other') {
            this.addField = true
        }
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

    close() {

    }

    setCarousel() {   

    }

    showAgreementModal(): void {

        this.openFindingValidationInput.assessmentId = this.originalAssessmentDetails.id;
        this.openFindingValidationInput.reviewData = this.originalAssessmentDetails.reviews;
        this.openFindingValidationInput.latestOpenFinding = this.LatestFindingByEntitIdList;

        this._assessmentServiceProxy
            .openFindingValidation(this.openFindingValidationInput)
            .subscribe((result) => {

                if (result.length > 0) {

                    let results = result.map(x => {
                        return { name: x };
                    })

                    Swal.fire({
                        text: 'Some controls status provided contradict with your current open Audit findings. Kindly upload the supporting evidences for the highlighted controls to be able to submit the assessments.',
                        icon: 'info',
                        showCancelButton: false,
                        confirmButtonText: 'Click here!',
                        //cancelButtonText: 'No, keep it'
                    }).then((result) => {
                        if (result.value) {

                            this.myMethod(results);
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            Swal.fire(

                            )
                        }
                    })
                }
                else {

                    if (this.copyTochildButton) {
                        var input = new SetAssessmentStatusInputDto();
                        input.assessmentStatus = this.originalAssessmentDetails.status;
                        input.reviewScores = this.overAllprogressPer;
                        input.assessmentIds = [];
                        input.assessmentIds.push(this.assessmentId);
                        this._assessmentServiceProxy.setAssessmentStatus(input).subscribe(() => {
                            this.sendToAuthorityModalModal.show(this.copyTochildButton, this.assessmentId);
                        });
                    }
                    else {
                        this.assessmentAgreementModal.show(true, this.copyTochildButton, this.assessmentId, null);
                    }
                }
            });



    }

    showSubmitForReviewModal(): void {
        if (this.originalAssessmentDetails.reviews.find(e => e.type == 0)) {
            this.message.error("Please provide responses to all questions before submission!");
        } else {

            this.openFindingValidationInput.assessmentId = this.originalAssessmentDetails.id;
            this.openFindingValidationInput.reviewData = this.originalAssessmentDetails.reviews;
            this.openFindingValidationInput.latestOpenFinding = this.LatestFindingByEntitIdList;

            this._assessmentServiceProxy
                .openFindingValidation(this.openFindingValidationInput)
                .subscribe((result) => {

                    if (result.length > 0)
                    {
                    
                        let results = result.map(x => {
                            return { name: x };
                        })

                        Swal.fire({
                            text: 'Some controls status provided contradict with your current open Audit findings. Kindly upload the supporting evidences for the highlighted controls to be able to submit the assessments.',
                            icon: 'info',
                            showCancelButton: false,
                            confirmButtonText: 'Click here!',
                            //cancelButtonText: 'No, keep it'
                        }).then((result) => {
                            if (result.value) {

                                this.myMethod(results);
                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                Swal.fire(

                                )
                            }
                        })
                    }
                    else {

                        var tempStatus = AssessmentStatus.InReview;
                        if (this.appSession.appSettings.skipReviewerApproval && this.appSession.appSettings.skipBEAdminApproval) {
                            tempStatus = AssessmentStatus.EntityGroupAdminReview;
                        }
                        else if (this.appSession.appSettings.skipReviewerApproval && !this.appSession.appSettings.skipBEAdminApproval) {
                            tempStatus = AssessmentStatus.BEAdminReview;
                        }
                        else if (!this.appSession.appSettings.skipReviewerApproval && this.appSession.appSettings.skipBEAdminApproval) {
                            tempStatus = AssessmentStatus.InReview;
                        }
                        else {
                            tempStatus = AssessmentStatus.InReview;
                        }

                        if (this.copyTochildButton) {
                            var input = new SetAssessmentStatusInputDto();
                            input.assessmentStatus = this.originalAssessmentDetails.status;
                            input.reviewScores = this.overAllprogressPer;
                            input.assessmentIds = [];
                            input.assessmentIds.push(this.assessmentId);
                            this._assessmentServiceProxy.setAssessmentStatus(input).subscribe(() => {
                                this.sendToAuthorityModalModal.showInreview(this.copyTochildButton, this.assessmentId, tempStatus, this.overAllprogressPer);
                            });
                        }
                        else {
                            this.setStatus(tempStatus);
                        }
                    }
                });
        }
    }
    myMethod(item) {
        this.releationAssessmentAuditProject.show('Control Name', item);
    }
    toggleLeftAside(): void {
        this.document.body.classList.toggle('kt-aside--minimize');
        this.triggerAsideToggleClickEvent();
    }
    triggerAsideToggleClickEvent(): void {
        abp.event.trigger('app.kt_qustionaire.onClick');
    }
    showBEAdminModal(): void {

        this.openFindingValidationInput.assessmentId = this.originalAssessmentDetails.id;
        this.openFindingValidationInput.reviewData = this.originalAssessmentDetails.reviews;
        this.openFindingValidationInput.latestOpenFinding = this.LatestFindingByEntitIdList;

        this._assessmentServiceProxy
            .openFindingValidation(this.openFindingValidationInput)
            .subscribe((result) => {

                if (result.length > 0) {

                    let results = result.map(x => {
                        return { name: x };
                    })

                    Swal.fire({
                        text: 'Some controls status provided contradict with your current open Audit findings. Kindly upload the supporting evidences for the highlighted controls to be able to submit the assessments.',
                        icon: 'info',
                        showCancelButton: false,
                        confirmButtonText: 'Click here!',
                        //cancelButtonText: 'No, keep it'
                    }).then((result) => {
                        if (result.value) {

                            this.myMethod(results);
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            Swal.fire(

                            )
                        }
                    })
                  //  console.log(result);
                  //  this.message.error("Some controls status provided contradict with your current open Audit findings. Kindly upload the supporting evidences for the highlighted controls to be able to submit the assessments.\n\n");
                }
                else {
                    var tempStatus = AssessmentStatus.All;
                    if (this.appSession.appSettings.skipReviewerApproval == false && this.appSession.appSettings.skipBEAdminApproval == false) {
                        tempStatus = AssessmentStatus.BEAdminReview;
                    }
                    else {
                        tempStatus = AssessmentStatus.EntityGroupAdminReview;
                    }
                    if (this.copyTochildButton) {
                        var input = new SetAssessmentStatusInputDto();
                        input.assessmentStatus = this.originalAssessmentDetails.status;
                        input.reviewScores = this.overAllprogressPer;
                        input.assessmentIds = [];
                        input.assessmentIds.push(this.assessmentId);
                        this._assessmentServiceProxy.setAssessmentStatus(input).subscribe(() => {
                            this.sendToAuthorityModalModal.showBEAdmin(this.copyTochildButton, this.assessmentId, tempStatus, this.overAllprogressPer);
                        });
                    }
                    else {
                        this.setStatus(tempStatus);
                    }
                }
            });
    }

    showBEGAdminModal(): void {

        this.openFindingValidationInput.assessmentId = this.originalAssessmentDetails.id;
        this.openFindingValidationInput.reviewData = this.originalAssessmentDetails.reviews;
        this.openFindingValidationInput.latestOpenFinding = this.LatestFindingByEntitIdList;

        this._assessmentServiceProxy
            .openFindingValidation(this.openFindingValidationInput)
            .subscribe((result) => {

                if (result.length > 0) {

                    let results = result.map(x => {
                        return { name: x };
                    })

                    Swal.fire({
                        text: 'Some controls status provided contradict with your current open Audit findings. Kindly upload the supporting evidences for the highlighted controls to be able to submit the assessments.',
                        icon: 'info',
                        showCancelButton: false,
                        confirmButtonText: 'Click here!',
                        //cancelButtonText: 'No, keep it'
                    }).then((result) => {
                        if (result.value) {

                            this.myMethod(results);
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            Swal.fire(

                            )
                        }
                    })

               //     console.log(result);
                 //   this.message.error("Some controls status provided contradict with your current open Audit findings. Kindly upload the supporting evidences for the highlighted controls to be able to submit the assessments.\n\n");
                }
                else {
                    var tempStatus = AssessmentStatus.EntityGroupAdminReview;
                    if (this.copyTochildButton) {
                        var input = new SetAssessmentStatusInputDto();
                        input.assessmentStatus = this.originalAssessmentDetails.status;
                        input.reviewScores = this.overAllprogressPer;
                        input.assessmentIds = [];
                        input.assessmentIds.push(this.assessmentId);
                        this._assessmentServiceProxy.setAssessmentStatus(input).subscribe(() => {
                            this.sendToAuthorityModalModal.showBEGAdmin(this.copyTochildButton, this.assessmentId, tempStatus, this.overAllprogressPer);
                        });
                    }
                    else {
                        this.setStatus(tempStatus);
                    }
                }
            });
    }

    setStatus(updateStatus) {    
        var input = new SetAssessmentStatusInputDto();
        input.assessmentStatus = updateStatus;
        input.reviewScores = this.overAllprogressPer;
        input.assessmentIds = [];
        input.assessmentIds.push(this.assessmentId);
        this._assessmentServiceProxy.setAssessmentStatus(input).subscribe(() => {
            this.notify.info(this.l("Submitted Succesfully"));
            this._router.navigate(["/app/main/assessments/assessments"]);
        });
    }

    setDomainNames(): void {
        let domainNames = this.originalAssessmentDetails.reviews
            .map(item => item.controlRequirementDomainName)
            .filter((value, index, self) => self.indexOf(value) === index);
        for (let i = 0; i < domainNames.length; i++) {
            let splitNames = domainNames[i].split("-");
            this.domainNames[i] = {};
            this.domainNames[i].fullText = domainNames[i];
            this.domainNames[i].text1 = splitNames[0];
            this.domainNames[i].text2 = splitNames[1];
            this.domainNames[i].obtained = 0;
            this.domainNames[i].width = this.setWidth(this.domainNames[i]);
            //alert(this.domainNames[i].lastResponseType);
        }
        this.domainNames = this.domainNames.sort(function (a, b) {
            let nameA = parseInt(a.text1.split(" ")[1]);
            let nameB = parseInt(b.text1.split(" ")[1]);
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
    }

    setAssessmentData(): void {
        this.setResponseTypes();
        this.setDomainNames();
        if (this.domainNames.length > 0) {
            this.activeDomain = this.domainNames[0].fullText;
            this.assessmentDetails.reviews = this.originalAssessmentDetails.reviews.filter(
                item => item.controlRequirementDomainName === this.activeDomain
            );
            this.assessmentDetails.reviews = _.orderBy(this.assessmentDetails.reviews, ['sortData'], ['asc']);
            this.assementDetailReviewCount.emit(this.assessmentDetails.reviews.length);
        }
        this.setProgressBar(0);
        this.getDataPros();
    }

    getAssessmentQuestionares() {
        this.spinnerService.show();
        this._assessmentServiceProxy.getById(this.assessmentId).subscribe(res => {
            let data: any;
            data = res;
            this.changeSelfStatus.emit(data);
            this.originalAssessmentDetails = res;
            this.isBEAdminReviewNecessary();
            this.isEntityGroupAdminReviewNecessary();
            // this.isAssessmentSentToAuthority();
            this.isAssessmentInitialized();
            this.submitForReviewButtonCondition();
            this.isGroupEntityAdmin();
            this.isBEAdmin();
            this.checkType();
            this.entityName = res.businessEntityName;
            this.questionCount = res.reviews.length;
            var versionOneList = res.reviews.filter(x => x.version == '0.1');

            if (res.entityGroupId != undefined) {
                if (res.businessEntityId == res.entityGroup.primaryEntityId) {
                    this.copyTochildButton = true;
                }
                //CopyToChild Logic here
                var testObj = this.userRoles.filter(x => this.copyTochildRoles.find(y => y == x));
                if (testObj != undefined && testObj != null && res.businessEntityId == this._appSessionService.user.businessEntityId) {
                    this.copyTochildButton = true;
                }
            }
            //Logic for show copytoChild button depends on user and roles
            else {
                //CopyToChild Logic here
                var testObj = this.userRoles.filter(x => this.copyTochildRoles.find(y => y == x));
                if (testObj != undefined && testObj != null && res.businessEntityId == this._appSessionService.user.businessEntityId) {
                    this.copyTochildButton = true;
                }
            }
            if (this.originalAssessmentDetails.status == AssessmentStatus.SentToAuthority ||
                this.originalAssessmentDetails.status == AssessmentStatus.NeedsClarification) {
                this.copyTochildButton = false;
            }
            this.setContentSettings();
            this.sendToAuthorityButtonSetting();

            if (res.status == AssessmentStatus.NeedsClarification) {
                //res.status = AssessmentStatus.Initialized;
                this.needsClarification = true;
                this.statusValue = 2;
                this.setResponseTypes();
                this.setDomainNames();
                this.domainNames = [];
                this.filterByQuestionStatus({
                    id: 2,
                    name: 'Clarification Needed'
                });
                this.setProgressBar(0);
                //this.dataGet();
                // this.gerDataProgress();
                //this.setCarousel();
                this.setAssessmentData();
                this.spinnerService.hide();
            } else {
                this.setAssessmentData();
                ///this.setCarousel();
                this.spinnerService.hide();
            }
            if (res.status == AssessmentStatus.Approved || res.status == AssessmentStatus.SentToAuthority) {
                this.readonly = true;
            }
        });
        this.HideImportButton();
    }


    setContentSettings() {
        switch (this.originalAssessmentDetails.status) {
            case AssessmentStatus.Initialized:
                if (this.appSession.appSettings.initialiazeSettingIds != undefined) {
                    this.canEditQuestionaire = this.appSession.appSettings.initialiazeSettingIds.find(i => i == 1) ? false : true;
                    this.canAttachDocuments = this.appSession.appSettings.initialiazeSettingIds.find(i => i == 2) ? false : true;
                    this.canAddORRequestForClarifications = this.appSession.appSettings.initialiazeSettingIds.find(i => i == 3) ? false : true;
                    this.canSaveCurrentAssessmentData = this.appSession.appSettings.initialiazeSettingIds.find(i => i == 4) ? false : true;
                    this.canCopyPreviousAssessmentData = this.appSession.appSettings.initialiazeSettingIds.find(i => i == 5) ? false : true;
                    break;
                }
            case AssessmentStatus.InReview:
                if (this.appSession.appSettings.initialiazeSettingIds != undefined) {
                    this.canEditQuestionaire = this.appSession.appSettings.inReviewSettingsIds.find(i => i == 1) ? false : true;
                    this.canAttachDocuments = this.appSession.appSettings.inReviewSettingsIds.find(i => i == 2) ? false : true;
                    this.canAddORRequestForClarifications = this.appSession.appSettings.inReviewSettingsIds.find(i => i == 3) ? false : true;
                    this.canSaveCurrentAssessmentData = this.appSession.appSettings.inReviewSettingsIds.find(i => i == 4) ? false : true;
                    this.canCopyPreviousAssessmentData = this.appSession.appSettings.inReviewSettingsIds.find(i => i == 5) ? false : true;
                    break;
                }
            case AssessmentStatus.BEAdminReview:
                if (this.appSession.appSettings.initialiazeSettingIds != undefined) {
                    this.canEditQuestionaire = this.appSession.appSettings.beAdminReviewSettingsIds.find(i => i == 1) ? false : true;
                    this.canAttachDocuments = this.appSession.appSettings.beAdminReviewSettingsIds.find(i => i == 2) ? false : true;
                    this.canAddORRequestForClarifications = this.appSession.appSettings.beAdminReviewSettingsIds.find(i => i == 3) ? false : true;
                    this.canSaveCurrentAssessmentData = this.appSession.appSettings.beAdminReviewSettingsIds.find(i => i == 4) ? false : true;
                    this.canCopyPreviousAssessmentData = this.appSession.appSettings.beAdminReviewSettingsIds.find(i => i == 5) ? false : true;
                    break;
                }
            case AssessmentStatus.EntityGroupAdminReview:
                if (this.appSession.appSettings.initialiazeSettingIds != undefined) {
                    this.canEditQuestionaire = this.appSession.appSettings.entityGroupAdminReviewSettingsds.find(i => i == 1) ? false : true;
                    this.canAttachDocuments = this.appSession.appSettings.entityGroupAdminReviewSettingsds.find(i => i == 2) ? false : true;
                    this.canAddORRequestForClarifications = this.appSession.appSettings.entityGroupAdminReviewSettingsds.find(i => i == 3) ? false : true;
                    this.canSaveCurrentAssessmentData = this.appSession.appSettings.entityGroupAdminReviewSettingsds.find(i => i == 4) ? false : true;
                    this.canCopyPreviousAssessmentData = this.appSession.appSettings.entityGroupAdminReviewSettingsds.find(i => i == 5) ? false : true;
                    break;
                }
            case AssessmentStatus.NeedsClarification:
                if (this.appSession.appSettings.initialiazeSettingIds != undefined) {
                    this.canEditQuestionaire = this.appSession.appSettings.needsClarificationSettingsIds.find(i => i == 1) ? false : true;
                    this.canAttachDocuments = this.appSession.appSettings.needsClarificationSettingsIds.find(i => i == 2) ? false : true;
                    this.canAddORRequestForClarifications = this.appSession.appSettings.needsClarificationSettingsIds.find(i => i == 3) ? false : true;
                    this.canSaveCurrentAssessmentData = this.appSession.appSettings.needsClarificationSettingsIds.find(i => i == 4) ? false : true;
                    this.canCopyPreviousAssessmentData = this.appSession.appSettings.needsClarificationSettingsIds.find(i => i == 5) ? false : true;
                    break;
                }
            case AssessmentStatus.SentToAuthority:
                if (this.appSession.appSettings.initialiazeSettingIds != undefined) {
                    //  this.canEditQuestionaire = this.appSession.appSettings.sentToAuthoritySettingsIds.find(i => i == 1) ? false : true;
                    this.canAttachDocuments = this.appSession.appSettings.sentToAuthoritySettingsIds.find(i => i == 2) ? false : true;
                    this.canAddORRequestForClarifications = this.appSession.appSettings.sentToAuthoritySettingsIds.find(i => i == 3) ? false : true;
                    this.canSaveCurrentAssessmentData = this.appSession.appSettings.sentToAuthoritySettingsIds.find(i => i == 4) ? false : true;
                    this.canCopyPreviousAssessmentData = this.appSession.appSettings.sentToAuthoritySettingsIds.find(i => i == 5) ? false : true;
                    break;
                }
            case AssessmentStatus.Approved:
                if (this.appSession.appSettings.initialiazeSettingIds != undefined) {
                    this.canEditQuestionaire = this.appSession.appSettings.approvedSettingsIds.find(i => i == 1) ? false : true;
                    this.canAttachDocuments = this.appSession.appSettings.approvedSettingsIds.find(i => i == 2) ? false : true;
                    this.canAddORRequestForClarifications = this.appSession.appSettings.approvedSettingsIds.find(i => i == 3) ? false : true;
                    this.canSaveCurrentAssessmentData = this.appSession.appSettings.approvedSettingsIds.find(i => i == 4) ? false : true;
                    this.canCopyPreviousAssessmentData = this.appSession.appSettings.approvedSettingsIds.find(i => i == 5) ? false : true;
                    break;
                }
            default:
        }
    }

    copyAnswersFromPreviousAssessment() {
        this.spinnerService.show();
        this._assessmentServiceProxy.getAssessmentWithPreviousAnswers(this.assessmentId).subscribe(res => {
            this.originalAssessmentDetails = res;
            this.setAssessmentData();
            //this.setCarousel();
            this.spinnerService.hide();
        }, err => {
            this.spinnerService.hide();
            this.message.error(err.error.error.message);
        });
    }

    setWidth(dataObj: any) {
        let assessmentDetailsReviews = this.originalAssessmentDetails.reviews.filter(op =>
            op.controlRequirementDomainName === dataObj.fullText);
        let count = assessmentDetailsReviews.filter(item => item.lastResponseType);
        let percentage = (100 * count.length) / assessmentDetailsReviews.length;
        return percentage.toFixed(0);
    }

    setResponseTypes(): void {
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
                this.originalAssessmentDetails.reviews[j].lastResponseType = this.responseTypes[index].id;
            } else {
                this.originalAssessmentDetails.reviews[j].lastResponseType = undefined;
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
                    this.originalAssessmentDetails.reviews[j].reviewQuestions[k].selectedAnswerOptionId = this.originalAssessmentDetails.reviews[j].reviewQuestions[k].answerOptions[index].id;
                } else {
                    this.originalAssessmentDetails.reviews[j].reviewQuestions[k].selectedAnswerOptionId = undefined;
                }
            }

        }
    }

    dataGet() {
        for (let i = 0; i < this.assessmentDetails.reviews.length; i++) {
            let sum = 0;
            this.assessmentDetails.reviews.forEach(x => {
                switch (x.lastResponseType) {
                    case 4:
                        sum = sum + 100;
                        break;
                    case 3:
                        sum = sum + 50;
                        break;
                    case 2:
                        sum = sum + 0;
                        break;
                    case 1:
                        sum = sum + 0;
                        break;
                    default:
                        sum = sum + 0;
                        sum = sum + 0;
                }
            });
            let totalcount = this.assessmentDetails.reviews.filter(item => item.iscored == true && (item.lastResponseType > 1 && item.lastResponseType <= 4));
            let progressPer1 = sum / totalcount.length;
            //let progressPer1 = sum / this.assessmentDetails.reviews.length;
            this.domainNames[i].progressPer1 = progressPer1.toFixed(1);
        }
    }

    setProgressBar(idx: number) {
        if (this.assessmentDetails.reviews && this.assessmentDetails.reviews.length > 0) {
            let count = this.assessmentDetails.reviews.filter(item => item.lastResponseType);
            let percentage = (100 * count.length) / this.assessmentDetails.reviews.length;
            if (this.domainNames[idx].width != undefined || this.domainNames[idx].length > 0) {
                this.domainNames[idx].width = percentage.toFixed(0);
                count = this.originalAssessmentDetails.reviews.filter(item => item.lastResponseType);
                percentage = (100 * count.length) / this.originalAssessmentDetails.reviews.length;
                this.overallProgress = percentage.toFixed(2);
            }
        }
    }

    getData(dataObj: any, idx: number, flag: boolean) {
        var finalTotal = 0;
        this.selectedItem = idx;
        if (dataObj != undefined) {
            this.assessmentDetails.reviews = this.originalAssessmentDetails.reviews.filter(
                op => op.controlRequirementDomainName === dataObj.fullText
            );
            this.activeDomain = dataObj.fullText;
        }
        this.assessmentDetails.reviews = _.orderBy(this.assessmentDetails.reviews, ['sortData'], ['asc']);

        this.setProgressBar(idx);
        this.percentage = 0;

        for (let i = 0; i < this.assessmentDetails.reviews.length; i++) {
            let sum = 0;
            this.assessmentDetails.reviews.forEach(x => {
                if (x.iscored == true) {
                    switch (x.lastResponseType) {
                        case 4:
                            sum = sum + 100;
                            break;
                        case 3:
                            sum = sum + 50;
                            break;
                        case 2:
                            sum = sum + 0;
                            break;
                        case 1:
                            sum = sum + 0;
                            break;
                        default:
                            sum = sum + 0;
                            sum = sum + 0;
                    }
                }
            });
            let totalcount = this.assessmentDetails.reviews.filter(item => item.iscored == true && (item.lastResponseType > 1 && item.lastResponseType <= 4));
            let progressPer1 = sum / totalcount.length;
            //let progressPer1 = sum / this.assessmentDetails.reviews.length;

            // setTimeout(() => {
            this.domainNames[idx].progressPer1 = progressPer1.toFixed(1);
            //  }, 1000);
        }

        let allSum = 0;
        finalTotal = 0;
        this.basicCount = 0;
        this.advanceCount = 0;
        this.transitionalCount = 0;
        this.basicTotal = 0;
        this.transitionalTotal = 0;
        this.advanceTotal = 0;

        this.originalAssessmentDetails.reviews.forEach(x => {
            if (x.iscored == true) {
                if (x.additionalComment == "" + "Basic") {

                    if (x.lastResponseType == 4) {
                        this.basicTotal = this.basicTotal + 100;
                        this.basicCount++;
                    }
                    else if (x.lastResponseType == 3) {
                        this.basicTotal = this.basicTotal + 50;
                        this.basicCount++;
                    }
                    else if (x.lastResponseType == 2) {
                        this.basicTotal = this.basicTotal + 0;
                        this.basicCount++;
                    }
                }
                else if (x.additionalComment == "" + "Transitional") {

                    if (x.lastResponseType == 4) {
                        this.transitionalTotal = this.transitionalTotal + 100;
                        this.transitionalCount++;
                    }
                    else if (x.lastResponseType == 3) {
                        this.transitionalTotal = this.transitionalTotal + 50;
                        this.transitionalCount++;
                    }
                    else if (x.lastResponseType == 2) {
                        this.transitionalTotal = this.transitionalTotal + 0;
                        this.transitionalCount++;
                    }
                }
                if (x.additionalComment == "" + "Advanced") {

                    if (x.lastResponseType == 4) {
                        this.advanceTotal = this.advanceTotal + 100;
                        this.advanceCount++;
                    }
                    else if (x.lastResponseType == 3) {
                        this.advanceTotal = this.advanceTotal + 50;
                        this.advanceCount++;
                    }
                    else if (x.lastResponseType == 2) {
                        this.advanceTotal = this.advanceTotal + 0;
                        this.advanceCount++;
                    }
                }
                //switch (x.lastResponseType) {
                //    case 4:
                //        allSum = allSum + 100;
                //        finalTotal++;
                //        break;
                //    case 3:
                //        allSum = allSum + 50;
                //        finalTotal++;
                //        break;
                //    case 2:
                //        allSum = allSum + 0;
                //        finalTotal++;
                //        break;
                //    case 1:
                //        allSum = allSum + 100;
                //        finalTotal++;
                //        break;
                //    default:
                //        allSum = allSum + 0;
                //        finalTotal++;
                //}
            }
        });

        var advanceScore = (this.advanceTotal == 0) ? 0 : Math.round((this.advanceTotal * 100) / (this.advanceCount * 100));
        var basicScore = (this.basicTotal == 0) ? 0 : Math.round((this.basicTotal * 100) / (this.basicCount * 100));
        var transitionalScore = (this.transitionalTotal == 0) ? 0 : Math.round((this.transitionalTotal * 100) / (this.transitionalCount * 100));

        if (this.basicCount > 0)
            finalTotal++;
        if (this.transitionalCount > 0)
            finalTotal++;
        if (this.advanceCount > 0)
            finalTotal++;
        var tempScore = ((advanceScore + basicScore + transitionalScore) / finalTotal);
        this.overAllprogressPer = tempScore.toString() == 'NaN' ? 0 : Math.round(tempScore);

        var notApplicableCount = this.originalAssessmentDetails.reviews.filter(x => x.lastResponseType == 1);
        if (this.originalAssessmentDetails.reviews.length == notApplicableCount.length) {
            this.overAllprogressPer = 0;
        }
        setTimeout(() => {
            this.spinnerService.hide();
        }, 1000);
    }

    getDataPros() {
        if (this.domainNames != undefined) {
            for (let i = this.domainNames.length; i >= 0; i--) {
                setTimeout(() => {
                    let domainname = this.domainNames[i];
                    if (domainname) {
                        this.getData(domainname, i, false)
                    }
                }, 1000);
            }
        }
    }

    attachReviewData(data: any) {
        let rev = this.assessmentDetails.reviews.filter(r => r.id == data.reviewData.id);
        if (rev.length > 0) {
            rev[0] = data.reviewData;
        }
    }

    onResponseSelectChange(event: any) {
        this.selectedResponseTypeFilter = event.id;
        this.filterByReponseType();
    }

    onSelectChange(e, i) {
        let as;
        this._assessmentServiceProxy.getById(this.assessmentId).subscribe(res => {
            as = res.reviews;
            as.push({ isDisable: true })
            let a = as[i].lastResponseType;

            if (e.id == a) {
                document.getElementById('textarea' + i).setAttribute("disabled", "disabled");
            }
            else {
                document.getElementById('textarea' + i).removeAttribute("disabled");
            }
        })
        let index = this.domainNames.findIndex(
            item => item.fullText === this.activeDomain
        );
        if (index != -1) {
            this.setProgressBar(index);
        }
        let sum = 0;
        this.assessmentDetails.reviews.forEach(x => {
            if (x.iscored == true) {
                switch (x.lastResponseType) {
                    case 4:
                        sum = sum + 100;
                        break;
                    case 3:
                        sum = sum + 50;
                        break;
                    case 2:
                        sum = sum + 0;
                        break;
                    case 1:
                        sum = sum + 0;
                        break;
                    default:
                        sum = sum + 0;
                        sum = sum + 0;
                }
            }
        });
        //let count = this.assessmentDetails.reviews.filter(item => item.lastResponseType);
        let totalcount = this.assessmentDetails.reviews.filter(item => item.iscored == true);
        let progressPer1 = sum / totalcount.length;
        // let progressPer1 = sum / this.assessmentDetails.reviews.length;
        this.domainNames[index].progressPer1 = progressPer1.toFixed(1);
        let allSum = 0;
        var finalTotal = 0;

        this.basicCount = 0;
        this.advanceCount = 0;
        this.transitionalCount = 0;
        this.basicTotal = 0;
        this.transitionalTotal = 0;
        this.advanceTotal = 0;

        this.originalAssessmentDetails.reviews.forEach(x => {
            if (x.iscored == true) {
                if (x.additionalComment == "" + "Basic") {

                    if (x.lastResponseType == 4) {
                        this.basicTotal = this.basicTotal + 100;
                        this.basicCount++;
                    }
                    else if (x.lastResponseType == 3) {
                        this.basicTotal = this.basicTotal + 50;
                        this.basicCount++;
                    }
                    else if (x.lastResponseType == 2) {
                        this.basicTotal = this.basicTotal + 0;
                        this.basicCount++;
                    }
                }
                else if (x.additionalComment == "" + "Transitional") {

                    if (x.lastResponseType == 4) {
                        this.transitionalTotal = this.transitionalTotal + 100;
                        this.transitionalCount++;
                    }
                    else if (x.lastResponseType == 3) {
                        this.transitionalTotal = this.transitionalTotal + 50;
                        this.transitionalCount++;
                    }
                    else if (x.lastResponseType == 2) {
                        this.transitionalTotal = this.transitionalTotal + 0;
                        this.transitionalCount++;
                    }
                }
                if (x.additionalComment == "" + "Advanced") {

                    if (x.lastResponseType == 4) {
                        this.advanceTotal = this.advanceTotal + 100;
                        this.advanceCount++;
                    }
                    else if (x.lastResponseType == 3) {
                        this.advanceTotal = this.advanceTotal + 50;
                        this.advanceCount++;
                    }
                    else if (x.lastResponseType == 2) {
                        this.advanceTotal = this.advanceTotal + 0;
                        this.advanceCount++;
                    }
                }
                //switch (x.lastResponseType) {
                //    case 4:
                //        allSum = allSum + 100;
                //        finalTotal++;
                //        break;
                //    case 3:
                //        allSum = allSum + 50;
                //        finalTotal++;
                //        break;
                //    case 2:
                //        allSum = allSum + 0;
                //        finalTotal++;
                //        break;
                //    case 1:
                //        allSum = allSum + 100;
                //        finalTotal++;
                //        break;
                //    default:
                //        allSum = allSum + 0;
                //        finalTotal++;
                //}
            }
        });
        //this.overAllprogressPer = (allSum / (finalTotal * 100) * 100).toFixed(1);
        var advanceScore = (this.advanceTotal == 0) ? 0 : Math.round((this.advanceTotal * 100) / (this.advanceCount * 100));
        var basicScore = (this.basicTotal == 0) ? 0 : Math.round((this.basicTotal * 100) / (this.basicCount * 100));
        var transitionalScore = (this.transitionalTotal == 0) ? 0 : Math.round((this.transitionalTotal * 100) / (this.transitionalCount * 100));

        if (this.basicCount > 0)
            finalTotal++;
        if (this.transitionalCount > 0)
            finalTotal++;
        if (this.advanceCount > 0)
            finalTotal++;
        var tempScore = ((advanceScore + basicScore + transitionalScore) / finalTotal);
        this.overAllprogressPer = tempScore.toString() == 'NaN' ? 0 : Math.round(tempScore);
        var notApplicableCount = this.originalAssessmentDetails.reviews.filter(x => x.lastResponseType == 1);
        if (this.originalAssessmentDetails.reviews.length == notApplicableCount.length) {
            this.overAllprogressPer = 0;
        }
        this.setPersentageProgrss(index);
    }

    gerDataProgress() {
        let domainNames = this.originalAssessmentDetails.reviews
            .map(item => item.controlRequirementDomainName)
            .filter((value, index, self) => self.indexOf(value) === index);
        for (let i = 0; i < domainNames.length; i++) {
            let sum = 0;
            this.assessmentDetails.reviews.forEach(x => {
                if (x.iscored == true) {
                    switch (x.lastResponseType) {
                        case 4:
                            sum = sum + 100;
                            break;
                        case 3:
                            sum = sum + 50;
                            break;
                        case 2:
                            sum = sum + 0;
                            break;
                        case 1:
                            sum = sum + 0;
                            break;
                        default:
                            sum = sum + 0;
                            sum = sum + 0;
                    }
                }
            });
            let totalcount = this.assessmentDetails.reviews.filter(item => item.iscored == true && (item.lastResponseType > 1 && item.lastResponseType <= 4));
            let progressPer1 = sum / totalcount.length;
            this.domainNames[i].progressPer1 = progressPer1.toFixed(1);
        }
    }

    setPersentageProgrss(index: number) {
        let sum = 0;
        this.assessmentDetails.reviews.forEach(x => {
            if (x.iscored == true) {
                switch (x.lastResponseType) {
                    case 4:
                        sum = sum + 100;
                        break;
                    case 3:
                        sum = sum + 50;
                        break;
                    case 2:
                        sum = sum + 0;
                        break;
                    case 1:
                        sum = sum + 0;
                        break;
                    default:
                        sum = sum + 0;
                        sum = sum + 0;
                }
            }
        });
        //let count = this.assessmentDetails.reviews.filter(item => item.lastResponseType);
        let totalcount = this.assessmentDetails.reviews.filter(item => item.iscored == true && (item.lastResponseType > 1 && item.lastResponseType <= 4));

        let progressPer1 = sum / totalcount.length;
        //let progressPer1 = sum / this.assessmentDetails.reviews.length;
        this.domainNames[index].progressPer1 = progressPer1.toFixed(1);
        let allSum = 0;
        var finalTotal = 0;

        this.basicCount = 0;
        this.advanceCount = 0;
        this.transitionalCount = 0;
        this.basicTotal = 0;
        this.transitionalTotal = 0;
        this.advanceTotal = 0;

        this.originalAssessmentDetails.reviews.forEach(x => {
            if (x.iscored == true) {
                if (x.additionalComment == "" + "Basic") {

                    if (x.lastResponseType == 4) {
                        this.basicTotal = this.basicTotal + 100;
                        this.basicCount++;
                    }
                    else if (x.lastResponseType == 3) {
                        this.basicTotal = this.basicTotal + 50;
                        this.basicCount++;
                    }
                    else if (x.lastResponseType == 2) {
                        this.basicTotal = this.basicTotal + 0;
                        this.basicCount++;
                    }
                }
                else if (x.additionalComment == "" + "Transitional") {

                    if (x.lastResponseType == 4) {
                        this.transitionalTotal = this.transitionalTotal + 100;
                        this.transitionalCount++;
                    }
                    else if (x.lastResponseType == 3) {
                        this.transitionalTotal = this.transitionalTotal + 50;
                        this.transitionalCount++;
                    }
                    else if (x.lastResponseType == 2) {
                        this.transitionalTotal = this.transitionalTotal + 0;
                        this.transitionalCount++;
                    }
                }
                if (x.additionalComment == "" + "Advanced") {

                    if (x.lastResponseType == 4) {
                        this.advanceTotal = this.advanceTotal + 100;
                        this.advanceCount++;
                    }
                    else if (x.lastResponseType == 3) {
                        this.advanceTotal = this.advanceTotal + 50;
                        this.advanceCount++;
                    }
                    else if (x.lastResponseType == 2) {
                        this.advanceTotal = this.advanceTotal + 0;
                        this.advanceCount++;
                    }
                }
                //switch (x.lastResponseType) {
                //    case 4:
                //        allSum = allSum + 100;
                //        finalTotal++;
                //        break;
                //    case 3:
                //        allSum = allSum + 50;
                //        finalTotal++;
                //        break;
                //    case 2:
                //        allSum = allSum + 0;
                //        finalTotal++;
                //        break;
                //    case 1:
                //        allSum = allSum + 100;
                //        finalTotal++;
                //        break;
                //    default:
                //        allSum = allSum + 0;
                //        finalTotal++;
                //}
            }
        });
        //this.overAllprogressPer = (allSum / (finalTotal * 100) * 100).toFixed(1);
        var advanceScore = (this.advanceTotal == 0) ? 0 : Math.round((this.advanceTotal * 100) / (this.advanceCount * 100));
        var basicScore = (this.basicTotal == 0) ? 0 : Math.round((this.basicTotal * 100) / (this.basicCount * 100));
        var transitionalScore = (this.transitionalTotal == 0) ? 0 : Math.round((this.transitionalTotal * 100) / (this.transitionalCount * 100));

        if (this.basicCount > 0)
            finalTotal++;
        if (this.transitionalCount > 0)
            finalTotal++;
        if (this.advanceCount > 0)
            finalTotal++;
        var tempScore = ((advanceScore + basicScore + transitionalScore) / finalTotal);
        this.overAllprogressPer = tempScore.toString() == 'NaN' ? 0 : Math.round(tempScore);
        var notApplicableCount = this.originalAssessmentDetails.reviews.filter(x => x.lastResponseType == 1);
        if (this.originalAssessmentDetails.reviews.length == notApplicableCount.length) {
            this.overAllprogressPer = 0;
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
        if (this.originalAssessmentDetails.reviews.find(e => e.type == 0)) {
            this.message.error(
                "Please provide responses to all questions before submission!"
            );
        } else {
            let count = this.originalAssessmentDetails.reviews.filter(e => e.assessmentRequestClarifications.length > 0);
            if (count.length == 0) {
                this._assessmentServiceProxy
                    .submitAssessment(this.assessmentId)
                    .subscribe(() => {
                        this.originalAssessmentDetails.status =
                            AssessmentStatus.InReview;
                        this.notify.info(this.l("Submitted Succesfully"));
                        this._router.navigate(["/app/main/assessments/assessments"]);
                    });
            } else {
                let data = this.originalAssessmentDetails.reviews.filter(e => e.assessmentRequestClarifications.length > 0);
                if (data.length > 0) {
                    let arr = [];
                    data.forEach(rc => {
                        if (rc.assessmentRequestClarifications[rc.assessmentRequestClarifications.length - 1].responseComment == null) {
                            arr.push(rc.assessmentRequestClarifications[rc.assessmentRequestClarifications.length - 1]);
                        }
                    });

                    if (arr.length > 0) {
                        this.message.warn("Please respond to these remaining clarifications");
                        this.filterByQuestionStatus({
                            id: 2,
                            name: 'Clarification Needed'
                        });
                    } else {
                        // this.requestClarification(true);
                    }
                }
            }
        }
    }

    approve() {
        let input = new ApproveAssessmentInput();
        input.assessmentId = this.assessmentId;
        this._assessmentServiceProxy
            .approveAssessment(input)
            .subscribe(() => {
                this.originalAssessmentDetails.status =
                    AssessmentStatus.Approved;
                this.notify.info(this.l("Approved Succesfully"));
                this.readonly = true;
                this._router.navigate(["/app/main/assessments/assessments"]);
            });
    }

    publish() {
        this._assessmentServiceProxy
            .publishAssessmentReviews(this.assessmentId)
            .subscribe(() => {
                this.originalAssessmentDetails.status =
                    AssessmentStatus.SentToAuthority;
                this.notify.info(this.l("Submitted Succesfully"));
                this._router.navigate(["/app/main/assessments/assessments"]);
            });
    }

    reverseResponseTypes() {
        for (let i = 0; i < this.originalAssessmentDetails.reviews.length; i++) {
            if (this.originalAssessmentDetails.reviews[i].lastResponseType) {
                this.originalAssessmentDetails.reviews[i].type = this.originalAssessmentDetails.reviews[i].lastResponseType;
            }
            for (let j = 0; j < this.originalAssessmentDetails.reviews[i].reviewQuestions.length; j++) {
                if (this.originalAssessmentDetails.reviews[i].reviewQuestions[j].selectedAnswerOptionId) {
                    this.originalAssessmentDetails.reviews[i].reviewQuestions[j].selectedAnswerOptionId = this.originalAssessmentDetails.reviews[i].reviewQuestions[j].selectedAnswerOptionId;
                }
            }
        }
    }

    saveForm(copyToChild: boolean) {
        this.finalReviewScoreCalculation();
        this.assessmentSubmission = new SubmitAssessmentInput();
        this.assessmentSubmission.assessmentId = this.assessmentId;

        if (this.overAllprogressPer == "NaN") {
            this.assessmentSubmission.reviewScore = 0;
        }
        this.assessmentSubmission.reviewScore = this.overAllprogressPer;

        this.reverseResponseTypes();

        this.assessmentSubmission.reviews = this.originalAssessmentDetails.reviews.map(
            r => {
                let reviewData = new FilledReviewDto();
                reviewData.comment = r.comment;
                reviewData.reviewDataResponseType = r.type;
                reviewData.clarification = r.clarification;
                reviewData.id = r.id;
                reviewData.crqId = r.controlRequirementId;
                reviewData.questions = r.reviewQuestions;
                return reviewData;
            }
        );
        this.spinnerService.show();
        this._assessmentServiceProxy
            .saveAssessmentReviews(copyToChild, this.overallProgress, this.assessmentSubmission)
            .subscribe(() => {
                this.spinnerService.hide();
                this.notify.info(this.l("SavedSuccessfully"));
                let aa = this.selectedItem;
                if (this.lastSelected == undefined) {
                    for (let i = 0; i < this.domainNames.length; i++) {
                        this.getData(this.domainNames[i], i, true);
                    }
                    this.getData(this.domainNames[0], 0, true);
                } else {
                    for (let i = 0; i < this.domainNames.length; i++) {
                        this.getData(this.domainNames[i], i, true);
                    }
                    this.getData(this.domainNames[this.lastSelected], this.lastSelected, true);
                }
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

    //COde for Version Basic logic
    saveVersionForm() {
        this.assessmentSubmission = new SubmitAssessmentInput();
        this.assessmentSubmission.assessmentId = this.assessmentId;
        this.reverseResponseTypes();
        this.assessmentSubmission.reviews = this.originalAssessmentDetails.reviews.map(
            r => {
                let reviewData = new FilledReviewDto();
                reviewData.comment = r.comment;
                reviewData.reviewDataResponseType = r.type;
                reviewData.clarification = r.clarification;
                reviewData.id = r.id;
                reviewData.questions = r.reviewQuestions;
                return reviewData;
            }
        );

        this.spinnerService.show();
        this._assessmentServiceProxy
            .saveAssessmentReviewsAsVersion(this.assessmentSubmission)
            .subscribe(() => {
                this.spinnerService.hide();
                this.notify.info(this.l("SavedSuccessfully"));
            });
    }

    hasAcceptedAgreement() {
        return this.assessmentAgreementModal.hasAcceptedAgreement();
    }

    isAssessmentInitialized() {
        if (this.originalAssessmentDetails != undefined) {

            if (this.originalAssessmentDetails.status == AssessmentStatus.Initialized || this.originalAssessmentDetails.status == AssessmentStatus.NeedsClarification) {
                this.isAssestInitialized = true;
            }

        } else {
            this.isAssestInitialized = false;
        }
    }

    submitForReviewButtonCondition() {

        if (this.originalAssessmentDetails != undefined) {
            if (this.originalAssessmentDetails.status == AssessmentStatus.Initialized) {
                this.submitForReviewButton = true;
            }
            else if (this.originalAssessmentDetails.status == AssessmentStatus.InReview) {
                if (this.appSession.appSettings.skipReviewerApproval == false) {
                    if (this.originalAssessmentDetails.isReviewer || this.originalAssessmentDetails.isPrimaryReviwer) {
                        this.BEAdminReviewButton = true;
                    }
                }
                else {
                    if (this.originalAssessmentDetails.isReviewer || this.originalAssessmentDetails.isPrimaryReviwer || this.originalAssessmentDetails.isBEAdmin || this.originalAssessmentDetails.isEntityGroupAdmin) {
                        this.BEAdminReviewButton = true;
                    }
                }
            }
            else if (this.originalAssessmentDetails.status == AssessmentStatus.BEAdminReview) {
                if (this.appSession.appSettings.skipBEAdminApproval == false) {
                    if (this.originalAssessmentDetails.isReviewer || this.originalAssessmentDetails.isPrimaryReviwer) {
                        this.EGAdminReviewButton = true;
                        // this.requestForClarificationButton = true;
                    }
                }
                else {
                    if (this.originalAssessmentDetails.isReviewer || this.originalAssessmentDetails.isPrimaryReviwer || this.originalAssessmentDetails.isBEAdmin || this.originalAssessmentDetails.isEntityGroupAdmin) {
                        this.EGAdminReviewButton = true;
                        // this.requestForClarificationButton = true;
                    }
                }
            }
            else if (this.originalAssessmentDetails.status == AssessmentStatus.EntityGroupAdminReview) {

                if (this.appSession.appSettings.enableEntityGroupAdminApproval == false) {
                    if (this.originalAssessmentDetails.isBEAdmin || this.originalAssessmentDetails.isEntityGroupAdmin) {
                        this.sendToAuthorityButton = true;
                        //  this.requestForClarificationButton = true;
                    }
                }
                else {
                    if (this.originalAssessmentDetails.isEntityGroupAdmin || this.originalAssessmentDetails.isBEAdmin) {
                        this.sendToAuthorityButton = true;
                        // this.requestForClarificationButton = true;
                    }
                }
            }
            else if (this.originalAssessmentDetails.status == AssessmentStatus.SentToAuthority) {
                if (this.originalAssessmentDetails.isAuthorityUser) {
                    this.approveQuestionaireButton = true;
                }
                this.saveButton = false;
                this.canEditQuestionaire = false;
            }
            else if (this.originalAssessmentDetails.status == AssessmentStatus.Approved) {
                this.saveButton = false;
            }
            else if (this.originalAssessmentDetails.status == AssessmentStatus.NeedsClarification) {
                this.saveButton = false;
            }
            else if (this.originalAssessmentDetails.status == AssessmentStatus.AuditApproved) {
                this.saveButton = false;
            }
        }
    }

    isBEAdminReviewNecessary() {
        if (this.originalAssessmentDetails != undefined) {
            if (this.originalAssessmentDetails.isBEAdmin) {
                if (this.originalAssessmentDetails.status == AssessmentStatus.InReview) {
                    if (this.originalAssessmentDetails.isReviewer) {
                        if (this.appSession.appSettings.skipReviewerApproval == false && this.appSession.appSettings.enableEntityGroupAdminApproval == false) {
                            this.BEAdminReview = true;
                        }
                        else if (this.appSession.appSettings.skipReviewerApproval == false && this.appSession.appSettings.enableEntityGroupAdminApproval == true) {
                            this.EntityGroupAdminReview = true;
                        }
                        else if (this.appSession.appSettings.skipReviewerApproval == true && this.appSession.appSettings.enableEntityGroupAdminApproval == false) {
                            this.EntityGroupAdminReview = true;
                        }
                        else if (this.appSession.appSettings.skipReviewerApproval == true && this.appSession.appSettings.enableEntityGroupAdminApproval == true) {
                            this.EntityGroupAdminReview = true;
                        }
                    }
                }
            }
        }
    }

    isEntityGroupAdminReviewNecessary() {
        if (this.originalAssessmentDetails != undefined) {
            if (this.originalAssessmentDetails.isEntityGroupAdmin) {
                if (this.originalAssessmentDetails.status == AssessmentStatus.BEAdminReview) {
                    if (this.originalAssessmentDetails.isReviewer) {
                        if (this.appSession.appSettings.skipReviewerApproval == false && this.appSession.appSettings.enableEntityGroupAdminApproval == false) {
                            this.BEAdminReview = true;
                        }
                        else if (this.appSession.appSettings.skipReviewerApproval == false && this.appSession.appSettings.enableEntityGroupAdminApproval == true) {
                            this.EntityGroupAdminReview = true;
                        }
                        else if (this.appSession.appSettings.skipReviewerApproval == true && this.appSession.appSettings.enableEntityGroupAdminApproval == false) {
                            this.EntityGroupAdminReview = true;
                        }
                        else if (this.appSession.appSettings.skipReviewerApproval == true && this.appSession.appSettings.enableEntityGroupAdminApproval == true) {
                            this.EntityGroupAdminReview = true;
                        }
                    }
                }
            }
        }
    }

    isAssessmentSentToAuthority() {
        if (this.originalAssessmentDetails != undefined) {

            if (this.originalAssessmentDetails.status == AssessmentStatus.SentToAuthority && this.isAdminFlag == true) {
                this.isSentToAuthority = true;
            }
        }
    }

    isAssessmentInReview(): boolean {
        if (this.originalAssessmentDetails != undefined) {
            return (
                this.originalAssessmentDetails.status == AssessmentStatus.InReview
            );
        } else {
            false;
        }
    }

    isClarificationNeeded(): boolean {
        return (
            this.needsClarification || this.originalAssessmentDetails.status == AssessmentStatus.InReview || this.originalAssessmentDetails.status == AssessmentStatus.SentToAuthority
        );
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

    isGroupEntityAdmin() {
        if (this.originalAssessmentDetails != undefined) {
            if (this.originalAssessmentDetails.status == AssessmentStatus.EntityGroupAdminReview
                && this.appSession.appSettings.enableEntityGroupAdminApproval && this.appSession.appSettings.skipBEAdminApproval) {
                this.showSentToAuthority1 = true;
            } else {
                if (this.originalAssessmentDetails.status == AssessmentStatus.EntityGroupAdminReview
                    && this.appSession.appSettings.enableEntityGroupAdminApproval) {
                    this.showSentToAuthority1 = true;
                }
            }

        } else {
            this.showSentToAuthority1 = false;
        }
    }

    isBEAdmin() {
        if (this.originalAssessmentDetails != undefined) {
            if (this.originalAssessmentDetails.status == AssessmentStatus.EntityGroupAdminReview && this.originalAssessmentDetails.isBEAdmin
                && !this.appSession.appSettings.enableEntityGroupAdminApproval && this.appSession.appSettings.skipBEAdminApproval) {
                this.showSentToAuthority2 = true;
            } else {
                if (this.originalAssessmentDetails.status == AssessmentStatus.EntityGroupAdminReview && this.originalAssessmentDetails.isBEAdmin
                    && !this.appSession.appSettings.enableEntityGroupAdminApproval) {
                    this.showSentToAuthority2 = true;
                }
            }
        } else {
            this.showSentToAuthority2 = false;
        }
    }

    sendToAuthorityButtonSetting() {
        this._assessmentServiceProxy.getSendToAuthorityButtonValues(this.assessmentId)
            .subscribe((result) => {
                this.BEAdmin = result.isBEAdmin;
                this.BEGAdmin = result.isBEGAdmin;
                if (this.BEGAdmin) {
                    if (this.appSession.appSettings.enableEntityGroupAdminApproval && this.appSession.appSettings.skipBEAdminApproval) {
                        return true;
                    } else {
                        if (this.appSession.appSettings.enableEntityGroupAdminApproval) {
                            return true;
                        }
                    }
                }
                if (this.BEAdmin) {
                    if (!this.appSession.appSettings.enableEntityGroupAdminApproval && this.appSession.appSettings.skipBEAdminApproval) {
                        return true;
                    }
                    else {
                        if (!this.appSession.appSettings.enableEntityGroupAdminApproval) {
                            return true;
                        }
                    }
                }
            });
    }

    showRFCBtn() {
        if (this.originalAssessmentDetails != undefined) {
            if ((this.originalAssessmentDetails.status != AssessmentStatus.Initialized && this.originalAssessmentDetails.status != AssessmentStatus.Approved && this.originalAssessmentDetails.status != AssessmentStatus.NeedsClarification)
                && (this.BEAdminReview || this.EntityGroupAdminReview)) {
                return true;
            } else {
                if (this.showSentToAuthority1 || this.showSentToAuthority2) {
                    return true;
                } else {
                    if (this.isSentToAuthority && this.isGrantedAny('Pages.HealthCareEntities.Assessments.Approve')) {
                        return true;
                    }
                }
            }
        }

        return false;
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

    uploadQuestionAttachment(
        event: any,
        reviewQuestionId: number,
        reviewId: number
    ) {
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
        if (type == ReviewDataResponseType.NotSelected || type == undefined) {
            return "NF";
        } else {
            return this.responseTypes.find(item => item.id === type).short;
        }
    }

    changePreviousAnswersSelect(event: any) {
        if (!event || event.id == undefined) {
            this.assessmentDetails.reviews = this.originalAssessmentDetails.reviews.filter(
                r => r.controlRequirementDomainName == this.activeDomain
            );
        } else {
            let value: boolean = event.id === true;
            this.assessmentDetails.reviews = this.originalAssessmentDetails.reviews.filter(
                r =>
                    r.isChangedSinceLastResponse == value &&
                    r.controlRequirementDomainName == this.activeDomain
            );
        }
        this.assessmentDetails.reviews = _.orderBy(this.assessmentDetails.reviews, ['sortData'], ['asc']);
    }

    changeVerticalData(e) {
        this.selectedData = e;
    }

    showDialog(item: ReviewDataDto, action: string) {
        this._assessmentServiceProxy.getAllClarificationAssessment(this.originalAssessmentDetails.id, item.controlRequirementId)
            .subscribe((result) => {
                this.clarificationInfoList = result;
                this.requestClarifications = result.assessmentRequestClarification;
                let rc = new AssessmentRequestClarificationDto();
                rc.clarificationType = ClarificationType.InternalComment;

                if (action == 'Add') {
                    rc.id = 0;
                    rc.assessmentId = this.originalAssessmentDetails.id;
                    rc.controlRequirementId = item.controlRequirementId;
                    rc.reviewDataId = item.id;
                    rc.controlRequirementOriginalId = item.controlRequirementOriginalId;
                    rc.controlRequirementDescription = item.controlRequirementDescription;
                    rc.clarificationCommentType = ClarificationCommentType.ClarificationComment;
                    this.requestClarifications.push(rc);
                } else if (action == 'Respond') {
                    rc.id = 0;
                    rc.assessmentId = this.originalAssessmentDetails.id;
                    rc.controlRequirementId = item.controlRequirementId;
                    rc.reviewDataId = item.id;
                    rc.controlRequirementOriginalId = item.controlRequirementOriginalId;
                    rc.controlRequirementDescription = item.controlRequirementDescription;
                    rc.clarificationCommentType = ClarificationCommentType.RepsonseComment;
                    rc.responseComment = null;
                    rc.authorityComment = "";
                    this.requestClarifications.push(rc);
                }
                this.display = true;
                this.clarificationActionMethod = action;
            });
        this.clearRC = true;
    }

    AddNewResponseComment(item, commentType: ClarificationCommentType) {
        let rc = new AssessmentRequestClarificationDto();
        rc.assessmentId = this.originalAssessmentDetails.id;
        rc.controlRequirementId = item[item.length - 1].controlRequirementId;
        rc.reviewDataId = item[item.length - 1].reviewDataId;
        rc.controlRequirementOriginalId = item[item.length - 1].controlRequirementOriginalId;
        rc.controlRequirementDescription = item[item.length - 1].controlRequirementDescription;
        rc.clarificationType = item[item.length - 1].clarificationType; // this.originalAssessmentDetails.status == AssessmentStatus.SentToAuthority ? ClarificationType.ExternalComment : ClarificationType.InternalComment
        rc.clarificationCommentType = ClarificationCommentType.RepsonseComment;
        rc.responseComment = null;
        rc.authorityComment = "";
        item.push(rc);
    }

    AddNewClarificationComment(item, commentType: ClarificationCommentType) {
        let rc = new AssessmentRequestClarificationDto();
        rc.assessmentId = this.originalAssessmentDetails.id;
        rc.controlRequirementId = item[item.length - 1].controlRequirementId;
        rc.reviewDataId = item[item.length - 1].reviewDataId;
        rc.controlRequirementOriginalId = item[item.length - 1].controlRequirementOriginalId;
        rc.controlRequirementDescription = item[item.length - 1].controlRequirementDescription;
        rc.clarificationType = this.originalAssessmentDetails.status == AssessmentStatus.SentToAuthority ? ClarificationType.ExternalComment : ClarificationType.InternalComment
        rc.clarificationCommentType = ClarificationCommentType.ClarificationComment;
        rc.authorityComment = null;
        rc.responseComment = null;
        item.push(rc);
    }

    removeAttachment(code) {
        const self = this;
        self._fileDownloadService.removeAttachment(code).subscribe(() => {
            this.ngOnInit();
            this.notify.success("File removed Successfully");
        });

    }

    filterByQuestionStatus(item) {
        this.spinnerService.show();
        if (item !== undefined) {
            if (item.name == 'Clarification Needed') {
                //this.activeDomain = this.domainNames[0].fullText;
                this.assessmentDetails.reviews = [];
                this.originalAssessmentDetails.reviews.forEach(data => {
                    if (data.assessmentRequestClarifications.length > 0) {
                        this.assessmentDetails.reviews.push(data);
                    }
                });
                if (this.assessmentDetails.reviews.length == 0) {
                    this.setAssessmentData();
                } else {
                    this.filterDomains();
                    this.activeDomain = this.domainNames[0].fullText;
                }
            }
        }

        if (item === undefined) {
            this.setDomainNames();
            this.assessmentDetails.reviews = this.originalAssessmentDetails.reviews.filter(
                item => item.controlRequirementDomainName === this.activeDomain
            );
            this.assessmentDetails.reviews = _.orderBy(this.assessmentDetails.reviews, ['sortData'], ['asc']);

        }
        //this.setCarousel();
        this.spinnerService.hide();
    }

    filterDomains() {
        this.domainNames = [];
        let domainNames = this.assessmentDetails.reviews
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

    addRc(val: any) {
        this._assessmentServiceProxy.createAndUpdateRequestClarification(val)
            .subscribe((result) => {
                this.RequestClarificationButtonFlag(this.assessmentId);
            });
        this.display = false;
        this.clearRC = false;
        this.clarificationActionMethod = '';
    }

    closeModal() {
        if (this.clearRC) {
            let index = this.requestClarifications.findIndex(e => e.id == undefined);
            if (index >= 0) {
                let popIndex = this.requestClarifications.findIndex(e => e.id == undefined);
                this.requestClarifications.splice(popIndex, 1);
            }
        }
    }

    onFileChange(files: FileList) {
        this.labelImport.nativeElement.innerText = Array.from(files)
            .map(f => f.name)
            .join(', ');
        this.fileToUpload = files.item(0);
    }

    importSelfAssessmentResponse(data: { files: File }): void {

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
                    formData.append('AssesmentId', this.assessmentId.toString());
                    formData.append('teantId', teantid.toString());
                    formData.append('userid', userid.toString());
                    this._httpClient
                        .post<any>(this.uploadUrl, formData)
                        //.pipe(finalize(() => this.excelFileUpload.clear()))
                        .subscribe(response => {
                            if (response.success) {
                                this.notify.success(this.l('Import Process Start'));
                                this.setIntrvl();
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

    exportToExcel(): void {
        this._assessmentServiceProxy.getAssessmentDetailstoExcel(
            this.assessmentId,
        )
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    HideImportButton() {
        this._assessmentServiceProxy.getAssessmentImportButton(this.assessmentId).subscribe((result) => {
            this.isImportButtonFlag = result;
            this.masterOrSecondary = (result == true) ? " M " : " S ";
        })
    }

    RefreshComponent() {
        this._commonLookupServiceProxy.getSelfAssessmentComponentRefresh(this.appSession.userId, this.appSession.tenantId, this.assessmentId).subscribe(
            (result) => {
                if (result != null) {
                    this.value = result;
                    if (this.value[0].match("Self")) {
                        this.ngOnInit();
                        clearInterval(this.progressInterval);
                    }
                    else if (this.value[1].match("Self")) {
                        this.ngOnInit();
                        clearInterval(this.progressInterval);
                    }
                    else if (this.value[1].match("ADHICS")) {
                        this.ngOnInit();
                        clearInterval(this.progressInterval);
                    }
                }
            });

    }


    setIntrvl() {
        this.progressInterval = setInterval(() => this.RefreshComponent(), 7000);
    }


    funcCopyToChild() {
        this.copyToChildFlag = false;
        console.log(this.selectedCopyToChildBusinessEntity);
        var selectedRecordCount = this.selectedCopyToChildBusinessEntity.length;
        this.assessmentSubmission = new SubmitAssessmentInput();
        this.assessmentSubmission.assessmentId = this.assessmentId;
        this.reverseResponseTypes();
        this.assessmentSubmission.reviews = this.originalAssessmentDetails.reviews.map(
            r => {
                let reviewData = new FilledReviewDto();
                reviewData.comment = r.comment;
                reviewData.reviewDataResponseType = r.type;
                reviewData.clarification = r.clarification;
                reviewData.id = r.id;
                reviewData.crqId = r.controlRequirementId;
                reviewData.questions = r.reviewQuestions;
                return reviewData;
            }
        );
        this.copyToChild.show(this.assessmentSubmission, this.overallProgress);
    }

    async updateChildReview(input: CopyToChildInputDto) {
        var resultString = "";
        await this._assessmentServiceProxy.copyToChildAssessmentReviews(this.overallProgress, input)
            .subscribe((result) => {
                resultString = "" + input.assessmentWithBusinessEntity.businessEntityName + " Record Updated Successfully";
            });
    }

    showcopyToChildDropdown() {
        this.copyToChildFlag = true;
        this.GetCopyToChildEntities();
        this.RequestClarificationButtonFlag(this.assessmentId);
    }

    GetCopyToChildEntities() {
        this._assessmentServiceProxy
            //  .getCopyToChildInputOfAssessment(this.assessmentId)
            .getCopyToChildInputOfAssessment(this.assessmentId, true)
            .subscribe((result) => {
                this.copyToChildBusinessEntity = result;
            });
    }

    checkType() {
        var checktype = this._appSessionService.user.type;
        switch (checktype) {
            case 0:
                {
                    this.isAdminFlag = true;
                    this.isAssessmentSentToAuthority();
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

    RequestClarificationButtonPermission() {
        this.requestClarificationPermission = this.isGranted("Pages.HealthCareEntities.Assessments.RequestClarification");
    }

    CopytoChildButtonPermission() {
        this.copytoChildPermission = this.isGranted("Pages.HealthCareEntities.Assessments.CopytoChild");
    }

    SenttoAuthorityButtonPermission() {
        this.sentToAuthorityPermission = this.isGranted("Pages.HealthCareEntities.Assessments.Publish");
    }

    ApproveQuestionaryButtonPermission() {
        this.approveQuestionaryPermission = this.isGranted("Pages.HealthCareEntities.Assessments.Approve");
    }
    SubmitReviewButtonPermission() {
        this.submitReviewPermission = this.isGranted("Pages.HealthCareEntities.Assessments.SubmitReview");
    }

    SubmitBEReviewButtonPermission() {
        this.submitBeReviewPermission = this.isGranted("Pages.HealthCareEntities.Assessments.SubmitBeReview");
    }

    SubmitGroupButtonPermission() {
        this.submitGroupPermission = this.isGranted("Pages.HealthCareEntities.Assessments.SubmitGroupReview");
    }

    GetLatestFindings() {
        this._findingReportServiceProxy.getUpdatedFindingByEntity(this.assessmentId).subscribe(
            (result) => {
                this.LatestFindingByEntitIdList = result;
                console.log(this.LatestFindingByEntitIdList);
                this.LatestFindingControlNamesList = this.LatestFindingByEntitIdList.map(x => x.controlRequirementName);
            });
    }

    GetUserAllRoles() {
        this._commonLookupServiceProxy.getCurrentUserRoles().subscribe(
            (result) => {
                this.userRoles = result.map(x => x.roleName);
            });
    }

    RequestClarificationButtonFlag(val) {
        this._assessmentServiceProxy.requestClarificationButton(val).subscribe(
            (result) => {
                this.requestedCrqIs = result.requestedCrqIs;
                this.responseCrqIs = result.responseCrqIs;
                if (this.requestedCrqIs.length == this.responseCrqIs.length && this.requestedCrqIs.length > 0) {
                    this.clarificationcountFlag = true;
                }
            });
    }

    RespondClarificicationButton(crqId): boolean {
        var result = this.requestedCrqIs.find(x => x == crqId);
        return result == undefined ? false : true;
    }

    requestClarification() {
        this._assessmentServiceProxy.setStatusAsNeedsClarification(this.assessmentId).subscribe(res => {
            this.notify.info(this.l("Clarification Successfully requested!"));
            setTimeout(() => {
                this.spinnerService.hide();
                this._router.navigate(["/app/main/assessments/assessments"]);
            }, 1000);
        });

    }

    finalReviewScoreCalculation() {

        let allSum = 0;
        var finalTotal = 0;
        this.basicCount = 0;
        this.advanceCount = 0;
        this.transitionalCount = 0;
        this.basicTotal = 0;
        this.transitionalTotal = 0;
        this.advanceTotal = 0;

        this.originalAssessmentDetails.reviews.forEach(x => {
            if (x.iscored == true) {
                if (x.additionalComment == "" + "Basic") {

                    if (x.lastResponseType == 4) {
                        this.basicTotal = this.basicTotal + 100;
                        this.basicCount++;
                    }
                    else if (x.lastResponseType == 3) {
                        this.basicTotal = this.basicTotal + 50;
                        this.basicCount++;
                    }
                    else if (x.lastResponseType == 2) {
                        this.basicTotal = this.basicTotal + 0;
                        this.basicCount++;
                    }
                }
                else if (x.additionalComment == "" + "Transitional") {

                    if (x.lastResponseType == 4) {
                        this.transitionalTotal = this.transitionalTotal + 100;
                        this.transitionalCount++;
                    }
                    else if (x.lastResponseType == 3) {
                        this.transitionalTotal = this.transitionalTotal + 50;
                        this.transitionalCount++;
                    }
                    else if (x.lastResponseType == 2) {
                        this.transitionalTotal = this.transitionalTotal + 0;
                        this.transitionalCount++;
                    }
                }
                if (x.additionalComment == "" + "Advanced") {

                    if (x.lastResponseType == 4) {
                        this.advanceTotal = this.advanceTotal + 100;
                        this.advanceCount++;
                    }
                    else if (x.lastResponseType == 3) {
                        this.advanceTotal = this.advanceTotal + 50;
                        this.advanceCount++;
                    }
                    else if (x.lastResponseType == 2) {
                        this.advanceTotal = this.advanceTotal + 0;
                        this.advanceCount++;
                    }
                }
            }
        });
        var advanceScore = (this.advanceTotal == 0) ? 0 : Math.round((this.advanceTotal * 100) / (this.advanceCount * 100));
        var basicScore = (this.basicTotal == 0) ? 0 : Math.round((this.basicTotal * 100) / (this.basicCount * 100));
        var transitionalScore = (this.transitionalTotal == 0) ? 0 : Math.round((this.transitionalTotal * 100) / (this.transitionalCount * 100));

        if (this.basicCount > 0)
            finalTotal++;
        if (this.transitionalCount > 0)
            finalTotal++;
        if (this.advanceCount > 0)
            finalTotal++;
        var tempScore = ((advanceScore + basicScore + transitionalScore) / finalTotal);

        this.overAllprogressPer = tempScore.toString() == 'NaN' ? 0 : Math.round(tempScore);
        var notApplicableCount = this.originalAssessmentDetails.reviews.filter(x => x.lastResponseType == 1);
        if (this.originalAssessmentDetails.reviews.length == notApplicableCount.length) {
            this.overAllprogressPer = 0;
        }
    }

    openFindingValidationMethod() {
        this.openFindingValidationInput.assessmentId = this.originalAssessmentDetails.id;
        this.openFindingValidationInput.reviewData = this.originalAssessmentDetails.reviews;
        this.openFindingValidationInput.latestOpenFinding = this.LatestFindingByEntitIdList;

        this._assessmentServiceProxy
            .openFindingValidation(this.openFindingValidationInput)
            .subscribe((result) => {

                if (result.length > 0) {
                    console.log(result);
                    this.message.error("Some controls status provided contradict with your current open Audit findings. Kindly upload the supporting evidences for the highlighted controls to be able to submit the assessments.\n\n");
                }
                else {
                    this.message.error("OK");
                }

            });
    }

    
  
}

