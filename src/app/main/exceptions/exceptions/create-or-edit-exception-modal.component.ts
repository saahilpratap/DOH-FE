import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
    BusinessRiskDto,
    ControlRequirementDto,
    GetBusinessEntitiesExcelDto,
    BusinessEntitiesServiceProxy,
    BusinessEntityUserDto,    RemediationServiceProxy,
    ExceptionsServiceProxy,
    ExceptionTypesServiceProxy,
    CreateOrEditExceptionDto,
    ExceptionTypeDto,
    ControlRequirementsServiceProxy,
    BusinessRisksServiceProxy,
    ExceptionReviewStatus,
    AssessmentServiceProxy,
    EntityType,
    RemediationsDto,
    AttachmentWithTitleDto,
    UserServiceProxy,
    ExceptionRemediationDto,
    IRMRelationDto,
    IncidentsServiceProxy,
    FindingReportServiceProxy,
    DynamicNameValueDto,
    BusinessEntityDto,
    CustomDynamicServiceProxy,
    BusinessEntityWorkflowActorType
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/common/session/app-session.service";
import {
    StorageServiceProxy
} from "@shared/service-proxies/services/storage.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FileDownloadService } from "../../../../shared/utils/file-download.service";
import { FileUploadComponent } from "../../../shared/common/file-upload/file-upload.component";

