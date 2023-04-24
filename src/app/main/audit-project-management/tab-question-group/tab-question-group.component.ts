import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { AuditProjectDto, AuditProjectServiceProxy, } from '../../../../shared/service-proxies/service-proxies';
import { TabAuditDetailComponent } from '../../audit-report/tab-audit-detail/tab-audit-detail.component';
import { TabAuditTeamComponent } from '../../audit-report/tab-audit-team/tab-audit-team.component';
import { AuditProjectManagementModalComponent } from '../../common-component/grid-audit-project-management/audit-project-management-modal/audit-project-management-modal.component';

@Component({
    selector: 'tab-question-group',
    templateUrl: './tab-question-group.component.html',
})
export class TabQuestionGroupComponent extends AppComponentBase implements OnInit {
    selectedItem: any;
    @Input('auditProId') auditProID: any;   
    @Output() closeModal = new EventEmitter();
    groupList: any;
    noData: any;
    @ViewChild(TabAuditDetailComponent) tabAuditDetail: TabAuditDetailComponent;
    @ViewChild(TabAuditTeamComponent) tabAuditTeam: TabAuditTeamComponent;
    @ViewChild('auditProjectManagementModals', { static: true }) auditProjectManagementModals: AuditProjectManagementModalComponent;
    @Input('reauditPermission') reauditPermission: boolean;

    constructor(_injector: Injector,
        private _router: Router, private _auditServiceProxy: AuditProjectServiceProxy
    ) {
        super(_injector);
    }

    ngOnInit() {
    
        this.selectedItem = 1;
        if (this.auditProID) {
            this.getData(this.auditProID)
        }
    }
    getData(e) {
        this._auditServiceProxy.getQuestionGroupByAuditProjectId(e)
            .subscribe(result => {
              
                this.groupList = result;
                this.noData = result.length;
            });
    }
    selectTab(e) {      
        this.selectedItem = e;
    }

}
