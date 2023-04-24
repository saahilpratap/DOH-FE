import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { AssessmentServiceProxy, AuditProjectServiceProxy, IdNameDto } from '../../../../../shared/service-proxies/service-proxies';
import { ComplianceQuestionaireComponent } from '../../../compliance-questionaire/compliance-questionaire.component';

@Component({
    selector: 'self-assessment',
    templateUrl: './self-assessment.component.html',
    styleUrls: ['./self-assessment.component.css']
})
export class SelfAssessmentComponent extends AppComponentBase implements OnInit {
    @ViewChild(ComplianceQuestionaireComponent) modal: ComplianceQuestionaireComponent;
    externalAssessmentList: IdNameDto[] = [];
    selectedInternalAssessmentId: number = 0;
    @Input() auditProjectId: number;
    assesmentDetailCount: number;
    @ViewChild(ComplianceQuestionaireComponent)
    tabViewQue: ComplianceQuestionaireComponent;

    constructor(_injector: Injector,
        public _activatedRoute: ActivatedRoute, public _router: Router,
        public _assessmentServiceProxy: AssessmentServiceProxy,
        public _auditProjectService: AuditProjectServiceProxy,
    ) {
        super(_injector);
    }

    ngOnInit() {
        this.spinnerService.show();
        this._auditProjectService.getAllInternalEntityByAuditProjectId(this.auditProjectId).subscribe(res => {
            this.externalAssessmentList = res.externalEntityList;
            this.selectedInternalAssessmentId = res.selectedEntityId;
            this.spinnerService.hide();
        }, err => {
            this.spinnerService.hide();
            this.message.error(err.error.error.message);
        });
        
    }

    setAssessment(val: number) {
        this.modal.changeAssessment(val);
        this.selectedInternalAssessmentId = val;
    }

    getReviewCount(event){
        this.assesmentDetailCount = event;
    }    
}
