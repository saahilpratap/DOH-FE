import { Component, OnInit, Injector } from '@angular/core';
import { DashboardCustomizationConst } from '@app/shared/common/customizable-dashboard/DashboardCustomizationConsts';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  selector: 'app-entity-dashboard',
  templateUrl: './entity-dashboard.component.html',
  styleUrls: ['./entity-dashboard.component.css'],
})
export class EntityDashboardComponent extends AppComponentBase
  implements OnInit {
  dashboardName =
    DashboardCustomizationConst.dashboardNames.defaultTenantDashboard;
  busy = true;
  constructor(private injector: Injector) {
    super(injector);
  }

    ngOnInit() {
        setTimeout(() => {
            this.busy = false;            
        }, 3000);
    }
}
