import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { AuditProjectDto, BusinessEntityDto } from '../../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'audit-plan',
    templateUrl: './audit-plan.component.html',
    styleUrls: ['./audit-plan.component.css']
})
export class AuditPlanComponent extends AppComponentBase implements OnInit {

    
    @Input('auditproject') auditproject: AuditProjectDto;
    @Input('businessEntity') businessEntity: BusinessEntityDto[]=[];

    constructor(_injector: Injector,
        private _router: Router,
    ) {
        super(_injector);
    }
    auditType = [
        { name: 'Certification' },
        { name: 'Extra' },
        { name: 'Recertification' },
        { name: 'Surveillance' }
    ];
    facilityDetail = [
        { facility: 'ABC Hospital', locationDetails: 'ABC Hospital Pune', mobile: '9865323214', email: 'abc.hospital@gmail.com'},
        { facility: 'ABC Pharmacy', locationDetails: 'ABC Pharmacy Pune', mobile: '7845159636', email: 'abc.pharmacy@gmail.com' },
        { facility: 'ABC Hospital', locationDetails: 'ABC Hospital Pune', mobile: '8525784512', email: 'abc.hospital@gmail.com' },
        { facility: 'New Speciality Center', locationDetails: 'New Speciality Center Pune', mobile: '9556252587', email: 'Speciality.center@gmail.com' },
    ];  
    ngOnInit() {
       
    }
}
