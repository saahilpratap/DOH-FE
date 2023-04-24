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
import { EmailNotificationTemplateServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { CreateEmailNotificationModalComponent } from './create-email-notification-modal.component';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';

@Component({
    selector: 'email-notification',
    templateUrl: './email-notification.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class EmailNotificationComponent extends AppComponentBase {
    @ViewChild('createEmailNotificationModals', { static: true })
    createEmailNotificationModals: CreateEmailNotificationModalComponent;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    EmailNotification: any;
    dataEmialNotification: any;
    filterText: any;
    constructor(
        private _emailtemplateservice: EmailNotificationTemplateServiceProxy,
        injector: Injector,
    ) {
        super(injector);
        this.primengTableHelper = new PrimengTableHelper();
    }
    ngOnInit() {
        this.getEmailNotification();
    }
    getEmailNotification() {
        this._emailtemplateservice.getAll()
            .subscribe(result => {

                this.dataEmialNotification = result;
                
            });
    }

   

    delete(val) {

        this.message.confirm(`You want to delete Email Notification`, this.l(`Are you sure. `), isConfirmed => {
            if (isConfirmed) {
                this.spinnerService.show();
                this._emailtemplateservice
                    .delete(val)
                    .subscribe(() => {
                        this.spinnerService.hide();
                        //this.reloadPage();
                        this.getEmailNotification();
                        this.notify.success(this.l("SuccessfullyDeleted"));
                    });
            }
            this.spinnerService.hide();
        });
       

    }
}
