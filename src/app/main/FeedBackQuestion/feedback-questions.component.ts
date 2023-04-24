import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy, QuestionDto, FeedbacksServiceProxy } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import { CreateOrEditFeedbackQuestionModalComponent } from "./create-or-edit-feedback-question-modal.component";
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { AppConsts } from "../../../shared/AppConsts";

@Component({
    templateUrl: "./feedback-questions.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class FeedbackQuestionsComponent extends AppComponentBase {
    @ViewChild("createOrEditFeedbackQuestionModal", { static: true })
    createOrEditFeedbackQuestionModal: CreateOrEditFeedbackQuestionModalComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild('ExcelFileUpload', { static: false }) excelFileUpload: FileUpload;

    advancedFiltersAreShown = false;
    filterText = "";
    codeFilter = "";
    nameFilter = "";
    descriptionFilter = "";
    selectedRowData: any[];
    allDelete: boolean;
    uploadUrl = "";
    exportButtonHide: boolean;
    exceptionPermission: boolean;
    constructor(
        injector: Injector,
        private _feedbacksServiceProxy: FeedbacksServiceProxy,
        private _httpClient: HttpClient,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);        
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Import/ImportExternalQuestions';
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
    getQuestions(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._feedbacksServiceProxy
            .getAllFeedbackQuestion(this.filterText,
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

    createQuestion(): void {
        this.createOrEditFeedbackQuestionModal.show();
    }

    deleteQuestion(question: QuestionDto): void {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), isConfirmed => {
            if (isConfirmed) {
                this._feedbacksServiceProxy
                    .deleteFeedback(question.id)
                    .subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l("SuccessfullyDeleted"));
                    });
            }
        });
    }
}
