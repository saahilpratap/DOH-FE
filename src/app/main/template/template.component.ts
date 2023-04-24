import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import * as _ from 'lodash';
import {  TokenAuthServiceProxy, HangfireCustomServiceProxy, CustomTemplateServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';
import { CreateTemplateModalComponent } from './create-template-modal.component';

@Component({
    templateUrl: './template.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class TemplateComponent extends AppComponentBase {
    @ViewChild('createTemplateModal', { static: true })
    createTemplateModal: CreateTemplateModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('ExcelFileUpload', { static: false }) excelFileUpload: FileUpload;
    selectedRowData: any[];
    allDelete: boolean;
    advancedFiltersAreShown = false;
    filterText = '';
    codeFilter = '';
    firstNameFilter = '';
    lastNameFilter = '';
    jobTitleFilter = '';
    mobileFilter = '';
    directPhoneFilter = '';
    constructor(
        injector: Injector,
        private _hangfireCustomServiceProxy: HangfireCustomServiceProxy,
        private _customTemplateService: CustomTemplateServiceProxy
    ) {
        super(injector);
    }   
    getTemplates(event?: LazyLoadEvent) {       
       
        this.primengTableHelper.showLoadingIndicator();
        this._customTemplateService
            .getAllCustomTemplate()
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.length;
                this.primengTableHelper.records = result;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    reloadPage(): void {     
        this.paginator.changePage(this.paginator.getPage());
    }

    createTemplate() {
        this.createTemplateModal.show(0);
    }

    deleteTemplate(record: any): void {
        this.message.confirm(`You want to delete ${record.templateTitle}`, this.l('Are you sure. '), isConfirmed => {
            if (isConfirmed) {
                this._customTemplateService.deleteCustomTemplate(record.id).subscribe(() => {                  
                    this.notify.success(this.l('SuccessfullyDeleted'));
                    this.getTemplates();
                });
            }
        });
    }



}
