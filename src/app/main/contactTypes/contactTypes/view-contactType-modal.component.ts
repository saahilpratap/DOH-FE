import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { AppComponentBase } from "@shared/common/app-component-base"; 
import { GetContactTypeForViewDto, ContactTypeDto } from "../../../../shared/service-proxies/service-proxies";

@Component({
    selector: "viewContactTypeModal",
    templateUrl: "./view-contactType-modal.component.html"
})
export class ViewContactTypeModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetContactTypeForViewDto;

    constructor(injector: Injector) {
        super(injector);
        this.item = new GetContactTypeForViewDto();
        this.item.contactType = new ContactTypeDto();
    }

    show(item: GetContactTypeForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
