import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { AuthorityDepartmentsServiceProxy, ActionCategory, CreateOrUpdateStateActionDto, WorkFlowServiceProxy, TemplateDto, StateApplicability, WorkFlowPageDto, ActionTimeType, CreateOrUpdateStateDto, GetContactForViewDto, BusinessEntityUserDto, AuthoritativeDocumentsServiceProxy, AuthoritativeDocumentDto, DynamicNameValueDto, CustomDynamicServiceProxy, BusinessEntitiesServiceProxy, CreateOrEditAuthorityDepartmentDto, ContactsServiceProxy, CustomTemplateDto, CustomTemplateServiceProxy, ReviewDataDto, ExternalAssessmentsServiceProxy } from "../../../shared/service-proxies/service-proxies";
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'lastUpdateResponse',
    templateUrl: './update-last-response-modal.component.html'
})
export class LastUpdateResponseModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    responseValue: number = 0;
    active = false;
    saving = false;
    customTemplateDto = new CustomTemplateDto();
    input = new ReviewDataDto();
    propertiesName: string[] = [];
    assessmentId: any;
    tableResponseTypes = [
        {
            id: 4,
            name: "Fully Compliant"
        },
        {
            id: 3,
            name: "Partially Compliant"
        },
        {
            id: 2,
            name: "Non Compliant"
        },
        {
            id: 1,
            name: "Not Applicable"
        }
    ];

    constructor(
        injector: Injector,
        private _customTemplateService: CustomTemplateServiceProxy,
        private _externalAssessmentProxy: ExternalAssessmentsServiceProxy,
        private _authorityDepartmentsServiceProxy: AuthorityDepartmentsServiceProxy
    ) {
        super(injector);
    }

    show(input: ReviewDataDto, assessmentId: number) {
        this.assessmentId = assessmentId;
        this.input = input;
        this.active = true;
        this.modal.show();
    }

    save(): void {
        this._externalAssessmentProxy
            .updateLastResonse(this.assessmentId, this.input)
            .subscribe(() => {
                this.notify.info(this.l("LastResponseUpdatedSuccessfully"));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
