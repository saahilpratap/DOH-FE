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
import { AppSessionService } from "@shared/common/session/app-session.service";
import { BusinessEntityFeedbackIds } from '../../../../shared/service-proxies/service-proxies';
import { TokenAuthServiceProxy, FeedbackQuestionDto, FeedbacksServiceProxy, FeedbackListDto } from "@shared/service-proxies/service-proxies";

@Component({
    selector: "CreateEntityFeedbackModal",
    templateUrl: "./Create-EntiyFeedback-modal.component.html",
})
export class CreateEntityFeedbackModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    feedbacEntity: BusinessEntityFeedbackIds = new BusinessEntityFeedbackIds();
    active = false;
    saving = false;
    feedbacklist: FeedbackListDto[] = [];
    entityid: any[];
    constructor(
        injector: Injector,
        private _feedbacksServiceProxy: FeedbacksServiceProxy,
        private _appSessionService: AppSessionService     
    ) {
        super(injector);
    }

    changFeedbackEntity(id) {
        this.feedbacEntity.feedbackDetailId = id;
    }

    show(items: BusinessEntityFeedbackIds) {       
        this.active = true;
        this.feedbacklist = [];
        this.entityid = items.businessEntityId;        
        this._feedbacksServiceProxy.getAllFeedbackList().subscribe(res =>
        {
            this.feedbacklist = res;
        })
        this.modal.show();
    }

    Close()
    {
        this.active = false;
        this.modalSave.emit(null);
        this.modal.hide();      
    }

    save() {
        this.spinnerService.show();
        this.feedbacEntity.businessEntityId = this.entityid;
        this._feedbacksServiceProxy.crateFeedbackEntity(this.feedbacEntity)
            .subscribe(res => {
                this.notify.success("Successfully Invited");
                this.spinnerService.hide();
                this.modal.hide();
                this.Close();

                
            });
    }
}
