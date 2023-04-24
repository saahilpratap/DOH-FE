import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FeedbacksServiceProxy, DashboardFeedbackDto, QuestionChartDto } from '../../../../shared/service-proxies/service-proxies';
import { FileDownloadService } from '../../../../shared/utils/file-download.service';


@Component({
    selector: 'feedback-dashboard',
    templateUrl: './feedback-dashboard.component.html',
    styleUrls: ['./feedback-dashboard.component.less']
})

export class FeedbackDashboardComponent extends AppComponentBase {
    displayModal: boolean;

    resultdata: DashboardFeedbackDto = null;
    questionListInfo: QuestionChartDto[] = [];
    feedbackId: any;
    data = [
        { id: '1', name: 'Groups' },
        { id: '2', name: 'Hospital' },
        { id: '3', name: 'Center' }
    ];
    constructor(
        injector: Injector,
        private _feedbacksServiceProxy: FeedbacksServiceProxy,
        private _fileDownloadService: FileDownloadService,

    ) {
        super(injector);

    }

    ngOnInit() {
        this._feedbacksServiceProxy
            .dashboardFeedback()
            .subscribe(res => {
                this.resultdata = res;
                console.log(res);
            });
    }

    getData(val) {
       
        this.questionListInfo = [];      
        if (val == undefined) {
            this.feedbackId = undefined;
        }
        else {
            this.feedbackId = val.id;
            this._feedbacksServiceProxy
                .allQuestionResponseByFeedbackDetailsId(val.id)
                .subscribe(res => {
                    this.questionListInfo = res;
                });
        }

    }
  
    GetBusinessEntitiesByQuestionIdAns() {     
        var feedbackId = 1;
        var questionId = 1;
        var ans = 'Yes';
        this._feedbacksServiceProxy
            .getBusinessEntitiesByQuestionIdAns(feedbackId, questionId, ans)
            .subscribe(result => {
                
            });
    }

    exportFun() {
        this._feedbacksServiceProxy.exportFeedBackResponse(this.feedbackId ).subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }

}
