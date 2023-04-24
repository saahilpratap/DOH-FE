import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { AuditProjectGroupDto, AuditProjectDto, BusinessEntityDto, EntityPrimaryDto, AuditDecisionServiceProxy, AuditReportEntitiesDto, AuditReportServiceProxy, AuditReportDto, BusinessEntitiesServiceProxy, BusinessEntityUserDto } from '../../../../../shared/service-proxies/service-proxies';
import { CreateOrEditEntityGroupDto } from '../../../../../shared/service-proxies/services/system-set-up.service';

@Component({
    selector: 'audit-report',
    templateUrl: './audit-report.component.html',
    styleUrls: ['./audit-report.component.css']
})
export class AuditReportComponent extends AppComponentBase implements OnInit {
    @Input('auditprojectinfo') auditprojectinfo: AuditProjectGroupDto;
    auditproject: AuditProjectDto = new AuditProjectDto();
    entitygroupDetails: CreateOrEditEntityGroupDto = new CreateOrEditEntityGroupDto();
    selectedGroupId: number;
    selectedFacilityId: number;
    businessEntity: BusinessEntityDto[] = [];
    entityPrimary: EntityPrimaryDto = new EntityPrimaryDto();
    auditReportEntitiesInput: AuditReportEntitiesDto[] = [];
    auditReportInput: AuditReportDto = new AuditReportDto();
    auditAgencyAdmins: BusinessEntityUserDto[] = [];


    facilityDetail = [
        { facility: 'ABC Hospital', locationDetails: 'ABC Hospital Pune', mobile: '9865323214', email: 'abc.hospital@gmail.com' },
        { facility: 'ABC Pharmacy', locationDetails: 'ABC Pharmacy Pune', mobile: '7845159636', email: 'abc.pharmacy@gmail.com' },
        { facility: 'ABC Hospital', locationDetails: 'ABC Hospital Pune', mobile: '8525784512', email: 'abc.hospital@gmail.com' },
        { facility: 'New Speciality Center', locationDetails: 'New Speciality Center Pune', mobile: '9556252587', email: 'Speciality.center@gmail.com' },
    ];
    facilitiesLocation = [
        { facilityTPAs: '', name: '', positions: '', email: '', },
        { facilityTPAs: '', name: '', positions: '', email: '', },
        { facilityTPAs: '', name: '', positions: '', email: '', },
        { facilityTPAs: '', name: '', positions: '', email: '', },
        { facilityTPAs: '', name: '', positions: '', email: '', },
    ]

    auditType = [
        { id: 1, name: 'Certification' },
        { id: 2, name: 'Extra' },
        { id: 3, name: 'Recertification' },
        { id: 4, name: 'Surveillance' }
    ];
    signaturePadOptions: Object = {
        'minWidth': 0.1,
        'canvasWidth': 280,
        'canvasHeight': 100,
        'penColor': 'rgb(0, 0, 128)'
    };

    constructor(_injector: Injector,
        private _router: Router,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private auditReportService: AuditReportServiceProxy,
        private _auditdecisionServiceProxy: AuditDecisionServiceProxy,
    ) {
        super(_injector);
    }

    ngOnInit() {
        
        this.auditproject = this.auditprojectinfo.auditProject;
        this.businessEntity = this.auditprojectinfo.businessEntity;
        this.entitygroupDetails = this.auditprojectinfo.auditProject.entityGroup;
        this.selectedGroupId = this.auditprojectinfo.auditProject.entityGroupId;
        this.onGroupChange(this.selectedGroupId);
        this.spinnerService.hide();
    }

    onGroupChange(id: number) {
        this._auditdecisionServiceProxy.getPrimaryEntityByEntityGroupId(id).subscribe(res => {
            this.entityPrimary = res;
            this.auditReport();
        })
    }

    auditReportEntities() {
        this.auditReportService.initilizeAuditEntities(this.auditproject.id).subscribe(res => {
            this.auditReportEntitiesInput = res;
            this.loadVendorUsers();
        });
    }

    auditReport() {
        this.auditReportService.initilizeAuditReport(this.auditproject.id).subscribe(res => {
            this.auditReportInput = res;
            this.auditReportEntities();
        });
    }

    loadVendorUsers() {
        this._businessEntitiesServiceProxy
            .getAllAuditAgencyAdmins(this.auditproject.vendorId)
            .subscribe(res => {
                setTimeout(() => {
                    this.auditAgencyAdmins = res;
                }, 1000);
            }, err => {
            });

    }
}
