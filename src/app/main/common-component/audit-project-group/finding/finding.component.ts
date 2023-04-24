import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { FindingReportServiceProxy, EntityType, GetBusinessEntitiesExcelDto, FindingListAuditDto, FindingReportType, ControlRequirementsServiceProxy, BusinessEntitiesServiceProxy, AuditProjectServiceProxy, IdNameDto, AuditProjectDto, AuditProjectGroupDto, BusinessEntityDto } from "@shared/service-proxies/service-proxies";
import { CreateOrEditEntityGroupDto } from '../../../../../shared/service-proxies/services/system-set-up.service';

@Component({
    selector: 'finding',
    templateUrl: './finding.component.html',
    styleUrls: ['./finding.component.css']
})
export class FindingComponent extends AppComponentBase implements OnInit {
    entityid: any;
    @Input('auditprojectinfo') auditprojectinfo: AuditProjectGroupDto;
    auditproject: AuditProjectDto = new AuditProjectDto();
    entitygroupDetails: CreateOrEditEntityGroupDto = new CreateOrEditEntityGroupDto();
    businessEntity: BusinessEntityDto[] = [];

    allFinding: FindingListAuditDto[] = [];
    finding: FindingListAuditDto[] = [];
    entityList: IdNameDto[] = [];
    auditProjecEntityList: number[] = [];
    selectedEntityId: number = 0;
    findingType: string = undefined;
    flag: boolean = false;
    businessEntitiesLookUp: GetBusinessEntitiesExcelDto[] = [];
    step: string;
    auditSpecific: boolean;
    findingDetail = [
        { detail: 'Dispaly all internal and External Audit Finding of antity selected' },
        { detail: 'Dispaly all internal and External Audit Finding of antity selected' }

    ]

    constructor(_injector: Injector,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _findingReportServiceProxy: FindingReportServiceProxy,
        public _auditProjectService: AuditProjectServiceProxy,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit() {
        this.spinnerService.show();
        this.auditproject = this.auditprojectinfo.auditProject;
        this.businessEntity = this.auditprojectinfo.businessEntity;
        this.entitygroupDetails = this.auditprojectinfo.auditProject.entityGroup;
        this.getFinding();
        this.step = 'step1';
    }

    filterData(val: string, flag: boolean) {
        this.finding = this.allFinding;

        if (this.selectedEntityId != 0)
            this.finding = this.finding.filter(x => x.entityId == this.selectedEntityId);

        if (this.findingType === 'External' || this.findingType === 'Internal')
            this.finding = this.finding.filter(x => x.type == val);

        if (this.findingType == 'External' && this.flag == true) {
            var temp = [];
            this.finding.forEach(x => {
                var valid = this.auditProjecEntityList.find((y) => y === x.entityId);
                if (valid) {
                    temp.push(x);
                }
            });
            this.finding = temp;
        }
    }

    setFindingType(val: string) {
        switch (val) {
            case "":
                this.step = 'step1';
                this.auditSpecific = false;
                break;
            case "Internal":
                this.step = 'step2';
                this.auditSpecific = true;
                break;
            case "External":
                this.step = 'step3';
                this.auditSpecific = false;
                break;
        }   
        this.findingType = val;
        this.filterData(this.findingType, this.flag);       
    }

    SetEntity(val: number) {       
        this.selectedEntityId = val;
        this.filterData(this.findingType, this.flag);       
    }

    IsAuditOrNot() {
        this.step = '';
        this.flag = !this.flag;
        this.filterData(this.findingType, this.flag);       
    }

    getFinding() {
        this.finding = [];
        this._auditProjectService.getAllFindingForAuditProject(this.auditproject.id, this.selectedEntityId).subscribe(res => {
            this.allFinding = res.findingListAudits;
            this.finding = this.allFinding;
            this.selectedEntityId = this.finding.length == 0 ? 0 : this.finding[0].entityId;
            this.filterData(this.findingType, this.flag);
            this.findingType = '';
            this.auditProjecEntityList = res.entityList;
            this.spinnerService.hide();
        });
    }    
}
