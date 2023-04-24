import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    Injectable,
    ɵConsole,
    OnInit,

    ElementRef
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
    IncidentsServiceProxy,
    ControlRequirementsServiceProxy,
    IncidentDto,
    GetBusinessEntitiesExcelDto,
    BusinessEntitiesServiceProxy,
    BusinessEntityUserDto,
    UserOriginType,
    FindingReportServiceProxy,
    CreateOrEditFindingReportDto,
    ExceptionDto,
    ExceptionsServiceProxy,
    FindingReportCategory,
    AssessmentServiceProxy,
    DynamicNameValueDto,
    FindingReportClassificationDto,
    FindingReportClassificationsServiceProxy,
    BusinessRisksServiceProxy,
    EntityType,
    RemediationsDto,
    RemediationServiceProxy,
    AttachmentWithTitleDto,
    UserServiceProxy,
    IRMRelationDto,
    CustomDynamicServiceProxy,
    ExternalAssessmentsServiceProxy,
    ReviewDataDto,
    FindingInputDto
} from "@shared/service-proxies/service-proxies";
import { Router, ActivatedRoute } from "@angular/router";
import { AppSessionService } from "@shared/common/session/app-session.service";
import {
    StorageServiceProxy
} from "@shared/service-proxies/services/storage.service";
import { FileDownloadService } from "../../../../../shared/utils/file-download.service";


export class ExtFindingInput {
    assessmentId: number;
    controlRequirementId: number;
    businessEntityId: number;
    vendorId: number;
    isReviewer: boolean;
    isApprover: boolean;
    isAuditor: boolean;
}





