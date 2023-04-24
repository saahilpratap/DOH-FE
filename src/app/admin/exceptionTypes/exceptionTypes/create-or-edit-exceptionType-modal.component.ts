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
import { ExceptionTypesServiceProxy, CreateOrEditExceptionTypeDto } from "../../../../shared/service-proxies/service-proxies";
@Component({
    selector: "createOrEditExceptionTypeModal",
    templateUrl: "./create-or-edit-exceptionType-modal.component.html"
})
@Injectable()
export class CreateOrEditExceptionTypeModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    exceptionType: CreateOrEditExceptionTypeDto = new CreateOrEditExceptionTypeDto();

    constructor(
        injector: Injector,
        private _exceptionTypesServiceProxy: ExceptionTypesServiceProxy
    ) {
        super(injector);
    }

    show(exceptionTypeId?: number): void {
        if (!exceptionTypeId) {
            this.exceptionType = new CreateOrEditExceptionTypeDto();
            this.exceptionType.id = exceptionTypeId;

            this.active = true;
            this.modal.show();
        } else {
            this._exceptionTypesServiceProxy
                .getExceptionTypeForEdit(exceptionTypeId)
                .subscribe(result => {
                    this.exceptionType = result.exceptionType;

                    this.active = true;
                    this.modal.show();
                });
        }
    }

    save(): void {
        this.saving = true;

        this._exceptionTypesServiceProxy
            .createOrEdit(this.exceptionType)
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
