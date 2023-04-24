import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { BusinessEntityDto, AuditSurviellanceProjectDto, AuditReportEntitiesFacilityDto, AuditReportFacilityDto, AuditSurviellanceEntitiesDto, BusinessEntitiesServiceProxy, AuditReportEntitiesDto, AuditReportServiceProxy, AuditProjectServiceProxy, CommonLookupServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { options } from '@amcharts/amcharts4/core';

@Component({
    selector: 'tab-audit-detail',
    templateUrl: './tab-audit-detail.component.html',
    styleUrls: ['./tab-audit-detail.component.css']
})
export class TabAuditDetailComponent extends AppComponentBase implements OnInit {

    type: any;
    @Input('businessentiesList') businessentiesList: BusinessEntityDto[] = [];
    @Input('auditProjectId') auditProjectId: number;
    @Input('businessEntityId') businessEntityId: number[] = [];
    auditReportEntitiesInput: AuditReportEntitiesDto[] = [];
    AuditReportEntitiesFacility = new AuditReportEntitiesFacilityDto();

    facilitiesLocation: AuditReportFacilityDto[] = [];
   @Input('reauditPermission') reauditPermission: boolean;
   // reauditPermission: boolean;
    IsAdmin: boolean;



    constructor(_injector: Injector,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private auditReportService: AuditReportServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _router: Router,
        private _auditServiceProxy: AuditProjectServiceProxy,
    ) {
        super(_injector);
    }

    ngOnInit() {
       
        this.IsAdmin = this.appSession.user.isAdmin;
        this.spinnerService.show();
        this.auditReportService.getInitilizeAuditEntities(this.auditProjectId).subscribe(res => {

            this.AuditReportEntitiesFacility.auditReportEntities = [];
            this.AuditReportEntitiesFacility.auditReportEntities = res.auditReportEntities;
            this.AuditReportEntitiesFacility.auditReportyFacilitys = res.auditReportyFacilitys;
            if (res.auditReportEntities.length == 0) {
                this.businessentiesList.forEach(obj => {
                    var item = new AuditReportEntitiesDto();
                    item.auditProjectId = this.auditProjectId;
                    item.businessEntityId = obj.id;
                    this.AuditReportEntitiesFacility.auditReportEntities.push(item);
                });
            }
            if (res.auditReportyFacilitys.length == 0) {
                this.AuditReportEntitiesFacility.auditReportyFacilitys = [];
                let item = new AuditReportFacilityDto();
                item.auditProjectId = this.auditProjectId;
                this.AuditReportEntitiesFacility.auditReportyFacilitys.push(item);
            }
            this.spinnerService.hide();
        }, err => {
            this.spinnerService.hide();
            this.message.error(err.error.error.message);
        });
    }

    save() {
        if (this.AuditReportEntitiesFacility.removedFacilitys != undefined) {

            this.AuditReportEntitiesFacility.removedFacilitys = this.AuditReportEntitiesFacility.removedFacilitys.filter(Number);
        }
        this.spinnerService.show();
        this.auditReportService.createOrEditAuditEntities(this.AuditReportEntitiesFacility).subscribe(res => {
            this.notify.info('Record Save Successfully');
            this.ngOnInit();
            this.spinnerService.hide();
        }, err => {
            this.spinnerService.hide();
            this.message.error(err.error.error.message);
        });
    }

    addItem(item) {


        let items = new AuditReportFacilityDto();
        items.auditProjectId = this.auditProjectId;
        this.AuditReportEntitiesFacility.auditReportyFacilitys.push(items);

        //this.demoArray.push(this._formBuilder.control(false));
    }

    removeItem(answerOption: AuditReportFacilityDto) {

        this.AuditReportEntitiesFacility.auditReportyFacilitys = this.AuditReportEntitiesFacility.auditReportyFacilitys.filter(
            options => options != answerOption
        );
        this.AuditReportEntitiesFacility.removedFacilitys = this.AuditReportEntitiesFacility.removedFacilitys == undefined ? [] : this.AuditReportEntitiesFacility.removedFacilitys;
        this.AuditReportEntitiesFacility.removedFacilitys.push(answerOption.id);
        //let index = this.AuditReportEntitiesFacility.auditReportyFacilitys.findIndex(d => d.id === i); //find index in your array
        //this.AuditReportEntitiesFacility.auditReportyFacilitys.splice(index, 1);

    }


}
