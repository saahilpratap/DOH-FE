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
import { ExternalAssessmentsServiceProxy, ExternalAssessmentType, AssessmentServiceProxy } from "../../../../../../shared/service-proxies/service-proxies";

@Component({
    selector: "grid-view-external-assessments",
    templateUrl: "./grid-view-external-assessments.component.html",
    styleUrls: ["./grid-view-external-assessments.component.css"],
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.None,
})
export class GridViewExternalAssessmentsComponent extends AppComponentBase implements OnInit {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    allDelete: boolean;
    selectedRowData: any[];
    externalAssessmentType = ExternalAssessmentType;
    constructor(
        injector: Injector,
        private _assessmentServiceProxy: AssessmentServiceProxy,
        private _externalAssessmentService: ExternalAssessmentsServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    ngOnInit() {

    }
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }
    getExternalAssessments(event?: LazyLoadEvent) {
     
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._externalAssessmentService
            .getAll(null, null, null, null, null, null, 0, null, null, null, null, null,
                null, null, null, null, null, null,
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
    onSelectionChange(selection: any[]) {
        if (selection.length >= 2) {
            this.allDelete = true;
        }
        else if (selection.length <= 1) {
            this.allDelete = false;
        }
    }
    generateQuestionaire(externalAssessmentId): void {
        this.message.confirm('', this.l('AreYouSure'), isConfirmed => {
            if (isConfirmed) {
                this.spinnerService.show();
                this._externalAssessmentService
                    .generateQuestionaire(externalAssessmentId)
                    .subscribe(
                        () => {
                            this.spinnerService.hide();
                            this.reloadPage();
                            abp.message.success('Successfully Generated!');

                        },
                        error => {
                            //this.message.error(
                            //    'Couldn\'t Generate Questionaire at this time!'
                            //);
                            this.spinnerService.hide();
                        }
                    );
            }
        });

    }
    createExternalAssessment(): void {
        this._router.navigate([
            '/app/main/externalAssessments/externalAssessments/new'
        ]);
    }

    editExternalAssessment(id: number, buttonstatus?: any): void {
        this._router.navigate(
            ['/app/main/externalAssessments/externalAssessments/new'],
            {
                queryParams: {
                    id: id,
                    buttonstatus: buttonstatus
                }
            }
        );
    }
    deleteExternalAssessment(externalAssessmentId): void {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), isConfirmed => {
            if (isConfirmed) {
                this.spinnerService.show();
                this._externalAssessmentService
                    .delete(externalAssessmentId)
                    .subscribe(
                        () => {
                            this.spinnerService.hide();                            
                            abp.message.success('Successfully Delete!');
                            this.ngOnInit();
                        },
                        error => {
                            this.message.error(
                                'Couldn\'t Delete  at this time!'
                            );
                            this.spinnerService.hide();
                        }
                    );
            }
        });
    }

    gotocomplianceQuestion(res) {
      
        this._assessmentServiceProxy.getEncryptAssessmentParameter(res, true).subscribe((encryptRessult) => {
            this._router.navigate([
                "/app/main/externalAssessments/externalAssessments/" +
                encryptRessult.assessmentId +
                "/compliance-questionaire/",
            ]);
        });
    }
}
