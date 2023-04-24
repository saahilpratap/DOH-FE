import {Component,ViewChild, Injector, Output, EventEmitter, Injectable, OnInit} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import * as moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { AppSessionService } from "@shared/common/session/app-session.service";
import { GetAllSectionGroupListDto, TableTopExerciseServiceProxy, CreateTTXEntityRequestDto} from "../../../../../shared/service-proxies/service-proxies";


@Component({
    selector: "ttxEntitiesModals",
    templateUrl: "./ttx-entities-modal.component.html",
    styleUrls: ["./ttx-entities-modal.component.less"],
})
@Injectable()
export class TTXEntitiesModalComponent extends AppComponentBase implements OnInit {


    @ViewChild("ttxEntitiesModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    type: any;
    active = false;
    saving = false;
    userId: number;
    ttxgroupName: GetAllSectionGroupListDto[] = [];
    createttxEntity: CreateTTXEntityRequestDto = new CreateTTXEntityRequestDto();
    constructor(
        injector: Injector, private _tableTopExerciseServiceProxy: TableTopExerciseServiceProxy,
        private _appSessionService: AppSessionService,

        private _router: Router
    ) {
        super(injector);

    }

    ngOnInit(): void {

    }

    show(items: CreateTTXEntityRequestDto) {
        this.active = true;       
        this.createttxEntity.businessEntityId = items.businessEntityId;
        this._tableTopExerciseServiceProxy.getallGroupList().subscribe(res => {
            this.ttxgroupName = res;
        })
        this.modal.show();
    }
    changFeedbackEntity(id) {
        this.createttxEntity.tableTopExerciseGroupId = id;
    }

    save() {
        this.spinnerService.show();
        this._tableTopExerciseServiceProxy.createtableTopExerciseEntity(this.createttxEntity)
            .subscribe(res => {
                this.notify.success("Successfully Invited");
                this.spinnerService.hide();
                this.modal.hide();
              


            });
    }

    close() {
        this.active = false;
        this.modal.hide();
    }
} 
