import { Component, OnInit, Injector, ViewChild, Input, ElementRef, EventEmitter, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { AuditProjectServiceProxy, AuditSurviellanceProjectServiceProxy, CommonLookupServiceProxy, AuditSurviellanceEntitiesDto, BusinessEntitiesServiceProxy, BusinessEntityUserDto, AuditSurviellanceProjectDto, BusinessEnityGroupWiesDto, AuditDecisionServiceProxy, CustomDynamicServiceProxy, DynamicNameValueDto, EntityPrimaryDto, OutPutConClusion, EntityGroupDto, EntityGroupsServiceProxy, AuditDecisionDto, } from '../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'tab-view-surviellance-program',
    templateUrl: './tab-view-surviellance-program.component.html',   
})
export class TabViewSurviellanceProgramComponent extends AppComponentBase implements OnInit {

    @Input('auditprojectId') auditprojectId: any;
    @Input('entityGroupId') entityGroupId: any;
    @Input('vendorId') vendorId: any;
    @Input('businessentityId') businessentityId: any;
    @Output() closeModal = new EventEmitter();
    auditType: DynamicNameValueDto[];
    entityGroup: EntityGroupDto[] = [];
    auditSurviellanceProject: AuditSurviellanceProjectDto = new AuditSurviellanceProjectDto();
    entityPrimary: EntityPrimaryDto = new EntityPrimaryDto();
    businessentity: BusinessEnityGroupWiesDto[] = [];
    selectedBusinessEntity: BusinessEnityGroupWiesDto[] = [];
    auditAgencyAdmins: BusinessEntityUserDto[] = [];
    IsAdmin : boolean;
    @Input('reauditPermission') reauditPermission: boolean;
    
