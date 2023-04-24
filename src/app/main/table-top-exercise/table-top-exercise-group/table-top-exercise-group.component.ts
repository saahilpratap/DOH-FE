import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { TableTopExerciseGroupModalComponent } from './table-top-exercise-group-modal/table-top-exercise-group-modal.component';
import { TableTopExerciseGroupServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';


@Component({
    selector: 'table-top-exercise-group',
    templateUrl: './table-top-exercise-group.component.html',
    styleUrls: ['./table-top-exercise-group.component.css']
})
export class TableTopExerciseGroupComponent extends AppComponentBase implements OnInit {
    @Input('name') name: any;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild("tableTopExerciseGroupModals", { static: true }) tableTopExerciseGroupModals: TableTopExerciseGroupModalComponent;
    filterText = '';

    constructor(_injector: Injector,       
        private _tableTopExerciseGroupServiceProxy: TableTopExerciseGroupServiceProxy
    ) {
        super(_injector);
       
    }

    ngOnInit() {        
      
    }
    getTTXGroup(event?: LazyLoadEvent) {
        this.primengTableHelper.hideLoadingIndicator();
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();
        this._tableTopExerciseGroupServiceProxy
            .getAll(this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event))

            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {                
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
        this.primengTableHelper.hideLoadingIndicator();
    }

    getTTXSection(event?: LazyLoadEvent) {
  
    }
   
    deleteGroupById(id)
    {
        this.message.confirm(`You want to delete`, this.l('Are you sure. '), isConfirmed => {
            if (isConfirmed) {
                this._tableTopExerciseGroupServiceProxy.delete(id).subscribe(() => {
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
