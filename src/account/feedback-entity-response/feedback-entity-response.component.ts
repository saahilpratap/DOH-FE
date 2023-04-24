import { Component, Injector, OnInit, ViewContainerRef, ViewEncapsulation, ViewChild } from '@angular/core';

import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { GetFeedbackQuestionResponseList, FeedbacksServiceProxy } from '../../shared/service-proxies/service-proxies';


@Component({

    templateUrl: './feedback-entity-response.component.html',
    styleUrls: ['./feedback-entity-response.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class FeedbackEntityResponseComponent extends AppComponentBase implements OnInit {

    active = false;
    saving = false;
    waitMessage: string;
    entityfeedbackId: any;
    display: boolean = false;
    feedbacklist: GetFeedbackQuestionResponseList[] = [];

    flag: boolean;
    public constructor(
        injector: Injector, private _feedbacksServiceProxy: FeedbacksServiceProxy, private _router: Router, private _activatedRoute: ActivatedRoute,) {
        super(injector);
    }
    ngOnInit(): void {
        this.entityfeedbackId = this._activatedRoute.snapshot.queryParams['entityFeedbackId'];
        this.display = true;
        this._feedbacksServiceProxy.getAllFeedBackResponse(this.entityfeedbackId).subscribe(res => {
            this.feedbacklist = res.getFeedbackQuestionResponseList;
            this.flag = res.flag;
        });

    }
    updateResponse() {
        var tempOjb = this.feedbacklist.filter(x => x.mandatory == true && (x.response == null || x.response == "") ).length;

        if (tempOjb == 0) {
            this._feedbacksServiceProxy.updateFeedBackResponse(this.feedbacklist).subscribe(res => {
                this.active = false;
                this.message.success("Thank you for your valuable feedback");
                setTimeout(() => {
                    this._router.navigate(['account/login']);
                }, 1000);

            });
        }
        else {
            this.message.success("Please provide responses to all Mandatory question.");
        }


    }

    close(): void {
        this.active = false;
    }

}
