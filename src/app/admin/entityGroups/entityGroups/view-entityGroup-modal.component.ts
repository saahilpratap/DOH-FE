import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { AppComponentBase } from "@shared/common/app-component-base";
import { GetEntityGroupForViewDto, EntityGroupDto } from "../../../../shared/service-proxies/service-proxies";

@Component({
    selector: "viewEntityGroupModal",
    templateUrl: "./view-entityGroup-modal.component.html"
})
export class ViewEntityGroupModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetEntityGroupForViewDto;

    constructor(injector: Injector) {
        super(injector);
        this.item = new GetEntityGroupForViewDto();
        this.item.entityGroup = new EntityGroupDto();
    }

    show(item: GetEntityGroupForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
