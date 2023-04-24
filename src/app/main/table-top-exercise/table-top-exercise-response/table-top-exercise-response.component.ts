import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { TableTopExerciseResponseModalComponent } from './table-top-exercise-response-modal/table-top-exercise-response-modal.component';
import { SubscriptionServiceProxy, TableTopExerciseServiceProxy } from '../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'table-top-exercise-response',
    templateUrl: './table-top-exercise-response.component.html',
    styleUrls: ['./table-top-exercise-response.component.css']
})
export class TableTopExerciseResponseComponent extends AppComponentBase implements OnInit {
    @Input('name') name: any;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild("tableTopExerciseResponseModals", { static: true }) tableTopExerciseResponseModals: TableTopExerciseResponseModalComponent;
    filterText = "";



    constructor(_injector: Injector,
        private _tableTopExerciseAppService: TableTopExerciseServiceProxy
    ) {
        super(_injector);

    }

    ngOnInit() {

    }
    getTTXResponse(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this._tableTopExerciseAppService.getAllTabletopExerciseEntity
            (this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event))

            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {                
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }
}
