import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { TableTopExerciseQuestionModalComponent } from './table-top-exercise-question-modal/table-top-exercise-question-modal.component';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { TableTopExerciseServiceProxy } from '../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'table-top-exercise-question',
    templateUrl: './table-top-exercise-question.component.html',
    styleUrls: ['./table-top-exercise-question.component.css']
})
export class TableTopExerciseQuestionComponent extends AppComponentBase implements OnInit {
    @Input('name') name: any;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild("tableTopExerciseQuestionModals", { static: true }) tableTopExerciseQuestionModals: TableTopExerciseQuestionModalComponent;
    filterText = "";
    constructor(_injector: Injector,
        private _tableTopExerciseServiceProxy: TableTopExerciseServiceProxy
    ) {
        super(_injector);
        
    }

    ngOnInit() {        
      
    }
    getTTXQuestion(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();
        
        this._tableTopExerciseServiceProxy
            .getAll(this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event))
                
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
       
    }
    deleteQuestion(e) {
        
            this.message.confirm(`You want to delete`, this.l('Are you sure. '), isConfirmed => {
                if (isConfirmed) {
                    this._tableTopExerciseServiceProxy.delete(e).subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.reloadPage();
                    });
                }
            });
        
    }
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }
}
