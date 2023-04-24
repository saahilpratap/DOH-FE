import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    OnInit,
    Input,
    ElementRef
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import {
    IncidentsServiceProxy,
    CreateOrEditIncidentDto,
    GetIncidentForViewDto,
    GetBusinessEntitiesExcelDto,
    BusinessEntitiesServiceProxy,
    BusinessEntityUserDto,    RemediationsDto,
    RemediationServiceProxy,
    AssessmentServiceProxy,
    GetIncidentTypeForViewDto,
    GetIncidentImpactForViewDto,
    IncidentTypesServiceProxy,
    IncidentImpactsServiceProxy,
    EntityType,
    AttachmentWithTitleDto,
    IncidentRemediationDto,
    UserServiceProxy,
    IncidentStatus,
    IRMRelationDto,
    BusinessRisksServiceProxy,
    ExceptionsServiceProxy,
    FindingReportServiceProxy,
    BusinessEntityDto,
    BusinessEntityWorkflowActorType,
    CommonLookupServiceProxy
} from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/common/app-component-base";
import * as moment from "moment";
import { AppSessionService } from "@shared/common/session/app-session.service";
import {
    StorageServiceProxy
} from "@shared/service-proxies/services/storage.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FileDownloadService } from "../../../../shared/utils/file-download.service";
import { FileUploadComponent } from "../../../shared/common/file-upload/file-upload.component";

@Component({
    selector: "createOrEditIncidentModal",
    templateUrl: "./create-or-edit-incident-modal.component.html"
})
export class CreateOrEditIncidentModalComponent extends AppComponentBase implements OnInit {
    active = false;
    saving = false;
    @ViewChild("entityUserSignaturePad", { read: ElementRef }) entityUserSignaturePad: ElementRef;
    @ViewChild("authorityUserSignaturePad", { read: ElementRef }) authorityUserSignaturePad: ElementRef;
    @ViewChild(FileUploadComponent) fileUpload: FileUploadComponent;
    incidentStatus = IncidentStatus;
    incident = new CreateOrEditIncidentDto();
    incidentTypeLookUp = [];
    incidentImpactLookUp = [];
    businessEntitiesLookUp: GetBusinessEntitiesExcelDto[] = [];
    authorityapprover: BusinessEntityUserDto[] = [];
    beUsers: BusinessEntityUserDto[] = [];
    beUsersClosedBy: BusinessEntityUserDto[] = [];
    attachedFileCodes = [];
    authorityUsers = [];
    closedate1: any;
    remediation: RemediationsDto[] = [];
    remediationfilter: RemediationsDto[] = [];
    selectedRemediation: RemediationsDto[] = [];
    exceptionsLookUp = [];
    selectedBusinessRisks = [];
    findingReportLookup = [];
    selectedExceptions = [];
    selectedFindingReports = [];
    businessRisksLookUp = [];
    inRemediationPlan: boolean;
    BusinessEntity: BusinessEntityDto[] = [];
    beapprover: BusinessEntityUserDto[] = [];
    priorities = [{
        id: 1,
        name: 'Low'
    }, {
        id: 2,
        name: 'Medium'
    }, {
        id: 3,
        name: 'High'
    }, {
        id: 4,
        name: 'Very High'
    }];

    incidentStatuses = [{
        id: 1,
        name: 'New'
    }, {
        id: 2,
        name: 'NotAssigned'
    }, {
        id: 3,
        name: 'NotStarted'
    }, {
        id: 4,
        name: 'InProgress'
    }, {
        id: 5,
        name: 'UnderReview'
    }, {
        id: 6,
        name: 'Resolved'
    }];

    recordId: any;
    title = 'Incident';
    isEdit: boolean;
    primarReviwerId = 0;
    primaryApproverId = 0;
    value: any;
    attachmentData: any;
    attachmentCode: AttachmentWithTitleDto[] = [];
    arrayCount: number = 0;
    entityapprovals: any;
    entityreviewers: any;
    authorityReviewers: any;
    authorityapprovers: any;
    pageId: any;
    constructor(
        injector: Injector,
        private _remediationServiceProxy: RemediationServiceProxy,
        private _incidentsServiceProxy: IncidentsServiceProxy,
        private _incidentsTypesServiceProxy: IncidentTypesServiceProxy,
        private _incidentsImpactsServiceProxy: IncidentImpactsServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _appSessionService: AppSessionService,
        private _storageService: StorageServiceProxy, private _exceptionsServiceProxy: ExceptionsServiceProxy,
        private _router: Router, private _businessRiskService: BusinessRisksServiceProxy,
        private _activatedroute: ActivatedRoute, private _findingReportServiceProxy: FindingReportServiceProxy,
        private _assessmentService: AssessmentServiceProxy,
        private _fileDownloadService: FileDownloadService, private _userServiceProxy: UserServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy
    ) {
        super(injector);
    }


