import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { EntityGroupDto, AuditProjectDto, AuditProjectGroupDto, BusinessEnityGroupWiesDto, BusinessEntityDto, AuditProjectServiceProxy, BusinessEntitiesServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { CreateOrEditEntityGroupDto } from '../../../../shared/service-proxies/services/system-set-up.service';
import { TabAuditDetailComponent } from '../../audit-report/tab-audit-detail/tab-audit-detail.component';
import { TabAuditTeamComponent } from '../../audit-report/tab-audit-team/tab-audit-team.component';

@Component({
    selector: 'tab-view-audit-report',
    templateUrl: './tab-view-audit-report.component.html',
})
export class TabViewAuditReportComponent extends AppComponentBase implements OnInit {
    selectedItem: any;
    @Input('auditProjectId') auditProjectId: number;
    @Input('reauditPermissionFlag') reauditPermissionFlag: boolean;
    @Input('entityGroupId') entityGroupId: any;
    @Input('businessentityId') businessentityId: any;
    @Input('oldAuditProject') oldAuditProject: AuditProjectDto = new AuditProjectDto();
    @Input('vendorId') vendorId: any;
    @Output() closeModal = new EventEmitter();
    selectedInternalAssessmentId: any;
    entityGroup: EntityGroupDto[] = [];
    businessentiesList: BusinessEntityDto[] = [];
    auditproject: AuditProjectDto = new AuditProjectDto();
    auditprojectgroup: AuditProjectGroupDto = new AuditProjectGroupDto();
    businessentity: BusinessEnityGroupWiesDto[] = [];
    selectedBusinessEntity: BusinessEnityGroupWiesDto[] = [];
    entitygroupDetails: CreateOrEditEntityGroupDto = new CreateOrEditEntityGroupDto();

    @ViewChild(TabAuditDetailComponent) tabAuditDetail: TabAuditDetailComponent;
    @ViewChild(TabAuditTeamComponent) tabAuditTeam: TabAuditTeamComponent;

    constructor(_injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,

        private _auditProjectservice: AuditProjectServiceProxy,

        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {
        this.selectedItem = 1;
        this.getauditProject(this.oldAuditProject.id);
    }
    getAuditProjectManager(auditId, businessEntityId, entityGroupId) {
        this.auditProjectId = auditId;
        this.entityGroupId = entityGroupId;
        this.businessentityId = businessEntityId;
    }
    selectTab(e) {       
        this.selectedItem = e;
        if (e == 3) {
            this._auditProjectservice.createComplianceAuditSummary(this.auditProjectId).subscribe(res => {

            });
        }
    }
    tabSave() {        
        if (this.selectedItem == 2) {
            this.tabAuditDetail.save();
        }
        else if (this.selectedItem == 3) {
            this.tabAuditTeam.save();
        }
    }

    getauditProject(val) {
        this._auditProjectservice.getAuditProjectGroup(val).subscribe(res => {
            this.auditproject = res.auditProject;
            this.businessentiesList = res.businessEntity;
          
        })
    }


}
