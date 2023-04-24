import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit, OnInit, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from "@shared/common/session/app-session.service";
import { finalize } from "rxjs/operators";
import { Router, ActivatedRoute } from '@angular/router';
import { GroupRelatedQuestionDto, SectionServiceProxy, SectionList, DomainTitleDto, SubDomainTitleDto, SectionTitleDto, QuestionGroupDto, GetAuthoritativeDocumentForViewDto, BusinessEntityUserDto, QuestionnaireType, ControlType, GroupType, ExternalRequirementQuestionDto, QuestionsServiceProxy, AuthoritativeDocumentsServiceProxy, GetBusinessEntitiesExcelDto, BusinessEntitiesServiceProxy, EntityType, GetFacilityTypeForViewDto, FacilityTypesServiceProxy, RequirementQuestionDto, DynamicNameValueDto, CustomDynamicServiceProxy, FacilityTypeDto, AuthoritativeDocumentDto, BusinessEntityDto, QuestionGroupServiceProxy } from "@shared/service-proxies/service-proxies";
import { DomSanitizer } from '@angular/platform-browser';
import { error } from '@angular/compiler/src/util';


@Component({
    selector: "create-edit-questionnaire-group",
    templateUrl: "./create-edit-questionnaire-group.component.html",

})
export class CreateEditQuestionnaireGroupComponent extends AppComponentBase implements OnInit {

    questionGroup = new QuestionGroupDto();
    relatedQuestions = new GroupRelatedQuestionDto();
    domainTitle: DomainTitleDto[] = [];
    subDominTitle: SubDomainTitleDto[] = [];
    sectionTitle: SectionTitleDto[] = [];

    authoritativeDocumentsLookUp: AuthoritativeDocumentDto[];
    auditCompaniesLookUp: BusinessEntityDto[] = [];
    allExternalQuestions: ExternalRequirementQuestionDto[] = [];
    allSection: SectionList[] = [];
    attachedExternalQuestions: ExternalRequirementQuestionDto[] = [];
    attachedallSection: SectionList[] = [];
    facilityTypesLookUp: FacilityTypeDto[];
    allInternalQuestions: RequirementQuestionDto[] = [];
    attachedInternalQuestions: RequirementQuestionDto[] = [];
    qTypes = [];
    controlTypes = [];
    gTypes = [];
    categories: DynamicNameValueDto[];
    questionnaireStage: DynamicNameValueDto[];
    authoritativeDocument = new AuthoritativeDocumentDto();
    auditCompany = new BusinessEntityDto();
    category = new DynamicNameValueDto();
    facilityType = new FacilityTypeDto();
    id: any;
    adId: number;

    saving = false;
    hideButton: any;
    hideButtons: any;
    constructor(
        injector: Injector, private _router: Router, private _sectionServiceProxy: SectionServiceProxy, private _questionsServiceProxy: QuestionsServiceProxy, private _facilityTypesProxy: FacilityTypesServiceProxy,
        private _authoritativeDocumentsServiceProxy: AuthoritativeDocumentsServiceProxy, private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy, private _questionsGRPServiceProxy: QuestionGroupServiceProxy, private _activatedRoute: ActivatedRoute
    ) {
        super(injector);
        this.id = this._activatedRoute.snapshot.queryParams['id'] || '';
        this.hideButton = this._activatedRoute.snapshot.queryParams['status'] || '';
        this.qTypes = [{ label: "Checklist", value: QuestionnaireType.Checklist },
        { label: "Questionnaire", value: QuestionnaireType.Questionnaire },
        { label: "Survey", value: QuestionnaireType.Survey }];

        this.controlTypes = [{ label: "Basic", value: ControlType.Basic },
        { label: "Transitional", value: ControlType.Transitional },
        { label: "Advanced", value: ControlType.Advanced }];

        this.gTypes = [{ label: "Internal", value: GroupType.Internal },
        { label: "External", value: GroupType.External }];
    }