    remediationLookup() {
        this._remediationServiceProxy.getAllRemediations().subscribe(res => {
            this.remediation = res;
            if (this.incident.selectedIncidentRemediations != undefined) {
                this.selectedRemediation = this.remediation.filter(b => this.incident.selectedIncidentRemediations.find(r => r == b.id));
            }
            this.getRemediation();
        })
    }

    initializeIncidentTypesLookUp() {
        this._incidentsTypesServiceProxy.getAllForLookUp()
            .subscribe(res => {
                this.incidentTypeLookUp = res;
            });
    }

    initializeIncidentImpactsLookUp() {
        this._incidentsImpactsServiceProxy.getAllForLookUp()
            .subscribe(res => {
                this.incidentImpactLookUp = res;
            });
    }

    initializeBusinessEntitiesLookUp() {
        this._businessEntitiesServiceProxy.getAllBusinessEntityType(EntityType.HealthcareEntity).subscribe(res => {
            this.BusinessEntity = res;
            this.incident.businessEntityId = this._appSessionService.user.businessEntityId == 0 ? this.incident.businessEntityId : this._appSessionService.user.businessEntityId;
            if (this.incident.businessEntityId > 0) {
                this.initializeBeLookUpFields(this.incident.businessEntityId);
            }
        });
    }

