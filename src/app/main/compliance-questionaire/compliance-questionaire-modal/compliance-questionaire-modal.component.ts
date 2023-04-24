import { Component, OnInit, Injector, ViewChild, Input } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { ModalDirective } from "ngx-bootstrap";
import { AssessmentServiceProxy, AssessmentDto, ReviewDataResponseType, AssessmentStatus, ReviewQuestionDto } from "../../../../shared/service-proxies/service-proxies";

@Component({
    selector: "complianceQuestionaireModals",
    templateUrl: "./compliance-questionaire-modal.component.html",
    styleUrls: ["./compliance-questionaire-modal.component.css"],
})
export class ComplianceQuestionaireModalComponent extends AppComponentBase implements OnInit {


    @ViewChild('complianceQuestionaireModal', { static: true }) modal: ModalDirective;
    active = false;
    saving = false;
    editMode: any;
    assessmentId: any;
    tabName: any;
    assessmentSubmission: any;
    assessmentDetails: AssessmentDto = {} as any;
    test: AssessmentDto = {} as any;
    originalAssessmentDetails: AssessmentDto = {} as any;
    selectedResponseTypeFilter: ReviewDataResponseType = null;
    agreementAccepted: boolean = false;
    needsClarification: boolean = false;
    readonly = false;
    assessmentStatus = AssessmentStatus;
    reviewQuestionDto = ReviewQuestionDto;
    reviewDataResponseType = ReviewDataResponseType;
    constructor(
        injector: Injector,
        private _assessmentServiceProxy: AssessmentServiceProxy,
    ) {
        super(injector);
    }
    ngOnInit(): void {
       // this.getAssessmentQuestionares();
    }
    show(e, t): void {   
        this.assessmentId = e;
        this.tabName = t;
        this.active = true;
        this.modal.show();
        this.getAssessmentQuestionares();
    }
    onShown(): void {
    }

    getAssessmentQuestionares() {
        this.spinnerService.show();
        this._assessmentServiceProxy.getById(this.assessmentId).subscribe(res => {
            //this.assessmentDetails = res;
            if (res.status == AssessmentStatus.NeedsClarification) {
                res.status = AssessmentStatus.Initialized;
                this.needsClarification = true;
            }
            this.originalAssessmentDetails = res;
            if (this.originalAssessmentDetails.status == AssessmentStatus.Approved) {
                this.readonly = true;
            }         
            this.spinnerService.hide();
            this.getData();
        });
    }
    getData() {   
        this.spinnerService.show();
        this.assessmentDetails.reviews = this.originalAssessmentDetails.reviews.filter(
            op => op.controlRequirementDomainName === this.tabName
        );
       
        setTimeout(() => {
            this.spinnerService.hide();
        }, 1000);
    }

    save(): void {
    }
    close(): void {
        this.active = false;     
        this.modal.hide();
    }
}
