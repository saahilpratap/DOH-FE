import { Component, OnInit, Injector, ViewChild, EventEmitter, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from "rxjs/operators";
import { AuditProjectServiceProxy, CreateAndUpdateAuditRequestClarification, DynamicNameValueDto, CustomDynamicServiceProxy} from '../../../../../shared/service-proxies/service-proxies';


@Component({
    selector: 'responseRequestModals',
    templateUrl: './response-request-modal.component.html',
    styleUrls: ['./response-request-modal.component.scss']
})
export class ResponseRequestModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('responseRequestModal', { static: true }) modal: ModalDirective;
   
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() responseRequest: EventEmitter<any> = new EventEmitter<any>();
    active: boolean;
    title: any;
    requestResponse: CreateAndUpdateAuditRequestClarification[] = [];

    createRequestResponse: CreateAndUpdateAuditRequestClarification[] = [];
    auditStatus: DynamicNameValueDto[];
    CheckResquest: number;
    CheckResponse: number;
    saving = false;
    constructor(_injector: Injector, private _auditServiceProxy: AuditProjectServiceProxy, private _customDynamicService: CustomDynamicServiceProxy,
        private _router: Router     
    ) {
        super(_injector);       
    }
    
    ngOnInit() {
        this.initializeAuditStatus();
    }
    initializeAuditStatus() {
        this._customDynamicService.getAuditStatus("Audit Status")
            .subscribe(res => {
                if (res.length > 0) {

                    this.auditStatus = res;
                   
                }
            });
    }
    show(id:any, name): void {
       
        this.initializeAuditStatus();

        this.title = name;
        this._auditServiceProxy.getAllClarificationAuditProject(id).subscribe(res => {
            this.requestResponse = res;
            this.createRequestResponse = [];
            this.CheckResquest = 0;
            this.CheckResponse = 0;
            let createrequestResponse = new CreateAndUpdateAuditRequestClarification();
            let checkRequestes = this.auditStatus.find(x => x.name.trim().toLowerCase() == "Draft Audit Report Submitted".trim().toLowerCase());
            let checkResponses = this.auditStatus.find(x => x.name.trim().toLowerCase() == "Authority(Clarification Needed)".trim().toLowerCase());
            if (checkRequestes != undefined) {
                this.CheckResquest = checkRequestes.id;
            }
            if (checkResponses != undefined) {
                this.CheckResponse = checkResponses.id;
            }

            if (name == 'Response') {
                createrequestResponse.id = 0;
                createrequestResponse.auditProjectId = id;
                createrequestResponse.statusId = this.CheckResquest;
                createrequestResponse.actionText = "";
                createrequestResponse.actionActive = false;
                this.createRequestResponse.push(createrequestResponse);

            } else if (name == 'Request') {
                createrequestResponse.id = 0;
                createrequestResponse.auditProjectId = id;
                createrequestResponse.statusId = this.CheckResponse;
                createrequestResponse.actionText = "";
                createrequestResponse.actionActive = true;
                this.createRequestResponse.push(createrequestResponse);
            }
        });
        
        this.active = true;
        this.modal.show();
    }
   
    close(): void {
        this.active = false;
        this.modal.hide();
        this.modalSave.emit(null);
    }


     save() {
         this.saving = true;  
         this._auditServiceProxy
             .requestAndResponseAuditProjectClarification(this.createRequestResponse)
             .pipe(
                 finalize(() => {
                     this.saving = false;
                 })
             )
             .subscribe(() => {
                 this.notify.info(this.l("SavedSuccessfully"));
                 this.close();
                 this.responseRequest.emit(null);
             });

    }
}
