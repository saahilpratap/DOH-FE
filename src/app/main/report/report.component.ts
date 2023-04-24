import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DashboardCustomizationConst } from '@app/shared/common/customizable-dashboard/DashboardCustomizationConsts';
import { BusinessEntitiesServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { debuglog } from 'util';

@Component({
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.less'],    
})

export class ReportComponent extends AppComponentBase {
   
    pivotGridDataSource: any;
    constructor(
        injector: Injector,      
    ) {
        super(injector);
    }    
    ngOnInit() {
        this.getData();      
    }

    getData() {        
    
    }
}
