import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { TableTopExerciseSectionModalComponent } from './table-top-exercise-section-modal/table-top-exercise-section-modal.component';
import { TableTopExerciseSectionServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
    selector: 'table-top-exercise-section',
    templateUrl: './table-top-exercise-section.component.html',
    styleUrls: ['./table-top-exercise-section.component.css']
})
export class TableTopExerciseSectionComponent extends AppComponentBase implements OnInit {
    @Input('name') name: any;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild("tableTopExerciseSectionModals", { static: true }) tableTopExerciseSectionModals: TableTopExerciseSectionModalComponent;
    filterText = "";
    
    constructor(_injector: Injector,       
        private _tableTopExerciseSectionServiceProxy: TableTopExerciseSectionServiceProxy
    ) {
        super(_injector);
       
    }

    ngOnInit() {
       
    }
   
    getTTXSection(event?: LazyLoadEvent) {
        
        this.primengTableHelper.showLoadingIndicator();
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }        
        this._tableTopExerciseSectionServiceProxy
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
    deleteSectionById(id) {
        this.message.confirm(`You want to delete`, this.l('Are you sure. '), isConfirmed => {
            if (isConfirmed) {
                this._tableTopExerciseSectionServiceProxy.delete(id).subscribe(() => {
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
