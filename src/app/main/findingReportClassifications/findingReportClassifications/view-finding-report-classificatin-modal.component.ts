import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetBusinessRiskForViewDto, BusinessRiskDto, FindingReportServiceProxy, CreateOrEditFindingReportDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewFindingReportClassificatinModals',
    templateUrl: './view-finding-report-classificatin-modal.component.html'
})
export class ViewFindingReportClassificatinModalComponent extends AppComponentBase {

    @ViewChild('viewFindingReportClassificatinModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    findingReport = new CreateOrEditFindingReportDto();


    constructor(
        injector: Injector,
        private _findingReportsServiceProxy: FindingReportServiceProxy,
    ) {
        super(injector);
      
    }

    show(id): void {     
        this.active = true;
        this.modal.show();
        //this.getData(id);
    }
    getData(id) {
        
        this._findingReportsServiceProxy.getFindingReportForEdit(id)
            .subscribe(
                result => {
                    this.findingReport = result.findingReport;                    
                },
                error => {
                    this.spinnerService.hide();
                    this.message.error(
                        "Couldn't fetch finding report data at this time !"
                    );
                    this.close();
                }
            );
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
