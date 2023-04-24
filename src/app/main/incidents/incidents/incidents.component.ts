import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
    IncidentsServiceProxy,
    IncidentDto,
    IncidentPriority,
    IncidentSeverity,
    IncidentStatus,
    IdAndName, IncidentTypesServiceProxy
} from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy } from "@shared/service-proxies/service-proxies";
import { CreateOrEditIncidentModalComponent } from "./create-or-edit-incident-modal.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import * as moment from "moment";
import { ViewIncidentModalComponent } from "./view-incident-modal.component";

@Component({
    templateUrl: "./incidents.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class IncidentsComponent extends AppComponentBase {
    @ViewChild('viewIncidentModals', { static: true }) viewIncidentModals: ViewIncidentModalComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = "";
    titleFilter = "";
    typeFilter = -1;
    priorityFilter = -1;
    severityFilter = -1;
    descriptionFilter = "";
    selectedRowData: any[];
    allDelete: boolean;
    incidentPriority = IncidentPriority;
    incidentSeverity = IncidentSeverity;
    incidentStatus = IncidentStatus;
    allIncidentStatus: IdAndName[] = [];
    statusId: IncidentStatus;
    nextStatusId: IncidentStatus;
    statuslabel: string = '';
    incidentTypeLookUp = [];

    priorities = [{
        id: 1,
        name: 'Low'
    }, {
        id: 2,
        name: 'Medium'
    }, {
        id: 3,
        name: 'High'
    }, {
        id: 4,
        name: 'Very High'
    }];
    constructor(
        injector: Injector,
        private _incidentsServiceProxy: IncidentsServiceProxy,
        private _tokenAuth: TokenAuthServiceProxy,
        private _incidentsTypesServiceProxy: IncidentTypesServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
        this.statusId = 0;
        this.loadAllIncidentStatus();
    }

    onSelectionChange(selection: any[]) {
        if (selection.length >= 2) {
            this.allDelete = true;
        }
        else if (selection.length <= 1) {
            this.allDelete = false;
        }
    }

    deleteAllRecord() {
        this.message.confirm("", this.l("AreYouSure"), isConfirmed => {
            if (isConfirmed) {

            }
        });
    }

    ngOnInit()
    {
        this.initializeIncidentTypesLookUp();
    }
    severityFilterChange(event) {
        if (event != null || event != undefined) {

        }
        else {
            this.severityFilter = -1;
        }
    }


    PriorityChange(event) {
        if (event != null || event != undefined) {

        }
        else {
            this.priorityFilter = -1;
        }
    }
    TypeChange(event) {
        if (event != null || event != undefined) {

        }
        else {
            this.typeFilter = -1;
        }
    }

    initializeIncidentTypesLookUp() {
        this._incidentsTypesServiceProxy.getAllForLookUp()
            .subscribe(res => {
                this.incidentTypeLookUp = res;
            });
    }

    getIncidents(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._incidentsServiceProxy
            .getAll(
                this.filterText,
                this.titleFilter,
                this.typeFilter,
                this.priorityFilter,
                this.severityFilter,
                this.descriptionFilter, this.statusId,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createIncident(): void {
        this._router.navigate(['/app/main/incidents/incidents/new']);
    }

    editIncident(incidentId: any) {
        this._router.navigate(['/app/main/incidents/incidents/new'], {
            queryParams: {
                incidentId: incidentId
            }
        });
    }

    deleteIncident(incident: IncidentDto): void {
        this.message.confirm("You Want To Delete This Record", this.l("AreYouSure?"), isConfirmed => {
            if (isConfirmed) {
                this._incidentsServiceProxy
                    .delete(incident.id)
                    .subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l("SuccessfullyDeleted"));
                    });
            }
        });
    }

    exportToExcel(): void {
        this._incidentsServiceProxy
            .getIncidentsToExcel(
                this.filterText,
                this.titleFilter,
                this.typeFilter,
                this.priorityFilter,
                this.severityFilter,
                this.descriptionFilter
            )
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    loadAllIncidentStatus() {
        this._incidentsServiceProxy.getIncidentStatusList()
            .subscribe(result => {
                this.allIncidentStatus = result;
            });
    }

    //initializeBeLookUpFields(val) {
    //    if (val != null) {
    //        this.statusId = val;
    //        this.nextStatusId = val + 1;
    //        var nextObj = this.allIncidentStatus.find(x => x.id == this.nextStatusId);
    //        if (nextObj != undefined) {
    //            this.statuslabel = nextObj.name;
    //        }
    //        this.getIncidents();
    //    }
    //}

    //inviteSelectedItemes() {
    //    console.log(this.nextStatusId);
    //}
}
