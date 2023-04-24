import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    Injectable,
    ɵConsole,
    OnInit,

    ElementRef,

    Input
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
    IncidentsServiceProxy,
    ControlRequirementsServiceProxy,
    IncidentDto,
    BusinessRiskDto,
    ControlRequirementDto,
    GetBusinessEntitiesExcelDto,
    BusinessEntitiesServiceProxy,
    BusinessEntityUserDto,
    UserOriginType,

    FindingReportServiceProxy,
    CreateOrEditFindingReportDto,  
    ExceptionDto,
    ExceptionsServiceProxy,
    FindingReportCategory,
    AssessmentDto,
    AssessmentServiceProxy,
    DynamicNameValueDto,
    AssessmentStatus,
    FindingReportClassificationDto,
    FindingReportClassificationsServiceProxy,
    BusinessRisksServiceProxy,
    EntityType,
    RemediationsDto,
    RemediationServiceProxy,
    AttachmentWithTitleDto,
    UserServiceProxy,
    FindingRemediationDto,
    IRMRelationDto,
    CustomDynamicServiceProxy,
    ExternalAssessmentsServiceProxy,
    ReviewDataDto,
    BusinessEntityDto,
    BusinessEntityWorkflowActorType,
    FindingReportAction,
    CommonLookupServiceProxy, FindingReportStatus, FindingInputDto, FindingReportLogDto, AuditProjectServiceProxy
} from "@shared/service-proxies/service-proxies";
import { Router, ActivatedRoute } from "@angular/router";
import { AppSessionService } from "@shared/common/session/app-session.service";
import {
    StorageServiceProxy
} from "@shared/service-proxies/services/storage.service";
import { FileDownloadService } from "../../../shared/utils/file-download.service";
import { FileUploadComponent } from "../../shared/common/file-upload/file-upload.component";
//import Swal from 'sweetalert2'
import { custom } from 'devextreme/ui/dialog';


