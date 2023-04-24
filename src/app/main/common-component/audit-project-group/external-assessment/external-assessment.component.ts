import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ComplianceQuestionaireComponent } from '../../../compliance-questionaire/compliance-questionaire.component';
import { AssessmentServiceProxy, AuditProjectServiceProxy, IdNameDto } from '../../../../../shared/service-proxies/service-proxies';
import { FileDownloadService } from '../../../../../shared/utils/file-download.service';
import { ExternalQuestionaireComponent } from '../../../external-questionaire/external-questionaire.component';

@Component({
    selector: 'external-assessment',
    templateUrl: './external-assessment.component.html',
    styleUrls: ['./external-assessment.component.css']
})
export class ExternalAssessmentComponent extends AppComponentBase implements OnInit {
    @Input() auditProjectId: number;
    @ViewChild(ExternalQuestionaireComponent) modal: ExternalQuestionaireComponent;
    externalAssessmentList: IdNameDto[] = [];
    @ViewChild(ExternalQuestionaireComponent) exchildcomp: ExternalQuestionaireComponent;
    selectedExternalAssessmentId: number = 0;
    assesmentDetailCount: number;
    constructor(public _injector: Injector,
        public _activatedRoute: ActivatedRoute, public _router: Router,
        public _assessmentServiceProxy: AssessmentServiceProxy,
        public _auditProjectService: AuditProjectServiceProxy,
        public _fileDownloadService: FileDownloadService
    ) {
        super(_injector);
    }

    ngOnInit() {
        this.spinnerService.show();
        this._auditProjectService.getAllExternalEntityByAuditProjectId(this.auditProjectId).subscribe(res => {
            this.externalAssessmentList = res.externalEntityList;
            this.selectedExternalAssessmentId = res.selectedEntityId;
            this.spinnerService.hide();
        }, err => {
            this.spinnerService.hide();
            this.message.error(err.error.error.message);
        });
    }

    exIsShow() {
        this.exchildcomp.exIsShows();
    }
    setAssessment(val: number) {
        this.modal.changeAssessment(val);
        this.selectedExternalAssessmentId = val;
        this.spinnerService.hide();
    }

    getReviewCount(event){
        this.assesmentDetailCount = event;
    }
}
