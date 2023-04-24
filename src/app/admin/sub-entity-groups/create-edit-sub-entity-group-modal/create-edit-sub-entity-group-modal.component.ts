import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import { CreateorEditFacilitySubTypeDto, ControlType, FacilitySubTypeServiceProxy, FacilityTypeDto  } from "../../../../shared/service-proxies/service-proxies";

@Component({
    selector: "createEditSubEntityGroupModals",
    templateUrl: "./create-edit-sub-entity-group-modal.component.html"
})
export class CreateEditSubEntityGroupModalComponent extends AppComponentBase
{
    @ViewChild("createEditSubEntityGroupModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();   
    facilityTypeId: any;
    createorupdatefacility: CreateorEditFacilitySubTypeDto = new CreateorEditFacilitySubTypeDto();
    facility: FacilityTypeDto[] = [];
    controlType = ControlType;
    controlTypes: { id: number; name: string }[] = [];
    active = false;
    saving = false;
    constructor(
        injector: Injector,
        private _facilitySubtypeServiceProxiy: FacilitySubTypeServiceProxy,
       
    ) {
        super(injector);
       this.createorupdatefacility= new CreateorEditFacilitySubTypeDto();
    }


    show(facilitysubIdTypeId?: number): void {
        
        this.getFacilityInitalization();
        this.getcontrolType();
        if (facilitysubIdTypeId == undefined && facilitysubIdTypeId==null) {
           // this.createoreditFacilitySubType = new CreateorEditFacilitySubTypeDto();
           // this.createoreditFacilitySubType.id = facilitysubIdTypeId;
            this.active = true;
            this.modal.show();
        } else {
            this._facilitySubtypeServiceProxiy.getFacilityTypeForEdit(facilitysubIdTypeId).subscribe(result => {
                this.createorupdatefacility = result;
                this.facilityTypeId = result.facilityTypeId;
                this.active = true;
                this.modal.show();
            });
        }
    }

    getcontrolType() {
        this.controlTypes = [];
        for (var n in ControlType) {
            if (typeof ControlType[n] === 'number') {
                this.controlTypes.push({ id: <any>ControlType[n], name: n });
            }
        }
    }


    save(): void {
        this.saving = true;
        this.createorupdatefacility.facilityTypeId =this.facilityTypeId;
        this._facilitySubtypeServiceProxiy.createOrUpdateFacilitySubType(this.createorupdatefacility)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }
 
    close(): void {
        this.active = false;
        this.modal.hide();      
    }

    getFacilityInitalization()
    {
        this._facilitySubtypeServiceProxiy.getFacilityAll().subscribe(res => {
            
            this.facility = res;
        });
    }

   
}
