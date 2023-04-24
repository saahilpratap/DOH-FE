import { Component, OnInit, Injector, ViewChild, ViewEncapsulation, } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { Router } from "@angular/router";
import * as moment from "moment";
import * as _ from "lodash";

@Component({
    selector: "grid-view-audit-projects",
    templateUrl: "./grid-view-audit-projects.component.html",
    styleUrls: ["./grid-view-audit-projects.component.css"],
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.None,
})
export class GridViewAuditProjectsComponent extends AppComponentBase implements OnInit {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;



    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {

    }
}
