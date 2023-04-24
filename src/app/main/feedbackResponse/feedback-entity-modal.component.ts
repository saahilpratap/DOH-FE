import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from "@angular/core";

import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy, GetFeedbackQuestionResponseList, FeedbacksServiceProxy, FeedBackDetailDto } from "@shared/service-proxies/service-proxies";
import { ModalDirective } from "ngx-bootstrap";
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: "FeedbackEntityResponseModal",
    templateUrl: "./feedback-entity-modal.component.html"

})
export class FeedbackEntityQuestionResponseModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    feedbacklist: GetFeedbackQuestionResponseList[] = [];
    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _feedbacksServiceProxy: FeedbacksServiceProxy,
        private _tokenAuth: TokenAuthServiceProxy
       
    ) {
        super(injector);
        this.feedbacklist = [];
    }
    show(id): void {
        this.active = true;
        this._feedbacksServiceProxy.getallFeedbackQuestionResponse(id).subscribe(res => {         
            this.feedbacklist = res.getFeedbackQuestionResponseList;
            this.modal.show();
        });
        this.modal.show();
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
