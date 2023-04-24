import { Component, OnInit } from "@angular/core";
import { DashboardCustomizationConst } from "@app/shared/common/customizable-dashboard/DashboardCustomizationConsts";

@Component({
    selector: "app-audit-dashboard",
    templateUrl: "./audit-dashboard.component.html",
    styleUrls: ["./audit-dashboard.component.css"]
})
export class AuditDashboardComponent implements OnInit {
    dashboardName =
        DashboardCustomizationConst.dashboardNames.defaultTenantDashboard;
    constructor() {}

    ngOnInit() {}
}
