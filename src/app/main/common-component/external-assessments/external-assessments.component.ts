import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '../../../../shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/public_api';
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { ExternalAssessmentsServiceProxy, ExternalAssessmentType } from "@shared/service-proxies/service-proxies";

@Component({
    selector: 'external-assessments',
    templateUrl: './external-assessments.component.html',
})
export class ExternalAssessmentsGridComponent extends AppComponentBase implements AfterViewInit {
   
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @Input('auditProId') auditProID: any;
    filterText = "";
    externalAssessmentType = ExternalAssessmentType;

    constructor(injector: Injector,
        private _externalAssessmentService: ExternalAssessmentsServiceProxy
    ) {
        super(injector);
        this.externalAssessmentType = ExternalAssessmentType;
    }

    ngAfterViewInit(): void {
       
    }

    getExternalAssessments(event?: LazyLoadEvent)
    {
        if (this.auditProID != null) {
            if (this.primengTableHelper.shouldResetPaging(event)) {
                this.paginator.changePage(0);
                return;
            }

            this.primengTableHelper.showLoadingIndicator();

            this._externalAssessmentService
                .getAllExternalAssementByProjectId(this.filterText, this.auditProID,
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
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    generateQuestionaire(externalAssessmentId): void {
        this.message.confirm("", this.l("AreYouSure"), isConfirmed => {
            if (isConfirmed) {
                this.spinnerService.show();
                this._externalAssessmentService
                    .generateQuestionaire(externalAssessmentId)
                    .subscribe(
                        () => {
                            this.message.success("Successfully Generated!");
                            this.spinnerService.hide();
                            this.reloadPage();
                        },
                        error => {
                            this.message.error(
                                "Couldn't Generate Questionaire at this time!"
                            );
                            this.spinnerService.hide();
                        }
                    );
            }
        });
    }

}
