import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DashboardCustomizationConst } from '@app/shared/common/customizable-dashboard/DashboardCustomizationConsts';
import { BusinessEntitiesServiceProxy, AuditProjectServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { debuglog } from 'util';
import { DomSanitizer } from '@angular/platform-browser';
import { appModuleAnimation } from '../../../shared/animations/routerTransition';
import { PivotGridComponent } from '../../shared/common/pivot-grid/pivot-grid.component';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class DashboardComponent extends AppComponentBase {
    dashboardName = DashboardCustomizationConst.dashboardNames.defaultTenantDashboard;
    selectedItem: number = 1;
    @ViewChild(PivotGridComponent) pivotGrid: PivotGridComponent;
    dateForm: Date;
    dateTo: Date;
    data = [{

    }]
    auditdata = [{

    }];    
    pivotGridDataSource: any;
    constructor(
        injector: Injector,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy, private _auditProjectServiceProxy: AuditProjectServiceProxy, private sanitizer: DomSanitizer,
    ) {
        super(injector);
        am4core.useTheme(am4themes_animated);
    }
    selectTab(e) {     
        this.selectedItem = e;
        switch (e) {
            case 2:
                this.spinnerService.show();
                this._businessEntitiesServiceProxy.getGroupEntityPivotGrid()
                    .subscribe(result => {
                        this.data = result;
                        this.pivotGrid.assessmentData(result);
                    });                
                break;
            case 3:
                this.spinnerService.show();
                this._auditProjectServiceProxy.getAuditProjectPivotGrid().subscribe(result => {                    
                    this.auditdata = result;
                    this.pivotGrid.auditProgramData(result);
                }); 
                break;            
        }
    }
    ngOnInit() {      
      
    }
    getData() {
        this._businessEntitiesServiceProxy.getGroupEntityPivotGrid()
            .subscribe(result => {
                this.data = result;
            });
    }
    getAuditProjectData() {
        this._auditProjectServiceProxy.getAuditProjectPivotGrid().subscribe(result => {
            this.auditdata = result;
        })
    }   
}
