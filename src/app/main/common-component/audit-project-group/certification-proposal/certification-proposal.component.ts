import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { CustomDynamicServiceProxy, CertificationProposalDto, CertificationProposalServiceProxy, CertificationProposalOutputDto, IdNameAndPrimaryDto, EntityWithAssessmentDto, IdNameDto, CertificationProposalCalculation } from '../../../../../shared/service-proxies/service-proxies';
import * as moment from 'moment';

@Component({
    selector: 'certification-proposal',
    templateUrl: './certification-proposal.component.html',
    styleUrls: ['./certification-proposal.component.css']
})
export class CertificationProposalComponent extends AppComponentBase implements OnInit {
    @Input('auditProjectId') id: any;
    data: CertificationProposalOutputDto = new CertificationProposalOutputDto();
    certificationProposalInput: CertificationProposalDto = new CertificationProposalDto();
    EntityGroupList: IdNameAndPrimaryDto[] = [];
    BusinessEntityList: EntityWithAssessmentDto[] = [];
    selectedPrimaryEntityId: number;
    referenceList: IdNameDto[] = [];
    certificationProposalCalculation: CertificationProposalCalculation[] = [];
    facilityName: string = '';
    DomainTable: {
        Name: string;
        AuditorName: string;
        AuditeeName: string;
        Level: string;
    };
    domainDetails: any;
    externalAssessmentId: string = '';
    totalQuestions: number;
    constructor(_injector: Injector,
        public _ertificationProposalService: CertificationProposalServiceProxy,
        private _router: Router,
    ) {
        super(_injector);
    }
    ngOnInit() {
        this.showMainSpinner();
        this._ertificationProposalService.initilizeCertificationProposal(this.id).subscribe(res => {
            this.EntityGroupList = res.entityGroups;
            this.BusinessEntityList = res.businessEntities;
            this.certificationProposalInput = res.certificationProposalDto;
            let tempDate = moment(this.certificationProposalInput.proposalDate).format("YYYY-MM-DD");
            this.certificationProposalInput.proposalDate = moment(tempDate);
            if (this.certificationProposalInput.entityGroupId != 0) {
                this.SetPrimaryEntityName();
            }
            this.spinnerService.hide();
        }, err => {
            this.spinnerService.hide();
            this.message.error(err.error.error.message);
        });
    }   
    SetPrimaryEntityName() {
        
        this.selectedPrimaryEntityId = this.EntityGroupList.find(x => x.id == this.certificationProposalInput.entityGroupId).entityId;
        var be = this.BusinessEntityList.find(x => x.id == this.selectedPrimaryEntityId);
        if (be != undefined) {
            this.facilityName = be.name;
            this.externalAssessmentId = '' + be.assessmentId;
            this.spinnerService.show();
            this._ertificationProposalService.calculateResult(be.assessmentId).subscribe(result => {
                this.certificationProposalCalculation = result;
                this.domainDetails = [];
                this.certificationProposalCalculation.forEach(x => {
                    this.certificationProposalInput.fullyCompliantCount = this.certificationProposalInput.fullyCompliantCount + x.fullyCompliantCount;
                    this.certificationProposalInput.partiallyCompliantCount = this.certificationProposalInput.partiallyCompliantCount + x.partiallyCompliantCount;
                    this.certificationProposalInput.notApplicableCount = this.certificationProposalInput.notApplicableCount + x.notApplicableCount;
                    this.certificationProposalInput.nonCompliantCount = this.certificationProposalInput.nonCompliantCount + x.nonCompliantCount;
                    this.totalQuestions = x.totalCount;
                    var temp = { Name: x.domainName, AuditeeName: '', AuditorName: '', Level: '' + ((x.fullyCompliantCount + x.partiallyCompliantCount + x.notApplicableCount + x.nonCompliantCount) / x.totalCount) };
                    this.domainDetails.push(temp);
                    this.spinnerService.hide();
                });
                if (result.length != 0) {
                    this.certificationProposalInput.grade = this.setGrade();
                }
                this.spinnerService.hide();
            }, err => {
                this.spinnerService.hide();
                this.message.error(err.error.error.message);
            });

        } else {
            this.facilityName = '';
            this.externalAssessmentId = '';
        }
    }
    setGrade(): string {
        var result = '';
        var attempQuestionCount = this.certificationProposalInput.fullyCompliantCount + this.certificationProposalInput.partiallyCompliantCount + this.certificationProposalInput.notApplicableCount + this.certificationProposalInput.nonCompliantCount;
        var percentage = (attempQuestionCount / this.totalQuestions) * 100;

        if (percentage >= 60) {
            result = 'A';
        } else if (percentage < 60 && percentage >= 50) {
            result = 'B';
        } else if (percentage < 50 && percentage >= 40) {
            result = 'C';
        } else {
            result = 'F';
        }
        return result;
    }
}
