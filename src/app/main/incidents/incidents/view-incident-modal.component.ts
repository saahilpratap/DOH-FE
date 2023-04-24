import { Component, OnInit, Injector, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { IncidentsServiceProxy, CreateOrEditIncidentDto } from '../../../../shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'viewIncidentModals',
    templateUrl: './view-incident-modal.component.html',  
})
export class ViewIncidentModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('viewIncidentModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    incident: CreateOrEditIncidentDto = new CreateOrEditIncidentDto();
    active = false;
    constructor(_injector: Injector,
        private _router: Router,
        private _incidentsServiceProxy: IncidentsServiceProxy,
    ) {
        super(_injector);
    }

    ngOnInit() {

    }

    show(id): void {       
        this.active = true;
        this.modal.show();
        if (id) {
            this.getData(id);
        }
        
    }
    getData(id) {
        
        abp.ui.setBusy();
        abp.ui.setBusy(null,
        this._incidentsServiceProxy
            .getIncidentForEdit(id)
            .subscribe(result => {
                this.incident = result.incident;             
                console.log(this.incident);
                this.active = true;
            }));
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
    save() {

    }
}
