import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/public_api';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { CreateEditSubEntityGroupModalComponent } from './create-edit-sub-entity-group-modal/create-edit-sub-entity-group-modal.component';
import { FacilitySubTypeServiceProxy } from '@shared/service-proxies/service-proxies';


@Component({
    selector: 'sub-entity-groups',
    templateUrl: './sub-entity-groups.component.html',
    styleUrls: ['./sub-entity-groups.component.scss']
})
export class SubEntityGroupsComponent extends AppComponentBase implements OnInit {
    @ViewChild('createEditSubEntityGroupModals', { static: true }) createEditSubEntityGroupModals: CreateEditSubEntityGroupModalComponent;
    filterText = '';
    selectedRowData: any[];
    advancedFiltersAreShown = false;
    subEntityDetail: Array<any> = [];
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    facilityTypeId: any;
    controlTypeId: any;
    constructor(_injector: Injector,
        private _facilitysubTypesServiceProxy: FacilitySubTypeServiceProxy,
        private _router: Router,
    ) {
        super(_injector);
    }

    ngOnInit()
    {
    }


    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    getSubEntity(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._facilitysubTypesServiceProxy.getFacilitySubTypeList(
            this.filterText,
            this.facilityTypeId,
            this.controlTypeId,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)           
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
       
    }

    addEditPage() {

    }
}
