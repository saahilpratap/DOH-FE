import { Component, OnInit, Injector, ViewChild, Input, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { AssessmentServiceProxy, SubmitAssessmentInput, AssessmentWithBusinessEntityNameDto, CopyToChildInputDto } from '../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'CopyToChildModals',
    templateUrl: './copy-to-child-modal.component.html',
    styleUrls: ['./copy-to-child-modal.component.css']
})
export class CopyToChildModalComponent extends AppComponentBase {

    active = false;
    saving = false;
    btncopyToChild: boolean;
    copyToChildBusinessEntity: any;
    @ViewChild('CopyToChildModal', { static: true }) modal: ModalDirective;
    imgUrl: any;
    assessmentSubmission: any;
    selectedCopyToChildBusinessEntity: AssessmentWithBusinessEntityNameDto[] = [];
    progressValue: number = 0;
    progressCount: number = 0;
    progressLabel: string = '';
    btnCopy: boolean;
    selectedRowData: any[];
    overallProgress: any = '';

    constructor(_injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _assessmentServiceProxy: AssessmentServiceProxy,
    ) {
        super(_injector);
    }

    show(inputData: SubmitAssessmentInput, percentageString: any): void {
        //this.btnCopy = true;
        this.progressValue = 0;
        this.overallProgress = percentageString;
        this.assessmentSubmission = inputData;
        //  this._assessmentServiceProxy.getCopyToChildInputOfAssessment(inputData.assessmentId)
        this._assessmentServiceProxy.getCopyToChildInputOfAssessment(inputData.assessmentId, true)
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

    funcCopyToChild() {
        this.btnCopy = false;
        this.progressCount = 0;
        this.progressValue = 0;
        this.progressLabel = '';
        this.message.confirm(this.l('Do you want to proceed ?'), '<b style="color: red;">WARNING!</b> This action is not reversible.' + '<br> <br> <h6 style="color: #74788d !important;  font-size: 14px !important; font-weight: 400 !important;line-height: 1.5!important"> The status of ALL controls in the selected child assessment(s) for the current quarter will be overwritten. </span>', (isConfirmed) => {


        //this.message.confirm(this.l('The status of ALL controls in the selected child assessment(s) for the current quarter will be overwritten.', '\nDo you want to proceed ?'), '<h1>Hello</h1>'+ '<b style="color: red;">WARNING!</b> This action is not reversible.', (isConfirmed) => {
            if (isConfirmed) {
                this.selectedCopyToChildBusinessEntity.forEach(async x => {
                    var input = new CopyToChildInputDto();
                    input.submitAssessmentInput = this.assessmentSubmission;
                    input.assessmentWithBusinessEntity = x;
                    await this.updateChildReview(input);
                });
            }
        });


        //this.message.confirm(this.l("The status of ALL controls in the selected child assessment(s) for the current quarter will be overwritten. <br> <br> <br> Do you want to proceed ?"), '<b style="color: red;">WARNING!</b> This action is not reversible.', (isConfirmed) => {
        //    if (isConfirmed) {
        //        this.selectedCopyToChildBusinessEntity.forEach(async x => {
        //            var input = new CopyToChildInputDto();
        //            input.submitAssessmentInput = this.assessmentSubmission;
        //            input.assessmentWithBusinessEntity = x;
        //            await this.updateChildReview(input);
        //        });
        //    }
        //});
    }

    async updateChildReview(input: CopyToChildInputDto) {
        await this._assessmentServiceProxy.copyToChildAssessmentReviews(this.overallProgress, input)
            .subscribe((result) => {
                this.progressCount = this.progressCount + 1;
                this.progressValue = Number(((this.progressCount / this.selectedCopyToChildBusinessEntity.length) * 100).toFixed(2));
                this.progressLabel = "" + input.assessmentWithBusinessEntity.businessEntityName + " process done";
                console.log("" + result + " : " + this.progressValue);
                //this.btnCopy = false;
            });
    }

    funcCopyToChildAll() {
        this._assessmentServiceProxy.saveAssessmentReviews(true, '100.00', this.assessmentSubmission)
            .subscribe(() => {
                this.notify.info(this.l("SavedSuccessfully"));
            });
    }
    onSelectionChange(selection: any[]) {
        if (selection.length == this.copyToChildBusinessEntity.length) {
            this.btncopyToChild = true;
        }
        else {
            this.btncopyToChild = false;
            this.btnCopy = false;
        }

        if (selection.length > 0) {
            this.btnCopy = true;
        }
        else {
            this.btnCopy = false;
        }

    }

}
