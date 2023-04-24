import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    OnInit
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import {
    BusinessRisksServiceProxy,
    CreateOrEditBusinessRiskDto,
    GetBusinessEntitiesExcelDto,
    BusinessEntitiesServiceProxy,
    AssessmentServiceProxy,
    EntityType,
    AttachmentWithTitleDto, 
    RemediationsDto,
    UserServiceProxy,
    IRMRelationDto,
    BusinessEntityUserDto,
    BusinessRiskRemediationDto,
    RemediationServiceProxy,
    BusinessEntityDto,
    FindingReportServiceProxy,
    IncidentsServiceProxy,
    CustomDynamicServiceProxy,
    ExceptionsServiceProxy,
    ControlRequirementsServiceProxy,
    DynamicNameValueDto,
    BusinessEntityWorkflowActorType,
    CommonLookupServiceProxy
} from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/common/app-component-base";
import * as moment from "moment";
import { AppSessionService } from "@shared/common/session/app-session.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
    StorageServiceProxy
} from "@shared/service-proxies/services/storage.service";
import { FileDownloadService } from "../../../../shared/utils/file-download.service";
import { FileUploadComponent } from "../../../shared/common/file-upload/file-upload.component";

@Component({
    selector: "createOrEditBusinessRiskModal",
    templateUrl: "./create-or-edit-businessRisk-modal.component.html"
})
export class CreateOrEditBusinessRiskModalComponent extends AppComponentBase implements OnInit {
    active = false;
    saving = false;
    itemList = [];
    selectedItems = [];
    settings = {};
    businessRisk = new CreateOrEditBusinessRiskDto();
    businessEntitiesLookUp: GetBusinessEntitiesExcelDto[] = [];
    attachedFileCodes = [];
    authorityUsers : BusinessEntityUserDto[] = [];
    authorityapprover :BusinessEntityUserDto[] = [];
    beUsers: BusinessEntityUserDto[] = [];
    beUsersOwnerManager: BusinessEntityUserDto[] = [];
    beapprover: BusinessEntityUserDto[] = [];
    title = 'BusinessRisk';
    remediation: RemediationsDto[] = [];
    remediationfilter: RemediationsDto[] = [];
    selectedRemediation: RemediationsDto[] = [];
    isEdit: boolean;
    recordId: any;
    incidentsLookUp = [];
    findingReportLookup = [];
    exceptionsLookUp = [];
    selectedExceptions = [];
    selectedIncidents = [];
    selectedFindingReports = [];
    selectedImpactedItems = [];
    selectedCompensatingItems = [];
    selectedMonitoringItems = [];
    controlRequirementLookUp = [];
    criticalities: DynamicNameValueDto[];
    riskTypes: DynamicNameValueDto[];
    riskLikelyHoods: DynamicNameValueDto[];
    riskImpacts: DynamicNameValueDto[];
    riskTreatments: DynamicNameValueDto[];
    primarReviwerId = 0;
    primaryApproverId = 0;
    BusinessEntity: BusinessEntityDto[] = [];
    value: any[] = [];
    attachmentData: any;
    attachmentCode: AttachmentWithTitleDto[] = [];
    arrayCount: number = 0;
    @ViewChild(FileUploadComponent) fileUpload: FileUploadComponent;
    BusinessEntityWorkflowActorType: BusinessEntityWorkflowActorType;
    authorityReviewers: any;
    authorityapprovers: any;
    pageId: any;
    entityapprovals: any;
    entityreviewers: any;
    constructor(
        injector: Injector,
        private _remediationServiceProxy: RemediationServiceProxy,
        private _businessRisksServiceProxy: BusinessRisksServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _appSessionService: AppSessionService,
        private _router: Router, private _controlRequirementProxy: ControlRequirementsServiceProxy,
        private _storageService: StorageServiceProxy,
        private _activatedRoute: ActivatedRoute, private _userServiceProxy: UserServiceProxy,
        private _assessmentService: AssessmentServiceProxy, private _fileDownloadService: FileDownloadService,
        private _findingReportsServiceProxy: FindingReportServiceProxy, private _customDynamicService: CustomDynamicServiceProxy,
        private _incidentsServiceProxy: IncidentsServiceProxy, private _exceptionsServiceProxy: ExceptionsServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    initializeCriticalities() {
        this._customDynamicService.getDynamicEntityDatabyName("Risk Critcality")
            .subscribe(res => {
                this.criticalities = res;
            });
    }

    initializeRiskImpacts() {
        this._customDynamicService.getDynamicEntityDatabyName("Risk Impact")
            .subscribe(res => {
                this.riskImpacts = res;
            });
    }

    initializeRiskLikelyHoods() {
        this._customDynamicService.getDynamicEntityDatabyName("Risk Likelihood")
            .subscribe(res => {
                this.riskLikelyHoods = res;
            });
    }

    initializeRiskTypes() {
        this._customDynamicService.getDynamicEntityDatabyName("Risk Type")
            .subscribe(res => {
                this.riskTypes = res;
            });
    }

    initializeRiskTreatments() {
        this._customDynamicService.getDynamicEntityDatabyName("Risk Treatment Selected")
            .subscribe(res => {
                this.riskTreatments = res;
            });
    }
   

    remediationLookup() {
        this._remediationServiceProxy.getAllRemediations().subscribe(res => {
            this.remediation = res;
            if (this.businessRisk.selectedBusinessRiskRemediations != undefined) {
                this.selectedRemediation = this.remediation.filter(b => this.businessRisk.selectedBusinessRiskRemediations.find(r => r == b.id));
            }
            this.getRemediation();
        })
    }

    initializeBusinessEntitiesLookUp() {
        this._businessEntitiesServiceProxy.getAllBusinessEntityType(EntityType.HealthcareEntity).subscribe(res => {
            this.BusinessEntity = res;

            this.businessRisk.businessEntityId = this._appSessionService.user.businessEntityId == 0 ? this.businessRisk.businessEntityId : this._appSessionService.user.businessEntityId;
            if (this.businessRisk.businessEntityId > 0) {
                this.initializeBeLookUpFields(this.businessRisk.businessEntityId);
            }
        });
    }

    initializeUsersLookUp() {
        this.getRemediation();
        this.entityapprovals = [];
        this.entityreviewers = [];
        this._businessEntitiesServiceProxy
            .getAllApprovalUser(this.businessRisk.businessEntityId)
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

    initializeAuthorityUsersLookUp() {
        this.authorityReviewers = [];
        this.authorityapprovers = [];
        this._businessEntitiesServiceProxy
            .getAuthorityUsers("Business Risks")
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
        this.businessRisk.businessEntityId = !this.businessRisk.businessEntityId ? this._appSessionService.user.businessEntityId : this.businessRisk.businessEntityId;;
        this._findingReportsServiceProxy
            .getAllForLookUp(this.businessRisk.businessEntityId)
            .subscribe(res => {
                this.findingReportLookup = res;
                if (this.businessRisk.relatedFindings != undefined) {
                    this.selectedFindingReports = this.findingReportLookup.filter(b => this.businessRisk.relatedFindings.find(r => r == b.id));
                }
            });
    }

    initialiazeBusinessRiskOwnerManager(businessEntityId: number) {
        this._commonLookupServiceProxy.getBusinessEntityUser(businessEntityId).subscribe(res => {
            this.beUsersOwnerManager = res;
        });
    }

    initializeIncidentsLookUp() {
        this.businessRisk.businessEntityId = !this.businessRisk.businessEntityId ? this._appSessionService.user.businessEntityId : this.businessRisk.businessEntityId;;
        this._incidentsServiceProxy
            .getAllForLookUp(this.businessRisk.businessEntityId)
            .subscribe(res => {
                this.incidentsLookUp = res;
                if (this.businessRisk.relatedIncidents != undefined) {
                    this.selectedIncidents = this.incidentsLookUp.filter(b => this.businessRisk.relatedIncidents.find(r => r == b.id));
                }
            });
    }

    initializeExceptionsLookUp() {
        this.businessRisk.businessEntityId = !this.businessRisk.businessEntityId ? this._appSessionService.user.businessEntityId : this.businessRisk.businessEntityId;;
        this._exceptionsServiceProxy
            .getAllForLookUp(this.businessRisk.businessEntityId)
            .subscribe(res => {
                this.exceptionsLookUp = res;
                if (this.businessRisk.relatedExceptions != undefined) {
                    this.selectedExceptions = this.exceptionsLookUp.filter(b => this.businessRisk.relatedExceptions.find(r => r == b.id));
                }
            });
    }

    initializeControlRequirements() {
        this._controlRequirementProxy.getControlRequirementList()
            .subscribe(result => {
                this.controlRequirementLookUp = result;
                if (this.businessRisk.selectedBusinessRisksCompensatingControls != undefined) {
                    this.selectedCompensatingItems = this.controlRequirementLookUp.filter(i => this.businessRisk.selectedBusinessRisksCompensatingControls.find(c => c == i.id));
                }
                if (this.businessRisk.selectedBusinessRisksImpactedControls != undefined) {
                    this.selectedImpactedItems = this.controlRequirementLookUp.filter(i => this.businessRisk.selectedBusinessRisksImpactedControls.find(c => c == i.id));
                }
                if (this.businessRisk.selectedBusinessRisksMonitoringControls != undefined) {
                    this.selectedMonitoringItems = this.controlRequirementLookUp.filter(i => this.businessRisk.selectedBusinessRisksMonitoringControls.find(c => c == i.id));
                }
            });
    }

    initializeBeLookUpFields(businessEntityId: number) {

        if (businessEntityId != undefined) {
            this.spinnerService.show();
            this.beUsers = [];
            this.selectedRemediation = [];
            this.selectedExceptions = [];
            this.selectedIncidents = [];
            this.selectedFindingReports = [];
            this.initializeUsersLookUp();
            this.initializeExceptionsLookUp();
            this.initializeFindingReportsLookUp();
            this.initializeIncidentsLookUp();
            this.remediationLookup();
            this.spinnerService.hide();
            this.initialiazeBusinessRiskOwnerManager(businessEntityId);
        }
        else {
            this.beUsersOwnerManager = [];
            this.businessRisk.riskOwnerId = null;
            this.businessRisk.riskManagerId = null;
        }
    }

    ngOnInit() {        
        let businessRiskId = this._activatedRoute.snapshot.queryParams['businessRiskId'];
        this.initializeCriticalities();
        this.initializeRiskTypes();
        this.initializeRiskLikelyHoods();
        this.initializeRiskTreatments();
        this.initializeRiskImpacts();
        if (!businessRiskId) {
            this.businessRisk = new CreateOrEditBusinessRiskDto();
            this.businessRisk.businessEntityId = this._appSessionService.user.businessEntityId;
            this.businessRisk.id = businessRiskId;
            this.businessRisk.authorityIRMRelations = new IRMRelationDto();
            this.businessRisk.entityIRMRelations = new IRMRelationDto();
            this.initializeBusinessEntitiesLookUp();
            this.initializeAuthorityUsersLookUp();
            this.businessRisk.identificationDate = moment().startOf("day");
          //  this.businessRisk.expectedClosureDate = moment().startOf("day");
            this.businessRisk.completionDate = moment().startOf("day");
            this.initializeControlRequirements();
            this.active = true;
        } else {
            this.isEdit = true;
            this.recordId = businessRiskId;
            this.pageId = 3;
            this._businessRisksServiceProxy
                .getBusinessRiskForEdit(businessRiskId)
                .subscribe(result => {
                    this.businessRisk = result.businessRisk;
                    this.businessRisk.businessEntityId = this.businessRisk.businessEntityId != undefined ? this.businessRisk.businessEntityId : this._appSessionService.user.businessEntityId;
                    this.initializeBusinessEntitiesLookUp();
                    this.initializeAuthorityUsersLookUp();
                    this.initializeControlRequirements();
                    if (this.businessRisk.authorityIRMRelations == undefined) {
                        this.businessRisk.authorityIRMRelations = new IRMRelationDto();
                    }
                    if (this.businessRisk.entityIRMRelations == undefined) {
                        this.businessRisk.entityIRMRelations = new IRMRelationDto();
                    }                  
                    this.attachedFileCodes = result.attachments;
                    this.active = true;                  
                    //this.fileUpload.getData(result.attachments);
                });
        }

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
    }

    onItemSelect(item: any) {
        console.log(item);
        console.log(this.selectedItems);
    }

    OnItemDeSelect(item: any) {
        console.log(item);
        console.log(this.selectedItems);
    }

    onSelectAll(items: any) {
        console.log(items);
    }

    onDeSelectAll(items: any) {
        console.log(items);
    }

    downloadAttachment(code: string) {
        const self = this;
        self._fileDownloadService.downloadAttachment(code);
    }

    getRemediation() {
        this.remediationfilter = this.remediation.filter(r => r.businessEntityId == this.businessRisk.businessEntityId);

    }

    getAttachment(e) {      
        this.attachmentData = e;
    }

    async save() {
        
        this.attachmentCode = [];
        if (this.attachmentData == undefined || this.attachmentData == 0 ) {
            this.saveData();        }
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
                            items.title = item.fileName;
                            this.attachmentCode.push(items);
                            if (this.attachmentData.length == this.arrayCount) {
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
                    this.arrayCount++;
                }
            });
            
        }
       
    }


    saveData(): void {
        this.saving = true;      
        this.businessRisk.attachments = this.attachmentCode.filter(e => e.code != "");
        this.businessRisk.relatedExceptions = this.selectedExceptions.map(r => r.id);
        this.businessRisk.relatedFindings = this.selectedFindingReports.map(r => r.id);
        this.businessRisk.relatedIncidents = this.selectedIncidents.map(r => r.id);
        this.businessRisk.selectedBusinessRiskRemediations = this.selectedRemediation.map(r => r.id);
        this.businessRisk.selectedBusinessRisksCompensatingControls = this.selectedCompensatingItems.map(c => c.id);
        this.businessRisk.selectedBusinessRisksImpactedControls = this.selectedImpactedItems.map(i => i.id);
        this.businessRisk.selectedBusinessRisksMonitoringControls = this.selectedMonitoringItems.map(c => c.id);
        if (this.businessRisk.id != null) {

        }
        else {
            this.businessRisk.authorityIRMRelations.authorityApprovers = this.authorityapprovers;
            this.businessRisk.authorityIRMRelations.authorityReviewers = this.authorityReviewers;
            this.businessRisk.entityIRMRelations.entityApprovers = this.entityapprovals;
            this.businessRisk.entityIRMRelations.entityReviewers = this.entityreviewers;

        }

        this._businessRisksServiceProxy
            .createOrEdit(this.businessRisk)
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

    close() {
        this.active = false;
        this._router.navigate(['/app/main/businessRisks/businessRisks']);
    }

    isBusinessEntityUser() {
        this.businessRisk.businessEntityId = this._appSessionService.businessEntityId;
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
    delAttachment(i) {
        this.value.splice(i);
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
