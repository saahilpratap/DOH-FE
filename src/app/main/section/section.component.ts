import { Component, Injector, ViewEncapsulation, ViewChild, EventEmitter, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DashboardCustomizationConst } from '@app/shared/common/customizable-dashboard/DashboardCustomizationConsts';
import { BusinessEntitiesServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { debuglog } from 'util';
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from 'primeng/public_api';
import { SectionModalComponent } from './section-modal/section-modal.component';
import { SectionServiceProxy, SectionRelatedQuestionDto, TokenAuthServiceProxy, SectionQuestionDto, QuestionGroupDto, QuestionsServiceProxy, ExternalRequirementQuestionDto } from "shared/service-proxies/service-proxies"; 


@Component({
    templateUrl: './section.component.html',
    styleUrls: ['./section.component.less'],    
})

export class SectionComponent extends AppComponentBase {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild('SectionModals', { static: true }) SectionModals: SectionModalComponent;

    filterText: any;
    pivotGridDataSource: any;
    constructor(
        injector: Injector,
        private _sectionServiceProxy: SectionServiceProxy,
    ) {
        super(injector);
    }    
    ngOnInit() {
    }

 
    getData(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.records
        this.primengTableHelper.showLoadingIndicator();

        this._sectionServiceProxy
            .getAllQuestionGroups(this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event)
            )
            .subscribe(result => {
              
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
               
            });
        //this.primengTableHelper.showLoadingIndicator();
    }
}
