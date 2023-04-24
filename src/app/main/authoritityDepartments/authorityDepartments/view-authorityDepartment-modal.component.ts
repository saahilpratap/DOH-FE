import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    Injectable
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { AppComponentBase } from "@shared/common/app-component-base";
import { GetAuthorityDepartmentForViewDto, AuthorityDepartmentDto } from "../../../../shared/service-proxies/service-proxies";

@Component({
    selector: "viewAuthorityDepartmentModal",
    templateUrl: "./view-authorityDepartment-modal.component.html"
})
@Injectable()
export class ViewAuthorityDepartmentModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetAuthorityDepartmentForViewDto;

    constructor(injector: Injector) {
        super(injector);
        this.item = new GetAuthorityDepartmentForViewDto();
        this.item.authorityDepartment = new AuthorityDepartmentDto();
    }

    show(item: GetAuthorityDepartmentForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
