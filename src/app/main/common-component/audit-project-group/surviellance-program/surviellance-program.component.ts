import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { AuditSurviellanceProjectServiceProxy, AuditSurviellanceEntitiesDto, BusinessEntitiesServiceProxy, BusinessEntityUserDto, AuditSurviellanceProjectDto, BusinessEnityGroupWiesDto, AuditDecisionServiceProxy, CustomDynamicServiceProxy, DynamicNameValueDto, EntityPrimaryDto, OutPutConClusion, EntityGroupDto, EntityGroupsServiceProxy, AuditDecisionDto, } from '../../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'surviellance-program',
    templateUrl: './surviellance-program.component.html',
    styleUrls: ['./surviellance-program.component.css']
})
export class SurviellanceProgramComponent extends AppComponentBase implements OnInit {

    @Input('auditProjectId') auditprojectId: any;
    @Input('entityGroupId') entityGroupId: any;
    @Input('vendorId') vendorId: any;

    auditType: DynamicNameValueDto[];
    entityGroup: EntityGroupDto[] = [];
    auditSurviellanceProject: AuditSurviellanceProjectDto = new AuditSurviellanceProjectDto();
    entityPrimary: EntityPrimaryDto = new EntityPrimaryDto();
    businessentity: BusinessEnityGroupWiesDto[] = [];
    selectedBusinessEntity: BusinessEnityGroupWiesDto[] = [];
    auditAgencyAdmins: BusinessEntityUserDto[] = [];

    constructor(_injector: Injector,
        private _auditSurviellaanceServiceProxiy: AuditSurviellanceProjectServiceProxy,      
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _auditdecisionServiceProxy: AuditDecisionServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy,
        private _entityGroupServiceProxy: EntityGroupsServiceProxy,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {
        this.initializationEntityGroup();       
        this.initializeAuditTypes();
        if (this.entityGroupId != null) {

            this.initializationbusinessEntity(this.entityGroupId);
        }
        if (this.vendorId) {
            this.loadVendorUsers(this.vendorId)
        }
        this.getAuditSurviellance();
    }

    getAuditSurviellance() {
        this.spinnerService.show();
        this._auditSurviellaanceServiceProxiy.getAuditProjectSurviellanceByProjectId(this.auditprojectId).subscribe(res => {
            if (res.id > 0) {
                this.auditSurviellanceProject = res;
                this.editFacilities();
                this.spinnerService.hide();
            }
        })

    }

    editFacilities()
    {
        this.selectedBusinessEntity = [];
        this.auditSurviellanceProject.auditSurviellanceEntities.forEach(obj => {           
            this.businessentity.forEach(item => {
                if (obj.businessEntityId == item.id) {
                    var temp = new BusinessEnityGroupWiesDto();
                    temp.id = item.id;
                    temp.entityGroupId = item.entityGroupId;
                    temp.companyName = item.companyName;
                    this.selectedBusinessEntity.push(temp);
                }
            })
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

    initializationbusinessEntity(id: number) {
        this.selectedBusinessEntity = [];
        this._businessEntitiesServiceProxy.getBusinessEntityGroupWies(id).subscribe(res => {
            this.businessentity = res;
            
        })
    }

    getbusinessEntityByProject(Id: number) {
        this._businessEntitiesServiceProxy.getBusinessEntityes(Id).subscribe(res => {
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
}
