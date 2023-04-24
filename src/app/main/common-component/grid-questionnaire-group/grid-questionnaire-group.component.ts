import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { QuestionGroupServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { Router } from '@angular/router';

@Component({
    selector: 'grid-questionnaire-group',
    templateUrl: './grid-questionnaire-group.component.html',
})
export class GridQuestionnaireGroupComponent extends AppComponentBase implements AfterViewInit {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    filterText = "";
    constructor(private _router: Router,
        injector: Injector, private _questionsGRPServiceProxy: QuestionGroupServiceProxy,
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {

    }

    getQuestionGroups(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._questionsGRPServiceProxy.getAllQuestionGroups(this.filterText,
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

    editQuestionnaireGroup(id,status) {
        this._router.navigate(['/app/main/create-edit-questionnaire-group'], { queryParams: { id: id,status:status } });
    }

    deleteQuestionGroup(id) {
        this.spinnerService.show();
        this._questionsGRPServiceProxy.removeQuestionGroup(id).subscribe(result => {
            this.spinnerService.hide();
            this.notify.success(this.l("SuccessfullyDeleted"));
            this.getQuestionGroups();
        }, error => {
            this.spinnerService.hide();
        });
    }
}
