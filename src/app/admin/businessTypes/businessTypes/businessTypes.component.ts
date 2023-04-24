import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild,
    Injectable
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy } from "@shared/service-proxies/service-proxies";
import { CreateOrEditBusinessTypeModalComponent } from "./create-or-edit-businessType-modal.component";
import { ViewBusinessTypeModalComponent } from "./view-businessType-modal.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from 'primeng/table';
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from 'primeng/public_api';

import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import * as moment from "moment";

@Component({
    templateUrl: "./businessTypes.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
@Injectable()
export class BusinessTypesComponent extends AppComponentBase {
    @ViewChild("createOrEditBusinessTypeModal", { static: true })
    createOrEditBusinessTypeModal: CreateOrEditBusinessTypeModalComponent;
    @ViewChild("viewBusinessTypeModalComponent", { static: true })
    viewBusinessTypeModal: ViewBusinessTypeModalComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = "";
    nameFilter = "";

    constructor(
        injector: Injector,
        //private _businessTypesServiceProxy: BusinessTypesServiceProxy,      
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getBusinessTypes(event?: LazyLoadEvent) {
        //if (this.primengTableHelper.shouldResetPaging(event)) {
        //    this.paginator.changePage(0);
        //    return;
        //}

        //this.primengTableHelper.showLoadingIndicator();

        //this._businessTypesServiceProxy
        //    .getAll(
        //        this.filterText,
        //        this.nameFilter,
        //        this.primengTableHelper.getSorting(this.dataTable),
        //        this.primengTableHelper.getSkipCount(this.paginator, event),
        //        this.primengTableHelper.getMaxResultCount(this.paginator, event)
        //    )
        //    .subscribe(result => {
        //        this.primengTableHelper.totalRecordsCount = result.totalCount;
        //        this.primengTableHelper.records = result.items;
        //        this.primengTableHelper.hideLoadingIndicator();
        //    });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createBusinessType(): void {
        this.createOrEditBusinessTypeModal.show();
    }

    //deleteBusinessType(businessType: BusinessTypeDto): void {
    //    this.message.confirm("", this.l("AreYouSure"), isConfirmed => {
    //        if (isConfirmed) {
    //            this._businessTypesServiceProxy
    //                .delete(businessType.id)
    //                .subscribe(() => {
    //                    this.reloadPage();
    //                    this.notify.success(this.l("SuccessfullyDeleted"));
    //                });
    //        }
    //    });
    //}

    //exportToExcel(): void {
    //    this._businessTypesServiceProxy
    //        .getBusinessTypesToExcel(this.filterText, this.nameFilter)
    //        .subscribe(result => {
    //            this._fileDownloadService.downloadTempFile(result);
    //        });
    //}

}
