import { Component, Injector, OnInit, ViewContainerRef, ViewEncapsulation, ViewChild } from '@angular/core';

import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { FeedbacksServiceProxy, GetFeedbackQuestionResponseList, TableTopExerciseServiceProxy, GetTTEEntityReponsesDto, TableTopExerciseEntityResponseDto, CodeNameDto } from '../../shared/service-proxies/service-proxies';


@Component({

    templateUrl: './tte-entity-response.component.html',
    styleUrls: ['./tte-entity-response.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class TTEEntityResponseComponent extends AppComponentBase implements OnInit {

    active = false;
    saving = false;
    waitMessage: string;
    tteId: any;
    display: boolean = false;
    tteEntitlyResponse: GetTTEEntityReponsesDto = new  GetTTEEntityReponsesDto();
    tteEntitlyResponselist: TableTopExerciseEntityResponseDto[]=[];

    flag: boolean;
    public constructor(
        injector: Injector,
        private _tableTopExerciseService: TableTopExerciseServiceProxy, private _router: Router, private _activatedRoute: ActivatedRoute,) {
        super(injector);
    }
    ngOnInit(): void {       
        this.tteId = this._activatedRoute.snapshot.queryParams['tteId'];
        this.display = true;
        this._tableTopExerciseService.getTTEEntityResponsesByTTEEntityId(this.tteId).subscribe(res => {
            this.tteEntitlyResponselist = res.tableTopExerciseEntityResponses;

            console.log(res);

            this.tteEntitlyResponselist.forEach(x => {
                if (x.answerType == 4) {
                    var obj = x.response.split(',');
                    obj.forEach(y => {
                        var temp = new CodeNameDto();
                        temp.code = y;
                        temp.name = y;
                        x.multiResponse.push(temp);
                    });
                }
            });

            this.flag = res.submitted;
            var QuestionByGroupName = _.groupBy(this.tteEntitlyResponselist, 'sectionName');
            console.log(QuestionByGroupName);
        });
    }

    updateResponse() {
        this.tteEntitlyResponselist.forEach(x => {
            if (x.answerType == 4) {
                x.response = _.join(x.multiResponse, ',');
            }
        });

        this._tableTopExerciseService.updateTTEEntityResponses(this.tteEntitlyResponselist).subscribe(res => {
            this.active = false;
            this.message.success("Thank you for your valuable Response");
        });

    }

    close(): void {
        this.active = false;
    }

}
