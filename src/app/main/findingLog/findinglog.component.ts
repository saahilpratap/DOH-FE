import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";

import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import { ContactsServiceProxy, TokenAuthServiceProxy, FindingReportLogDto, FindingReportServiceProxy, HangfireCustomServiceProxy } from "shared/service-proxies/service-proxies";
import { AppConsts } from "shared/AppConsts";
import { HttpClient } from "@angular/common/http";
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: "./findinglog.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class findingLogComponent extends AppComponentBase {
   
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    selectedRowData: any[];  
    advancedFiltersAreShown = false;
    filterText = "";
   
    exportButtonHide: boolean;
    exceptionPermission: boolean;

    constructor(
        injector: Injector,
        private _findingReportServiceProxy: FindingReportServiceProxy,
      
        private _hangfireCustomServiceProxy: HangfireCustomServiceProxy,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,     
        private _httpClient: HttpClient
    ) {
        super(injector);
             
    }
   
   
    getFindinglog(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        //this._findingReportServiceProxy
        //    .getAllFindingLogs(this.filterText, this.primengTableHelper.getSorting(this.dataTable),
        //        this.primengTableHelper.getSkipCount(this.paginator, event),
        //        this.primengTableHelper.getMaxResultCount(this.paginator, event)).subscribe(result => {
        //        this.primengTableHelper.totalRecordsCount = result.totalCount;
        //        this.primengTableHelper.records = result.items;
        //        this.primengTableHelper.hideLoadingIndicator();

        //        });
       
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

  

   

   
  
}
