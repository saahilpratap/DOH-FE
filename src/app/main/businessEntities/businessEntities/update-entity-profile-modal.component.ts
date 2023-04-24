import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
    BusinessEntitiesServiceProxy, CreateOrEditBusinessEntityDto, UpdateEntitiesProfileDto,
} from "../../../../shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/common/session/app-session.service";

@Component({
    selector: "updateEntityProfileModal",
    templateUrl: "./update-entity-profile-modal.component.html",
})
export class UpdateEntityProfileModalComponent extends AppComponentBase {
    @ViewChild("updateProfileModal", { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    businessEntity: CreateOrEditBusinessEntityDto = new CreateOrEditBusinessEntityDto();
    updatedData: UpdateEntitiesProfileDto = new UpdateEntitiesProfileDto();
    businessEntitiesIdList: number[] = [];

    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy
    ) {
        super(injector);
    }

    show(input: number[]): void {       
        this.businessEntitiesIdList = input;
        this.businessEntity = new CreateOrEditBusinessEntityDto();
        this.businessEntity.name = "temp";
        this.businessEntity.adminEmail = "temp";

        this.active = true;
        this.modal.show();
    }

    save(): void {       
        this.updatedData.createOrEditBusinessEntityDto = this.businessEntity;
        this.updatedData.businessEntitiesId = this.businessEntitiesIdList;
        this._businessEntitiesServiceProxy
            .updateEntitiesProfile(this.updatedData)
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

    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
}

