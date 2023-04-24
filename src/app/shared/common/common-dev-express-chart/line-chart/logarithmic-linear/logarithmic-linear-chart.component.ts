import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'dev-logarithmic-linear-chart',
    templateUrl: './logarithmic-linear-chart.component.html',
    styleUrls: ['./logarithmic-linear-chart.component.css']
})
    export class Data {
    arg: number;
    val: number;
}



export class LogarithmicLinearChartComponent extends AppComponentBase implements OnInit {

    @Input('cTitle') cTitle: any;

    action: any;

    @Output() createEditModal: EventEmitter<string[]> = new EventEmitter<string[]>();

    dataSource: any;

    constructor(_injector: Injector,


    ) {
        super(_injector);

    }

    ngOnInit() {
        

        for (let i = 0; i < 600; i += 1) {
            const argument = i / 100;
            this.dataSource.push({ arg: argument, val: Math.exp(-argument) * Math.cos(2 * Math.PI * argument) });
        }

    }
    ngAfterViewInit() {
        
        this.dataSource;
    }
}