@Component({
    selector: 'addUpdateExtAssessmentData',
    templateUrl: './add-external-finding-assessment-modal.component.html',
    styleUrls: ['./add-external-finding-assessment-modal.component.css']
})
export class AddExternalFindingAssessmentModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('addUpdateExtAssessmentData', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("entityUserSignaturePad", { read: ElementRef }) entityUserSignaturePad: ElementRef;
    @ViewChild("authorityUserSignaturePad", { read: ElementRef }) authorityUserSignaturePad: ElementRef;
    auditCompaniesLookUp: GetBusinessEntitiesExcelDto[] = [];
    remediation: RemediationsDto[] = [];
    remediationfilter: RemediationsDto[] = [];
    selectedRemediation = [];
    isEdit: boolean;
    recordId: any;
    active = false;
    saving = false;
    itemList = [];
    selectedItems = [];
    settings = {};
    findingReport = new CreateOrEditFindingReportDto();
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
    findingReportId = 0;
    extfindingInput = new ExtFindingInput();
    input: FindingInputDto = new FindingInputDto();

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
        private _businessRiskService: BusinessRisksServiceProxy, private _userServiceProxy: UserServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
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
            .getAllForLookUp(EntityType.ExternalAudit, false)
            .subscribe(res => {
                this.auditCompaniesLookUp = res;
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
        if (this.findingReport.businessEntityId && this.findingReport.vendorId) {
            this._externalAssessmentService.getAllExternalAssessmentsByBE(this.findingReport.businessEntityId, this.findingReport.vendorId)
                .subscribe(res => {
                    this.assessmentsLookUp = res;
                });
        }
    }

    initializeBusinessEntitiesLookUp() {
        this._businessEntitiesServiceProxy.getAllForLookUp(EntityType.HealthcareEntity, false).subscribe(res => {
            this.businessEntitiesLookUp = res;
            if (this.findingReport.businessEntityId > 0) {
                this.initializeBeLookUpFields();
            }
        });
    }

    initializeAuthorityUsersLookUp() {
        this._userServiceProxy.getUsers(undefined, undefined, undefined, false, true, undefined, 1000, 0).subscribe(result => {
            this.authorityUsers = result.items;
            this.authorityUsers.forEach((u: any) => {
                u.fullname = u.name + " " + u.surname;
            });
        });
    }

    isBusinessEntityUser() {
        return (
            this._appSessionService.user.type ==
            UserOriginType.BusinessEntity ||
            this._appSessionService.user.type == UserOriginType.ExternalAuditor
        );
    }

    initializeUsersLookUp() {
        this._businessEntitiesServiceProxy
            .getAllUsers(this.findingReport.businessEntityId)
            .subscribe(res => {
                this.beUsers = res;
                let approver = this.beUsers.filter(a => this.businessEntitiesLookUp.find(b => b.businessEntity.primaryApproverId == a.id));
                if (approver.length > 0) {
                    this.primaryApproverId = approver[0].id;
                }
                let reviewer = this.beUsers.filter(a => this.businessEntitiesLookUp.find(b => b.businessEntity.primaryReviewerId == a.id));
                if (reviewer.length > 0) {
                    this.primarReviwerId = reviewer[0].id;
                }
            });
    }

    initializeAuditUsersLookUp() {
        this.initializeAssessmentLookUp();
        this._businessEntitiesServiceProxy
            .getAllUsers(this.findingReport.vendorId)
            .subscribe(res => {
                this.auditUsers = res;
            });
    }

    initializeBeLookUpFields() {
        this.spinnerService.show();
        this.selectedBusinessRisks = [];
        this.selectedExceptions = [];
        this.selectedIncidents = [];
        this.selectedRemediation = [];
        this.assessmentsLookUp = [];
        this.beUsers = [];
        if (this.extfindingInput.isApprover) {
            this.initializeBusinessRisksLookUp();
            this.initializeExceptionsLookUp();
            this.initializeIncidentsLookUp();
        }
        this.initializeUsersLookUp();
        this.initializeAssessmentLookUp();
        this.remediationLookup();
        this.spinnerService.hide();
    }

    downloadAttachment(code: string) {
        const self = this;
        self._fileDownloadService.downloadAttachment(code);
    }

    show(item: ExtFindingInput): void {
        this.extfindingInput = item;
        this.active = true;
        this.spinnerService.show();
        this._findingReportsServiceProxy.getExtAssessmentFindingReportForEdit(0, item.assessmentId, item.businessEntityId, item.controlRequirementId, item.vendorId)
            .subscribe(res => {
                if (!res.findingReport) {
                    this.findingReport = {} as any;
                    this.findingReport.authorityIRMRelations = new IRMRelationDto();
                    this.findingReport.entityIRMRelations = new IRMRelationDto();
                    this.findingReport.businessEntityId = item.businessEntityId;
                    this.findingReport.assessmentId = item.assessmentId;
                    this.findingReport.controlRequirementId = item.controlRequirementId;
                    this.findingReport.vendorId = item.vendorId;
                    this.initializeBusinessEntitiesLookUp();
                    this.initializeAuthorityUsersLookUp();
                    this.initializeControlRequirementsLookUp();
                    this.initializeClassificationsLookUp();
                    this.initializeAuditCompaniesLookUp();
                    this.initializeCriticalities();
                    this.initializeFindingStatus();
                    this.initializeAuditUsersLookUp();
                    this.findingReport.type = 2;
                    this.modal.show();
                } else {
                    this.findingReport = res.findingReport;
                    this.findingReport.type = 2;
                    this.findingReport.businessEntityId = item.businessEntityId;
                    this.findingReport.assessmentId = item.assessmentId;
                    this.findingReport.controlRequirementId = item.controlRequirementId;
                    this.findingReport.vendorId = item.vendorId;
                    this.initializeBusinessEntitiesLookUp();
                    this.initializeControlRequirementsLookUp();
                    this.initializeClassificationsLookUp();
                    this.initializeAuditCompaniesLookUp();
                    this.initializeCriticalities();
                    this.initializeAuthorityUsersLookUp();
                    this.initializeAuditUsersLookUp();
                    if (this.findingReport.authorityIRMRelations == undefined) {
                        this.findingReport.authorityIRMRelations = new IRMRelationDto();
                    }
                    if (this.findingReport.entityIRMRelations == undefined) {
                        this.findingReport.entityIRMRelations = new IRMRelationDto();
                    }
                    this.attachedFileCodes = res.attachments;
                    this.spinnerService.hide();
                    this.isEdit = true;
                    this.modal.show();
                }
                this.spinnerService.hide();
            }, err => {
                this.spinnerService.hide();
            });
    }

    save(): void {
        //if (
        //    this.findingReport.findingReportClassificationId == 0 ||
        //    this.findingReport.findingReportClassificationId == undefined
        //) {
        //    this.message.error("Choose Classification!");
        //    return;
        //}
        if (
            this.findingReport.controlRequirementId == 0 ||
            this.findingReport.controlRequirementId == undefined
        ) {
            this.message.error("Choose Control Requirement!");
            return;
        }
        this.findingReport.attachments = this.attachedFileCodes.filter(
            e => e.code != ""
        );

        this.saving = true;
        this.findingReport.relatedBusinessRisks = this.selectedBusinessRisks.map(r => r.id);
        this.findingReport.relatedExceptions = this.selectedExceptions.map(r => r.id);
        this.findingReport.relatedIncidents = this.selectedIncidents.map(r => r.id);
        this.findingReport.selectedFindingRemediations = this.selectedRemediation.map(r => r.id);
        this.input.createOrEditFindingReportDto = this.findingReport;

        this._findingReportsServiceProxy
            .createOrEdit(this.input)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l("SavedSuccessfully"));
                this.close();
            });
    }

    close(): void {
        this.spinnerService.hide();
        this.findingReport = new CreateOrEditFindingReportDto();
        this.modal.hide();
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

    deleteAttachmentInput(input: AttachmentWithTitleDto) {
        this.attachedFileCodes = this.attachedFileCodes.filter(
            item => item != input
        );
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
                    "Couldn't upload file at this time, try later :)!"
                );
            }
        );
    }
}
