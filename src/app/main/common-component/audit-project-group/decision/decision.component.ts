import { Component, OnInit, Injector, ViewChild, Input, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {
    AuditDecisionServiceProxy,
    CustomDynamicServiceProxy, DynamicNameValueDto,
    EntityPrimaryDto, OutPutConClusion, EntityGroupDto, EntityGroupsServiceProxy, AuditDecisionDto
} from '../../../../../shared/service-proxies/service-proxies';
export class DocumentCheck {
    id: number;
    name: string;
    checked: boolean;
}

@Component({
    selector: 'decision',
    templateUrl: './decision.component.html',
    styleUrls: ['./decision.component.css']
})
export class DecisionComponent extends AppComponentBase implements OnInit {   
    @Input('auditProjectId') auditProjectId: any;    
    signaturePadOptions: Object = {
        'minWidth': 0.1,
        'canvasWidth': 350,
        'canvasHeight': 100,
        'penColor': 'rgb(0, 0, 128)'
    };
    splitted: any;
    nameCheck: string;
    entityGroup: EntityGroupDto[] = [];
    auditDecision: AuditDecisionDto = new AuditDecisionDto();
    entityPrimary: EntityPrimaryDto = new EntityPrimaryDto();
    documents: DynamicNameValueDto[];
    selectedDocument: DocumentCheck[] = [];
    documentany: any;
    flag: boolean = false;
    constructor(_injector: Injector,
        public _sanitizer: DomSanitizer,
        private _entityGroupServiceProxy: EntityGroupsServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy,
        private _auditdecisionServiceProxy: AuditDecisionServiceProxy,

        private _router: Router,
    ) {
        super(_injector);
        this.flag = true;
    }

    ngOnInit() {
        this.showMainSpinner();
        if (this.auditProjectId > 0) {
            this.getdocuments();
            this.getAuditProjectDecision();
        }      
    }

    getdocuments() {        
        this.showMainSpinner();
        this._customDynamicService.getDynamicEntityDatabyName("Documents").subscribe(res => {
            this.documents = res;           
            this.hideMainSpinner();
        })
    }

    onGroupChange(id: number) {
        this.showMainSpinner();
        this._auditdecisionServiceProxy.getPrimaryEntityByEntityGroupId(id).subscribe(res => {
            this.entityPrimary = res;
            this.hideMainSpinner();
        })
    }

    getAuditProjectDecision() {
        this.showMainSpinner();
        this._auditdecisionServiceProxy.getAuditDecisionByProjectId(this.auditProjectId).subscribe(res => {
            
            this.auditDecision = res;
            this.splitted = this.auditDecision.documentCheck.split(',');
            this.splitted = this.splitted.slice(0, (this.splitted.length - 1));
            this.documents.forEach(obj => {
                var item = this.splitted.find(x => Number(x) == obj.id);
                if (item == undefined) {
                    var a = new DocumentCheck();
                    a.checked = false;
                    a.id = obj.id;
                    a.name = obj.name;
                    this.selectedDocument.push(a);
                }
                else {
                    var a = new DocumentCheck();
                    a.checked = true;
                    a.id = obj.id;
                    a.name = obj.name;
                    this.selectedDocument.push(a);                    
                }
            })


            if (this.auditDecision.entityGroupId != null)
            {
                this.onGroupChange(this.auditDecision.entityGroupId);
                this.hideMainSpinner();
            }            
        })
    }
}
