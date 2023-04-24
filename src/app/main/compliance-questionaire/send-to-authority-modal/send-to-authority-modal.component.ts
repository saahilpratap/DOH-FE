import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { AssessmentServiceProxy, SubmitAssessmentInput, AssessmentWithBusinessEntityNameDto, CopyToChildInputDto, SetAssessmentStatusInputDto, AssessmentStatus } from '../../../../shared/service-proxies/service-proxies';
import { AssessmentAgreementModalComponent } from '../assessment-agreement-modal/assessment-agreement-modal.component';
import { ReleationAssessmentAuditProjectModalComponent } from '../releation-assessment-audit-project-modal/releation-assessment-audit-project-modal.component';
import Swal from 'sweetalert2'

@Component({
    selector: 'sendToAuthorityModalModals',
    templateUrl: './send-to-authority-modal.component.html',
    styleUrls: ['./send-to-authority-modal.component.css']
})
export class SendToAuthorityModalModalComponent extends AppComponentBase {

    active = false;
    saving = false;
    copyToChildBusinessEntity: any;
    @ViewChild('SendToAuthorityModalModal', { static: true }) modal: ModalDirective;
    @ViewChild("assessmentAgreementModal", { static: true }) assessmentAgreementModal: AssessmentAgreementModalComponent;
    @ViewChild("releationAssessmentAuditProject", { static: true }) releationAssessmentAuditProject: ReleationAssessmentAuditProjectModalComponent;
    imgUrl: any;
    assessmentSubmission: any;
    selectedCopyToChildBusinessEntity: AssessmentWithBusinessEntityNameDto[] = [];
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    flag: boolean = false;
    assessmentId: number = 0;
    BEAdminFlag: boolean = false;
    EGAdminFlag: boolean = false;
    InReviewFlag: boolean = false;
    updatedStatus: AssessmentStatus = 0;
    btnFlag: boolean = false;
    overAllScore: any;

    constructor(_injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _assessmentServiceProxy: AssessmentServiceProxy,
    ) {
        super(_injector);
    }

    show(flag: boolean, id: number): void {
        this.assessmentId = id;
        this.flag = flag;
        this.getData(this.assessmentId, AssessmentStatus.All);
    }

    showBEAdmin(flag: boolean, id: number, status: AssessmentStatus, score: String): void {
        this.assessmentId = id;
        this.flag = flag;
        this.BEAdminFlag = true;
        this.updatedStatus = status;
        this.overAllScore = score;
        this.getData(this.assessmentId, this.updatedStatus);
    }

    showBEGAdmin(flag: boolean, id: number, status: AssessmentStatus, score: String): void {
        this.assessmentId = id;
        this.flag = flag;
        this.EGAdminFlag = true;
        this.updatedStatus = status;
        this.overAllScore = score;
        this.getData(this.assessmentId, this.updatedStatus);
    }

    showInreview(flag: boolean, id: number, status: AssessmentStatus, score: String): void {
        this.assessmentId = id;
        this.flag = flag;
        this.InReviewFlag = true;
        this.updatedStatus = status;
        this.overAllScore = score;
        this.getResponseData(this.assessmentId);
    }

    getData(val, status) {
        this.selectedCopyToChildBusinessEntity = [];
        this.btnFlag = false;
        this._assessmentServiceProxy
            .getBusinessEntityGroupWise(val, status)
            .subscribe((result) => {
                this.copyToChildBusinessEntity = result;
                this.active = true;
                this.modal.show();
            });
    }

    getResponseData(val) {
        this.selectedCopyToChildBusinessEntity = [];
        this.btnFlag = false;
        this._assessmentServiceProxy
            .getBusinessEntityGroupWiseForSubmitForReview(val)
            .subscribe((result) => {
                this.copyToChildBusinessEntity = result;
                this.active = true;
                this.modal.show();
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    saveData() {
        if (this.BEAdminFlag || this.EGAdminFlag || this.InReviewFlag) {
            this.setBEAdmin(this.flag);
        }
        else {
            this.assessmentAgreementModal.show(true, this.flag, this.assessmentId, this.selectedCopyToChildBusinessEntity);
        }
    }
    showReleationAssessmentAuditProject() {        
        Swal.fire({
            title: 'Are you sure want to remove?',
            text: 'You will not be able to recover this file!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.value) {
                //this.myMethod();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'Your imaginary file is safe :)',
                    'error'
                )
            }
        });
    }
    myMethod(item) {
        this.releationAssessmentAuditProject.show('Entity Control', item);
    }

    setBEAdmin(flag) {
        var input = new SetAssessmentStatusInputDto();
        input.assessmentStatus = this.updatedStatus;
        input.reviewScores = this.overAllScore;
        input.assessmentIds = [];
        if (flag) {
            for (var i = 0; i < this.selectedCopyToChildBusinessEntity.length; i++) {
                input.assessmentIds.push(this.selectedCopyToChildBusinessEntity[i].assessementId);
            }
        }
        else {
            input.assessmentIds.push(this.assessmentId);
        }

        this._assessmentServiceProxy.openFindingValidationForGroup(input).subscribe((result) => {
            if (result.length > 0) {           
                //this.message.info("LicenseNumber are : " + result.map(x => x));
                let results = result.map(x => {
                    return { name: x };
                })
                this.releationAssessmentAuditProject.show('Below entity(s) have open findings on some controls. Kindly navigate to the assessment(s) of the below entities and provide supporting evidences.', results);
            }
            else {
            this._assessmentServiceProxy.setAssessmentStatus(input).subscribe(() => {
                this.saving = true;
                this.backToModal();
            });
            }
        });
    }

    backToModal() {
        this.active = false;
        this.modal.hide();
        this.notify.info(this.l("Submitted Succesfully"));
        this._router.navigate(["/app/main/assessments/assessments"]);
    }

    onSelectionChange(selection: any[]) {
        if (selection.length > 0) {
            this.btnFlag = true;
        }
        else {
            this.btnFlag = false;
        }

    }

}
