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
import { FindingReportClassificationsServiceProxy, CreateOrEditFindingReportClassificationDto } from "../../../../shared/service-proxies/service-proxies";

@Component({
    selector: "createOrEditFindingReportClassificationModal",
    templateUrl:
        "./create-or-edit-findingReportClassification-modal.component.html"
})
@Injectable()
export class CreateOrEditFindingReportClassificationModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    findingReportClassification: CreateOrEditFindingReportClassificationDto = new CreateOrEditFindingReportClassificationDto();

    constructor(
        injector: Injector,
        private _findingReportClassificationsServiceProxy: FindingReportClassificationsServiceProxy
    ) {
        super(injector);
    }

    show(findingReportClassificationId?: number): void {
        if (!findingReportClassificationId) {
            this.findingReportClassification = new CreateOrEditFindingReportClassificationDto();
            this.findingReportClassification.id = findingReportClassificationId;

            this.active = true;
            this.modal.show();
        } else {
            this._findingReportClassificationsServiceProxy
                .getFindingReportClassificationForEdit(
                    findingReportClassificationId
                )
                .subscribe(result => {
                    this.findingReportClassification =
                        result.findingReportClassification;

                    this.active = true;
                    this.modal.show();
                });
        }
    }

    save(): void {
        this.saving = true;

        this._findingReportClassificationsServiceProxy
            .createOrEdit(this.findingReportClassification)
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
