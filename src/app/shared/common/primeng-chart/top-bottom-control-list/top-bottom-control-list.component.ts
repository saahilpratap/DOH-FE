import { Component, OnInit, Injector, Input, ViewChild, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AssessmentServiceProxy } from '../../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'top-bottom-control-list',
    templateUrl: './top-bottom-control-list.component.html',
    styleUrls: ['./top-bottom-control-list.component.css'],
  animations: [appModuleAnimation()]
})

export class TopBottomControlListComponent extends AppComponentBase implements OnInit, OnDestroy {
    selectedValue: any;
    strongHospitalStatus: any;
    strongCenterStatus: any;
    strongClinicStatus: any;
    weakHospitalStatus: any;
    weakCenterStatus: any;
    weakClinicStatus: any;
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

        //this.strongStatus = [
        //    { center: '', hospital: '', clinic:'' },
        //    { center: '', hospital: '', clinic: '' },
        //    { center: '', hospital: '', clinic: '' },
        //    { center: '', hospital: '', clinic: '' },
        //    { center: '', hospital: '', clinic: '' },
        //];
        //this.weekStatus = [
        //    { center: '', hospital: '', clinic: '' },
        //    { center: '', hospital: '', clinic: '' },
        //    { center: '', hospital: '', clinic: '' },
        //    { center: '', hospital: '', clinic: '' },
        //    { center: '', hospital: '', clinic: '' },
        //];
  }

  ngOnDestroy(): void {
  
  }

    getData() {
        this._assessmentServiceProxy.getAssessmentsControlListChart(this.startDate, this.endDate, null, null, null, null, null)
            .subscribe((result) => {               
                this.strongHospitalStatus = result.topHospitalList;
                this.strongCenterStatus = result.topCenterList;
                this.strongClinicStatus = result.topClinicList;
                this.weakHospitalStatus = result.worstHospitalList;
                this.weakCenterStatus = result.worstCenterList;
                this.weakClinicStatus = result.worstClinicList;
               // this.bottomStatus = result.bottomCompliance;
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
