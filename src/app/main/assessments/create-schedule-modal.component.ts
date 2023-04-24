import { AfterViewChecked, Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { GetAuthoritativeDocumentForViewDto, BusinessEntityDto, GetFacilityTypeForViewDto, FacilityTypesServiceProxy, CustomDynamicServiceProxy, InternalAssessmentScheduleDetailBusinessEntityDto, BusinessEnityGroupWiesDto, BusinessEntitiesListDto, EntityGroupsServiceProxy, EntityGroupDto, DynamicNameValueDto, AssementScheduleServiceProxy, AuthoritativeDocumentsServiceProxy, InternalAssessmentScheduleDto, GetBusinessEntitiesExcelDto, BusinessEntitiesServiceProxy, IInternalAssessmentScheduleDetailDto, InternalAssessmentScheduleDetailDto, CreateOrEditAssessmentInput, AssessmentServiceProxy, EntityType, FacilitySubTypeDto, FacilitySubTypeServiceProxy, FacilityTypeDto } from '../../../shared/service-proxies/service-proxies';
import * as moment from 'moment';
import * as twix from 'twix';
import { async } from '@angular/core/testing';
import { MINUTE } from 'ngx-bootstrap/chronos/units/constants';
require('twix');

@Component({
    selector: 'createScheduleModals',
    templateUrl: './create-schedule-modal.component.html',
})
export class CreateScheduleModalComponent extends AppComponentBase {

    @ViewChild('createScheduleModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    readonly = false;
    facilities: DynamicNameValueDto[];
    subfaclility: DynamicNameValueDto[];
    subfaclilityId: any;
    facilityId: any;
    scheduleActive = false;
    scheduleDetailActive = false;
    facilityTypesLookUp: GetFacilityTypeForViewDto[];
    saving = false;
    creationDateRange: Date;
    authoritativeDocumentsLookUp: GetAuthoritativeDocumentForViewDto[];
    scheduleTypes: DynamicNameValueDto[];
    assessmentTypes: DynamicNameValueDto[];
    assementSchedule = new InternalAssessmentScheduleDto();
    assementScheduleDetail = new InternalAssessmentScheduleDetailDto();
    assessment: CreateOrEditAssessmentInput = {} as any;
    businessEntitiesLookUp: GetBusinessEntitiesExcelDto[];
    businessEntity: BusinessEntityDto[] = [];
    // selectedBusinessEntity: BusinessEntityDto[] = [];
    allBESelected: boolean = true;
    entityGroup: EntityGroupDto[] = [];
    selectedvalue: any;
    //businessEntitiesLookUps: BusinessEntitiesListDto[] = [];
    //selectedBusinessEntitys: BusinessEntitiesListDto[] = [];

    businessentity: BusinessEnityGroupWiesDto[] = [];
    selectedBusinessEntity: BusinessEnityGroupWiesDto[] = [];
    tempEntity: BusinessEnityGroupWiesDto[] = [];
    selectedEntityGroup: EntityGroupDto[] = [];

    editBusinessEntity: BusinessEnityGroupWiesDto[] = [];

    internalAssessmentScheduleDetailBusinessEntity: InternalAssessmentScheduleDetailBusinessEntityDto = new InternalAssessmentScheduleDetailBusinessEntityDto();
    selectedEntitype = EntityType;
    flag: boolean = false;
    flaghealth: boolean = false;
    flaginsurance: boolean = false;
    entitype: any;
    facility: FacilityTypeDto[] = [];
    facilityIds: any[] = [];
    facilitySubTypesId: any[] = [];
    facilitySubType: FacilitySubTypeDto[] = [];
    selectedFacilitySubTyes: FacilitySubTypeDto[] = [];
    selectedfacility: FacilityTypeDto[] = [];
    selectedBusinessEntitys: BusinessEnityGroupWiesDto[] = [];
    businessEntitiesLookUps: BusinessEnityGroupWiesDto[] = [];
    flagfacilityType: boolean = false;

    constructor(
        injector: Injector, private _assementScheduleAppService: AssementScheduleServiceProxy,
        private _entityGroupServiceProxy: EntityGroupsServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy,
        private _facilityTypesProxy: FacilityTypesServiceProxy,
        private _authoritativeDocumentsServiceProxy: AuthoritativeDocumentsServiceProxy,
        private _facilitySubtypeServiceProxiy: FacilitySubTypeServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy, private _assessmentsServiceProxy: AssessmentServiceProxy,

    ) {
        super(injector);
        this.readonly = false;
        this.saving = false;
        this.selectedvalue = 1;
        this.entitype = EntityType.ExternalAudit;

    }

    onItemChange(event, id) {
        
        switch (id) {
            case 1: {
                this.selectedvalue = 1;
                this.flagfacilityType = true;
                this.internalAssessmentScheduleDetailBusinessEntity.entityType = EntityType.ExternalAudit;
                this.businessEntitiesLookUps = [];
                this.selectedBusinessEntitys = [];
                this.selectedEntityGroup = [];
                this.facility = [];
                this.selectedfacility = [];                
                this.facilitySubType = [];
                this.selectedFacilitySubTyes = [];
                this.initializationHealthAllEntity();
                this.getInitilizationFacility();
                break;
            }
            case 2: {
                this.selectedvalue = 2;
                this.flagfacilityType = false;
                this.internalAssessmentScheduleDetailBusinessEntity.entityType = EntityType.HealthcareEntity;
                this.selectedBusinessEntity = [];
                this.businessentity = [];
                this.selectedEntityGroup = [];
                this.facility = [];
                this.selectedfacility = [];
                this.facilitySubType = [];
                this.selectedFacilitySubTyes = [];
                this.getInitilizationFacility();                
                break;
            }
            default: {
                this.selectedvalue = 3;
                this.flagfacilityType = true;
                this.internalAssessmentScheduleDetailBusinessEntity.entityType = EntityType.InsuranceFacilities;
                this.selectedBusinessEntity = [];
                this.selectedEntityGroup = [];                
                this.facility = [];
                this.selectedfacility = [];
                this.facilitySubType = [];
                this.selectedFacilitySubTyes = [];
                this.getInsuranceFacilityType();               
                this.getInsuranceEntity(EntityType.InsuranceFacilities);
                break;
            }
        }

    }

    getInsuranceFacilityType() {
        this.facility = [];
        this.selectedfacility = [];
        this._facilitySubtypeServiceProxiy.getFacilityAll().subscribe(res => {                      
            this.facility = res.filter(x => x.name == "Insurance Facility");
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

    initializationEntityGroup() {
        this._entityGroupServiceProxy.getAllEntityGroupForLookUp().subscribe(res => {
            this.entityGroup = res;
        })
    }

     initializationHealthAllEntity() {       
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
                      var  objecttrue = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == true);
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

    editEntityGroup() {
        this.selectedEntityGroup = [];

        this.editBusinessEntity.forEach(obj => {
            this.entityGroup.forEach(entity => {
                if (obj.entityGroupId == entity.id) {
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

    editInitilizationentity() {
        var entityGroupId = _.uniq(this.editBusinessEntity.map(x => x.entityGroupId));
        if (entityGroupId.length > 0) {
            this.selectedBusinessEntity = [];
            this.businessentity = [];
            this._businessEntitiesServiceProxy.getBusinessEntityOFMultipleGroup(entityGroupId).subscribe(res => {
                this.businessentity = res;
                this.editBusinessEntitys();
            });
        }

    }

    initializeAuthoritativeDocumentLookUp() {
        this._authoritativeDocumentsServiceProxy.getAllAuthoritativeDocument().subscribe(res => {
            this.authoritativeDocumentsLookUp = res;
        });
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


    saveBusinessEntity() {
        
        if (this.internalAssessmentScheduleDetailBusinessEntity.entityType == undefined) {
            this.internalAssessmentScheduleDetailBusinessEntity.entityType = EntityType.ExternalAudit;
        }
        this.internalAssessmentScheduleDetailBusinessEntity.extGenerated = false;
        if (this.selectedBusinessEntity.length > 0) {
            this.internalAssessmentScheduleDetailBusinessEntity.businessEnityies = this.selectedBusinessEntity;
        }
        else {
            this.internalAssessmentScheduleDetailBusinessEntity.businessEnityies = [];
            this.selectedBusinessEntitys.forEach(obj => {
                var items = new BusinessEnityGroupWiesDto();
                items.id = obj.id;
                this.internalAssessmentScheduleDetailBusinessEntity.businessEnityies.push(items);
            });
        }
        if (this.internalAssessmentScheduleDetailBusinessEntity.businessEnityies.length == 0) {
            abp.message.warn("Please Select Entity");
            return;
        }
        this._assementScheduleAppService.addorUpdatInternalAssessmentScheduleBusinessentity(this.internalAssessmentScheduleDetailBusinessEntity).subscribe(result => {
            this.saving = false;
            this.notify.info(this.l("SavedSuccessfully"));
            this.selectedBusinessEntity = [];
            this.selectedBusinessEntitys = [];
            this.selectedEntityGroup = [];
            this.modal.hide();

        })
    }

   

    toggleBESelection() {
        this.allBESelected = !this.allBESelected;
        if (this.allBESelected) {
            this.assementScheduleDetail.businessEntityIds = this.businessEntitiesLookUp.map(
                item => item.businessEntity.id
            );
        } else {
            this.assementScheduleDetail.businessEntityIds = [];
        }
    }

    editBusinessEntitys() {
        var temp = this.businessentity;
        this.businessentity = [];
        this.selectedBusinessEntity = [];
        if (temp != null) {
            temp.forEach(obj => {              
                var object = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == false);
                if (object == undefined) {
                   var objecttrue = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == true);
                    if (objecttrue == undefined) {
                        this.businessentity.push(obj);
                        this.tempEntity.push(obj);
                        //  this.selectedBusinessEntity.push(obj);
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

    }


    initializeFacilitiesType() {
        this._customDynamicService
            .getDynamicEntityDatabyName("Insurance Facilities Type")
            .subscribe((res) => {
                this.facilities = res;
            });
    }

    show(input?: InternalAssessmentScheduleDto): void {
        this.initializeAuthoritativeDocumentLookUp();
        this.initializeScheduleTypes();
        this.initializeAssessmentTypes();
        this.scheduleActive = true;
        if (input != undefined) {
            //  this.initializeBusinessEntitiesLookUp();
            this.assementSchedule = input;
            this.readonly = true;
        }
        this.modal.show();
    }

    onfacilitysubTypeChange($event)
    {
       
        this.facilityIds = [];
        this.facilitySubTypesId = [];
        this.facilityIds = this.selectedfacility.map(x => x.id);
        this.facilitySubTypesId = this.selectedFacilitySubTyes.map(x => x.id);
        this.selectedBusinessEntity = [];
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
                        this.businessentity.push(obj);
                        this.selectedBusinessEntitys.push(obj);
                    }
                }
                else {
                   
                    this.selectedBusinessEntitys.push(obj);
                }

            });
        }
    }

    //onFacilitySubTypeChange(subfaclilityId: any) {

    //    this.selectedBusinessEntity = [];
    //    var temp = this.tempEntity;
    //    temp.forEach(obj => {
    //        var object = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == false && x.facilitySubTypeId == subfaclilityId);
    //        if (object == undefined) {
    //            object = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == true);
    //            if (object == undefined) {
    //                if (obj.facilitySubTypeId == subfaclilityId) {
    //                    this.selectedBusinessEntity.push(obj);
    //                }
    //                // this.businessentity.push(obj);

    //            }
    //        }
    //        else {
    //            //  this.businessentity.push(obj);
    //            this.selectedBusinessEntity.push(obj);
    //        }

    //    });


    //}


    initializeFacilityTypesForLookUp() {
        this._facilityTypesProxy.getAllFacilityType().subscribe((res) => {
            this.facilityTypesLookUp = res;
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
                }
            }
            else {
                this.selectedBusinessEntity.push(obj);
            }

        });

    }

    async showScheduleDetails(input?: InternalAssessmentScheduleDetailDto)
    {
     
        this.selectedBusinessEntity = [];
        this.selectedEntityGroup = [];
        this.selectedBusinessEntitys = [];
        this.internalAssessmentScheduleDetailBusinessEntity.internalAssessmentScheduleDetailId = input.id;
        this._assementScheduleAppService.getAllBusinessEntityByScheduleDetailId(input.id).subscribe(async res => {
           
            this.editBusinessEntity = res;
            this.initializeAuthoritativeDocumentLookUp();                   
            this.initializeFacilityTypesForLookUp();
            this.initializeScheduleTypes();
            this.initializeAssessmentTypes();
            this.initializationEntityGroup();
            if (res.length == 0) {
                this.initializationHealthAllEntity();  
            }
                     
            this.getInitilizationFacility();
            this.scheduleDetailActive = true;         
            if (this.editBusinessEntity.length > 0) {
                
                switch (this.editBusinessEntity[0].entityType) {                    
                    case EntityType.ExternalAudit:
                        {
                            this.flag = true;
                            //this.flaghealth = false;
                            //this.flaginsurance = false;
                            this.selectedvalue = 1;
                            this.flagfacilityType = true;
                            this.internalAssessmentScheduleDetailBusinessEntity.entityType = this.editBusinessEntity[0].entityType;
                            this.assessment.entityType = this.editBusinessEntity[0].entityType;
                            setTimeout(() => {
                                this.editAllentity();                                                            
                            }, 1000);
                            break;
                        }
                    case EntityType.HealthcareEntity:
                        {
                            this.flaghealth = true;
                            //this.flag = false;
                            //this.flaginsurance = false;
                            this.flagfacilityType = true;
                            this.selectedvalue = 2;
                            this.internalAssessmentScheduleDetailBusinessEntity.entityType = this.editBusinessEntity[0].entityType;
                            this.assessment.entityType = this.editBusinessEntity[0].entityType;
                           
                            setTimeout(() => {
                                this.editEntityGroup();
                                this.editInitilizationentity();
                            }, 1000);
                            break;
                        }
                    default:
                        {
                            this.flaginsurance = true;
                            //this.flag = false;
                            //this.flaghealth = false;
                            this.flagfacilityType = true;
                            this.selectedvalue = 3;
                            this.internalAssessmentScheduleDetailBusinessEntity.entityType = this.editBusinessEntity[0].entityType;
                            this.assessment.entityType = this.editBusinessEntity[0].entityType;
                            this.getInsuranceEntity(EntityType.InsuranceFacilities);
                            setTimeout(() => {
                                this.editinitializeBusinessEntitiesLookUps();
                            }, 1000);
                            break;
                        }
                }

            }
            else
            {               
                this.flag = true;
                this.internalAssessmentScheduleDetailBusinessEntity.entityType = EntityType.ExternalAudit;              
            }
            this.assementScheduleDetail = input;
            this.readonly = true;
            this.saving = false;
            this.modal.show();
        })


    }

    editinitializeBusinessEntitiesLookUps() {
      
        var temp = this.businessEntitiesLookUps;
        this.businessEntitiesLookUps = [];
        this.selectedBusinessEntitys = [];
        temp.forEach(obj => {

            var object = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == false);
            if (object == undefined) {
               
              var  objecttrue = this.editBusinessEntity.find(x => x.id == obj.id && x.extGenerated == true);
                if (objecttrue == undefined) {
                    this.businessEntitiesLookUps.push(obj);
                    this.tempEntity.push(obj);
                  //  this.selectedBusinessEntitys.push(obj);
                }
            }
            else {
              
                this.businessEntitiesLookUps.push(obj);
                this.tempEntity.push(obj);
                this.selectedBusinessEntitys.push(obj);
            }
        });
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
        //this.saving = true;
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
        if (scheduleTypeName[0].name == "Daily") {
            let itr = startDate.twix(endDate).iterate('days');
            while (itr.hasNext()) {
                dateRange.push(itr.next());
            }
        } else {
            if (scheduleTypeName[0].name == "Weekly") {
                let itr = startDate.twix(endDate).iterate('weeks');
                while (itr.hasNext()) {
                    dateRange.push(itr.next());
                }
            } else {
                if (scheduleTypeName[0].name == "Monthly") {
                    let itr = startDate.twix(endDate).iterate('months');
                    while (itr.hasNext()) {
                        dateRange.push(itr.next());
                    }
                } else {
                    if (scheduleTypeName[0].name == "Quarterly") {
                        
                        let itr = startDate.twix(endDate).iterate('quarters');
                        while (itr.hasNext()) {
                            dateRange.push(itr.next());
                        }
                    } else {
                        if (scheduleTypeName[0].name == "Bi-Annual") {
                            let itr = startDate.twix(endDate).iterate(6, 'months');
                            while (itr.hasNext()) {
                                dateRange.push(itr.next());
                            }
                        } else {
                            if (scheduleTypeName[0].name == "Annual") {
                                let itr = startDate.twix(endDate).iterate('years');
                                while (itr.hasNext()) {
                                    dateRange.push(itr.next());
                                }
                            } else {

                            }
                        }
                    }
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

    saveScheduleAssessments() {
        this.assessment.assessmentDate = this.assementScheduleDetail.startDate;
        this.assessment.reportingDate = this.assementScheduleDetail.endDate;
        this.assessment.authoritativeDocumentId = this.assementScheduleDetail.authoritativeDocumentId;
        this.assessment.feedback = this.assementScheduleDetail.feedBack;
        this.assessment.sendEmailNotification = this.assementScheduleDetail.sendEmailNotify;
        this.assessment.sendSmsNotification = this.assementScheduleDetail.sendSmsNotify;
        this.assessment.name = this.assementScheduleDetail.assessmentName;
        this.assessment.info = this.assementScheduleDetail.assessmentInfo;
        this.assessment.assessmentTypeId = this.assementScheduleDetail.assessmentTypeId;
        this.assessment.businessEntityIds = this.assementScheduleDetail.businessEntityIds;
        this.assessment.scheduleDetailId = this.assementScheduleDetail.id;
        this.assessment.entityType = this.internalAssessmentScheduleDetailBusinessEntity.entityType;
      
        if (this.selectedBusinessEntity.length > 0) {
            this.assessment.businessEnityies = this.selectedBusinessEntity;
        }
        else {
            this.assessment.businessEnityies = [];
            this.selectedBusinessEntitys.forEach(obj => {
                var items = new BusinessEnityGroupWiesDto();
                items.id = obj.id;
                // items.entityGroupId = null;
                this.assessment.businessEnityies.push(items);
            });
        }
        if (this.assessment.businessEnityies.length == 0) {
            this.message.error("You should use at least one Business Entity!");
        } 

        else {
            this.assessment.authoritativeDocumentName = document.getElementById(
                "authoritativeId"
            ).innerText;
            this.saving = true;
            this._assessmentsServiceProxy.createOrEdit(this.assessment).pipe(finalize(() => {this.saving = false;}))
                .subscribe(
                    (result) => {
                        this._assessmentsServiceProxy.updateScheduleAssessmentStatusLogInitial(this.assementScheduleDetail.id).pipe(finalize(() => { this.saving = false; }))
                            .subscribe(
                                () => {
                                    this.notify.info(this.l("SavedSuccessfully"));
                                    this.close();
                                    this.modalSave.emit(null);
                                },
                                error => {
                                    this.message.error(error.error.error.message);
                                    this.close();
                                    this.modalSave.emit(null);
                                }
                            );
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
        this.authoritativeDocumentsLookUp = [];
        this.scheduleTypes = [];
        this.assessmentTypes = [];
        this.assementSchedule = new InternalAssessmentScheduleDto();
        this.assementScheduleDetail = new InternalAssessmentScheduleDetailDto();
        this.scheduleActive = false;
        this.scheduleDetailActive = false;
        this.modal.hide();
        this.businessEntity = [];
    }

    getInitilizationFacility() {
        this.facility = [];
        this.selectedfacility = [];
        this.facilitySubType = [];
        this.selectedFacilitySubTyes = [];
        this._facilitySubtypeServiceProxiy.getFacilityAll().subscribe(res => {
            this.facility = res;
        });
    }

    async initilizationFacilitySubTypes() {
        this.facilitySubType = [];
        this.selectedFacilitySubTyes = [];
        this._facilitySubtypeServiceProxiy.getAllFacilitysubTypesList(this.facilityIds).subscribe(res => {
            this.facilitySubType = res;
        });
    }

    async onfacilityChange() {
        this.facilityIds = [];
        this.facilitySubTypesId = [];
        this.facilityIds = this.selectedfacility.map(x => x.id);
        this.facilitySubTypesId = this.selectedFacilitySubTyes.map(x => x.id);
        await this.initilizationFacilitySubTypes();
        this.selectedBusinessEntity = [];
        var temp = this.tempEntity;
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

   

    //onfacilitysubTypeChange($event) {
    //    this.facilityIds = [];
    //    this.facilitySubTypesId = [];
    //    this.facilityIds = this.selectedfacility.map(x => x.id);
    //    this.facilitySubTypesId = this.selectedFacilitySubTyes.map(x => x.id);
    //    this.selectedBusinessEntity = [];
    //    var temp = this.tempEntity;
    //    temp.forEach(obj => {
    //        var object = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == false && _.includes(this.facilityIds, x.facilityTypeId) && _.includes(this.facilitySubTypesId, x.facilitySubTypeId));
    //        if (object == undefined) {
    //            object = this.tempEntity.find(x => x.id == obj.id && x.extGenerated == true && _.includes(this.facilityIds, x.facilityTypeId) && _.includes(this.facilitySubTypesId, x.facilitySubTypeId));
    //            if (object != undefined) {
    //                this.selectedBusinessEntity.push(obj);
    //            }
    //        }
    //        else {
    //            this.selectedBusinessEntity.push(obj);
    //        }
    //    });
    //}







}