@Component({
    selector: "createOrEditExceptionModal",
    templateUrl: "./create-or-edit-exception-modal.component.html",
    styleUrls: ["./create-or-edit-exception-modal.component.css"]
})
export class CreateOrEditExceptionModalComponent extends AppComponentBase
    implements OnInit {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(FileUploadComponent) fileUpload: FileUploadComponent;
    active = false;
    saving = false;
    selectedImpactedItems = [];
    selectedCompensatingItems = [];
    settings = {};
    exception = new CreateOrEditExceptionDto();
    reviewStatus: ExceptionReviewStatus;
    requestDate: string;
    requestorName: string;
    exceptionTypesLookUp: ExceptionTypeDto[] = [];
    businessRisksLookUp: BusinessRiskDto[] = [];
    controlRequirementLookUp = [];
    businessEntitiesLookUp: GetBusinessEntitiesExcelDto[] = [];
    beUsers: BusinessEntityUserDto[] = [];
    reviewStatuses = ExceptionReviewStatus;
    attachedFileCodes = [];
    authorityUsers = [];
    authorityapprover: BusinessEntityUserDto[] = [];
    inRemediationPlan: boolean;
    titles: string = 'Exceptions';
    itemList1 = [];
    selectedItems1 = [];
    remediation: RemediationsDto[] = [];
    remediationfilter: RemediationsDto[] = [];
    selectedRemediation: RemediationsDto[] = [];
    incidentsLookUp = [];
    findingReportLookup = [];
    selectedBusinessRisks = [];
    selectedIncidents = [];
    selectedFindingReports = [];
    criticalities: DynamicNameValueDto[];
    reviewPriority: DynamicNameValueDto[];
    isEdit: boolean = false;
    recordId: any;
    primarReviwerId = 0;
    primaryApproverId = 0;
    exceptionId: any;
    selectedItem: any;
    BusinessEntity: BusinessEntityDto[] = [];
    value: any[] = [];
    attachmentData: any;
    attachmentCode: AttachmentWithTitleDto[] = [];
    arrayCount: number = 0;
    entityapprovals: any;
    entityreviewers: any;
    authorityReviewers: any;
    authorityapprovers: any;
    pageId: any;
    beapprover: BusinessEntityUserDto[] = [];
    constructor(
        injector: Injector,
        private _remediationServiceProxy: RemediationServiceProxy,
        private _exceptionsServiceProxy: ExceptionsServiceProxy,
        private _exceptionTypesServiceProxy: ExceptionTypesServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _appSessionService: AppSessionService,
        private readonly _storageService: StorageServiceProxy,
        private readonly _assessmentService: AssessmentServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _controlRequirementProxy: ControlRequirementsServiceProxy,
        private _businessRiskProxy: BusinessRisksServiceProxy,
        private _router: Router, private _userServiceProxy: UserServiceProxy,
        private _findingReportsServiceProxy: FindingReportServiceProxy, private _customDynamicService: CustomDynamicServiceProxy,
        private _fileDownloadService: FileDownloadService, private _incidentsServiceProxy: IncidentsServiceProxy,
    ) {
        super(injector);
        this.titles = "Exceptions";
    }

    ngOnInit(): void {
        let exceptionId = this._activatedRoute.snapshot.queryParams["id"];
        if (!exceptionId) {
            this.isEdit = false;
            this.exception = new CreateOrEditExceptionDto();
            this.exception.businessEntityId = this._appSessionService.user.businessEntityId;
            this.exception.authorityIRMRelations = new IRMRelationDto();
            this.exception.entityIRMRelations = new IRMRelationDto();
            this.initializeBusinessEntitiesLookUp();
            this.initializeExceptionTypesLookUp();
            this.initializeReviewPriority();
            this.initializeCriticalities();
            this.exception.id = exceptionId;
            this.initializeAuthorityUsersLookUp();
            this.active = true;
            if (!this._appSessionService.isAuthorityUser) {
                this.initializeUsersLookUp();
            }
        }
        else {
            this.isEdit = true;
            this.pageId = 7;
            this.recordId = exceptionId;
            this._exceptionsServiceProxy
                .getExceptionForEdit(exceptionId)
                .subscribe(result => {
                    this.exception = result.exception;
                    this.exception.businessEntityId = this.exception.businessEntityId != undefined ? this.exception.businessEntityId : this._appSessionService.user.businessEntityId;
                    this.initializeAuthorityUsersLookUp();
                    this.initializeBusinessEntitiesLookUp();
                    this.initializeExceptionTypesLookUp();
                    this.initializeReviewPriority();
                    this.initializeCriticalities();
                    if (this.exception.authorityIRMRelations == undefined) {
                        this.exception.authorityIRMRelations = new IRMRelationDto();
                    }
                    if (this.exception.entityIRMRelations == undefined) {
                        this.exception.entityIRMRelations = new IRMRelationDto();
                    }
                    this.attachedFileCodes = result.attachments;
                    //this.exception.closeDate = (result.exception.closeDate);
                    //this.closedate1 = moment.utc(result.exception.closeDate);
                    //this.exception.detectionDateTime = moment.utc(result.exception.detectionDateTime);
                    this.active = true;
                    this.fileUpload.getData(result.attachments);
                });
        }
        this.show(exceptionId);
        this.settings = {
            singleSelection: false,
            text: "Select Control Requirements",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: 'Search Fields',
            enableSearchFilter: true,
            badgeShowLimit: 1,
            groupBy: "domainName",
            position: "bottom",
        };
        this.selectedItem = 1;
    }
    selectTab(e) {
        this.selectedItem = e;
    }

    initializeReviewPriority() {
        this._customDynamicService.getDynamicEntityDatabyName("Risk Critcality")
            .subscribe(res => {
                this.criticalities = res;
            });
    }

    initializeCriticalities() {
        this._customDynamicService.getDynamicEntityDatabyName("Review Priority")
            .subscribe(res => {
                this.reviewPriority = res;
            });
    }



    initializeExceptionTypesLookUp() {
        this._exceptionTypesServiceProxy.getAllForLookUp().subscribe(res => {
            this.exceptionTypesLookUp = res;
        });
    }

    initializeControlRequirements() {

        this._controlRequirementProxy.getControlRequirementList()
            .subscribe(result => {
                this.controlRequirementLookUp = result;

                if (this.exception.compensatingControlIds != undefined) {
                    this.selectedCompensatingItems = this.controlRequirementLookUp.filter(i => this.exception.compensatingControlIds.find(c => c == i.id));
                }
                if (this.exception.impactedControlRequirementIds != undefined) {
                    this.selectedImpactedItems = this.controlRequirementLookUp.filter(i => this.exception.impactedControlRequirementIds.find(c => c == i.id));
                }
            });
    }

    remediationLookup() {
        this._remediationServiceProxy.getAllRemediations().subscribe(res => {
            this.remediation = res;
            this.getRemediation();
            if (this.exception.selectedExceptionRemediations != undefined) {
                this.selectedRemediation = this.remediation.filter(b => this.exception.selectedExceptionRemediations.find(r => r == b.id));
            }
        })
    }

    getRemediation() {
        this.remediationfilter = [];
        this.remediation.forEach(obj => {
            if (obj.businessEntityId == this.exception.businessEntityId) {
                this.remediationfilter.push(obj);
            }
        })
    }

    initializeBusinessEntitiesLookUp() {
        this._businessEntitiesServiceProxy.getAllBusinessEntityType(EntityType.HealthcareEntity).subscribe(res => {
            this.BusinessEntity = res;
            this.exception.businessEntityId = this._appSessionService.user.businessEntityId == 0 ? this.exception.businessEntityId : this._appSessionService.user.businessEntityId;
            if (this.exception.businessEntityId > 0) {
                this.initializeBeLookUpFields(this.exception.businessEntityId);
            }
        });
    }

    initializeUsersLookUp() {
        this.exception.businessEntityId = this.exception.businessEntityId ?? this._appSessionService.user.businessEntityId;
        this.getRemediation();
        this.entityapprovals = [];
        this.entityreviewers = [];
        this._businessEntitiesServiceProxy.getAllApprovalUser(this.exception.businessEntityId).subscribe(res => {
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

    initializeAuthorityUsersLookUp() {
        this.authorityReviewers = [];
        this.authorityapprovers = [];
        this._businessEntitiesServiceProxy
            .getAuthorityUsers("Exceptions")
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

    initializeFindingReportsLookUp() {
        this.exception.businessEntityId = !this.exception.businessEntityId ? this._appSessionService.user.businessEntityId : this.exception.businessEntityId;;
        this._findingReportsServiceProxy
            .getAllForLookUp(this.exception.businessEntityId)
            .subscribe(res => {
                this.findingReportLookup = res;
                if (this.exception.relatedFindings != undefined) {
                    this.selectedFindingReports = this.findingReportLookup.filter(b => this.exception.relatedFindings.find(r => r == b.id));
                }
            });
    }

    initializeBusinessRisksLookUp() {
        this._businessRiskProxy.getAllForLookUp(this.exception.businessEntityId)
            .subscribe(res => {
                this.businessRisksLookUp = res;
                if (this.exception.exceptionRelatedBusinessRisks != undefined) {
                    this.selectedBusinessRisks = this.BusinessEntity.filter(b => this.exception.exceptionRelatedBusinessRisks.find(r => r == b.id));
                }
            });
    }

    initializeIncidentsLookUp() {
        this.exception.businessEntityId = !this.exception.businessEntityId ? this._appSessionService.user.businessEntityId : this.exception.businessEntityId;;
        this._incidentsServiceProxy
            .getAllForLookUp(this.exception.businessEntityId)
            .subscribe(res => {
                this.incidentsLookUp = res;
                if (this.exception.relatedIncidents != undefined) {
                    this.selectedIncidents = this.incidentsLookUp.filter(b => this.exception.relatedIncidents.find(r => r == b.id));
                }
            });
    }

    initializeBeLookUpFields(businessEntityId: Number) {
        if (businessEntityId != undefined) {
            this.spinnerService.show();
            this.beUsers = [];
            this.selectedRemediation = [];
            this.selectedBusinessRisks = [];
            this.selectedIncidents = [];
            this.selectedFindingReports = [];
            this.initializeUsersLookUp();
            this.initializeBusinessRisksLookUp();
            this.initializeFindingReportsLookUp();
            this.initializeIncidentsLookUp();
            this.remediationLookup();
            this.spinnerService.hide();
        }
    }

    show(exceptionId?: number): void {      
        this.active = true;
        this.isEdit = false;
        this.titles = 'Exceptions';


        if (!exceptionId) {
            this.initializeControlRequirements();
            this.exception = {} as any;
            this.exception.id = exceptionId;
            this.exception.businessEntityId = this._appSessionService.user.businessEntityId;
            this.exception.authorityIRMRelations = new IRMRelationDto();
            this.exception.entityIRMRelations = new IRMRelationDto();
            this.exception.impactedControlRequirementIds = [];
            this.initializeBusinessEntitiesLookUp();
            this.exception.compensatingControlIds = [];
            if (!this._appSessionService.isAuthorityUser) {
                this.initializeUsersLookUp();
                this.initializeBusinessRisksLookUp();
            }

        } else {
            this.isEdit = true;
            this.titles = "Exceptions";
            this.recordId = exceptionId;
            this.spinnerService.show();
            this._exceptionsServiceProxy
                .getExceptionForEdit(exceptionId)
                .subscribe(
                    result => {
                        this.exception = result.exception;
                        this.exception.businessEntityId = this.exception.businessEntityId != undefined ? this.exception.businessEntityId : this._appSessionService.user.businessEntityId;
                        this.attachedFileCodes = result.attachments;
                        this.initializeControlRequirements();
                        if (this.exception.authorityIRMRelations == undefined) {
                            this.exception.authorityIRMRelations = new IRMRelationDto();
                        }
                        if (this.exception.entityIRMRelations == undefined) {
                            this.exception.entityIRMRelations = new IRMRelationDto();
                        }
                        if (!this._appSessionService.isAuthorityUser) {
                            this.exception.businessEntityId = this._appSessionService.user.businessEntityId;

                        }
                        this.initializeBusinessEntitiesLookUp();
                        this.requestDate = result.requestedDate.toLocaleString();
                        this.requestorName = result.requestorName;
                        this.reviewStatus = result.reviewStatus;
                        this.exception.nextReviewDate = this.exception.nextReviewDate;
                        this.exception.approvedTillDate = this.exception.approvedTillDate;
                        this.spinnerService.hide();
                        this.fileUpload.getData(result.attachments);
                    },
                    error => {
                        this.spinnerService.hide();
                        this.message.error(
                            "Couldn't load exception at this time!"
                        );
                        this.close();
                    }
                );
        }
    }
    getAttachment(e) {
        this.attachmentData = e;
    }
    save(): void {       
        this.attachmentCode = [];
        if (this.attachmentData == undefined || this.attachmentData == 0) {
            this.saveData();
        }
        else {
            this.attachmentData.forEach(item => {                
                if (!item.code) {
                    let blob = new Blob([item], { type: item.extention });
                    let formData: FormData = new FormData();
                    formData.append("File", blob, item.name);
                    this.spinnerService.show();
                    this._storageService.AddAttachment(formData).subscribe(
                        res => {
                            this.arrayCount++;
                            this.spinnerService.hide();
                            let items = new AttachmentWithTitleDto();
                            items.code = res.result.code;
                            items.title = item.name;
                            this.attachmentCode.push(items);
                            if (this.attachmentData.length == this.arrayCount) {
                                this.saveData();
                            }
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
                    this.arrayCount++;
                }

            });            
        }
    }
    saveData(): void {
        this.saving = true; 
        this.exception.attachments = this.attachmentCode.filter(e => e.code != "");

        this.exception.exceptionRelatedBusinessRisks = this.selectedBusinessRisks.map(r => r.id);
        this.exception.relatedFindings = this.selectedFindingReports.map(r => r.id);
        this.exception.relatedIncidents = this.selectedIncidents.map(r => r.id);
        this.exception.selectedExceptionRemediations = this.selectedRemediation.map(r => r.id);
        this.exception.compensatingControlIds = this.selectedCompensatingItems.map(c => c.id);
        this.exception.impactedControlRequirementIds = this.selectedImpactedItems.map(i => i.id);
        if (this.exception.id != null) {

        }
        else {
            this.exception.authorityIRMRelations.authorityApprovers = this.authorityapprovers;
            this.exception.authorityIRMRelations.authorityReviewers = this.authorityReviewers;
            this.exception.entityIRMRelations.entityApprovers = this.entityapprovals;
            this.exception.entityIRMRelations.entityReviewers = this.entityreviewers;

        }
        this._exceptionsServiceProxy
            .createOrEdit(this.exception)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l("SavedSuccessfully"));
                this.close();
                this.modalSave.emit(null);
            });
    }
    delAttachment(i) {
        this.value.splice(i);
    }
    close(): void {
        this.active = false;
        this._router.navigate(["/app/main/exceptions/exceptions"]);
    }
    isBusinessEntityUser() {
        this.exception.businessEntityId = this._appSessionService.businessEntityId;

        // return !this._appSessionService.isAuthorityUser;
    }

    downloadAttachment(code: string) {
        const self = this;
        self._fileDownloadService.downloadAttachment(code);
    }

    addAttachmentInputs() {
        this.attachedFileCodes.push(new AttachmentWithTitleDto());
    }
    deleteAttachmentInput(input) {
        //this.attachedFileCodes = this.attachedFileCodes.filter(
        //    item => item != input
        //);
        const self = this;
        self._fileDownloadService
            .removeAttachment(input.code)
            .subscribe(() => {
                this.attachedFileCodes = this.attachedFileCodes.filter(
                    (item) => item != input
                );
                this.notify.success("File removed Successfully");
            });
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
