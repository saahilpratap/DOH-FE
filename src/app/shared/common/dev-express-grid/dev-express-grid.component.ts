import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DevExpressGridService } from './dev-express-grid.service';

@Component({
    selector: 'dev-express-grid',
    templateUrl: './dev-express-grid.component.html',
    styleUrls: ['./dev-express-grid.component.css']
})
export class DevExpressGridComponent extends AppComponentBase implements OnInit {

    @Output() attachmentData: EventEmitter<string[]> = new EventEmitter<string[]>();
    @Input('name') name: any;
    @Input('checkBoxesMode') checkBoxesMode: any;
    @Input('columnsName') columnsName: any;
    @Input('dataSource') dataSource: any;
    @Input('url') url: any;
    allMode: string;

    constructor(_injector: Injector,       
        private devExpressGridService: DevExpressGridService,
        
    ) {
        super(_injector);

    }

    ngOnInit() {
        this.allMode = 'allPages';
        this.checkBoxesMode = 'onClick'
        this.url;
    }
    getData() {      
             
    }

    ngAfterViewInit() {
        switch (this.name) {
            case "Incident":

                break;
            case "Business Risks":

                break;
            case "Exception":

                break;
        }
    }    
}