    constructor(_injector: Injector,
        private _auditSurviellaanceServiceProxiy: AuditSurviellanceProjectServiceProxy,    
        private _activatedRoute: ActivatedRoute,
        private _auditServiceProxy: AuditProjectServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _auditdecisionServiceProxy: AuditDecisionServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy,
        private _entityGroupServiceProxy: EntityGroupsServiceProxy,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {
       
        this.IsAdmin = this.appSession.user.isAdmin;
        this.spinnerService.show(); 
        this.initializeAuditTypes()
        if (this.entityGroupId != null) {
            this.initializationEntityGroup();
            this.initializationbusinessEntity(this.entityGroupId);
        }
        else {
            this.entityGroupId = null;
            this.getbusinessEntityByProject(this.businessentityId);     
        }
         if (this.vendorId) {
            this.loadVendorUsers(this.vendorId);
        }
        this.getAuditSurviellance();
        this.getAuditProjectManager(this.auditprojectId, this.businessentityId, this.entityGroupId, this.vendorId);
    }
    getAuditProjectManager(auditId, businessEntityId, entityGroupId, vendorId) {        
        this.auditprojectId = auditId;
        this.entityGroupId = entityGroupId;
        this.vendorId = vendorId;
        this.businessentityId = businessEntityId;


        if (this.entityGroupId != null) {
            this.initializationEntityGroup();
            this.initializationbusinessEntity(this.entityGroupId);
        }
        else {
            this.entityGroupId = null;
            this.getbusinessEntityByProject(this.businessentityId);
        }
        if (this.vendorId) {
            this.loadVendorUsers(this.vendorId);
        }
    }       
      
    getAuditSurviellance() {
        this.spinnerService.show();        
        this._auditSurviellaanceServiceProxiy.getAuditProjectSurviellanceByProjectId(this.auditprojectId).subscribe(res => {            
            if (res.id > 0) {
                this.auditSurviellanceProject = res;
                this.editFacilities();
                this.spinnerService.hide();
            }
            else {
                this.spinnerService.hide();
            }           
        })
    }

    editFacilities() {       
        this.selectedBusinessEntity = [];        
        this.auditSurviellanceProject.auditSurviellanceEntities.forEach(obj => {
            this.businessentity.forEach(item => {
                if (obj.businessEntityId == item.id) {
                    var temp = new BusinessEnityGroupWiesDto();
                    temp.id = item.id;
                    temp.entityGroupId = item.entityGroupId;
                    temp.companyName = item.companyName;
                    temp.extGenerated = item.extGenerated;
                    temp.facilityTypeId = item.facilityTypeId;
                    temp.facilitySubTypeId = item.facilitySubTypeId;
                    temp.entityType = item.entityType;   
                    this.selectedBusinessEntity.push(temp);
                }
            })
        })
    }

    getbusinessentityChange() {
        this.auditSurviellanceProject.auditSurviellanceEntities = [];
        this.selectedBusinessEntity.forEach(obj => {
            var item = new AuditSurviellanceEntitiesDto();
            item.businessEntityId = obj.id;
            this.auditSurviellanceProject.auditSurviellanceEntities.push(item);
        })
    }

    initializeAuditTypes() {
        this._customDynamicService.getDynamicEntityDatabyName("Audit Type")
            .subscribe(res => {
                this.auditType = res;
            });
    }

    initializationEntityGroup() {
        this._entityGroupServiceProxy.getAllForLookUp().subscribe(res => {
            this.entityGroup = res;
        })
    }

    getbusinessEntityByProject(Id: number) {       
        this._businessEntitiesServiceProxy.getBusinessEntityes(Id).subscribe(res => {
            this.businessentity = res;
        })
    }

    initializationbusinessEntity(id: number) {
        this.selectedBusinessEntity = [];
        this._businessEntitiesServiceProxy.getBusinessEntityWithGrouporNot(id, this.auditprojectId).subscribe(res => {
            this.businessentity = res;
           
        })
    }

    loadVendorUsers(vendorId) {
        this.spinnerService.show();
        this._businessEntitiesServiceProxy
            .getAllAuditAgencyAdmins(vendorId)
            .subscribe(res => {
                setTimeout(() => {
                    this.auditAgencyAdmins = res;
                    this.spinnerService.hide();
                }, 1000);
            }, err => {
                this.spinnerService.hide();
            });
    }

    save()
    {
        this.spinnerService.show();
        this.auditSurviellanceProject.auditProjectId = this.auditprojectId;
        this._auditSurviellaanceServiceProxiy.addorUpdateAuditSurviellanceProject(this.auditSurviellanceProject).subscribe(res => {
            this.spinnerService.hide();
            abp.notify.success(this.l('SavedSuccessfully'));
            //this.closeModal.emit(false);
        })
        
    }

    //Surviellance Program
    ReauditPermissionCheck() {
        this._commonLookupServiceProxy.getCurrentUserRoles().subscribe(
            (result) => {
                var roleList = result.map(x => x.roleName);
                this._auditServiceProxy.reauditPermissionCkeker().subscribe(res => {
                    var isExist = res.find(x => x.id == this.auditprojectId);
                    var isBEA = roleList.find(x => x.toLowerCase() == "Business Entity Admin".toLowerCase());
                    var isEAA = roleList.find(x => x.toLowerCase() == "External Audit Admin".toLowerCase());
                    var isEA = roleList.find(x => x.toLowerCase() == "External Auditor".toLowerCase());
                    var isIEA = roleList.find(x => x.toLowerCase() == "Insurance Entity Admin".toLowerCase());
                    if (isExist != undefined) {
                        if (isExist.accessPermission == 0) {
                            this.reauditPermission = true;
                        }
                        //External Auditor
                        else if (isExist.accessPermission == 4) {
                            this.reauditPermission = this.appSession.user.isAuditer ? false : true;
                        }
                        //Business Entity Admin
                        else if (isExist.accessPermission == 1) {
                            if (isBEA != undefined)
                                this.reauditPermission = false;
                            else
                                this.reauditPermission = true;
                        }
                        //Insurance Entity Admin
                        else if (isExist.accessPermission == 1) {
                            if (isIEA != undefined)
                                this.reauditPermission = false;
                            else
                                this.reauditPermission = true;
                        }
                        //External Auditor Admin
                        else if (isExist.accessPermission == 2) {
                            if (isEAA != undefined)
                                this.reauditPermission = false;
                            else
                                this.reauditPermission = true;
                        }
                        //External Auditor Admin + Business Entity Admin
                        else if (isExist.accessPermission == 3) {
                            if (isEAA != undefined || isBEA != undefined)
                                this.reauditPermission = false;
                            else
                                this.reauditPermission = true;
                        }
                        //External Auditor + External Auditor Admin
                        else if (isExist.accessPermission == 6) {
                            if (isEAA != undefined || isBEA != undefined)
                                this.reauditPermission = false;
                            else
                                this.reauditPermission = true;
                        }
                        //External Auditor + Business Entity Admin
                        else if (isExist.accessPermission == 5) {
                            if (isEA != undefined || isBEA != undefined)
                                this.reauditPermission = false;
                            else
                                this.reauditPermission = true;
                        }
                    }
                    else {
                        this.reauditPermission = false;
                    }
                    if (this.appSession.user.isAdmin)
                        this.reauditPermission = false;
                });
            });
    }

}
