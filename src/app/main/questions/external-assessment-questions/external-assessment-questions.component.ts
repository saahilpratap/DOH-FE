import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy, QuestionsServiceProxy, QuestionDto, ControlRequirementsServiceProxy } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import { CreateOrEditExternalAssessmentQuestionModalComponent } from "./create-or-edit-external-assessment-question-modal.component";
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { AppConsts } from "../../../../shared/AppConsts";

@Component({
    templateUrl: "./external-assessment-questions.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ExternalAssessmentQuestionsComponent extends AppComponentBase {
    @ViewChild("createOrEditExternalAssessmentQuestionModal", { static: true })
    createOrEditExternalAssessmentQuestionModal: CreateOrEditExternalAssessmentQuestionModalComponent;
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
        private _questionsServiceProxy: QuestionsServiceProxy,
        private _httpClient: HttpClient,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
        this.exportPermission();
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

        this._questionsServiceProxy
            .getAllExternalQuestions(this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event)
            )
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
                this.exportHide();
            });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createQuestion(): void {
        this.createOrEditExternalAssessmentQuestionModal.show();
    }

    deleteQuestion(question: QuestionDto): void {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), isConfirmed => {
            if (isConfirmed) {
                this._questionsServiceProxy
                    .deleteExternalQuestion(question.id)
                    .subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l("SuccessfullyDeleted"));
                    });
            }
        });
    }
    importFile(data: { files: File }): void {
        const formData: FormData = new FormData();
        const file = data.files[0];
        this.message.confirm('', this.l('Are You Sure You Want To Import ' + file.name), (isConfirmed) => {
            if (isConfirmed) {
                formData.append('file', file, file.name);
                this.notify.success(this.l('Import Questions Process Start'));
                this._httpClient
                    .post<any>(this.uploadUrl, formData)
                    .pipe(finalize(() => this.excelFileUpload.clear()))
                    .subscribe(response => {
                        if (response.success) {
                            this.notify.success(this.l('All External Assessment Question - Import Completed'));
                        } else if (response.error != null) {
                            this.notify.error(this.l('Import Questions Process Failed'));
                        }
                    });
            }
            });
    }

    exportToExcel(): void {
        this.spinnerService.show();
        this._questionsServiceProxy.getExternalQuestionsToExcel(this.filterText, this.codeFilter, this.nameFilter, this.descriptionFilter).subscribe(
            result => {
                this._fileDownloadService.downloadTempFile(result);
                this.spinnerService.hide();
            },
            error => {
                this.spinnerService.hide();
            }
        );
    }

    exportHide() {
        if (this.primengTableHelper.totalRecordsCount == 0) {
            this.exportButtonHide = false;
        }
        else {
            this.exportButtonHide = true;
        }
    }

    exportPermission() {
        this.exceptionPermission = this.isGranted("Pages.ComplianceManagement.ExternalAssessmentQuestions.Export");
    }
}
