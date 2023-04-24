import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base"; 
import { IncidentImpactsServiceProxy, CreateOrEditIncidentImpactDto } from "../../../../shared/service-proxies/service-proxies";

@Component({
    selector: "createOrEditIncidentImpactModal",
    templateUrl: "./create-or-edit-incidentImpact-modal.component.html"
})
export class CreateOrEditIncidentImpactModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    incidentImpact: CreateOrEditIncidentImpactDto = new CreateOrEditIncidentImpactDto();
    hideButton: any;
    constructor(
        injector: Injector,
        private _incidentImpactsServiceProxy: IncidentImpactsServiceProxy
    ) {
        super(injector);
    }

    show(incidentImpactId?: number, buttonStatus?: any): void {
        if (buttonStatus != undefined)
            this.hideButton = buttonStatus;
        else
            this.hideButton = 0;
        if (!incidentImpactId) {
            this.incidentImpact = new CreateOrEditIncidentImpactDto();
            this.incidentImpact.id = incidentImpactId;

            this.active = true;
            this.modal.show();
        } else {
            this._incidentImpactsServiceProxy
                .getIncidentImpactForEdit(incidentImpactId)
                .subscribe(result => {
                    this.incidentImpact = result.incidentImpact;

                    this.active = true;
                    this.modal.show();
                });
        }
    }

    save(): void {
        this.saving = true;

        this._incidentImpactsServiceProxy
            .createOrEdit(this.incidentImpact)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l("SavedSuccessfully"));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