@Component({
    selector: "createOrEditfindingReportModal",
    templateUrl: "./create-or-edit-findingReport-modal.component.html",
    styleUrls: ["./create-or-edit-findingReport-modal.component.css"]
})
@Injectable()
export class CreateOrEditfindingReportModalComponent extends AppComponentBase
    implements OnInit {
    @Input('auditProjectId') auditProjectId: number;
    @ViewChild("createOrEditFindingModal", { static: true }) modal: ModalDirective;
    @ViewChild("entityUserSignaturePad", { read: ElementRef }) entityUserSignaturePad: ElementRef;
    @ViewChild("authorityUserSignaturePad", { read: ElementRef }) authorityUserSignaturePad: ElementRef;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(FileUploadComponent) fileUpload: FileUploadComponent;
    backPage: boolean;
    readonlyall: boolean;
    auditCompaniesLookUp: GetBusinessEntitiesExcelDto[] = [];
    remediation: RemediationsDto[] = [];
    remediationfilter: RemediationsDto[] = [];
    selectedRemediation = [];
    isEdit: boolean;
    isEdit1: boolean;
    recordId: any;
    active = false;
    saving = false;
    itemList = [];
    selectedItems = [];
    beAuditees: BusinessEntityUserDto[] = [];
    settings = {};
    findingReport = new CreateOrEditFindingReportDto();
    findingReportLog: FindingReportLogDto = new FindingReportLogDto();
    input: FindingInputDto = new FindingInputDto();
    incidentsLookUp: IncidentDto[] = [];
    exceptionsLookUp: ExceptionDto[] = [];
    businessRisksLookUp = [];
    controlRequirementsLookUp = [];
    classificationsLookUp: FindingReportClassificationDto[] = [];
    assessmentsLookUp = [];
    businessEntitiesLookUp: GetBusinessEntitiesExcelDto[] = [];
    beUsers: BusinessEntityUserDto[] = [];
    auditUsers: BusinessEntityUserDto[] = [];
    attachedFileCodes = [];
    status: DynamicNameValueDto[] = [];
    authorityUsers = [];
    title = 'Finding';
    selectedBusinessRisks = [];
    selectedExceptions = [];
    selectedIncidents = [];
    criticalities: DynamicNameValueDto[];
    primarReviwerId = 0;
    primaryApproverId = 0;
    bussinessEntityId: any;
    assessmentId: any;
    ControlRequirmentResponseType: any;
    ControlRequirmentId: any;
    findingReportId: any;
    BusinessEntity: BusinessEntityDto[] = [];
    value: any[] = [];
    attachmentData: any;
    attachmentCode: AttachmentWithTitleDto[] = [];
    arrayCount: number = 0;
    authorityReviewers: any;
    authorityapprovers: any;
    authorityapprover: BusinessEntityUserDto[] = [];
    entityapprovals: any;
    entityreviewers: any;
    beapprover: BusinessEntityUserDto[] = [];
    pageId: any;
    BusinessEntityId: any[] = [];
    beFindingUsers: BusinessEntityUserDto[] = [];
    findingDetails: string = '';
    findingActualRootCause: string = '';
    isExternalAuditor: boolean = false;
    isAuditee: boolean = false;
    findingStatus: any;
    count = 0;
    CAPAOpenFlag: boolean = false;
    Workinproflag: boolean = false;
    auditmanagerId: any;
    vendorId: any;
    hideButton: any;
    isdiable: boolean = false;
    attachmentfinding: AttachmentWithTitleDto[] = [];
    fileFormat = ['.pdf'];
    reauditPermission: boolean;
    IsAdmin: boolean;
    attachmentfindingDelete: boolean = true;
    checkAttachments: any = [];
    checkReadOnly: boolean = false;
    constructor(
        injector: Injector,
        private _remediationServiceProxy: RemediationServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy,
        private _findingReportsServiceProxy: FindingReportServiceProxy,
        private _exceptionsServiceProxy: ExceptionsServiceProxy,
        private _incidentsServiceProxy: IncidentsServiceProxy,
        private _controlRequirementsServiceProxy: ControlRequirementsServiceProxy,
        private _classificationServiceProxy: FindingReportClassificationsServiceProxy,
        private _assessmentServiceProxy: AssessmentServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _appSessionService: AppSessionService,
        private _storageService: StorageServiceProxy,
        private _router: Router, private _fileDownloadService: FileDownloadService,
        private _activatedRoute: ActivatedRoute, private _externalAssessmentService: ExternalAssessmentsServiceProxy,
        private _businessRiskService: BusinessRisksServiceProxy, private _userServiceProxy: UserServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _auditServiceProxy: AuditProjectServiceProxy
    ) {
        super(injector);
        this.hideButton = true;
        this.arrayCount = 0;
    }

    ngOnInit(): void {
        this.IsAdmin = this.appSession.user.isAdmin;
        let id = this._activatedRoute.snapshot.queryParams["id"];
        this.findingReportId = this._activatedRoute.snapshot.queryParams["id"];
        this.findingReport = new CreateOrEditFindingReportDto();
        this.input = new FindingInputDto();
        this.input.createOrEditFindingReportDto = new CreateOrEditFindingReportDto();
        this.input.findingReportLogDto = new FindingReportLogDto();
        this.findingReportLog = new FindingReportLogDto();
        this.findingReport.findingAction = FindingReportAction.Accept;
        this.arrayCount = 0;
        this.checkType();

    }

    checkType() {
        var checktype = this._appSessionService.user.type;
        switch (checktype) {
            case 0:
                {
                    this.isdiable = true;
                    break;
                }
            case 1:
                {
                    this.isdiable = false;
                    break;
                }
            case 2:
                {
                    this.isdiable = true;
                    break;
                }
            case 3:
                {
                    this.isdiable = false;
                    break;
                }
            case 4:
                {
                    this.isdiable = true;
                    break;
                }
            case 5:
                {
                    this.isdiable = true;
                    break;
                }
        }
    }

    show(controlRequirementId, BussinessEntityId, AssessmentId, vendorId, auditManagerId, responseType) {
       
        this.findingReport = new CreateOrEditFindingReportDto();
        this.findingReport.findingAction = FindingReportAction.Accept;
        this.ControlRequirmentResponseType = responseType;
        this.findingReport.externalAssessmentId = AssessmentId;
        this.findingReport.externalAssessmentResponseType = this.ControlRequirmentResponseType;
        this.findingDetails = null;
        this.findingActualRootCause = null;
        this.vendorId = vendorId;
        this.findingReport.findingCAPAStatus = 5;
        this.checkType();
        if (controlRequirementId) {
            this.isEdit1 = true;
        }
        this.active = true;
        if (this.isInternal()) {
            this.findingReport.type = 1;
        } else {
            this.findingReport.type = 2;
        }
        if (this.findingReport.type == 2) {
            this.BusinessEntityId = [];
            this.findingReport.type = 2;
            this.assessmentId = AssessmentId;
            this.bussinessEntityId = BussinessEntityId;
            this.findingReport.businessEntityId = BussinessEntityId;
            // this.findingReport.vendorId = vendorId;
            this.auditmanagerId = auditManagerId;
            this.BusinessEntityId.push(this.findingReport.businessEntityId)
            this.ControlRequirmentId = controlRequirementId;
            this._findingReportsServiceProxy.getcheckFinding(this.ControlRequirmentId, this.assessmentId).subscribe(result => {
                this.findingReportId = result;
                this.show1(result);
                this.modal.show();
            });
        }
        else {
            if (controlRequirementId != undefined) {
                this.findingReportId = controlRequirementId;
            }
            else {
                this.findingReportId = 0;
            }
            this.show1(this.findingReportId);
            this.modal.show();
        }
    }

    onItemChange(event, Id) {
        switch (Id) {
            case 5: {
                this.findingStatus = FindingReportStatus.CapaOpen;
                break;
            }
            case 6: {
                this.findingStatus = FindingReportStatus.WorkinProgress;
                break;
            }
            case 7:
                {
                    this.findingStatus = FindingReportStatus.CapaClosed;
                    break;
                }
        }
    }

    show1(findingReportId?: number, buttonStatus?: any, attachmentReadOnly?: boolean): void {
        this.checkReadOnly = attachmentReadOnly;
        this.attachmentData = [];
        this.checkAttachments = [];
        let userType = this.appSession.user.type;
        if (userType == 1 || userType == 4) {
            this.attachmentfindingDelete = false;
        }

        this.checkType();
        if (buttonStatus != undefined) {
            this.hideButton = buttonStatus;
        }
        else {
            this.hideButton = 0;
        }
        this._findingReportsServiceProxy.isExternalAuditorAndAuditee(findingReportId).subscribe(resultouter => {
            this.isExternalAuditor = resultouter.isExternalAuditor;
            this.isAuditee = resultouter.isAuditee;
            this.findingReportId = findingReportId;
            if (
                this._appSessionService.user.type ==
                UserOriginType.BusinessEntity ||
                this._appSessionService.user.type == UserOriginType.ExternalAuditor
            ) {
                this.initializeUsersLookUp();
                this.initializeIncidentsLookUp();
                this.initializeExceptionsLookUp();
                this.initializeAssessmentLookUp();
            }

            this.active = true;
            if (this.findingReportId == 0) {
                this.isEdit = false;
                this.findingReport.findingAction = FindingReportAction.Accept;
                this.findingReport.authorityIRMRelations = new IRMRelationDto();
                this.findingReport.entityIRMRelations = new IRMRelationDto();
                this.findingReport.id = findingReportId;
                this.findingReport.controlRequirementId = this.ControlRequirmentId;
                this.findingReport.findingCAPAStatus = 5;
                if (this.bussinessEntityId != null) {
                    this.findingReport.businessEntityId = this.bussinessEntityId;
                }
                else {
                    this.findingReport.businessEntityId = this._appSessionService.user.businessEntityId;
                }

                this.initializeBusinessEntitiesLookUp();
                this.initializeAuthorityUsersLookUp();
                this.initializeControlRequirementsLookUp();
                this.initializeClassificationsLookUp();
                this.initializeAuditCompaniesLookUp();
                this.initializeCriticalities();
                this.initializeFindingStatus();
                if (this.isInternal()) {
                    this.findingReport.type = 1;
                } else {
                    this.findingReport.type = 2;
                }

                this.findingReportLog.old_CorrectiveActionResponse = "";
                this.findingReportLog.old_ActualRootCause = "";
                this.findingReportLog.old_ActionResponseDate = null;
                this.findingReportLog.old_AuditorRemarks = "";
                this.findingReportLog.old_CAPAUpdateRequired = false;
                this.findingReportLog.old_Title = "";
                this.findingReportLog.old_DateClosed = null;
                this.findingReportLog.old_DateFound = null;
                this.findingReportLog.old_ActionResponseDate = null;
                this.findingReportLog.old_Category = "";
                this.findingReportLog.old_FindingDetails = "";
                this.findingReportLog.old_Reference = "";
                this.findingReportLog.old_Status = "";
                this.input.createOrEditFindingReportDto = new CreateOrEditFindingReportDto();
            }
            else {
                this.findingReport.actionResponseDate = undefined;
                this.findingReport.dateClosed = undefined;
                this.findingReport.dateFound = undefined;
                this.isEdit = true;
                this.pageId = 5;
                this.recordId = findingReportId;
                this.findingReport.findingAction = FindingReportAction.Accept;
                this.findingReportId = findingReportId;
                this.spinnerService.show();
                this.vendorId = null;
                this._findingReportsServiceProxy.getFindingReportForEdit(this.findingReportId)
                    .subscribe(
                        result => {

                            this.findingReport = result.findingReport;
                            this.attachmentfinding = result.attachments;
                            if (this.findingReport.status == FindingReportStatus.CapaApproved) {
                                this.hideButton = 1;
                            }

                            this.vendorId = this.findingReport.vendorId;
                            if (this.findingReport.status == FindingReportStatus.CapaOpen) {
                                this.CAPAOpenFlag = true;
                                this.Workinproflag = false;
                            }
                            else if (this.findingReport.status == FindingReportStatus.WorkinProgress) {
                                this.CAPAOpenFlag = false;
                                this.Workinproflag = true;
                            }

                            var temp = this.findingReport.details.split('`');

                            this.findingDetails = temp[0] == "null" ? "" : temp[0];
                            this.findingActualRootCause = temp[1] == "null" ? "" : temp[1];

                            this.findingReportLog.old_CorrectiveActionResponse = temp[0] == "null" ? "" : temp[0];
                            this.findingReportLog.old_ActualRootCause = temp[1] == "null" ? "" : temp[1];
                            this.findingReportLog.old_ActionResponseDate = result.findingReport.actionResponseDate;
                            this.findingReportLog.old_AuditorRemarks = result.findingReport.auditorRemark;
                            this.findingReportLog.old_CAPAUpdateRequired = result.findingReport.capaUpdateRequired;
                            this.findingReportLog.old_Title = result.findingReport.title;
                            this.findingReportLog.old_DateClosed = result.findingReport.dateClosed;
                            this.findingReportLog.old_DateFound = result.findingReport.dateFound;
                            this.findingReportLog.old_ActionResponseDate = result.findingReport.actionResponseDate;
                            this.findingReportLog.old_Category = "" + result.findingReport.category;
                            this.findingReportLog.old_FindingDetails = result.findingReport.otherCategoryName;
                            this.findingReportLog.old_Reference = result.findingReport.reference;
                            this.findingReportLog.old_Status = "" + result.findingReport.status;

                            if (this.isInternal()) {
                                this.findingReport.type = 1;
                            } else {
                                this.findingReport.type = 2;
                            }
                            this.findingReport.businessEntityId = this.findingReport.businessEntityId != undefined ? this.findingReport.businessEntityId : this._appSessionService.user.businessEntityId;
                            this.initializeBusinessEntitiesLookUp();
                            this.initializeControlRequirementsLookUp();
                            this.initializeClassificationsLookUp();
                            this.initializeAuditCompaniesLookUp();
                            this.initializeCriticalities();
                            this.initialiazeFindingUser(this.findingReport.businessEntityId);
                            this.initializeAuthorityUsersLookUp();
                            if (this.findingReport.authorityIRMRelations == undefined) {
                                this.findingReport.authorityIRMRelations = new IRMRelationDto();
                            }
                            if (this.findingReport.entityIRMRelations == undefined) {
                                this.findingReport.entityIRMRelations = new IRMRelationDto();
                            }

                            this.arrayCount = result.attachments.length;
                            this.attachedFileCodes = result.attachments;
                            this.fileUpload.getData(result.attachments);
                            this.spinnerService.hide();
                            this.attachedFileCodes.forEach((item, index: number) => {                              
                                this.checkAttachments.push({ name: item.title, code: item.code, name1: item.fileName, static: item.static })
                            });
                            this.isEdit = true;
                            this.modal.show();
                        },
                        error => {
                            this.spinnerService.hide();
                            this.message.error(
                                "Couldn't fetch finding report data at this time !"
                            );
                            this.close();
                        }
                    );
            }
        });

    }

    onShown() {

    }

    getAllInitilizationLookUp() {
        this.remediationLookup();
        this.initializeCriticalities();
        this.initializeAuditCompaniesLookUp();
        this.initializeFindingStatus();
        this.initializeControlRequirementsLookUp();
        this.initializeBusinessRisksLookUp();
        this.initializeExceptionsLookUp();
        this.initializeClassificationsLookUp();
        this.initializeAssessmentLookUp();
        this.initializeBusinessEntitiesLookUp();
        this.initializeAuthorityUsersLookUp();
        this.isBusinessEntityUser();
        this.initializeUsersLookUp();
    }

    remediationLookup() {
        this._remediationServiceProxy.getAllRemediations().subscribe(res => {
            this.remediation = res;
            this.getRemediation();
            if (this.findingReport.selectedFindingRemediations != undefined) {
                this.selectedRemediation = this.remediation.filter(b => this.findingReport.selectedFindingRemediations.find(r => r == b.id));
            }
        })
    }

    initializeCriticalities() {
        this._customDynamicService.getDynamicEntityDatabyName("Risk Critcality")
            .subscribe(res => {
                this.criticalities = res;
            });
    }

    getRemediation() {
        this.remediationfilter = this.remediation.filter(r => r.businessEntityId == this.findingReport.businessEntityId);
    }

    initializeAuditCompaniesLookUp() {
        this._businessEntitiesServiceProxy
            .getAllForLookUpByVendor(this.vendorId, false)
            .subscribe(res => {
                this.auditCompaniesLookUp = res;
                if (this.auditCompaniesLookUp != null) {
                    var vendorlist = this.auditCompaniesLookUp.find(x => x.businessEntity != null);
                    if (vendorlist != null) {
                        this.findingReport.vendorId = this.vendorId;
                        this.initializeAuditUsersLookUp();
                    }
                    else {
                        this.findingReport.vendorId = this.vendorId;
                    }
                }
            });

    }

    initializeFindingStatus() {
        this._findingReportsServiceProxy.getDynamicEntityFindingStatus("Finding Status").subscribe(res => {
            this.status = res;
        })
    }

    initializeControlRequirementsLookUp() {
        this._controlRequirementsServiceProxy.getControlRequirementListByGrouping()
            .subscribe(result => {
                this.controlRequirementsLookUp = result;
            });
    }

    initializeBusinessRisksLookUp() {
        this._businessRiskService.getAllForLookUp(this.findingReport.businessEntityId)
            .subscribe(res => {
                this.businessRisksLookUp = res;
                if (this.findingReport.relatedBusinessRisks != undefined) {
                    this.selectedBusinessRisks = this.businessRisksLookUp.filter(b => this.findingReport.relatedBusinessRisks.find(r => r == b.id));
                }
            });
    }

    initializeExceptionsLookUp() {
        this.findingReport.businessEntityId = !this.findingReport.businessEntityId ? this._appSessionService.user.businessEntityId : this.findingReport.businessEntityId;;
        this._exceptionsServiceProxy
            .getAllForLookUp(this.findingReport.businessEntityId)
            .subscribe(res => {
                this.exceptionsLookUp = res;
                if (this.findingReport.relatedExceptions != undefined) {
                    this.selectedExceptions = this.exceptionsLookUp.filter(b => this.findingReport.relatedExceptions.find(r => r == b.id));
                }
            });
    }

    initializeIncidentsLookUp() {
        this.findingReport.businessEntityId = !this.findingReport.businessEntityId ? this._appSessionService.user.businessEntityId : this.findingReport.businessEntityId;;
        this._incidentsServiceProxy
            .getAllForLookUp(this.findingReport.businessEntityId)
            .subscribe(res => {
                this.incidentsLookUp = res;
                if (this.findingReport.relatedIncidents != undefined) {
                    this.selectedIncidents = this.incidentsLookUp.filter(b => this.findingReport.relatedIncidents.find(r => r == b.id));
                }
            });
    }

    initializeClassificationsLookUp() {
        this._classificationServiceProxy.getAllForLookUp().subscribe(res => {
            this.classificationsLookUp = res;
        });
    }

    initializeAssessmentLookUp() {
        this.findingReport.businessEntityId = !this.findingReport.businessEntityId ? this._appSessionService.user.businessEntityId : this.findingReport.businessEntityId;;
        if (!this.isInternal() && this.findingReport.businessEntityId) {
            this._externalAssessmentService.getAllExternalAssessmentsByBessinessEntity(this.findingReport.businessEntityId)
                .subscribe(res => {
                    this.assessmentsLookUp = res;
                    this.findingReport.assessmentId = Number(this.assessmentId);
                    if (this.assessmentsLookUp != null) {
                        var assessment = this.assessmentsLookUp.find(x => x.id != null);
                        if (assessment != null) {
                            this.findingReport.assessmentId = assessment.id;
                        }
                    }
                });
        }
    }

    initializeBusinessEntitiesLookUp() {
        this._businessEntitiesServiceProxy.getAllBusinessEntityTypeById(this.findingReport.businessEntityId).subscribe(res => {
            this.BusinessEntity = res;
            //if (!this._appSessionService.user.isAuditer) {
            //    this.findingReport.businessEntityId = this._appSessionService.user.businessEntityId == 0 ? this.findingReport.businessEntityId : this._appSessionService.user.businessEntityId;
            //}
            if (this.findingReport.businessEntityId > 0) {
                this.initializeBeLookUpFields(this.findingReport.businessEntityId);
            }
        });
    }

    initializeAuthorityUsersLookUp() {
        this.authorityReviewers = [];
        this.authorityapprovers = [];
        this._businessEntitiesServiceProxy
            .getAuthorityUsers("Findings")
            .subscribe(res => {
                if (res.length > 0) {
                    this.authorityUsers = res.filter(x => x.type == BusinessEntityWorkflowActorType.Reviewer);
                    this.authorityapprover = res.filter(x => x.type == BusinessEntityWorkflowActorType.Approver);
                    this.authorityUsers.forEach(obj => {
                        this.authorityReviewers.push(obj.id);
                    });
                    this.authorityapprover.forEach(obj => {
                        this.authorityapprovers.push(obj.id);
                    });
                }
            });
    }

    isBusinessEntityUser() {
        this.findingReport.businessEntityId = this._appSessionService.businessEntityId;

    }

    initializeUsersLookUp() {

        this.findingReport.businessEntityId = !this.findingReport.businessEntityId ? this._appSessionService.user.businessEntityId : this.findingReport.businessEntityId;
        this.entityapprovals = [];
        this.entityreviewers = [];
        this._businessEntitiesServiceProxy
            .getAllApprovalUser(this.findingReport.businessEntityId)
            .subscribe(res => {
                if (res.length > 0) {
                    if (this._appSessionService.businessEntityId == 0) {
                        this.beUsers = res.filter(x => x.type == BusinessEntityWorkflowActorType.Reviewer);
                        let approver = this.beUsers.filter(a => this.BusinessEntity.find(b => b.primaryApproverId == a.id));
                        this.beUsers.forEach(obj => {
                            this.entityreviewers.push(obj.id);
                        });
                        if (approver.length > 0) {
                            this.primaryApproverId = approver[0].id;
                        }
                        this.beapprover = res.filter(x => x.type == BusinessEntityWorkflowActorType.Approver);
                        this.beapprover.forEach(obj => {
                            this.entityapprovals.push(obj.id);
                        });
                        let reviewer = this.beUsers.filter(a => this.BusinessEntity.find(b => b.primaryReviewerId == a.id));
                        if (reviewer.length > 0) {
                            this.primarReviwerId = reviewer[0].id;
                        }
                    }
                    else {
                        this.beUsers = res.filter(x => x.type == BusinessEntityWorkflowActorType.Reviewer);
                        let approver = this.beUsers.filter(a => this.BusinessEntity.find(b => b.primaryApproverId == a.id));
                        this.beUsers.forEach(obj => {
                            if (this.appSession.userId == obj.id) {
                                this.entityreviewers.push(obj.id);
                            }
                        });
                        if (approver.length > 0) {
                            this.primaryApproverId = approver[0].id;
                        }
                        this.beapprover = res.filter(x => x.type == BusinessEntityWorkflowActorType.Approver);
                        this.beapprover.forEach(obj => {
                            if (this.appSession.userId == obj.id) {
                                this.entityapprovals.push(obj.id);
                            }
                        });
                        let reviewer = this.beUsers.filter(a => this.BusinessEntity.find(b => b.primaryReviewerId == a.id));
                        if (reviewer.length > 0) {
                            this.primarReviwerId = reviewer[0].id;
                        }
                    }

                }
            });
    }

    initializeAuditUsersLookUp() {
        if (this.findingReport.vendorId != 0) {
            this._businessEntitiesServiceProxy
                .getAllUsers(this.findingReport.vendorId)
                .subscribe(res => {

                    this.auditUsers = res;
                    if (this.auditmanagerId != undefined) {
                        this.findingReport.auditorId = this.auditmanagerId;
                    }
                    else {

                    }

                });
        }
        else {
            this.findingReport.auditorId = null;
            this.findingReport.vendorId = null;
        }
    }

    initializeBeLookUpFields(businessEntityId: number) {
        if (businessEntityId != undefined) {
            this.BusinessEntityId = [];
            this.BusinessEntityId.push(businessEntityId)
            // this.loadEntityUsers();
            this.spinnerService.show();
            this.selectedBusinessRisks = [];
            this.selectedExceptions = [];
            this.selectedIncidents = [];
            this.selectedRemediation = [];
            this.assessmentsLookUp = [];
            this.beUsers = [];
            this.initializeBusinessRisksLookUp();
            this.initializeExceptionsLookUp();
            this.initializeIncidentsLookUp();
            this.initializeUsersLookUp();
            this.initializeAssessmentLookUp();
            this.remediationLookup();
            this.spinnerService.hide();
            this.initialiazeFindingUser(businessEntityId);
        }
        else {
            this.beAuditees = [];
            this.findingReport.assignedToUserId = null;
            this.findingReport.findingManagerId = null;
            this.findingReport.findingCoordinatorId = null;
            this.findingReport.findingOwnerId = null;
        }
    }

    downloadAttachment(code: string) {
        const self = this;
        self._fileDownloadService.downloadAttachment(code);
    }

    getAttachment(e) {        
        this.checkAttachments = [];
        this.attachmentData = e;
        this.checkAttachments = e;
    
        //e.forEach((item, index: number) => {
        //    data.push({ name: item.name, code: item.code });
        //});
        //this.checkAttachments = data;
    }

    save(): void {         
        let userType = this.appSession.user.type;       
        if (this.findingReport.findingCAPAStatus == 7 && (userType == 1 || userType == 4) && (this.checkAttachments == undefined || this.checkAttachments.length == 0)) {
            let evidenceFinding = custom({
                showTitle: false,
                messageHtml: '<b>Please Attach Evidence For Finding</b>',
                buttons: [{
                    text: "Ok",
                    onClick: (e) => {
                        return { buttonText: e.component.option("text") }
                    }
                }]
            });
            evidenceFinding.show().then((dialogResult) => {
                if (dialogResult.buttonText == "Ok") { }
            });


            //Swal.fire({
            //    icon: 'warning',
            //    html:
            //        '<b>Please Attach Evidence For Finding</b>',
            //    showCloseButton: false,
            //    showCancelButton: false,
            //    focusConfirm: false
            //});
        } else if (this.findingReport.findingCAPAStatus == 7 && (this.checkAttachments == undefined || this.checkAttachments.length == 0)) {
            let evidenceFinding = custom({
                showTitle: false,
                messageHtml: '<b> FND-' + this.findingReportId + '&nbsp; cannot be closed as evidence is not attached.</b>',
                buttons: [{
                    text: "Ok",
                    onClick: (e) => {
                        return { buttonText: e.component.option("text") }
                    }
                }]
            });
            evidenceFinding.show().then((dialogResult) => {
                if (dialogResult.buttonText == "Ok") { }
            });

            //Swal.fire({
            //    icon: 'warning',
            //    html:
            //        '<b> FND-' + this.findingReportId + '&nbsp; cannot be closed as evidence is not attached.</b>',
            //    showCloseButton: false,
            //    showCancelButton: false,
            //    focusConfirm: false
            //});
        }
        else {
            this.count = 0;
            this.attachmentCode = [];
            if (this.checkAttachments == undefined || this.checkAttachments == 0) {
                this.saveData();
            }
            else {
                this.checkAttachments.forEach((item, index: number) => {                  
                    this.count++;
                    if (!item.code) {
                        this.arrayCount == 0;
                        this.spinnerService.show();                        
                        let blob = new Blob([item], { type: item.extention });
                        let formData: FormData = new FormData();
                        formData.append("File", blob, item.name);
                        formData.append("title",this.findingReportId);
                        this._storageService.AddAttachment(formData).subscribe(
                            res => {
                                this.arrayCount++;                                
                                this.spinnerService.hide();
                                let items = new AttachmentWithTitleDto();
                                items.code = res.result.code;
                                items.title = item.name;
                                this.attachmentCode.push(items);
                                if (this.checkAttachments.length == this.count) {
                                    this.saveData();
                                }
                            },
                            error => {
                                console.log(error);
                                this.spinnerService.hide();
                                this.message.error(
                                    "Please contact Admin to fix this.)!"
                                );
                            }
                        );
                    }
                    else {
                        //this.count++;
                        //if (this.attachmentData.length == this.count) {
                        //    this.saveData();
                        //}
                        if (this.checkAttachments.length == this.count) {
                            this.saveData();
                        }
                    }
                });
            }
            
        }
    }

    saveData(): void {

       

        if (
            this.findingReport.controlRequirementId == 0 ||
            this.findingReport.controlRequirementId == undefined
        ) {
            this.message.error("Choose Control Requirement!");
            return;
        }
        if (this.attachmentCode.length > 0) {
            this.findingReport.attachments = this.attachmentCode.filter(e => e.code != "")
        }
        else {
            this.findingReport.attachments = this.attachmentfinding;
        }

        if (this.findingReport.title == null || this.findingReport.title == "" || this.findingReport.title == undefined) {
            this.message.error("Please fill required field..!");

            return;

        }
        this.saving = true;
        this.findingReport.relatedBusinessRisks = this.selectedBusinessRisks.map(r => r.id);
        this.findingReport.relatedExceptions = this.selectedExceptions.map(r => r.id);
        this.findingReport.relatedIncidents = this.selectedIncidents.map(r => r.id);
        this.findingReport.selectedFindingRemediations = this.selectedRemediation.map(r => r.id);
        this.findingReport.assessmentId = this.assessmentId;

        if (this.assessmentId != undefined && this.findingReport.id == 0)
            this.findingReport.externalAssessmentId = this.assessmentId;
        if (this.ControlRequirmentResponseType != undefined && this.findingReport.id == 0)
            this.findingReport.externalAssessmentResponseType = this.ControlRequirmentResponseType;


        if (this.findingReport.id != 0) {

        }
        else {
            if (this.isInternal() == true) {
                this.findingReport.authorityIRMRelations.authorityApprovers = this.authorityapprovers;
                this.findingReport.authorityIRMRelations.authorityReviewers = this.authorityReviewers;
                this.findingReport.entityIRMRelations.entityApprovers = this.entityapprovals;
                this.findingReport.entityIRMRelations.entityReviewers = this.entityreviewers;
            }
        }

        this.findingReport.details = this.findingDetails + '`' + this.findingActualRootCause;
        this.findingReport.findingAction = FindingReportAction.Accept;


        this.input.createOrEditFindingReportDto = this.findingReport;
        this.input.findingReportLogDto = this.findingReportLog;

        //Finding Log Logic here

        this.input.findingReportLogDto.new_ActionResponseDate = this.findingReport.actionResponseDate;
        this.input.findingReportLogDto.new_CorrectiveActionResponse = "" + this.findingDetails;
        this.input.findingReportLogDto.new_ActualRootCause = "" + this.findingActualRootCause;
        this.input.findingReportLogDto.new_AuditorRemarks = this.findingReport.auditorRemark;
        this.input.findingReportLogDto.new_CAPAUpdateRequired = this.findingReport.capaUpdateRequired;
        this.input.findingReportLogDto.new_Title = this.findingReport.title;
        this.input.findingReportLogDto.new_DateClosed = this.findingReport.dateClosed;
        this.input.findingReportLogDto.new_DateFound = this.findingReport.dateFound;
        this.input.findingReportLogDto.new_Category = "" + this.findingReport.category;
        this.input.findingReportLogDto.new_FindingDetails = this.findingReport.otherCategoryName;
        this.input.findingReportLogDto.new_Reference = this.findingReport.reference;
        this.input.findingReportLogDto.new_Status = "" + this.findingReport.status;
        this.input.findingReportLogDto.updatedFieldName = "";
        if (this.input.findingReportLogDto.old_Title != this.input.findingReportLogDto.new_Title) {
            this.input.findingReportLogDto.createOrEditFlag = true;
            this.input.findingReportLogDto.updatedFieldName = this.input.findingReportLogDto.updatedFieldName + "Title";
        }
        if (this.input.findingReportLogDto.old_AuditorRemarks != this.input.findingReportLogDto.new_AuditorRemarks) {
            this.input.findingReportLogDto.createOrEditFlag = true;
            this.input.findingReportLogDto.updatedFieldName = this.input.findingReportLogDto.updatedFieldName + ",Auditor Remarks";
        }
        if (this.input.findingReportLogDto.old_CorrectiveActionResponse != this.input.findingReportLogDto.new_CorrectiveActionResponse) {
            this.input.findingReportLogDto.createOrEditFlag = true;
            this.input.findingReportLogDto.updatedFieldName = this.input.findingReportLogDto.updatedFieldName + ",Corrective Action Response";
        }
        if (this.input.findingReportLogDto.old_ActualRootCause != this.input.findingReportLogDto.new_ActualRootCause) {
            this.input.findingReportLogDto.createOrEditFlag = true;
            this.input.findingReportLogDto.updatedFieldName = this.input.findingReportLogDto.updatedFieldName + ",Actual Root Cause";
        }
        if (this.input.findingReportLogDto.old_Reference != this.input.findingReportLogDto.new_Reference) {
            this.input.findingReportLogDto.createOrEditFlag = true;
            this.input.findingReportLogDto.updatedFieldName = this.input.findingReportLogDto.updatedFieldName + ",Reference";
        }
        if (this.input.findingReportLogDto.old_FindingDetails != this.input.findingReportLogDto.new_FindingDetails) {
            this.input.findingReportLogDto.createOrEditFlag = true;
            this.input.findingReportLogDto.updatedFieldName = this.input.findingReportLogDto.updatedFieldName + ",Finding Details";
        }
        if (this.input.findingReportLogDto.old_ActionResponseDate != this.input.findingReportLogDto.new_ActionResponseDate) {
            this.input.findingReportLogDto.createOrEditFlag = true;
            this.input.findingReportLogDto.updatedFieldName = this.input.findingReportLogDto.updatedFieldName + ",Action Response Date";
        }
        if (this.input.findingReportLogDto.old_DateClosed != this.input.findingReportLogDto.new_DateClosed) {
            this.input.findingReportLogDto.createOrEditFlag = true;
            this.input.findingReportLogDto.updatedFieldName = this.input.findingReportLogDto.updatedFieldName + ",Date Closed";
        }
        if (this.input.findingReportLogDto.old_DateFound != this.input.findingReportLogDto.new_DateFound) {
            this.input.findingReportLogDto.createOrEditFlag = true;
            this.input.findingReportLogDto.updatedFieldName = this.input.findingReportLogDto.updatedFieldName + ",Date Found";
        }
        if (this.input.findingReportLogDto.old_CAPAUpdateRequired != this.input.findingReportLogDto.new_CAPAUpdateRequired) {
            this.input.findingReportLogDto.createOrEditFlag = true;
            this.input.findingReportLogDto.updatedFieldName = this.input.findingReportLogDto.updatedFieldName + ",CAPA Update Required";
        }
        if (this.input.findingReportLogDto.old_Category != this.input.findingReportLogDto.new_Category) {
            this.input.findingReportLogDto.createOrEditFlag = true;
            this.input.findingReportLogDto.updatedFieldName = this.input.findingReportLogDto.updatedFieldName + ",Category";
        }
        if (this.input.findingReportLogDto.old_Status != this.input.findingReportLogDto.new_Status) {
            this.input.findingReportLogDto.createOrEditFlag = true;
            this.input.findingReportLogDto.updatedFieldName = this.input.findingReportLogDto.updatedFieldName + ",Status";
        }

        this._findingReportsServiceProxy
            .createOrEdit(this.input)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l("SavedSuccessfully"));
                this.active = false;
                this.modal.hide();
                this.findingReport.controlRequirementId = null;
                this.modalSave.emit(null);
                if (this.backPage = false) {
                    this.modalSave.emit(null);
                }
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
        this.arrayCount = 0;
        this.isEdit1 = false;
    }

    isOtherCategorySelected() {
        return this.findingReport.category == FindingReportCategory.Other;
    }

    isInternal(): boolean {
        return this._router.url.includes("internal");
    }

    addAttachmentInputs() {
        this.attachedFileCodes.push(new AttachmentWithTitleDto());
    }

    deleteAttachmentInput(input) {      
        const self = this;
        this.attachmentfinding = [];
        self._fileDownloadService
            .removeAttachment(input)
            .subscribe(() => {
                this.arrayCount--;
                this.attachedFileCodes = this.attachedFileCodes.filter(
                    (item) => item != input
                );
                this.arrayCount--;
                this.notify.error("File removed Successfully");

                //const filteredData = this.checkAttachments.filter(item => !input.includes(item.id));
            });

        let arrList = this.checkAttachments.filter(item => item.code !== input);
        this.checkAttachments = arrList;       
    }

    uploadAttachment(event: any, attachment: AttachmentWithTitleDto) {

        var file = event.target.files[0];
        let formData: FormData = new FormData();
        formData.append("file", file, file.name);
        this.spinnerService.show();
        this._storageService.AddAttachment(formData).subscribe(
            res => {
                this.spinnerService.hide();
                attachment.code = res.result.code;
            },
            error => {
                console.log(error);
                this.spinnerService.hide();
                this.message.error(
                    "Please contact Admin to fix this.)!"
                );
            }
        );
    }

    initialiazeFindingUser(businessEntityId: number) {
        this._commonLookupServiceProxy.getBusinessEntityUser(businessEntityId).subscribe(res => {
            this.beAuditees = res;
        });
    }
    countChangedHandler(count: number) {
        this.arrayCount = count;
    }

   
}
