import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    Injectable,
    OnInit,
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import * as moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { AppSessionService } from "@shared/common/session/app-session.service";
import { BusinessEntityAdminChangeRequestServiceProxy, EntityAdminListDto, BusinessEntityAdminChangeRequestInputDto } from "../../../../../shared/service-proxies/service-proxies";

@Component({
    selector: "businessEntityAdminChangeRequestModals",
    templateUrl: "./business-entity-admin-change-request-modal.component.html",
    styleUrls: ["./business-entity-admin-change-request-modal.component.less"],
})
@Injectable()
export class BusinessEntityAdminChangeRequestModalComponent extends AppComponentBase implements OnInit {


    @ViewChild("businessEntityAdminChangeRequestModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    type: any;
    active = false;
    saving = false;
    userList: EntityAdminListDto[] = [];
    userId: number;
    input: BusinessEntityAdminChangeRequestInputDto = new BusinessEntityAdminChangeRequestInputDto();
    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private _businessEntityAdminChangeRequestServiceProxy: BusinessEntityAdminChangeRequestServiceProxy,
        private _router: Router
    ) {
        super(injector);

    }

    ngOnInit(): void {

    }

    async show(businessEntityId?: any) {       
        this.input.businessEntityIds = businessEntityId;
        this._businessEntityAdminChangeRequestServiceProxy.getAllEntityAdminList(businessEntityId).subscribe((result) => {
           
            this.userList = result;
            this.active = true;
            this.modal.show();
        });     
    }

    save(): void {
        this.input.userId = this.userId;
        this._businessEntityAdminChangeRequestServiceProxy.create(this.input).subscribe((result) => {
            this.notify.info(this.l("Request Submitted Succesfully"));
            this.close();
        }); 
    }

    close() {
        this.active = false;
        this.modal.hide();
    }
} 
