import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { AgreementAcceptanceLogServiceProxy, AgreementAcceptanceDto, BusinessEntityFacilityTypeLookupTableDto, BusinessEntitiesServiceProxy, BusinessEntityUserDto } from "../../../shared/service-proxies/service-proxies";
import * as moment from "moment";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { parseDate } from "ngx-bootstrap";
import { LazyLoadEvent } from 'primeng/public_api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';
import * as _ from "lodash"; 
import { appModuleAnimation } from "../../../shared/animations/routerTransition";
@Component({
    selector: "app-agreenment-acceptance-log",
    templateUrl: "./agreenment-acceptance-log.component.html",
    styleUrls: ["./agreenment-acceptance-log.component.css"],
     encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class AgreenmentAcceptanceLogComponent implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    toDateFilter: string;
    fromDateFilter: string;
    agreementAcceptances: AgreementAcceptanceDto[] = [];
    users: BusinessEntityUserDto[] = [];
    healthEntitys: BusinessEntityFacilityTypeLookupTableDto[] = [];
    userFilter: any;
    entityFilter: any;
    businessEntityId;
    primengTableHelper = new PrimengTableHelper();
    constructor(
        private _agreementAcceptanceService: AgreementAcceptanceLogServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _fileDownloadService: FileDownloadService,
    ) {
        
    }

   

    ngOnInit() {
        parseDate(this.fromDateFilter).setDate(parseDate(this.toDateFilter).getDate() - 7);
        this.getEntity();
        this.getuser();
    }

    getuser() {
        this._businessEntitiesServiceProxy.getAllAggrementsUsers().subscribe(data => this.users = data);
        
    }
    getEntity() {
        this._businessEntitiesServiceProxy.getAllHealthCareEntity().subscribe(data => this.healthEntitys = data);
    }
    getAllAccptancelog(event?: LazyLoadEvent) {  
        if (this.primengTableHelper.shouldResetPaging(event))
        {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        let FromDate = "";
        let ToDate = "";
        if (this.fromDateFilter != '' || this.fromDateFilter != undefined) {
            FromDate = moment(this.fromDateFilter).format("MM/DD/YYYY");
        }
        if (this.toDateFilter != '' || this.toDateFilter != undefined) {
            ToDate = moment(this.toDateFilter).format("MM/DD/YYYY");
        }
        this._agreementAcceptanceService.getAllAgreementAcceptLog(FromDate, ToDate, this.userFilter, this.entityFilter,
            this.primengTableHelper.getSorting(this.dataTable),
           this.primengTableHelper.getMaxResultCount(this.paginator, event),
           this.primengTableHelper.getSkipCount(this.paginator, event)
            ).subscribe(res => {
                this.primengTableHelper.totalRecordsCount = res.totalCount;
            this.primengTableHelper.records = res.items;
             this.primengTableHelper.hideLoadingIndicator();
            });
      
    }

    exportToExcel(): void {
        let FromDate = "";
        let ToDate = "";
        if (this.fromDateFilter != '' || this.fromDateFilter != undefined) {
            FromDate = moment(this.fromDateFilter).format("MM/DD/YYYY");
        }
        if (this.toDateFilter != '' || this.toDateFilter != undefined) {
            ToDate = moment(this.toDateFilter).format("MM/DD/YYYY");
        }
        this._agreementAcceptanceService
            .getAggrementLogToExcel
            (
                FromDate, ToDate, this.userFilter, this.entityFilter
            )
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    
}
