import {Component, ViewChild, Injector, Output, EventEmitter, OnInit, Input} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { AppComponentBase } from "@shared/common/app-component-base";
import { Table } from "primeng/table";

@Component({
    selector: "findingCAPAListModals",
    templateUrl: "./finding-capa-list-modal.component.html",
    styleUrls: ["./finding-capa-list-modal.component.css"]
})
export class FindingCAPAListModalsComponent extends AppComponentBase implements OnInit {
    @ViewChild("findingCAPAListModal", { static: true }) modal: ModalDirective;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    model = [];
    findingData: any = [];
    testData: [];
    messageName: string;
    constructor(
        injector: Injector,
       ) {
        super(injector);

    }

    ngOnInit(): void {
    }

    show(name?: string, data?: any): void {       
        this.messageName = name;
        this.testData = data;

        data.forEach((item, index: number) => {
            this.findingData.push({ name: item[index] });
        });        
        this.modal.show();
        this.active = true;
    }

    save(): void {
       
    }

    close(): void {
        this.active = false;
        this.modal.hide();        
    }
}
