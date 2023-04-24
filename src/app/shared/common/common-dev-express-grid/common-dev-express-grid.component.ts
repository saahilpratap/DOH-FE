import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CommonDevExpressGridService, Customer } from './common-dev-express-grid.service';

@Component({
    selector: 'common-dev-express-grid',
    templateUrl: './common-dev-express-grid.component.html',
    styleUrls: ['./common-dev-express-grid.component.css']
})
export class CommonDevExpressGridComponent extends AppComponentBase implements OnInit {

    @Output() attachmentData: EventEmitter<string[]> = new EventEmitter<string[]>();
    @Input('name') name: any;
    @Input('checkBoxesMode') checkBoxesMode: any;
    @Input('columnsName') columnsName: any;
    @Input('dataSource') dataSource: any;
    @Input('url') url: any;
    @Input('columHeader') columHeader: any;
    @Input('Customer1') Customer1: any;
    @Input('searchBox') searchBox: any;
    @Output() buttonClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
    
    allMode: string;
    customers: Customer[];


    dataSource1: any;
    filterValue: Array<any>;
    customOperations: Array<any>;
    popupPosition: any;
    saleAmountHeaderFilter: any;

    

    constructor(_injector: Injector,       
        private commonDevExpressGridService: CommonDevExpressGridService,
        private _service: CommonDevExpressGridService
        
    ) {
        super(_injector);
        this.customers = _service.getCustomers();

    }

    ngOnInit() {
        this.allMode = 'allPages';
        this.checkBoxesMode = 'onClick'
        this.url;       
        this.customers;        
        this.Customer1;
        this.columHeader;
    }
    getData(data) {
        this.dataSource = data;        
    }

    ngAfterViewInit() {

    }    
}
