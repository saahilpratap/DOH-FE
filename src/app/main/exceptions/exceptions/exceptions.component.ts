import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy, ExceptionsServiceProxy, ExceptionDto } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import { ReviewStatus } from "../../../../shared/service-proxies/services/exception.service";
import { ViewExceptionsModalComponent } from "./view-exceptions-modal.component";
import { AppConsts } from "../../../../shared/AppConsts";
import { HttpClient } from '@angular/common/http';
@Component({
    templateUrl: "./exceptions.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ExceptionsComponent extends AppComponentBase {   
    @ViewChild('viewExceptionsModals', { static: true }) viewExceptionsModals: ViewExceptionsModalComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    selectedRowData: any[];
    allDelete: boolean;
    reviewStatus = ReviewStatus;
    uploadUrl: string;
    concateUrl: string;
    filterText = "";
    constructor(
        injector: Injector,
        private _httpClient: HttpClient,
        private _exceptionsServiceProxy: ExceptionsServiceProxy,
       
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _router: Router
    ) {
        super(injector);
      
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

    getExceptions(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._exceptionsServiceProxy
            .getAll(this.filterText, "", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount =
                    result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createException() {
        this._router.navigate(["/app/main/exceptions/exceptions/new"]);
    }

  

    downloadPdf() {
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Exception/CreatePDF';
        window.open(this.uploadUrl, '_blank');
        //this._httpClient
        //    .get<any>(this.uploadUrl)
        //    .subscribe(response => {
               
        //    });
       
               
    }

   
    editException(id: any) {
        this._router.navigate(["/app/main/exceptions/exceptions/new"], {
            queryParams: {
                id: id
            }
        });
    }

    deleteException(exception: ExceptionDto): void {
        this.message.confirm("You Want To Delete This Record", this.l("AreYouSure"), isConfirmed => {
            if (isConfirmed) {
                 this._exceptionsServiceProxy
                     .delete(exception.id)
                     .subscribe(() => {
                         this.reloadPage();
                         this.notify.success(this.l("SuccessfullyDeleted"));
                     });
            }
        });
    }
}
