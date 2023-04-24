import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild, OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import * as _ from 'lodash';
import { EmailReminderTemplateServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { CreateEmailReminderModalComponent } from './create-email-reminder-modal.component';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';

@Component({
    selector: 'email-reminder',
    templateUrl: './email-reminder.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class EmailReminderComponent extends AppComponentBase {
    @ViewChild('createEmailReminderModals', { static: true })
    createEmailReminderModals: CreateEmailReminderModalComponent;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    EmailReminder: any;
    dataEmialReminder: any;
    filterText: any;
    constructor(
        private _emailtemplateservice: EmailReminderTemplateServiceProxy,
        injector: Injector,
    ) {
        super(injector);
        this.primengTableHelper = new PrimengTableHelper();
    }
    ngOnInit() {
        this.getEmailReminder();
    }
    getEmailReminder() {
        this._emailtemplateservice.getAll()
            .subscribe(result => {
                this.dataEmialReminder = result;                
            });
    }   

    delete(val) {
        this.message.confirm(`You want to delete Email Reminder`, this.l(`Are you sure. `), isConfirmed => {
            if (isConfirmed) {
                this.spinnerService.show();
                this._emailtemplateservice
                    .delete(val)
                    .subscribe(() => {
                        this.spinnerService.hide();
                        //this.reloadPage();
                        this.getEmailReminder();
                        this.notify.success(this.l("SuccessfullyDeleted"));
                    });
            }
            this.spinnerService.hide();
        });
       

    }
}
