import { Component, OnInit, Injector, ViewChild, ViewEncapsulation, Input } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { Router } from "@angular/router";
import * as moment from "moment";
import * as _ from "lodash";
import { PrimengTableHelper } from "../../../../../shared/helpers/PrimengTableHelper";
import { AssessmentServiceProxy, AssessmentStatus } from "../../../../../shared/service-proxies/service-proxies";
import { CreateOrEditAssessmentModalComponent } from "../../create-or-edit-assessment-modal.component";
import { AssessmentDetailModalComponent } from "../../../audit-project-management/assessment-detail-modal/assessment-detail-modal.component";

@Component({
    selector: "grid-all-assessments",
    templateUrl: "./grid-all-assessments.component.html",
    styleUrls: ["./grid-all-assessments.component.css"],
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.None,
})
export class GridAllAssessmentsComponent extends AppComponentBase implements OnInit {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    assessmentStatus = AssessmentStatus;
    selectedAssessmentStatusFilter: AssessmentStatus = null;
    deleteAll: boolean;
    info: string = '';
    @Input('auditProId') auditProID: any;
    @ViewChild("createOrEditAssessmentModal", { static: true })
    createOrEditAssessmentModal: CreateOrEditAssessmentModalComponent;
    @Input("reauditPermission") reauditPermission: boolean;

    @ViewChild('assessmentDetailModals', { static: true }) assessmentDetailModals: AssessmentDetailModalComponent;
    constructor(
        injector: Injector,
        private _assessmentServiceProxy: AssessmentServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    ngOnInit() {       
        this.selectedAssessmentStatusFilter = AssessmentStatus.SentToAuthority;
    }

    getAssessments(event?: LazyLoadEvent) {    
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();
        this._assessmentServiceProxy
            .getAllAssessment (
                this.selectedAssessmentStatusFilter,
                this.appSession.user.businessEntityId,
                "",                
                null,
                null,
                this.auditProID,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe((result) => {
                var asessments = result.items;
                var filterAssessment = _.chain(result.items)
                    .groupBy("name")
                    .map(function (v, i) {
                        return {
                            name: i,
                            asessments: _.chain(v)
                                .groupBy("info")
                                .map(function (v) {
                                    return {
                                        asessmentlist: v
                                            .filter((x) => x.isPrimaryEntity == true)
                                            .concat(
                                                v.filter((y) => y.isPrimaryEntity == false)
                                            ),
                                    };
                                })
                                .value(),
                        };
                    })
                    .value();
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = filterAssessment;
                if (filterAssessment.length > 0) {
                    for (var i = 0; i < filterAssessment.length; i++) {
                        filterAssessment[i].name = filterAssessment[i].asessments[0].asessmentlist[0].info;
                    }
                }
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    onSelectionChange(selection: any[]) {
        if (selection.length >= 2) {
            this.deleteAll = true;
        } else if (selection.length <= 1) {
            this.deleteAll = false;
        }
    }
    eventClicked(event) {
        this.createOrEditAssessmentModal.show();       
    }
    gotocomplianceQuestion(res) {
        this._assessmentServiceProxy.getEncryptAssessmentParameter(res, false).subscribe((encryptRessult) => {          
            this._router.navigate([
                "/app/main/assessments/assessments/" +
                encryptRessult.assessmentId +
                "/" +
                encryptRessult.flag +
                "/compliance-questionaire/",
            ]);
        });
    }
}
