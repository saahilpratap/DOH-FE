import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    Injectable
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";

import { AppComponentBase } from "@shared/common/app-component-base";
import * as moment from "moment";

@Component({
    selector: "createOrEditBusinessTypeModal",
    templateUrl: "./create-or-edit-businessType-modal.component.html"
})
@Injectable()
export class CreateOrEditBusinessTypeModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    //businessType: CreateOrEditBusinessTypeDto = new CreateOrEditBusinessTypeDto();

    constructor(
        injector: Injector,
        //private _businessTypesServiceProxy: BusinessTypesServiceProxy
    ) {
        super(injector);
    }

    show(businessTypeId?: number): void {
        //if (!businessTypeId) {
        //    this.businessType = new CreateOrEditBusinessTypeDto();
        //    this.businessType.id = businessTypeId;

        //    this.active = true;
        //    this.modal.show();
        //} else {
        //    this._businessTypesServiceProxy
        //        .getBusinessTypeForEdit(businessTypeId)
        //        .subscribe(result => {
        //            this.businessType = result.businessType;

        //            this.active = true;
        //            this.modal.show();
        //        });
        //}
    }

    save(): void {
        this.saving = true;

        //this._businessTypesServiceProxy
        //    .createOrEdit(this.businessType)
        //    .pipe(
        //        finalize(() => {
        //            this.saving = false;
        //        })
        //    )
        //    .subscribe(() => {
        //        this.notify.info(this.l("SavedSuccessfully"));
        //        this.close();
        //        this.modalSave.emit(null);
        //    });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