    initializeUsersLookUp() {
        this.incident.businessEntityId = !this.incident.businessEntityId ? this._appSessionService.user.businessEntityId : this.incident.businessEntityId;
        this.getRemediation();
        this.entityapprovals = [];
        this.entityreviewers = [];
        this._businessEntitiesServiceProxy
            .getAllApprovalUser(this.incident.businessEntityId)
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
                        //this.beUsers = res;
                        //let approver = this.beUsers.filter(a => this.BusinessEntity.find(b => b.primaryApproverId == a.id));
                        //if (approver.length > 0) {
                        //    this.primaryApproverId = approver[0].id;
                        //}
                        //let reviewer = this.beUsers.filter(a => this.BusinessEntity.find(b => b.primaryReviewerId == a.id));
                        //if (reviewer.length > 0) {
                        //    this.primarReviwerId = reviewer[0].id;
                        //}
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

    getRemediation() {
        this.remediationfilter = this.remediation.filter(r => r.businessEntityId == this.incident.businessEntityId);
    }

    initializeBusinessRisksLookUp() {
        this._businessRiskService.getAllForLookUp(this.incident.businessEntityId)
            .subscribe(res => {
                this.businessRisksLookUp = res;
                if (this.incident.relatedBusinessRisks != undefined) {
                    this.selectedBusinessRisks = this.businessRisksLookUp.filter(b => this.incident.relatedBusinessRisks.find(r => r == b.id));
                }
            });
    }

    initialiazeIncidentClosedBy(businessEntityId: number) {
        this._commonLookupServiceProxy.getBusinessEntityUser(businessEntityId).subscribe(res => {
            this.beUsersClosedBy = res;
        });
    }

    initializeExceptionsLookUp() {
        this.incident.businessEntityId = !this.incident.businessEntityId ? this._appSessionService.user.businessEntityId : this.incident.businessEntityId;;
        this._exceptionsServiceProxy
            .getAllForLookUp(this.incident.businessEntityId)
            .subscribe(res => {
                this.exceptionsLookUp = res;
                if (this.incident.relatedExceptions != undefined) {
                    this.selectedExceptions = this.exceptionsLookUp.filter(b => this.incident.relatedExceptions.find(r => r == b.id));
                }
            });
    }

    initializeFindingReportsLookUp() {
        this.incident.businessEntityId = !this.incident.businessEntityId ? this._appSessionService.user.businessEntityId : this.incident.businessEntityId;;
        this._findingReportServiceProxy
            .getAllForLookUp(this.incident.businessEntityId)
            .subscribe(res => {
                this.findingReportLookup = res;
                if (this.incident.relatedFindings != undefined) {
                    this.selectedFindingReports = this.findingReportLookup.filter(b => this.incident.relatedFindings.find(r => r == b.id));
                }
            });
    }

    initializeAuthorityUsersLookUp() {
        this.authorityReviewers = [];
        this.authorityapprovers = [];
        this._businessEntitiesServiceProxy
            .getAuthorityUsers("Incidents")
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
        //this._userServiceProxy.getUsers(undefined, undefined, undefined, false, true, undefined, 1000, 0).subscribe(result => {
        //    this.authorityUsers = result.items;
        //    this.authorityUsers.forEach((u: any) => {
        //        u.fullname = u.name + " " + u.surname;
        //    });
        //});
    }

    downloadAttachment(code: string) {
        const self = this;
        self._fileDownloadService.downloadAttachment(code);
    }

    initializeBeLookUpFields(businessEntityId: number) {
        if (businessEntityId != undefined) {
            this.spinnerService.show();
            this.beUsers = [];
            this.selectedRemediation = [];
            this.selectedBusinessRisks = [];
            this.selectedExceptions = [];
            this.selectedFindingReports = [];
            this.initializeUsersLookUp();
            this.initializeBusinessRisksLookUp();
            this.initializeFindingReportsLookUp();
            this.initializeExceptionsLookUp();
            this.remediationLookup();
            this.spinnerService.hide();
            this.initialiazeIncidentClosedBy(businessEntityId);
        }
        else {
            this.beUsersClosedBy = [];
            this.incident.closedByUserId = null;
        }
    }

    ngOnInit() {
        let incidentId = this._activatedroute.snapshot.queryParams['incidentId'];
        if (!incidentId) {
            this.isEdit = false;
            this.incident = new CreateOrEditIncidentDto();
            this.incident.businessEntityId = this._appSessionService.user.businessEntityId;
            this.incident.authorityIRMRelations = new IRMRelationDto();
            this.incident.entityIRMRelations = new IRMRelationDto();
            this.initializeBusinessEntitiesLookUp();
            this.initializeIncidentImpactsLookUp();
            this.initializeIncidentTypesLookUp();
            this.incident.id = incidentId;
            this.initializeAuthorityUsersLookUp();
            this.active = true;
            if (!this._appSessionService.isAuthorityUser) {
                this.initializeUsersLookUp();
            }
        } else {
            this.isEdit = true;
            this.pageId = 8;
            this.recordId = incidentId;
            this._incidentsServiceProxy
                .getIncidentForEdit(incidentId)
                .subscribe(result => {
                    this.incident = result.incident;
                    this.incident.businessEntityId = this.incident.businessEntityId != undefined ? this.incident.businessEntityId : this._appSessionService.user.businessEntityId;
                    this.initializeAuthorityUsersLookUp();
                    this.initializeBusinessEntitiesLookUp();
                    this.initializeIncidentImpactsLookUp();
                    this.initializeIncidentTypesLookUp();
                    if (this.incident.authorityIRMRelations == undefined) {
                        this.incident.authorityIRMRelations = new IRMRelationDto();
                    }
                    if (this.incident.entityIRMRelations == undefined) {
                        this.incident.entityIRMRelations = new IRMRelationDto();
                    }                   
                    this.attachedFileCodes = result.attachments;
                    this.incident.closeDate = (result.incident.closeDate);
                    this.closedate1 = moment.utc(result.incident.closeDate);
                    this.incident.detectionDateTime = moment.utc(result.incident.detectionDateTime);
                    this.active = true;
                    this.fileUpload.getData(result.attachments);
                });
        }
    }


    getAttachment(e) {
        this.attachmentData = e;       
    }

    async save() {      
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
                    this._storageService.AddAuditAttachment(formData).subscribe(
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

    saveData() {
        if (
            this.incident.incidentImpactId == 0 ||
            this.incident.incidentImpactId == undefined
        ) {
            this.message.error("Select Incident Impact");
            return;
        }
        if (
            this.incident.incidentTypeId == 0 ||
            this.incident.incidentTypeId == undefined
        ) {
            this.message.error("Select Incident Type");
            return;
        }
        if (this.incident.closedByUserId == 0) {
            this.message.error("Choose Closed by User!");
            return;
        }
        this.saving = true;

        this.incident.attachments = this.attachmentCode.filter(e => e.code != "");

        this.incident.relatedBusinessRisks = this.selectedBusinessRisks.map(r => r.id);
        this.incident.relatedExceptions = this.selectedExceptions.map(r => r.id);
        this.incident.relatedFindings = this.selectedFindingReports.map(r => r.id);
        this.incident.selectedIncidentRemediations = this.selectedRemediation.map(r => r.id);
        if (this.incident.id != null) {

        }
        else {
            this.incident.authorityIRMRelations.authorityApprovers = this.authorityapprovers;
            this.incident.authorityIRMRelations.authorityReviewers = this.authorityReviewers;
            this.incident.entityIRMRelations.entityApprovers = this.entityapprovals;
            this.incident.entityIRMRelations.entityReviewers = this.entityreviewers;

        }
        this._incidentsServiceProxy
            .createOrEdit(this.incident)
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
    delAttachment(i) {
        this.value.splice(i);
    }
    close(): void {
        this.incident = {} as any;
        this.active = false;
        this._router.navigate(['/app/main/incidents/incidents']);
    }

    isBusinessEntityUser() {
        this.incident.businessEntityId = this._appSessionService.businessEntityId;
        //  return !this._appSessionService.isAuthorityUser;
    }

    addAttachmentInputs() {
        this.attachedFileCodes.push(new AttachmentWithTitleDto());
    }

    deleteAttachmentInput(input) {       
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
                this.message.error("Couldn't upload file at this time, try later :)!");
            }
        );
    }

}
