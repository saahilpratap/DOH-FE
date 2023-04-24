import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'dev-area-chart',
    templateUrl: './area-chart.component.html',
    styleUrls: ['./area-chart.component.css']
})
export class AreaChartComponent extends AppComponentBase implements OnInit {
  
    @Input('cTitle') cTitle: any;
    valueField = ["y1564", "y014", "y65"];
    name = ["15-64 years", "0-14 years", "65 years and older"];
    action: any;
   
    @Output() createEditModal: EventEmitter<string[]> = new EventEmitter<string[]>();
    populationData: any;
    types: string[] = ["area", "stackedarea", "fullstackedarea"];
    
    constructor(_injector: Injector,
      
        
    ) {
        super(_injector);
      
    }

    ngOnInit() {

        

        this.populationData = [{
            country: "China",
            y014: 320866959,
            y1564: 853191410,
            y65: 87774113
        }, {
            country: "India",
            y014: 340419115,
            y1564: 626520945,
            y65: 47063757
        }, {
            country: "United States",
            y014: 58554755,
            y1564: 182172625,
            y65: 34835293
        }, {
            country: "Indonesia",
            y014: 68715705,
            y1564: 146014815,
            y65: 10053690
        }, {
            country: "Brazil",
            y014: 50278034,
            y1564: 113391494,
            y65: 9190842
        }, {
            country: "Russia",
            y014: 26465156,
            y1564: 101123777,
            y65: 18412243
        }];
    }  
    ngAfterViewInit() {

    }  
}
