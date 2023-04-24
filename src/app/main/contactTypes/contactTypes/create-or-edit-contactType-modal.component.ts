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
import { ContactTypesServiceProxy, CreateOrEditContactTypeDto } from "../../../../shared/service-proxies/service-proxies";

@Component({
    selector: "createOrEditContactTypeModal",
    templateUrl: "./create-or-edit-contactType-modal.component.html"
})
export class CreateOrEditContactTypeModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    contactType: CreateOrEditContactTypeDto = new CreateOrEditContactTypeDto();

    constructor(
        injector: Injector,
        private _contactTypesServiceProxy: ContactTypesServiceProxy
    ) {
        super(injector);
    }

    show(contactTypeId?: number): void {
        if (!contactTypeId) {
            this.contactType = new CreateOrEditContactTypeDto();
            this.contactType.id = contactTypeId;

            this.active = true;
            this.modal.show();
        } else {
            this._contactTypesServiceProxy
                .getContactTypeForEdit(contactTypeId)
                .subscribe(result => {
                    this.contactType = result.contactType;

                    this.active = true;
                    this.modal.show();
                });
        }
    }

    save(): void {
        this.saving = true;

        this._contactTypesServiceProxy
            .createOrEdit(this.contactType)
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