    ngOnInit(): void {
        if (this.hideButton == "1")
            this.hideButtons = 1;
        else
            this.hideButtons = 0;
        if (!this.id) {
            this.questionGroup.groupType = GroupType.Internal;
            this.initializeInternalQuestions();
            this.initializeAuthoritativeDocumentLookUp();
            this.initializeFacilityTypesForLookUp();
            this.initializationQuestionnaireStage();
            this.initializeCategories();
            this.getTitile();
        } else {
            this.spinnerService.show();
            this._questionsGRPServiceProxy.getQuestionGroupForEdit(this.id).subscribe(result => {
              
                this.spinnerService.hide();
                this.questionGroup = result;
                if (this.questionGroup.groupType == 1) {
                    this.initializeInternalQuestions();
                } else {
                    this.allSection = [];
                    this._sectionServiceProxy.getAllSection().subscribe(res => {
                        this.allSection = res;
                        this.initializeExternalQuestions();
                    });
                  
                    this.initializeAuditCompaniesLookUp();
                }
                this.initializationQuestionnaireStage();
                this.initializeAuthoritativeDocumentLookUp();
                this.initializeFacilityTypesForLookUp();
                this.initializeCategories();
            }, error => {
                this.spinnerService.hide();
            });
        }
    }

    getTitile()
    {
        this.getDomain();
        this.getsubdomain();
        this.getsection();
    }
    getDomain() {
        this._questionsGRPServiceProxy.getDomainTitle().subscribe(res => {
            this.domainTitle = res;
        })
    }
    getsubdomain() {
        this._questionsGRPServiceProxy.getSubDomainTitle().subscribe(res => {
            this.subDominTitle = res;
        })
    }
    getsection() {
        this._questionsGRPServiceProxy.getSectionTitle().subscribe(res => {
            this.sectionTitle = res;
        })
    }

    initializeCategories() {
        this._customDynamicService.getDynamicEntityDatabyName("Questionnaire Category")
            .subscribe(res => {
                this.categories = res;
                if (this.id > 0) {
                    
                    let item = this.categories.filter(a => a.id == this.questionGroup.categoryId);
                    if (item.length > 0)
                    {
                        this.category = item[0];
                    }
                  
                }
            });
    }

    initializationQuestionnaireStage() {
        this._customDynamicService.getDynamicEntityDatabyName("Meeting Stage")
            .subscribe(res => {
                this.questionnaireStage = res;
            });
    }

    initializeAuthoritativeDocumentLookUp() {
        this._authoritativeDocumentsServiceProxy.getAllAuthoritativeDocument().subscribe(res => {
            this.authoritativeDocumentsLookUp = res.map(a => a.authoritativeDocument);
            if (this.id > 0) {
                let item = this.authoritativeDocumentsLookUp.filter(a => a.id == this.questionGroup.authoritativeDocumentId);
                if (item.length > 0) {
                    this.adId = item[0].id;
                }
               
            }
        });
    }

    initializeAuditCompaniesLookUp() {
        this._businessEntitiesServiceProxy
            .getAllForLookUp(EntityType.ExternalAudit, false)
            .subscribe(res => {
                this.auditCompaniesLookUp = res.map(b => b.businessEntity);
                if (this.id > 0) {
                    let item = this.auditCompaniesLookUp.filter(a => a.id == this.questionGroup.auditVendorId);
                    if (item.length > 0)
                    {
                        this.auditCompany = item[0];
                    }
                  
                }
            });
    }

    initializeFacilityTypesForLookUp() {
        this._facilityTypesProxy.getAllFacilityType().subscribe(res => {
            this.facilityTypesLookUp = res.map(f => f.facilityType);
            if (this.id > 0) {
                let item = this.facilityTypesLookUp.filter(a => a.id == this.questionGroup.facilityTypeID);
                if (item.length > 0)
                {
                    this.facilityType = item[0];
                }
               
            }
        });
    }

    getAllsections() {
        this.allSection = [];
        this._sectionServiceProxy.getAllSection().subscribe(res => {
            this.allSection = res;
          
        });
    }


    initializeExternalQuestions() {
        this.allInternalQuestions = [];
        this.allExternalQuestions = [];
      
        this.attachedallSection = [];
       
            if (this.id > 0) {
                this.questionGroup.groupRelatedQuestions.forEach(q => {
                  
                    let item = this.allSection.filter(e => e.sectionId == q.sectionId);
                    if (item.length > 0) {
                        this.attachedallSection.push(item[0]);
                    }
                });

                this.questionGroup.groupRelatedQuestions.forEach(q => {
                    let item = this.attachedallSection.filter(e => e.sectionId == q.sectionId);
                    if (item.length > 0) {
                        this.allSection.splice(this.allSection.findIndex(a => a.sectionId == item[0].sectionId), 1);
                    }
                });
            }
       
    }

