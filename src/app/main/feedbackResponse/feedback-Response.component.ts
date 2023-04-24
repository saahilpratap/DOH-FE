import {
Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import * as moment from "moment";
import { ComplianceManagementServiceProxy } from "@shared/service-proxies/services/compliance-management.service";
import { TokenAuthServiceProxy, QuestionDto, FeedbacksServiceProxy } from "@shared/service-proxies/service-proxies";
import { HttpClient } from "@angular/common/http";
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from "@angular/router";
import { FeedbackEntityQuestionResponseModalComponent } from '../feedbackResponse/feedback-entity-modal.component';

@Component({
    templateUrl: "./feedback-Response.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class FeedbackResponseComponent extends AppComponentBase {
    @ViewChild("FeedbackEntityResponseModal", { static: true }) FeedbackEntityResponseModal: FeedbackEntityQuestionResponseModalComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    selectedRowData: any[];
    filterText = "";
   
    constructor(
        injector: Injector,
        private _feedbacksServiceProxy: FeedbacksServiceProxy,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,        
        private _router: Router
    ) {
        super(injector);        
    }

    createQuestion(): void
    {

    }

    getFeedbackResponse(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._feedbacksServiceProxy
            .getEntityFeedbackResponse(this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event)
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

    onSelectionChange(selection: any[]) {
        if (selection.length >= 2) {
           
        }
        else if (selection.length <= 1) {
           
        }
    }
}
