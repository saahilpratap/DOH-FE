import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { AuditProjectServiceProxy, CorrectiveActionPlanDto, AuditProjectDto, BusinessEntityDto, CorrectiveActionPlanWithBusinessEntityDto, AuditDecisionServiceProxy, EntityPrimaryDto, EntityGroupsServiceProxy, EntityGroupDto } from '../../../../shared/service-proxies/service-proxies';
import * as _ from 'lodash';
@Component({
    selector: 'tab-view-corrective-action-plan',
    templateUrl: './tab-view-corrective-action-plan.component.html',
    styleUrls: ['./tab-view-corrective-action-plan.component.css']
})
export class TabViewCorrectiveActionPlanComponent extends AppComponentBase implements OnInit {
    @Input('auditprojectId') auditprojectId: number;
    @Input('businessentityId') businessentityId: any;
    output: CorrectiveActionPlanWithBusinessEntityDto = new CorrectiveActionPlanWithBusinessEntityDto();
    @Input('entityGroupId') entityGroupId: any;
    allCorrectiveActionPlanList: CorrectiveActionPlanDto[] = [];
    correctiveActionPlanList: CorrectiveActionPlanDto[] = [];
    businessEntity: BusinessEntityDto[] = [];
    dropdownBusinessEntity: BusinessEntityDto[] = [];
    auditproject: AuditProjectDto = new AuditProjectDto();
    selectedPrimaryEntityId: number;
    entityPrimary: EntityPrimaryDto = new EntityPrimaryDto();
    entityGroup: EntityGroupDto[] = [];

    constructor(_injector: Injector,
        private _auditProjectservice: AuditProjectServiceProxy,
        private _entityGroupServiceProxy: EntityGroupsServiceProxy,
   private _auditdecisionServiceProxy: AuditDecisionServiceProxy,
        private _router: Router,
    ) {
        super(_injector);
    }

    async ngOnInit() {
        await this.getauditProject();
        await this.loadData();
    }
    getAuditProjectManager(auditId, businessEntityId, entityGroupId) {
        this.auditprojectId = auditId;
        this.businessentityId = businessEntityId;
    }
    
    async loadData() {
        this._auditProjectservice.getCorrectiveActionByAuditProjectId(this.auditprojectId).subscribe(res => {
            this.correctiveActionPlanList = res.correctiveActionPlanList;
            this.allCorrectiveActionPlanList = res.correctiveActionPlanList;
            this.dropdownBusinessEntity = _.uniq(res.businessEntities.map(x => x));
            if (this.dropdownBusinessEntity.length != 0) {
                this.selectedPrimaryEntityId = this.dropdownBusinessEntity[0].id;
                this.correctiveActionPlanList = this.allCorrectiveActionPlanList.filter(x => x.businessEntityId == this.selectedPrimaryEntityId);
            }

        })
        
    }

    async  getauditProject() {

      
        if (this.entityGroupId != undefined) {
            this.initializationEntityGroup();
            this.entityGroupId = this.entityGroupId;
        }
        else {
            this.entityGroupId = null;
            this.getbusinessEntity(this.businessentityId);
        }

    }

    initializationEntityGroup() {
        this._entityGroupServiceProxy.getAllForLookUp().subscribe(res => {
            this.entityGroup = res;
            this.onGroupChange(this.entityGroupId);
        })
    }

    onEntityChange() {
        this.correctiveActionPlanList = this.allCorrectiveActionPlanList.filter(x => x.businessEntityId == this.selectedPrimaryEntityId);
    }

    //initializationEntityGroup() {
    //    this._entityGroupServiceProxy.getAllForLookUp().subscribe(res => {
    //        this.entityGroup = res;
    //        if (this.entityGroupId != null) {
    //        }

    //    })
    //}

    getbusinessEntity(Id: number) {
        this._auditdecisionServiceProxy.getBusinessEntity(Id).subscribe(res => {
            this.entityPrimary = res;
        })
    }

    onGroupChange(id: number) {
        this._auditdecisionServiceProxy.getPrimaryEntityByEntityGroupId(id).subscribe(res => {
            this.entityPrimary = res;
        })
    }
}
