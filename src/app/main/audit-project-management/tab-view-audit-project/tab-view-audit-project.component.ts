import { Component, OnInit, Injector, AfterViewInit, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { AuditProjectServiceProxy, CommonLookupServiceProxy, AuditReportServiceProxy, BusinessEnityGroupWiesDto, BusinessEntitiesListDto, AuthoritativeDocumentDto, AuditProjectAuthoritativeDocumentDto, EntityGroupDto, EntityGroupsServiceProxy, AuditProjectDto, AuditProjectQuestionGroupDto, QuestionGroupListDto, DynamicNameValueDto, BusinessEntityUserDto, ExternalAssessmentsServiceProxy, AuthoritativeDocumentsServiceProxy, BusinessEntitiesServiceProxy, EntityType, GetBusinessEntitiesExcelDto, ContactsServiceProxy, CustomDynamicServiceProxy, AttachmentWithTitleDto, GetCountryForViewDto, CountriesServiceProxy, GetAuthoritativeDocumentForViewDto, BusinessEntityDto, ExtAssementScheduleServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { AppSessionService } from '../../../../shared/common/session/app-session.service';
import { StorageServiceProxy } from '../../../../shared/service-proxies/services/storage.service';
import { FileDownloadService } from '../../../../shared/utils/file-download.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HealthCareEntityModalComponent } from './health-care-entity-modal/health-care-entity-modal.component';
import { DataSharedService } from '../../../shared/common/data-shared/data-shared.service';
import * as moment from 'moment';


@Component({
    selector: 'tab-view-audit-project',
    templateUrl: './tab-view-audit-project.component.html',
})
export class TabViewAuditProjectComponent extends AppComponentBase implements OnInit {

    @Input('auditProId') auditProID: any;
    @Output() activeM = new EventEmitter();
    @Output() popupModal = new EventEmitter();
    @Output() hideSaveButton = new EventEmitter();
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('healthCareEntityPopupModal', { static: true }) healthCareEntityPopupModal: HealthCareEntityModalComponent;
    @Input('isStatusCheckAuditProject') isStatusCheckAuditProject: boolean;
    entityTypeId: number;
    entityTypeIds: number;
    onside: boolean = false;
    active = false;
    flag: boolean = true;
    attachedFileCodes = [];
    dataSource = [];
    uploadedFiles: any[] = [];
    questionGroup: QuestionGroupListDto[] = [];
    selectedQuestionGroup: QuestionGroupListDto[] = [];
    auditProject = new AuditProjectDto();
    auditTypes: DynamicNameValueDto[];
    auditStatus: DynamicNameValueDto[];
    auditAreas: DynamicNameValueDto[];
    auditNewStatus: DynamicNameValueDto[];
    capaStatus: DynamicNameValueDto[];
    AuditOutcomeReport: DynamicNameValueDto[];
    PaymentDetail: DynamicNameValueDto[];
    EvidenceSubmission: DynamicNameValueDto[];
    Evidencesharedstatus: DynamicNameValueDto[];
    OverallStatus: DynamicNameValueDto[];
    tempVariable: any;
    auditAgencyAdmins: BusinessEntityUserDto[] = [];
    beAuditees: BusinessEntityUserDto[] = [];
    selectedBeAuditees: BusinessEntityUserDto[] = [];
    @Output() closeModal = new EventEmitter();
    @Output() showsTab = new EventEmitter();
    @Output() showsAllTab = new EventEmitter();
    @Output() exAuditFinding = new EventEmitter();
    @Output() exAssessment = new EventEmitter();
    countriesLookUp: GetCountryForViewDto[];
    assessmentTypes: DynamicNameValueDto[];
    entityGroup: EntityGroupDto[] = [];
    businessEntitys: BusinessEntityDto[] = [];
    auditProjectBtn: boolean = true;
    auditee = [];
    auditeeTeam = [];
    auditorTeam = [];
    contactUsers = [];
    generalContacts = [];
    technicalContacts = [];
    primaryentityId: any;
    businessentity: BusinessEnityGroupWiesDto[] = [];
    selectedBusinessEntity: BusinessEnityGroupWiesDto[] = [];

    auditCompaniesLookUp: GetBusinessEntitiesExcelDto[] = [];
    authoritativeDocumentsLookUp: GetAuthoritativeDocumentForViewDto[];
    authoritavuieDocuments: AuthoritativeDocumentDto[];
    selectedAuthorativeDocuments: AuthoritativeDocumentDto[] = [];
    externalAuditFindingStatus: boolean;
    businessEntitiesLookUp: BusinessEntitiesListDto[] = [];

    businessEntities = [];
    dropdownDisabled = false;
    vendorId: any;
    selectedItem: number = 1;
    selectedvalue: any;
    auditProjectId: any;
    contactUsersGeneral = [];
    contactUsersTechnical = [];
    registerForm: FormGroup;
    userForm: FormGroup;
    isadminandExternalAdmin: boolean = false;
    isadminandBusinessentityAdmin: boolean = false;
    ischeckstatus: boolean = false;
    type: DynamicNameValueDto[] = [];
    showAuditstatusButton: boolean = false;
    //@Input('reauditPermission') reauditPermission: boolean;
    reauditPermission: boolean= false;
    maxDate = new Date();
    addTimeLineDays = new Date();
    IsAdmin: boolean;
    checkEetranalAuditor: boolean = false;
    constructor(_injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _auditServiceProxy: AuditProjectServiceProxy, private _commonlookupServiceProxy: CommonLookupServiceProxy, private _authoritativeDocumentsServiceProxy: AuthoritativeDocumentsServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy, private _customDynamicService: CustomDynamicServiceProxy,
        private _entityGroupServiceProxy: EntityGroupsServiceProxy,
        private _appSessionService: AppSessionService, private _contactsServiceProxy: ContactsServiceProxy, private _countriesServiceProxy: CountriesServiceProxy,
        private _router: Router, private _storageService: StorageServiceProxy, private _fileDownloadService: FileDownloadService,
        private _assementScheduleAppService: ExtAssementScheduleServiceProxy,
        private formBuilder: FormBuilder,
        private _auditreportProxy: AuditReportServiceProxy,
        private _dataSharedService: DataSharedService

    ) {
        super(_injector);
        this.selectedvalue = 1;
       
    }


    async ngOnInit() {

        //if (this._eventEmitterService.subsVar == undefined) {
        //    this._eventEmitterService.subsVar = this._eventEmitterService.
        //        invokeFirstComponentFunction.subscribe((name: string) => {
        //            this.firstFunction();
        //        });
        //}    

        this.ReauditPermissionCheck();
        this.IsAdmin = this.appSession.user.isAdmin;
        if (this.auditProID) {

        }       
        this.checkAdminandExternalAdmin();
        this.checkadminAndBusinessEntityAdmin();
        await this.getallOnInit();
        this.geteditAuditProject(this.auditProID);
        //this.getcheckstatus();

        this.showsAllTab.emit();
        this.checkType();
        this.userForm = this.formBuilder.group({
            firstName: [, Validators.required],
            lastName: [, Validators.required]
        });
    }
    getcheckstatus(auditProIDs) {
        this._auditServiceProxy.getCheckStatusAuditProject(auditProIDs).subscribe(res => {
            this.isStatusCheckAuditProject = res;

        })
    }

    checkType() {

        var checktype = this._appSessionService.user.type;
        switch (checktype) {
            case 0:
                {
                    this.showAuditstatusButton = true;
                    break;
                }
            case 1:
                {
                    this.showAuditstatusButton = false;
                    break;
                }
            case 2:
                {
                    this.showAuditstatusButton = true;
                    break;
                }
            case 3:
                {
                    this.showAuditstatusButton = true;
                    break;
                }
            case 4:
                {
                    this.showAuditstatusButton = false;
                    break;
                }
        }
    }

    getAuditProjectManager(id) {
        this.auditProID = id;
        this.geteditAuditProject(id);
    }
    checkauditProjectStatus() {
        this._auditServiceProxy.getCheckAuditProjectStatus(this.auditProID).subscribe(result => {
            this.ischeckstatus = result;
        })
    }
    sendnotification() {
        this._auditServiceProxy.setAuditStatusEntityNotify(this.auditProID).subscribe(result => {
            this.checkauditProjectStatus();
            abp.notify.success(this.l('Send Successfully'));
        })
    }

    checkAdminandExternalAdmin() {
        this._commonlookupServiceProxy.checkAdminAndExternalAuditorAdmin().subscribe(res => {
            
            this.isadminandExternalAdmin = res;
        })
    }

    checkadminAndBusinessEntityAdmin() {
        {
            this._commonlookupServiceProxy.checkAdminAndBusinessEntity().subscribe(res => {
                this.isadminandBusinessentityAdmin = res;
            })
        }
    }
    selectedTab() {
        this.selectedItem = 1;
    }


    keyDownFunction(event) {
        if (event.keyCode == 13) {

        }
    }
    selectTab(e) {
        this.selectedItem = e;
        if (e == 1) {
            this.hideSaveButton.emit(true);
        }
        else {
            this.hideSaveButton.emit(false);
        }
    }



    addDays(date: Date, days: number): Date {            
        date.setDate(date.getDate() + days);       
        return date;
    }
    

    onDayChange(event) {
        

        if (event != null) {
            if (this.auditProject.stageEndDate != null) {
                this.addTimeLineDays = this.addDays(new Date(Date.parse(this.auditProject.stageEndDate.toString())), 90)
                this.auditProject.daysTimeline = moment(this.addTimeLineDays);
            }
        }
        else {
            this.auditProject.daysTimeline = null;              
        }


    }
    async getallOnInit() {

        this.auditProjectId = this.auditProID;
        this.initializeTemplateType();
        this.initializationEntityGroup();
        this.initializeAuthoritativeDocumentLookUp();
        this.initializeAuditTypes();
        this.initializeAuditAreas();
        this.initializeAuditStatus();
        this.initializeAuditCompaniesLookUp();
        this.initializeCountriesForLookUp();
        this.initializeAssessmentTypes();
        //  this.initializeBusinessEntity();
        this.initializeNewAuditStatus();
        this.initializeCapaStatus();
        this.initializeAuditOutcomeReport();
        this.initializePaymentDetails();
        this.initializeOverallStatus();
        this.initializeEvidenceSubmissionTimeline();
        this.initializeEvidencesharedstatus();
    }


    initializeNewAuditStatus() {
        this._customDynamicService.getDynamicEntityDatabyName("Audit New Status")
            .subscribe(res => {

                this.auditNewStatus = res;
            });
    }

    initializeCapaStatus() {
        this._customDynamicService.getDynamicEntityDatabyName("CAPA Status")
            .subscribe(res => {

                this.capaStatus = res;
            });
    }

    initializeAuditOutcomeReport() {
        this._customDynamicService.getDynamicEntityDatabyName("Audit Outcome Report")
            .subscribe(res => {
                this.AuditOutcomeReport = res;
            });
    }

    initializePaymentDetails() {
        this._customDynamicService.getDynamicEntityDatabyName("Payment Details")
            .subscribe(res => {
                this.PaymentDetail = res;
            });
    }

    initializeOverallStatus() {
        this._customDynamicService.getDynamicEntityDatabyName("Overall Status")
            .subscribe(res => {
                this.OverallStatus = res;
            });
    }

    initializeEvidenceSubmissionTimeline() {
        this._customDynamicService.getDynamicEntityDatabyName("Evidence Submission Timeline")
            .subscribe(res => {
                this.EvidenceSubmission = res;
            });

    }

    initializeEvidencesharedstatus() {
        this._customDynamicService.getDynamicEntityDatabyName("Evidence shared status")
            .subscribe(res => {
                this.Evidencesharedstatus = res;
            });

    }


    async geteditAuditProject(auditProId)
    {       
        this.spinnerService.show();

        this.selectedBusinessEntity = [];
        if (auditProId > 0) {
            this.auditProjectId = auditProId;
            this.ReauditPermissionCheck();
            this._auditServiceProxy.getAuditProjectForEdit(auditProId).subscribe(async result => {
               
                this.auditProject = result;
                this.spinnerService.hide();
                this.checkauditProjectStatus();
                if (this.auditProject.entityGroupId != null) {
                    this.selectedvalue = 1;
                    this.auditProject.businessEntityIds = result.businessEntityIds;
                    this.editBusinessEntitys(this.auditProject.entityGroupId);
                }
                else {
                    this.selectedvalue = 2;
                    this.initializeBusinessEntitiesLookUp(result.entityType);
                }

                setTimeout(() => {
                    this.getallOnInit();
                }, 2000)
                this.auditProject.authoritativeDocumentIds = result.authoritativeDocumentIds;
                this.vendorId = this.auditProject.vendorId;
                await this.editdocuments();
                this.auditProject.auditProjectQuestionGroup = result.auditProjectQuestionGroup;
                this.attachedFileCodes = result.attachments;
                this.initializationQuestionGroup();
                this.generalContacts = result.generalContact;
                this.technicalContacts = result.technicalContact;
                if (result.entityGroupId != null) {
                    this.initializeContactUsers(result.entityGroupId, null);
                }
                else {
                    this.initializeContactUsers(null, result.businessEntityId);
                }
                if (this.auditProject.vendorId != null) {
                    this.loadVendorUsers(this.auditProject.vendorId);
                    this.loadEntityUsers(result.entityGroupId, result.id);
                }
                this.active = true;
                this.dropdownDisabled = true;
            });
        }
        else {

        }
        this.spinnerService.hide();
    }

    onItemChange(event, id) {

        switch (id) {
            case 1: {
                this.selectedvalue = 1;
                this.auditProject.businessEntityId = null;
                this.businessEntitiesLookUp = [];
                break;
            }
            case 2: {
                this.selectedvalue = 2;
                this.selectedBusinessEntity = [];
                this.businessEntitiesLookUp = [];
                this.auditProject.businessEntityId = null;
                this.auditProject.entityGroupId = null;
                this.spinnerService.show();
                this.businessEntitys = [];

                if (this.auditProject.id > 0) {
                    this.initializeBusinessEntitiesLookUp(EntityType.HealthcareEntity);
                    this.spinnerService.hide();
                }
                else {
                    this._businessEntitiesServiceProxy
                        .getAllExcludeMembers(EntityType.HealthcareEntity)
                        .subscribe(res => {
                            this.businessEntitiesLookUp = res;
                            this.spinnerService.hide();
                        });
                }
                break;
            }

            case 3:
                {

                    this.selectedvalue = 3;
                    this.selectedBusinessEntity = [];
                    this.businessEntitiesLookUp = [];
                    this.auditProject.entityGroupId = null;
                    this.auditProject.businessEntityId = null;
                    if (this.auditProject.id > 0) {
                        this.initializeBusinessEntitiesLookUp(EntityType.InsuranceFacilities);
                        this.spinnerService.hide();
                    }
                    else {
                        this._businessEntitiesServiceProxy
                            .getAllExcludeMembers(EntityType.InsuranceFacilities)
                            .subscribe(res => {
                                this.businessEntitiesLookUp = res;
                                this.spinnerService.hide();
                            });
                    }
                    //  this.initializeBusinessEntitiesLookUp(EntityType.InsuranceFacilities);
                    break;
                }

            default: {
                this.selectedvalue = 3;
                this.selectedBusinessEntity = [];
                this.businessEntitiesLookUp = [];
                this.auditProject.entityGroupId = null;
                this.auditProject.businessEntityId = null;
                // this.initializeBusinessEntitiesLookUp(EntityType.InsuranceFacilities);
                break;
            }
        }

        this.spinnerService.hide();

    }


    async editdocuments() {
        this.selectedAuthorativeDocuments = [];
        this.auditProject.authoritativeDocumentIds.forEach(obj => {

            this.authoritavuieDocuments.forEach(item => {
                if (item.id == obj) {
                    var items = new AuthoritativeDocumentDto();
                    items.id = item.id;
                    items.name = item.name;
                    items.authoratativeDocumentLogo = item.authoratativeDocumentLogo;
                    items.category = item.category;
                    items.categoryId = item.categoryId;
                    items.description = item.description;
                    items.code = item.code;
                    items.title = item.title;
                    items.departmentName = item.departmentName;
                    items.status = item.status;
                    this.selectedAuthorativeDocuments.push(items);
                }
            })

        })
    }

    initializationEntityGroup() {
        if (this.auditProject.id > 0) {
            this._entityGroupServiceProxy.getAllWithDeletedEntityGroupForLookUp().subscribe(res => {
                this.entityGroup = res;
            })
        }
        else {
            this._entityGroupServiceProxy.getAllEntityGroupForLookUp().subscribe(res => {
                this.entityGroup = res;
            })
        }

    }

    initializationQuestionGroup() {
        var authorativeDocuments = this.selectedAuthorativeDocuments.map(x => x.id);
        this._auditServiceProxy.getQuestionaryGroupAll(authorativeDocuments).subscribe(res => {
            this.questionGroup = res;
            //this.selectedQuestionGroup = res;
            // this.auditProject.auditProjectQuestionGroup = [];          
            if (this.auditProjectId > 0) {
                this.editquestionGroup();
            }
            else {
                this.selectedQuestionGroup = [];
            }
        })
    }

    questionGroupChange(event) {
        this.auditProject.auditProjectQuestionGroup = [];
        event.value.forEach(obj => {
            var item = new AuditProjectQuestionGroupDto();
            item.id = 0;
            item.auditProjectId = 0;
            item.questionGroupId = obj.id;
            this.auditProject.auditProjectQuestionGroup.push(item);
        })
    }

    editquestionGroup() {
        this.selectedQuestionGroup = [];
        this.auditProject.auditProjectQuestionGroup.forEach(obj => {
            this.questionGroup.forEach(team => {
                if (obj.questionGroupId == team.id) {
                    var temp = new QuestionGroupListDto();
                    temp.id = team.id;
                    temp.questionnaireTitle = team.questionnaireTitle;
                    this.selectedQuestionGroup.push(temp);
                }
            });
        });
    }

    initializeAuthoritativeDocumentLookUp() {
        // this.selectedAuthorativeDocuments = [];
        this.authoritavuieDocuments = [];
        this._authoritativeDocumentsServiceProxy.getallAuthorativeDocuments().subscribe(res => {
            this.authoritavuieDocuments = res;
        });
    }

    initializeBusinessEntitiesLookUp(type) {
        this.businessEntitiesLookUp = [];
        this._auditServiceProxy.getAuditReportEntity(this.auditProject.id)
            .subscribe(res => {
                this.businessEntitiesLookUp = res;
            });
    }

    initializeAuditTypes() {
        this._customDynamicService.getDynamicEntityDatabyName("External Assessment Types")
            .subscribe(res => {
                this.auditTypes = res;
            });
    }

    initializeTemplateType() {
        this._customDynamicService.getDynamicEntityDatabyName("Template Type")
            .subscribe(res => {
                this.type = res;
                let checkTemplate = this.type.find(x => x.name.trim().toLowerCase() == 'template'.trim().toLowerCase());
                let checkChecklist = this.type.find(x => x.name.trim().toLowerCase() == 'checklist'.trim().toLowerCase());
                if (checkTemplate != undefined) {
                    this.entityTypeId = this.type.find(x => x.name.trim().toLowerCase() == 'template'.trim().toLowerCase()).id;
                }
                if (checkChecklist != undefined) {
                    this.entityTypeIds = this.type.find(x => x.name.trim().toLowerCase() == 'checklist'.trim().toLowerCase()).id;
                }

            });
    }

    initializeCountriesForLookUp() {
        this._countriesServiceProxy.getallCountry().subscribe(res => {
            this.countriesLookUp = res;
        });
    }

    initializeAuditAreas() {
        this._customDynamicService.getDynamicEntityDatabyName("Audit Area")
            .subscribe(res => {
                this.auditAreas = res;
            });
    }

    initializeAuditStatus() {
        this._customDynamicService.getAuditStatus("Audit Status")
            .subscribe(res => {
                this.auditStatus = res;
            });
    }

    initializeAuditCompaniesLookUp() {
        this._businessEntitiesServiceProxy
            .getAllVendor(EntityType.ExternalAudit, false)
            .subscribe(res => {
                this.auditCompaniesLookUp = res;
            });
    }

    loadVendorUsers(vendorId) {
        this.spinnerService.show();
        this._businessEntitiesServiceProxy
            .getAllAuditAgencyAdmins(vendorId)
            .subscribe(res => {
                setTimeout(() => {
                    this.auditAgencyAdmins = res;
                    if (this.auditProject.auditorTeam != undefined) {
                        this.auditorTeam = this.auditAgencyAdmins.filter(a => this.auditProject.auditorTeam.find(u => u == a.id));
                    }
                    this.spinnerService.hide();
                }, 1000);
            }, err => {
                this.spinnerService.hide();
            });
    }

    async businessentitiyChange(event) {
        this.auditProject.businessEntityIds = [];

        event.value.forEach(obj => {
            this.auditProject.businessEntityIds.push(obj.id);
        })


    }

    initializeContactUsers(groupId?: any, businessEntityId?: any) {
        this._auditServiceProxy.getContactUsersint(groupId == null ? 0 : groupId, businessEntityId == null ? 0 : businessEntityId).subscribe(async res => {
            setTimeout(() => {
                this.contactUsersGeneral = res.filter(x => x.contactType == 'General Contacts');
                this.contactUsersTechnical = res.filter(x => x.contactType == 'Technical Contacts');
                if (this.auditProject.generalContact != undefined && this.auditProject.generalContact.length != 0) {
                    this.generalContacts = this.contactUsersGeneral.filter(a => this.auditProject.generalContact.find(u => u == a.id));
                }
                if (this.auditProject.technicalContact != undefined) {
                    this.technicalContacts = this.contactUsersTechnical.filter(a => this.auditProject.technicalContact.find(u => u == a.id));
                }
            }, 1000);
        })
    }


    loadEntityUsers(groupId?: any, auditProjectId?: any) {
        this._auditServiceProxy
            .getAuditProjetUsers(groupId == null ? 0 : groupId, auditProjectId)
            .subscribe(res => {
                setTimeout(() => {
                    this.beAuditees = res;
                    if (this.auditProject.auditee != undefined) {
                        this.auditee = this.beAuditees.filter(a => this.auditProject.auditee.find(u => u == a.id));
                    }
                    if (this.auditProject.auditeeTeam != undefined) {
                        this.auditeeTeam = this.beAuditees.filter(a => this.auditProject.auditeeTeam.find(u => u == a.id));
                    }
                    if (this.auditProject.id == undefined) {
                        this.initializeContactUsers(null, groupId);
                    }
                }, 1000);
            });
    }

    initializeAssessmentTypes() {
        this._assementScheduleAppService.getAssessmentTypes().subscribe(res => {
            this.assessmentTypes = res;
        });
    }

    initializeBusinessEntity() {
        this.spinnerService.show();
        this.businessEntitys = [];
        this._businessEntitiesServiceProxy
            .getAllExcludedEntityGroupMembers(EntityType.HealthcareEntity)
            .subscribe(res => {
                res.forEach(obj => {

                    var item = new BusinessEntityDto();
                    item.id = obj.businessEntity.id;
                    item.name = obj.businessEntity.name;
                    this.businessEntitys.push(item);
                });
                this.spinnerService.hide();
            });
    }

    onAddData() {
        this.dataSource.push(this.dataSource.length);
    }

    close(): void {
        this.auditProject = new AuditProjectDto();
        this.attachedFileCodes = [];
        this.auditee = [];
        this.auditeeTeam = [];
        this.generalContacts = [];
        this.technicalContacts = [];
        this.auditorTeam = [];
        this.countriesLookUp = [];
        this.selectedBusinessEntity = [];
        this.selectedQuestionGroup = [];
        this.selectedAuthorativeDocuments = [];

        this.active = false;
    }

    onEntityChange(id: number) {
        if (id != null) {
            this.flag = false;
            this.selectedBusinessEntity = [];
            this._businessEntitiesServiceProxy.getBusinessEntityGroupWies(id).subscribe(res => {
                this.businessentity = res;
            })
            if (this.auditProject.id == undefined) {
                this.initializeContactUsers(id, null);
            }
        }
        else {
            this.flag = true;
            this.selectedBusinessEntity = [];
            this.businessentity = [];
        }
    }

    editBusinessEntitys(entityGroupId: number) {
        this.selectedBusinessEntity = [];

        if (this.auditProject.id > 0) {
            this._businessEntitiesServiceProxy.getBusinessEntityWithGrouporNot(entityGroupId, this.auditProject.id).subscribe(res => {
                this.businessentity = res;
                if (this.businessentity != undefined) {
                    this.businessentity.forEach(obj => {
                        this.auditProject.businessEntityIds.forEach(item => {
                            if (obj.id == item) {
                                var items = new BusinessEnityGroupWiesDto();
                                items.id = obj.id;
                                items.companyName = obj.companyName;
                                items.entityGroupId = obj.entityGroupId;
                                items.extGenerated = obj.extGenerated;
                                items.entityType = obj.entityType;
                                this.selectedBusinessEntity.push(obj);
                            }
                        });
                    })
                }
            })
        }
        else {

            this._businessEntitiesServiceProxy.getBusinessEntityGroupWies(entityGroupId).subscribe(res => {
                this.businessentity = res;
                if (this.businessentity != undefined) {
                    this.businessentity.forEach(obj => {
                        this.auditProject.businessEntityIds.forEach(item => {
                            if (obj.id == item) {
                                var items = new BusinessEnityGroupWiesDto();
                                items.id = obj.id;
                                items.companyName = obj.companyName;
                                items.entityGroupId = obj.entityGroupId;
                                items.extGenerated = obj.extGenerated;
                                items.entityType = obj.entityType;
                                this.selectedBusinessEntity.push(obj);
                            }
                        });
                    })
                }
            })

        }
    }

    authDocumentChange(event) {
        this.auditProject.authDocuments = [];
        this.auditProject.authoritativeDocumentIds = [];
        event.value.forEach(obj => {
            var item = new AuditProjectAuthoritativeDocumentDto();
            item.id = 0;
            item.auditProjectId = 0;
            item.authoritativeDocumentId = obj.id;
            this.auditProject.authDocuments.push(item);
            this.auditProject.authoritativeDocumentIds.push(obj.id);
        })
        this.initializationQuestionGroup();
    }

    save() {

        this.spinnerService.show();
        if (this.auditProject.fiscalYear == undefined) {
            this.spinnerService.hide();
            return this.message.info("Please enter fiscal year");
        }
        else if (this.auditProject.auditTypeId == undefined) {
            this.spinnerService.hide();
            return this.message.info("Please select assessment Type");
        }
        else if (this.auditProject.auditStageId == undefined) {
            this.spinnerService.hide();
            return this.message.info("Please select audit type");
        }
        else if (this.selectedAuthorativeDocuments.length == 0) {
            this.spinnerService.hide();
            return this.message.info("Please select  authoritative documents");
        }
        else if (this.auditProject.auditTitle == undefined) {
            this.spinnerService.hide();
            return this.message.info("Please enter audit title ");
        }
        else if (this.auditProject.vendorId == undefined) {
            this.spinnerService.hide();
            return this.message.info("Please select audit services provider");
        }
        else if (this.auditProject.auditManagerId == undefined) {
            this.spinnerService.hide();
            return this.message.info("Please select audit admin/manager ");
        }
        // this.auditProject.assessmentTypeId = this.auditProject.auditStageId;
        this.auditProject.auditee = this.auditee.map(a => a.id);
        this.auditProject.auditeeTeam = this.auditeeTeam.map(a => a.id);
        this.auditProject.auditorTeam = this.auditorTeam.map(a => a.id);
        this.auditProject.generalContact = this.generalContacts.map(a => a.id);
        this.auditProject.technicalContact = this.technicalContacts.map(a => a.id);
        this.auditProject.attachments = this.attachedFileCodes.filter(e => e.code != "");
        if (this.selectedBusinessEntity.length > 0) {
            this.auditProject.businessEntityIds = [];
            this.auditProject.businessEntityIds = this.selectedBusinessEntity.map(
                item => item.id,
            );
        }
        else {
            this.auditProject.businessEntityIds = [];
            if (this.auditProject.businessEntityId != undefined) {
                this.auditProject.businessEntityIds.push(this.auditProject.businessEntityId);

            }
            else {
                this.spinnerService.hide();
                return this.message.info("please Select HealthCare Entity");

            }
        }
        if (this.auditProject.businessEntityIds.length == 0) {
            this.spinnerService.hide();
            return this.message.info("please Select HealthCare Entity");

        }
        this._auditServiceProxy.addUpdateAuditProject(this.auditProject).subscribe(res => {
            this.spinnerService.hide();
            abp.event.trigger('app.onAuditProjectAdded');
            abp.notify.success(this.l('SavedSuccessfully'));
          //this.auditProject = new AuditProjectDto();
          //this._dataSharedService.callFuction.next();
            if (this.auditProject.id == 0 || this.auditProject.id == undefined || this.auditProject.id == null) {
                this.modalSave.emit(null);
                this.closeModal.emit(false);                
            }
        });
    }
    addAttachmentInputs() {
        this.attachedFileCodes.push(new AttachmentWithTitleDto());
    }

    deleteAttachmentInput(input: AttachmentWithTitleDto) {
        const self = this;
        self._fileDownloadService.deleteAuditAttachment(input.code).subscribe(res => {
            this.attachedFileCodes = this.attachedFileCodes.filter(
                item => item != input
            );
            this.notify.success("File removed Successfully");
        });
    }

    downloadAttachment(code: string) {
        const self = this;
        self._fileDownloadService.downloadAuditAttachment(code);
    }

    uploadAttachment(event: any, attachment: AttachmentWithTitleDto) {
        var file = event.target.files[0];
        let formData: FormData = new FormData();
        formData.append("file", file, file.name);
        this.spinnerService.show();
        this._storageService.AddAuditAttachment(formData).subscribe(
            res => {
                this.spinnerService.hide();
                event.target.value = "";
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

    showTab(e) {
        this.showTabs(e);
    }

    showTabs(e) {
        this.showsTab.emit(e);
    }

    numberOnly(event): boolean {
        //const charCode = event.which ? event.which : event.keyCode;
        //if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        //    return false;
        //}
        //return true;


        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
            return false;
        }
        return true;

    }

    //Audit Project
    ReauditPermissionCheck() {
        this._commonlookupServiceProxy.getCurrentUserRoles().subscribe(
            (result) => {               
                var roleList = result.map(x => x.roleName);
                this._auditServiceProxy.reauditPermissionCkeker().subscribe(res => {
                    var isExist = res.find(x => x.id == this.auditProID);
                    var isExist = res.find(x => x.id == this.auditProID);
                    var isBEA = roleList.find(x => x.trim().toLowerCase() == "Business Entity Admin".trim().toLowerCase());
                    var isEAA = roleList.find(x => x.trim().toLowerCase() == "External Audit Admin".trim().toLowerCase());
                    var isEA = roleList.find(x => x.trim().toLowerCase() == "External Auditors".trim().toLowerCase());
                    var isIEA = roleList.find(x => x.trim().toLowerCase() == "Insurance Entity Admin".trim().toLowerCase());

                    if (isExist != undefined) {

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
                                    //  this.reauditPermission = this.appSession.user.isAuditer ? false : true;

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
                    else {
                        this.reauditPermission = false;
                       
                    }

                    if (this.appSession.user.isAdmin) {
                        this.reauditPermission = false;

                    }
                      
                                
                });
            });
    }

}
