import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AuditProjectServiceProxy, CommonLookupServiceProxy, AuditReportServiceProxy, BusinessEnityGroupWiesDto, BusinessEntitiesListDto, AuthoritativeDocumentDto, AuditProjectAuthoritativeDocumentDto, EntityGroupDto, EntityGroupsServiceProxy, AuditProjectDto, AuditProjectQuestionGroupDto, QuestionGroupListDto, DynamicNameValueDto, BusinessEntityUserDto, ExternalAssessmentsServiceProxy, AuthoritativeDocumentsServiceProxy, BusinessEntitiesServiceProxy, EntityType, GetBusinessEntitiesExcelDto, ContactsServiceProxy, CustomDynamicServiceProxy, AttachmentWithTitleDto, GetCountryForViewDto, CountriesServiceProxy, GetAuthoritativeDocumentForViewDto, BusinessEntityDto, ExtAssementScheduleServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'healthCareEntityPopupModal',
    templateUrl: './health-care-entity-modal.component.html'
})
export class HealthCareEntityModalComponent extends AppComponentBase {
    @ViewChild('healthCareEntityModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    cities= [];
    selectedCities: [];
    businessentity: BusinessEnityGroupWiesDto[] = [];
    selectedBusinessEntity: BusinessEnityGroupWiesDto[] = [];

    auditProjectId: number;
    constructor(
        injector: Injector, private _auditreportProxy: AuditReportServiceProxy, private _auditProjectreportProxy: AuditProjectServiceProxy
         
         

    ) {
        super(injector);
        
    }

    show(id?: number): void
    {
        if (id > 0) {
            this.auditProjectId = id;
            this._auditreportProxy.getEntityWithGroupWieses(id).subscribe(res => {
                this.businessentity = res;
            })           
        }

        this.active = true;
        this.modal.show();
    }

    save(): void {
        this.saving = true;

       
        this._auditProjectreportProxy.createExternalAssessmentAuditProject(this.auditProjectId, this.selectedBusinessEntity)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(
                () => {
                    this.notify.info(this.l("SavedSuccessfully"));
                    this.close();                   
                    this.modalSave.emit(null);
                },
                error => {
                    this.message.error(error.error.error.message);
                    this.close();
                    this.modalSave.emit(null);
                }
            );
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
