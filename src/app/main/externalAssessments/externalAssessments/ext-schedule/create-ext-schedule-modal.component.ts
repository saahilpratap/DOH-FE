import { AfterViewChecked, Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { GetAuthoritativeDocumentForViewDto, FacilitySubTypeServiceProxy, FacilityTypeDto, FacilitySubTypeDto, EntityGroupDto, EntityType, CustomDynamicServiceProxy, GetFacilityTypeForViewDto, FacilityTypesServiceProxy, AuthoritativeDocumentListDto, ExternalAssessmentScheduleEntityGroupDto, BusinessEntitiesListDto, AuthoritativeDocumentDto, BusinessEnityGroupWiesDto, EntityGroupsServiceProxy, DynamicNameValueDto, AssementScheduleServiceProxy, AuthoritativeDocumentsServiceProxy, ExternalAssessmentScheduleDto, GetBusinessEntitiesExcelDto, BusinessEntitiesServiceProxy, ExternalAssessmentScheduleDetailDto, CreateOrEditAssessmentInput, AssessmentServiceProxy, ExternalAssessmentsServiceProxy, ExtAssementScheduleServiceProxy, CreateOrEditExternalAssessmentDto, UserOriginType, BusinessEntityUserDto, BusinessEntityDto } from '../../../../../shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { AppSessionService } from '../../../../../shared/common/session/app-session.service';
import { Item } from 'angular2-multiselect-dropdown';
import { async } from 'rxjs/internal/scheduler/async';

require('twix');

@Component({
    selector: 'createExtScheduleModals',
    templateUrl: './create-ext-schedule-modal.component.html',
})
export class CreateExtScheduleModalComponent extends AppComponentBase {

    @ViewChild('createExtScheduleModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    readonly = false;
    scheduleActive = false;
    scheduleDetailActive = false;
    saving = false;
    facilityTypesLookUp: GetFacilityTypeForViewDto[];

    facility: FacilityTypeDto[] = [];

    selectedfacility: FacilityTypeDto[] = [];

    facilitySubType: FacilitySubTypeDto[] = [];
    selectedFacilitySubTyes: FacilitySubTypeDto[] = [];

    creationDateRange: Date;
    authoritativeDocumentsLookUp: GetAuthoritativeDocumentForViewDto[]=[];
    scheduleTypes: DynamicNameValueDto[]=[];
    assessmentTypes: DynamicNameValueDto[]=[];
    assementSchedule = new ExternalAssessmentScheduleDto();
    assementScheduleDetail = new ExternalAssessmentScheduleDetailDto();
    assessment: CreateOrEditExternalAssessmentDto = {} as any;
    businessEntitiesLookUp: BusinessEntityDto[];
    allBESelected: boolean = true;
    auditCompaniesLookUp: BusinessEntityDto[] = [];
    auditAgencyAdmins: BusinessEntityUserDto[] = [];
    entityGroup: EntityGroupDto[] = [];
    selectedEntityGroup: EntityGroupDto[] = [];

    businessentity: BusinessEnityGroupWiesDto[] = [];
    selectedBusinessEntity: BusinessEnityGroupWiesDto[] = [];

    authorativeDocument: AuthoritativeDocumentListDto[] = [];
    selectedauthorativeDocument: AuthoritativeDocumentListDto[] = [];

    businessEntitiesLookUps: BusinessEnityGroupWiesDto[] = [];
    selectedBusinessEntitys: BusinessEnityGroupWiesDto[] = [];

    externalAssessmentScheduleEntityGroup: ExternalAssessmentScheduleEntityGroupDto = new ExternalAssessmentScheduleEntityGroupDto();

    editBusinessEntity: BusinessEnityGroupWiesDto[] = [];
    tempEntity: BusinessEnityGroupWiesDto[] = [];

    facilities: DynamicNameValueDto[];
    
    subfaclility: DynamicNameValueDto[];

    selectedvalue: any;
    entitype: any;
    selectedEntitype = EntityType;
    flag: boolean=false;
    flaghealth: boolean=false;
    flaginsurance: boolean = false;
    facilityIds: any[] = [];
    facilitySubTypesId: any[] = [];
    flagfacilityType: boolean = false;



    constructor(
        injector: Injector, private _assementScheduleAppService: ExtAssementScheduleServiceProxy,
        private _authoritativeDocumentsServiceProxy: AuthoritativeDocumentsServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _facilityTypesProxy: FacilityTypesServiceProxy,
        private _facilitySubtypeServiceProxiy: FacilitySubTypeServiceProxy,
        private _entityGroupServiceProxy: EntityGroupsServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy,
        private _externalAssessmentService: ExternalAssessmentsServiceProxy,
        private _appSessionService: AppSessionService,
    ) {
        super(injector);
        this.readonly = false;
        this.saving = false;
        this.selectedvalue = 1;
        this.assessment.authoritativeDocumentIds = [];
        this.entitype = EntityType.ExternalAudit;
       // this.facility = FacilityTypeDto;
    }


    getInitilizationFacility()
    {
        this.facility = [];
        this._facilitySubtypeServiceProxiy.getFacilityAll().subscribe(res => {
            this.facility = res;                                                          
        });
    }


    async initilizationFacilitySubTypes()
    {
        this.facilitySubType = [];

        this._facilitySubtypeServiceProxiy.getAllFacilitysubTypesList(this.facilityIds).subscribe(res => {
            this.facilitySubType = res;
        });
    }


    async onfacilityChange()
    {
        
        this.facilityIds = [];
        this.facilitySubTypesId = [];
        this.selectedBusinessEntity = [];  
        this.facilityIds = this.selectedfacility.map(x => x.id);
        this.facilitySubTypesId = this.selectedFacilitySubTyes.map(x => x.id);
        await this.initilizationFacilitySubTypes();
           
        var temp = this.tempEntity;
        if (this.selectedvalue != 3) {

            temp.forEach(obj => {
                var object = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == false && _.includes(this.facilityIds, x.facilityTypeId) && _.includes(this.facilitySubTypesId, x.facilitySubTypeId));
                if (object == undefined) {
                 var    objecttrue = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == true && _.includes(this.facilityIds, x.facilityTypeId) && _.includes(this.facilitySubTypesId, x.facilitySubTypeId));
                    if (objecttrue != undefined) {
                        this.selectedBusinessEntity.push(obj);
                    }
                }
                else {

                    this.selectedBusinessEntity.push(obj);
                }

            });
        }
        else {
            temp.forEach(obj => {
                var object = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == false && _.includes(this.facilityIds, x.facilityTypeId) && _.includes(this.facilitySubTypesId, x.facilitySubTypeId));
                if (object == undefined) {
                    var objecttrue = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == true && _.includes(this.facilityIds, x.facilityTypeId) && _.includes(this.facilitySubTypesId, x.facilitySubTypeId));
                    if (objecttrue != undefined) {
                        this.selectedBusinessEntitys.push(obj);
                    }
                }
                else {

                    this.selectedBusinessEntitys.push(obj);
                }

            });
        }

    }

    onfacilitysubTypeChange($event) {
        this.facilityIds = [];
        this.facilitySubTypesId = [];
        this.facilityIds = this.selectedfacility.map(x => x.id);
        this.facilitySubTypesId = this.selectedFacilitySubTyes.map(x => x.id);      
        this.selectedBusinessEntity = [];
       // this.businessentity = [];
        var temp = this.tempEntity;
        if (this.selectedvalue != 3) {
            temp.forEach(obj => {
                var object = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == false && _.includes(this.facilityIds, x.facilityTypeId) && _.includes(this.facilitySubTypesId, x.facilitySubTypeId));
                if (object == undefined) {
                    var objecttrue = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == true && _.includes(this.facilityIds, x.facilityTypeId) && _.includes(this.facilitySubTypesId, x.facilitySubTypeId));
                    if (objecttrue != undefined) {

                        this.selectedBusinessEntity.push(obj);

                    }
                }
                else {

                    this.selectedBusinessEntity.push(obj);
                }

            });
        }
        else {
            temp.forEach(obj => {
                var object = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == false && _.includes(this.facilityIds, x.facilityTypeId) && _.includes(this.facilitySubTypesId, x.facilitySubTypeId));
                if (object == undefined) {
                    var objecttrue = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == true && _.includes(this.facilityIds, x.facilityTypeId) && _.includes(this.facilitySubTypesId, x.facilitySubTypeId));
                    if (objecttrue != undefined) {
                        this.selectedBusinessEntitys.push(obj);
                    }
                }
                else {

                    this.selectedBusinessEntitys.push(obj);
                }

            });
        }
    }

   async onItemChange(event, id) {
       ;
        switch (id) {
            case 1: {
                this.selectedvalue = 1;
                this.flagfacilityType = true;
                this.externalAssessmentScheduleEntityGroup.entityType = EntityType.ExternalAudit;
                this.businessEntitiesLookUps = [];
                this.selectedBusinessEntitys = [];
                this.businessentity = [];
                this.selectedBusinessEntity = [];
                this.selectedEntityGroup = [];
                this.facilitySubType = [];
                this.selectedFacilitySubTyes = [];                              
                this.initializationHealthAllEntity();
                this.getInitilizationFacility();
                break;
            }
            case 2: {
                this.selectedvalue = 2;
                this.flagfacilityType = false;
                this.externalAssessmentScheduleEntityGroup.entityType = EntityType.HealthcareEntity;
                this.selectedBusinessEntity = [];
                this.businessentity = [];
                this.selectedEntityGroup = [];
                this.facilitySubType = [];
                this.selectedFacilitySubTyes = [];
                this.getInitilizationFacility();
                break;
            }
            default: {
                this.selectedvalue = 3;
                this.flagfacilityType = true;
                this.selectedBusinessEntity = [];
                this.selectedEntityGroup = [];
                this.facilitySubType = [];               
                this.getInsuranceFacilityType();                           
                this.externalAssessmentScheduleEntityGroup.entityType = EntityType.InsuranceFacilities;
                this.getInsuranceEntity(EntityType.InsuranceFacilities);
                break;
            }
        }

    }

     getInsuranceFacilityType()
    {
         this.facility = [];
         this.selectedfacility = [];
        this._facilitySubtypeServiceProxiy.getFacilityAll().subscribe(async res => {
            res.forEach(obj => {
                if (obj.name == "Insurance Facility".toString()) {
                    this.facility.push(obj);
                }
            });
        });
    }


    getInsuranceEntity(type: EntityType) {
        this.businessEntitiesLookUps = [];
        this.tempEntity = [];
        this._businessEntitiesServiceProxy.getAllBusinessEntityByType(type).subscribe(res => {
            this.businessEntitiesLookUps = res;
            this.tempEntity = res;
        })


    }
  

    checkFacilityTypeInsurance(facilityId: any)
    {        
        this.selectedBusinessEntitys = [];
        var temp = this.tempEntity;
        temp.forEach(obj => {
            var object = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == false && x.facilityTypeId == facilityId);
            if (object == undefined) {
                var objecttrue = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == true);
                if (objecttrue == undefined) {
                    if (obj.facilityTypeId == facilityId) {
                        this.selectedBusinessEntitys.push(obj);
                    }                  
                }
            }
            else
            {               
                this.selectedBusinessEntitys.push(obj);
            }

        });
    }

    checkFacility(facilityId: any) {
        this.selectedBusinessEntity = [];
        var temp = this.tempEntity;
        temp.forEach(obj => {
            var object = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == false && x.facilityTypeId == facilityId);
            if (object == undefined) {
                var objecttrue = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == true);
                if (objecttrue == undefined) {
                    if (obj.facilityTypeId == facilityId) {
                        this.selectedBusinessEntity.push(obj);
                    }
                    // this.businessentity.push(obj);

                }
            }
            else {
                //  this.businessentity.push(obj);

                this.selectedBusinessEntity.push(obj);
            }

        });

    }


    editinitializeBusinessEntitiesLookUps()
    {
        
        var temp = this.businessEntitiesLookUps;
        this.businessEntitiesLookUps = [];
        this.selectedBusinessEntitys = [];
        this.tempEntity = [];
        temp.forEach(obj => {
            
            var object = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == false);
            if (object == undefined) {
                var objecttrue = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == true);
                if (objecttrue == undefined) {
                   
                    this.businessEntitiesLookUps.push(obj);
                    this.tempEntity.push(obj);
                }
            }
            else {
                
                this.tempEntity.push(obj);
                //this.selectedBusinessEntitys.push(obj);
                this.businessEntitiesLookUps.push(obj);
              
            }
        });


    }

    initializationEntityGroup() {
        this._entityGroupServiceProxy.getAllEntityGroupForLookUp().subscribe(res => {
            this.entityGroup = res;
        })
    }

    SaveEntity()
    {
        
        if (this.externalAssessmentScheduleEntityGroup.entityType == undefined)
        {
            this.externalAssessmentScheduleEntityGroup.entityType = EntityType.ExternalAudit;
        }      
        this.externalAssessmentScheduleEntityGroup.extGenerated = false;

        
        if (this.selectedBusinessEntity.length > 0) {
            this.externalAssessmentScheduleEntityGroup.businessEnityies = this.selectedBusinessEntity;
        }
        else {
            this.externalAssessmentScheduleEntityGroup.businessEnityies = [];
            this.selectedBusinessEntitys.forEach(obj => {
                var items = new BusinessEnityGroupWiesDto();
                items.id = obj.id;
                items.entityGroupId = obj.entityGroupId;
                this.externalAssessmentScheduleEntityGroup.businessEnityies.push(items);
            });
        }
        if (this.externalAssessmentScheduleEntityGroup.businessEnityies.length == 0)
        {
            abp.message.warn("Please Select Entity");
            return;
        }
        this._assementScheduleAppService.addorUpdateExternalAssessmentScheduleEntityGroup(this.externalAssessmentScheduleEntityGroup).subscribe(result =>
        {
            this.saving = false;
            this.notify.info(this.l("SavedSuccessfully"));
            this.selectedBusinessEntity = [];
            this.selectedBusinessEntitys = [];
            this.selectedEntityGroup = [];          
            this.modalSave.emit();
            this.close();
            
        })
    }
    
    selectedDocument()
    {     
        this.assementSchedule.authoritativeDocumentIds = [];
        this.selectedauthorativeDocument.forEach(obj =>
        {
            
            this.assementSchedule.authoritativeDocumentIds.push(obj.id);
        });

    }

    async initializationHealthAllEntity() {
        this.businessentity = [];
        this.selectedBusinessEntity = [];
        this.tempEntity = [];
        this._businessEntitiesServiceProxy.getAllBusinessEntityswithFacilityType().subscribe(res => {
            this.businessentity = res;
            res.forEach(obj => {
                this.tempEntity.push(obj);
            });
           
        });
    }

    editAllentity() {
        this._businessEntitiesServiceProxy.getAllBusinessEntityswithFacilityType().subscribe(res => {

            var temp = res;
            this.businessentity = [];
            this.tempEntity = [];
            this.selectedBusinessEntity = [];

            if (temp != null) {
                temp.forEach(obj => {
                    var object = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == false);
                    if (object == undefined) {
                        var objecttrue = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == true);
                        if (objecttrue == undefined) {
                            this.businessentity.push(obj);
                            this.tempEntity.push(obj);
                            // this.selectedBusinessEntity.push(obj);
                        }
                    }
                    else {
                        this.businessentity.push(obj);
                        this.tempEntity.push(obj);
                        this.selectedBusinessEntity.push(obj);
                    }
                });
            }
            else {
                this.businessentity = [];
            }
        });
    }

    //editAllentity()
    //{
    //    var temp = this.businessentity;
    //    this.businessentity = [];
    //    this.tempEntity = [];       
    //    this.selectedBusinessEntity = [];
    //    temp.forEach(obj => {
    //        var object = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == false);
    //        if (object == undefined) {
    //            var objecttrue = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == true);
    //            if (objecttrue == undefined) {
    //                this.businessentity.push(obj);
    //                this.tempEntity.push(obj);
    //               // this.selectedBusinessEntity.push(obj);
    //            }
    //        }
    //        else {

    //            this.businessentity.push(obj);
    //            this.tempEntity.push(obj);
    //            this.selectedBusinessEntity.push(obj);
    //        }
    //    });
    //}

    onEntityChange(event)
    {
        if (this.selectedEntityGroup.length > 0) {
            var entityGroupId = this.selectedEntityGroup.map(x => x.id);
            this.selectedBusinessEntity = [];
            this.businessentity = [];
            this.tempEntity = [];
            this.flagfacilityType = true;
            this._businessEntitiesServiceProxy.getBusinessEntityOFMultipleGroup(entityGroupId).subscribe(res => {
                this.businessentity = res;
                var temp = this.businessentity;
                this.businessentity = [];
                temp.forEach(obj => {
                    var object = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == false);
                    if (object == undefined) {
                        var objecttrue = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == true);
                        if (objecttrue == undefined) {
                            this.tempEntity.push(obj);
                            this.businessentity.push(obj);
                          //  this.selectedBusinessEntity.push(obj);
                        }
                    }
                    else {
                        this.tempEntity.push(obj);
                        this.businessentity.push(obj);
                        this.selectedBusinessEntity.push(obj);
                    }

                });


                //temp.forEach(obj => {               
                //    var object = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == false);            
                //    if (object == undefined)
                //    {
                //        object = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == true);
                //        if (object == undefined) {
                //            this.businessentity.push(obj);
                //            this.selectedBusinessEntity.push(obj);
                //        }                   
                //    }
                //    else {
                //       // this.businessentity.push(obj);
                //       // this.selectedBusinessEntity.push(obj);
                //    }

                //});  

            });

        }
        else {
            this.selectedfacility = [];
            this.selectedFacilitySubTyes = [];
            this.flagfacilityType = false;
            this.selectedBusinessEntity = [];
            this.businessentity = [];
            this.tempEntity = [];
        }
    }

    initializeAuthoritativeDocumentLookUp() {
       
        this.authorativeDocument = [];
        this._authoritativeDocumentsServiceProxy.getAllAuthorativeDocument().subscribe(res => {
            this.authorativeDocument = res;

            if (this.assementSchedule.authoritativeDocumentIds != undefined) {
                this.editAuthDocuementd();
            }
                                            
        });
    }

    editAuthDocuementd() {
        this.selectedauthorativeDocument = [];
        this.assementSchedule.authoritativeDocumentIds.forEach(id => {
            this.authorativeDocument.forEach(obj => {
                if (obj.id == id) {
                    this.selectedauthorativeDocument.push(obj);
                }
            })
        })
    }

    editDocuments()
    {
        this.selectedauthorativeDocument = [];
        this.assementScheduleDetail.authoritativeDocumentIds.forEach(id => {
            this.authorativeDocument.forEach(obj =>
            {            
                if (obj.id == id)
                {                    
                    this.selectedauthorativeDocument.push(obj);
               }
           })
        })
    }

    initializeScheduleTypes() {
        this._assementScheduleAppService.getScheduleTypes().subscribe(res => {
            this.scheduleTypes = res;
        });
    }

    initializeAssessmentTypes() {
        this._assementScheduleAppService.getAssessmentTypes().subscribe(res => {
            this.assessmentTypes = res;
        });
    }

    initializeBusinessEntitiesLookUp() {
        this._businessEntitiesServiceProxy.getAllAuditablesForLookUp(EntityType.HealthcareEntity)
            .subscribe(res => {
               
                this.businessEntitiesLookUp = res.map(
                    item => item.businessEntity
                );
            });
    }

    initializeAuditCompaniesLookUp()
    {
        this._businessEntitiesServiceProxy
            .getAllVendors(EntityType.ExternalAudit, false)
            .subscribe(res => {
                this.auditCompaniesLookUp = res;
              
            });
    }

    onVendorChange(businessEntityId: number) {
        
        if (businessEntityId > 0 && businessEntityId!=null) {
            this.auditAgencyAdmins = [];
            this.spinnerService.show();
            this._businessEntitiesServiceProxy
                .getAllAuditAgencyAdmins(businessEntityId)
                .subscribe(res => {
                    if (res.length > 0) {
                        this.auditAgencyAdmins = res;
                    } else {
                        this.message.warn("This vendor does not have any External Audit Admin,Please select other vendor");
                    }
                    this.spinnerService.hide();
                });
        }
        else {
            this.auditAgencyAdmins = [];
            this.assementScheduleDetail.vendorId = null;
            this.assementScheduleDetail.auditAgencyAdminId = null;
        }
    }

    show(input?: ExternalAssessmentScheduleDto): void {
        
      this.assementSchedule = new ExternalAssessmentScheduleDto()
        this.assementSchedule.authoritativeDocumentIds = [];
        this.initializeAuthoritativeDocumentLookUp();
        this.initializeScheduleTypes();
        this.initializeAssessmentTypes();
        
        this.scheduleActive = true;
        if (input != undefined) {
            this.initializeBusinessEntitiesLookUp();
            this.assementSchedule = input;
            
            this.readonly = true;
        }
        this.modal.show();
    }

    showScheduleDetails(input?: ExternalAssessmentScheduleDetailDto)
    {
       
        this.spinnerService.show();
        this.selectedBusinessEntity = [];
        this.selectedBusinessEntitys = [];
        this.selectedEntityGroup = [];
        this.auditAgencyAdmins = [];
        this._assementScheduleAppService.getAllBusinessEntityByScheduleId(input.id).subscribe(async result => {
          
            this.editBusinessEntity = result;          
            this.externalAssessmentScheduleEntityGroup.externalAssessmentScheduleId = input.scheduleId;
            this.selectedvalue = 1;
            this.assementSchedule.startDate = moment.utc(input.startDate);
            this.assementSchedule.endDate = moment.utc(input.endDate);
             this.getInitilizationFacility();                                           
            this.initializeAuthoritativeDocumentLookUp();
            this.initializeScheduleTypes();
            this.initializeAssessmentTypes();
            this.initializeAuditCompaniesLookUp();
            this.initializationEntityGroup();
            
            if (result.length == 0) {
                //this.initializeBusinessEntitiesLookUp();
                 this.initializationHealthAllEntity();   
            }
                 
            this.scheduleDetailActive = true;
            this.assementScheduleDetail = input;
            this.assementScheduleDetail.authoritativeDocumentIds = input.authoritativeDocumentIds;
            setTimeout(() => {
                this.editDocuments();
            }, 1000);
            
            if (this.editBusinessEntity.length > 0)
            {          
                switch (this.editBusinessEntity[0].entityType) {      
                    case EntityType.ExternalAudit:
                        {
                            this.flag = true;
                          //  this.flaghealth = false;
                          //  this.flaginsurance = false;
                            this.flagfacilityType = true;
                            this.externalAssessmentScheduleEntityGroup.entityType = this.editBusinessEntity[0].entityType;
                            this.selectedvalue = 1;
                           // this.initializationHealthAllEntity();  
                            setTimeout(() => {
                                this.editAllentity();
                                                           
                            }, 1000);                          
                            break;
                        }
                    case EntityType.HealthcareEntity:
                        {
                            this.flaghealth = true;
                          //  this.flag = false;
                         //   this.flaginsurance = false;
                            this.selectedvalue = 2;
                            this.flagfacilityType = true;
                            this.externalAssessmentScheduleEntityGroup.entityType = this.editBusinessEntity[0].entityType;
                            setTimeout(() => {
                                this.editEntityGroup(); 
                                this.editInitilizationentity();                                                            
                            }, 1000);
                            break;
                        }
                    default:
                        {
                            
                            this.flaginsurance = true;
                           // this.flag = false;
                          //  this.flaghealth = false;
                            this.selectedvalue = 3;
                            this.flagfacilityType = true;
                            this.externalAssessmentScheduleEntityGroup.entityType = this.editBusinessEntity[0].entityType;
                            this.getInsuranceEntity(EntityType.InsuranceFacilities);
                            setTimeout(() => {
                                this.getInsuranceFacilityType();
                                this.editinitializeBusinessEntitiesLookUps();                             
                            }, 1000);
                            break;
                        }
                }

            }

            else
            {
                this.flag = true;
               // this.flaghealth = true;
              //  this.flaginsurance = true;
                this.flagfacilityType = true;
                this.externalAssessmentScheduleEntityGroup.entityType = EntityType.ExternalAudit;
            }

            this.readonly = true;
            this.saving = false;
            this.modal.show();
            this.spinnerService.hide();
        })
        this.spinnerService.hide();      
    }

    editEntityGroup()
    {
        this.selectedEntityGroup = [];
        this.editBusinessEntity.forEach(obj => {
            this.entityGroup.forEach(entity => {
                if (obj.entityGroupId == entity.id)
                {                    
                    var checkId = this.selectedEntityGroup.find(x => x.id == entity.id);
                    if (checkId == undefined) {
                        var item = new EntityGroupDto();
                        item.id = entity.id;
                        item.name = entity.name;
                        item.organizationUnitId = entity.organizationUnitId;
                        this.selectedEntityGroup.push(item);
                    }
                }
              
            })
           
        })
    }

    editInitilizationentity()
    {
        
        var entityGroupId = _.uniq(this.editBusinessEntity.map(x => x.entityGroupId));
        if (entityGroupId.length > 0)
        {
            
            this.selectedBusinessEntity = [];
            this.businessentity = [];
            this._businessEntitiesServiceProxy.getBusinessEntityOFMultipleGroup(entityGroupId).subscribe(res => {
                
                this.businessentity = res;
                this.editBusinessEntitys();
            });
        }

    }

    editBusinessEntitys()
    {
       
        //var temp = this.businessentity;
        //this.businessentity = [];
        //temp.forEach(obj => {
        //    var object = this.editBusinessEntity.find(x => x.id == obj.id);
        //    if (object == undefined) {
        //        this.businessentity.push(obj);
        //    }
        //});     
        var temp = this.businessentity;
        this.businessentity = [];
        this.selectedBusinessEntity = [];
        
        temp.forEach(obj => {
          
            var object = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == false);
            if (object == undefined)
            {
                
                object = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == true);
                if (object == undefined) {
                    this.businessentity.push(obj);
                    this.tempEntity.push(obj);
                  //  this.selectedBusinessEntity.push(obj);
                }
            }
            else
            {
                
                this.businessentity.push(obj);
                this.tempEntity.push(obj);
                this.selectedBusinessEntity.push(obj);
            }

            });

        //temp.forEach(obj => {        
        //    this.businessentity.push(obj);
        //    
        //    var object = this.editBusinessEntity.find(x => x.id == obj.id);
        //    if (object == undefined) {

        //    }
        //    else {
        //        this.selectedBusinessEntity.push(obj);
        //    }
        //});
        
    }

    onShown(): void {

    }

    scheduleChange() {
        let scheduleTypeName = this.scheduleTypes.filter(s => s.id == this.assementSchedule.scheduleTypeId);
        if (scheduleTypeName.length == 0) {
            return;
        }
        let assessmentTypeName = this.assessmentTypes.filter(s => s.id == this.assementSchedule.assessmentTypeId);
        if (assessmentTypeName.length == 0) {
            return;
        }
        if (this.assementSchedule.startDate == undefined) {
            return;
        }
        this.assementSchedule.assessmentName = "ADHICS-" + scheduleTypeName[0].name + " x-" + this.assementSchedule.startDate.year() + "-" + assessmentTypeName[0].name;
    }

    save(): void {
        if (this.assementSchedule.endDate < this.assementSchedule.startDate) {
            abp.message.warn("End Date Should be  Greater than Start Date");
            return;
        }
        let dateRange = [];
        let AssstartDate = moment(this.assementSchedule.startDate).format("YYYY-MM-DD");
        let startDate = moment(AssstartDate);
        let endDate = moment(this.assementSchedule.endDate).format("YYYY-MM-DD");
        let scheduleTypeName = this.scheduleTypes.filter(s => s.id == this.assementSchedule.scheduleTypeId);
        this.assementSchedule.scheduleTypeName = scheduleTypeName[0].name;
        let assessmentTypeName = this.assessmentTypes.filter(s => s.id == this.assementSchedule.assessmentTypeId);
        this.assementSchedule.assessmentTypeName = assessmentTypeName[0].name;
        if (scheduleTypeName[0].name.trim().toLowerCase() == "OnDemand".trim().toLowerCase()) {          
            dateRange.push(startDate);
        } else {
            if (scheduleTypeName[0].name.trim().toLowerCase() == "Annual".trim().toLowerCase()) {
                let itr = startDate.twix(endDate).iterate('years');
                while (itr.hasNext()) {
                    dateRange.push(itr.next());
                }
            }
        }
        this.assementSchedule.scheduledDates = dateRange;
        this.assementSchedule.assessmentType = null;
        this.assementSchedule.scheduleType = null;
        this._assementScheduleAppService.addorUpdateAssessmentSchedule(this.assementSchedule)
            .pipe(finalize(() => { this.saving = false; })).subscribe(res => {
                this.saving = false;
                this.notify.info(this.l("SavedSuccessfully"));
                this.readonly = false;
                this.modalSave.emit();
                this.close();
            });
    }

    saveScheduleAssessments()
    {
       
        this.assessment.startDate = this.assementScheduleDetail.startDate;
        this.assessment.endDate = this.assementScheduleDetail.endDate;
        this.assessment.authoritativeDocumentIds = this.assementScheduleDetail.authoritativeDocumentIds;
        this.assessment.feedback = this.assementScheduleDetail.feedBack;
        this.assessment.sendEmailNotification = this.assementScheduleDetail.sendEmailNotify;
        this.assessment.sendSmsNotification = this.assementScheduleDetail.sendSmsNotify;
        this.assessment.name = this.assementScheduleDetail.assessmentInfo;
        this.assessment.assessmentTypeId = this.assementScheduleDetail.assessmentTypeId;
        this.assessment.vendorId = this.assementScheduleDetail.vendorId;
        this.assessment.auditAgencyAdminId = this.assementScheduleDetail.auditAgencyAdminId;
      //  this.assessment.name = this.assementScheduleDetail.assessmentName;
        this.assessment.scheduleDetailId = this.assementScheduleDetail.scheduleId;
        this.assessment.entityGroupId = this.assementScheduleDetail.entityGroupId;
        this.assessment.entityType = this.externalAssessmentScheduleEntityGroup.entityType;
        // this.assessment.s = this.assementScheduleDetail.scheduleTypeId;
        if (this.selectedBusinessEntity.length > 0) {
            this.assessment.businessEnityies = this.selectedBusinessEntity;
        }
        else {
            this.assessment.businessEnityies = [];
            this.selectedBusinessEntitys.forEach(obj => {
                var items = new BusinessEnityGroupWiesDto();
                items.id = obj.id;
                items.entityType = this.externalAssessmentScheduleEntityGroup.entityType;
                items.entityGroupId = obj.entityGroupId;
                this.assessment.businessEnityies.push(items);
            });
        }       
        if (this.assessment.businessEnityies.length == 0) {
            this.message.error("You should use at least one Business Entity!");
        }
        else {
            this.saving = true;
            this._externalAssessmentService.generateScheduledExtAssemments(this.assessment)
                .pipe(
                    finalize(() => {
                        this.saving = false;
                    })
                )
                .subscribe(
                    () => {
                        this.notify.info(this.l("SavedSuccessfully"));
                        this.close();
                       // this.modalSave.emit(null);
                    },
                    error => {
                        this.message.error(error.error.error.message);
                        this.close();
                        this.modalSave.emit(null);
                    }
                );
        }
    }

    close(): void {
        this.saving = false;
        this.readonly = false;
        this.flag = false;
        this.flaghealth = false;
        this.flaginsurance = false;
        this.authoritativeDocumentsLookUp = [];
        this.scheduleTypes = [];
        this.assessmentTypes = [];
        this.assementSchedule = new ExternalAssessmentScheduleDto();
        this.assementScheduleDetail = new ExternalAssessmentScheduleDetailDto();
        this.scheduleActive = false;
        this.scheduleDetailActive = false;
        this.selectedBusinessEntity = [];
        this.selectedBusinessEntitys = [];
        this.businessEntitiesLookUps = [];
        this.businessentity = [];
        this.facility = [];
        this.selectedfacility = [];
        this.facilitySubType = [];
        this.selectedFacilitySubTyes = [];
        this.auditAgencyAdmins = [];
        
        this.modalSave.emit(null);
        this.modal.hide();
    }

}