    initializeInternalQuestions() {
        this.allExternalQuestions = [];
        this.allSection = [];
        this.allInternalQuestions = [];
        this._questionsServiceProxy.getAll("", undefined, 1000, 0).subscribe(res => {
            res.items.forEach(obj => {
                let item = new RequirementQuestionDto();
                item.questionId = obj.id;
                item.questionDescription = obj.description;
                this.allInternalQuestions.push(item);
            });

            if (this.id > 0) {
                this.questionGroup.groupRelatedQuestions.forEach(q => {
                    let item = this.allInternalQuestions.filter(e => e.questionId == q.questionId);
                    if (item.length > 0) {
                        this.attachedInternalQuestions.push(item[0]);
                    }
                });
                this.questionGroup.groupRelatedQuestions.forEach(q => {
                    let item = this.attachedInternalQuestions.filter(e => e.questionId == q.questionId);
                    if (item.length > 0) {
                        this.allInternalQuestions.splice(this.allInternalQuestions.findIndex(a => a.questionId == item[0].questionId), 1);
                    }
                });
            }
        });
    }

    showExternalData() {
        if (this.questionGroup.groupType == 2) {
            this.getAllsections();
            this.initializeAuditCompaniesLookUp();
            this.initializeExternalQuestions();
        } else {
            this.initializeInternalQuestions();
        }
    }

    Save(): void {
        if (this.adId == undefined) {
            this.saving = false;
            this.message.warn("Please Select Authoritative Document");
            return;
        } 
         
        this.questionGroup.authoritativeDocumentId = this.adId;
        this.questionGroup.auditVendorId = this.auditCompany.id;
        this.questionGroup.categoryId = this.category.id;
        this.questionGroup.facilityTypeID = this.facilityType.id;
        this.questionGroup.groupRelatedQuestions = [];
        if (this.questionGroup.groupType == 1) {
            if (this.attachedInternalQuestions.length == 0) {
                this.saving = false;
                this.message.warn("Please Select Questions to Add in Group");
                return;
            }
            this.attachedInternalQuestions.forEach(q => {
                let question = new GroupRelatedQuestionDto();
                question.questionGroupId = this.questionGroup.id;
                question.questionId = q.questionId;
                question.questionGroupId = this.questionGroup.id;
                this.questionGroup.groupRelatedQuestions = this.questionGroup.groupRelatedQuestions == undefined ? [] : this.questionGroup.groupRelatedQuestions;
                this.questionGroup.groupRelatedQuestions.push(question);
            });
        } else {
            if (this.attachedallSection.length == 0) {
                this.saving = false;
                this.message.warn("Please Select Questions to Add in Group");
                return;
            }
            if (this.auditCompany.id == undefined) {
                this.saving = false;
                this.message.warn("Please Select Audit Vendor");
                return;
            }
            this.attachedallSection.forEach(q => {
                let question = new GroupRelatedQuestionDto();
                question.questionGroupId = this.questionGroup.id;
                question.externalAssessmentQuestionId = null;
                question.questionGroupId = this.questionGroup.id;
                question.sectionId = q.sectionId;
                this.questionGroup.groupRelatedQuestions = this.questionGroup.groupRelatedQuestions == undefined ? [] : this.questionGroup.groupRelatedQuestions;
                this.questionGroup.groupRelatedQuestions.push(question);
            });
        }
        this.questionGroup.tenantId = this.appSession.tenantId;
        this.saving = true;
        this.spinnerService.show();
        this._questionsGRPServiceProxy.addOrUpdateQuestionGroup(this.questionGroup).subscribe(res => {
            this.saving = false;
            this.spinnerService.hide();
            this._router.navigate(['/app/main/questionnaire-group']);
        }, error => {
            this.saving = false;
            this.spinnerService.hide();
        });
    }

    back() {
        this._router.navigate(['/app/main/questionnaire-group']);
    }

}
