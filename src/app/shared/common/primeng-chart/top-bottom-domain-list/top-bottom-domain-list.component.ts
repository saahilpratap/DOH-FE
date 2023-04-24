import { Component, OnInit, Injector, Input, ViewChild, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AssessmentServiceProxy } from '../../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'top-bottom-domain-list',
    templateUrl: './top-bottom-domain-list.component.html',
    styleUrls: ['./top-bottom-domain-list.component.css'],
    animations: [appModuleAnimation()]
})

export class TopBottomDomainListComponent extends AppComponentBase implements OnInit, OnDestroy {
    selectedValue: any;
    topDomain: any[]=[];
    weekDomain: any[]=[];
    startDate: any = null;
    endDate: any = null;

    dataGroup = [
        { id: '1', name: 'Groups' },
        { id: '2', name: 'Hospital' },
        { id: '3', name: 'Center' },
        { id: '4', name: 'Individual' }
    ];

    constructor(injector: Injector,
        private _assessmentServiceProxy: AssessmentServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.selectedValue = "1";
        this.getData();
        //this.topDomain = [
        //    { name: '', val: '' },
        //    { name: '', val: '' },
        //    { name: '', val: '' },
        //    { name: '', val: '' },
        //    { name: '', val: '' }
        //];
        //this.weekDomain = [
        //    { name: '', val: '' },
        //    { name: '', val: '' },
        //    { name: '', val: '' },
        //    { name: '', val: '' },
        //    { name: '', val: '' }
        //];
    }

    ngOnDestroy(): void {

    }

    getData() {
        this._assessmentServiceProxy.getAssessmentsDomainListChart(this.startDate, this.endDate, null, null, null, null, null)
            .subscribe((result) => {             
                this.topDomain = result.topist;
                this.weekDomain = result.worstList;
            }
            )
    };

    setDateData(fromDate: Date, endDate: Date) {
        if (fromDate == null || fromDate.toString() == 'Invalid Date') {
            endDate = null;
            fromDate = null;
        }
        else {
            if (endDate == null || endDate.toString() == 'Invalid Date') {
                endDate = fromDate;
            }
        }
        this.startDate = fromDate;
        this.endDate = endDate;
        this.getData();
    }
}
