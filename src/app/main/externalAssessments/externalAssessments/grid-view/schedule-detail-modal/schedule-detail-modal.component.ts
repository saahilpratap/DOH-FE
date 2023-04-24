import { AfterViewChecked, Component, ElementRef, EventEmitter, Injector, Output, ViewChild, ViewChildren, ContentChild, QueryList, ContentChildren, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ExtAssementScheduleServiceProxy } from '../../../../../../shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/public_api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';


@Component({
    selector: 'ScheduleDetailModals',
    templateUrl: './schedule-detail-modal.component.html',
})

export class ScheduleDetailModalComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('ScheduleDetailModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    filterText = '';
    scheduleId: any;
    showModal: boolean;
    constructor(
        injector: Injector,
        private _assementScheduleAppService: ExtAssementScheduleServiceProxy
    ) {
        super(injector);
       
    }

    ngOnInit() {

    }
    

    show(e) {
        this.active = true;
        this.modal.show();
        this.scheduleId = e.id;
       
    }
    getScheduledDetailAssessments(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        if (event != undefined) {
            this.dataTable.sortField = event.sortField;          
        }
        this.primengTableHelper.showLoadingIndicator();
        this._assementScheduleAppService.getAllScheduledDetailAssessments(this.filterText, this.scheduleId,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event))
            .subscribe(result => {               
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    getData(event?: LazyLoadEvent) {
        //this._assementScheduleAppService.getAllScheduledDetailAssessmentById
        //this._assementScheduleAppService.getAllScheduledDetailAssessmentById( this.scheduleId)
        //    .subscribe(result => {
        //        this.primengTableHelper.totalRecordsCount = result.totalCount;
        //        this.primengTableHelper.records = result.items;
        //        this.primengTableHelper.hideLoadingIndicator();
        //    });

        //this._assementScheduleAppService.getAllScheduledDetailAssessmentById(id).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

        //    this.primengTableHelper.totalRecordsCount = result.totalCount;
        //    this.primengTableHelper.records = result.items;
        //    this.primengTableHelper.hideLoadingIndicator();           
        //});
    }

    close() {      
        this.active = false;
        this.modal.hide();
    }
}
