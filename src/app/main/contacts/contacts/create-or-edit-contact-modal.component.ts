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
import { AppSessionService } from "@shared/common/session/app-session.service";
import { ContactsServiceProxy, BusinessEntityDto, ContactTypesServiceProxy, BusinessEntitiesServiceProxy, CreateOrEditContactDto, GetBusinessEntitiesExcelDto, ContactTypeDto } from "../../../../shared/service-proxies/service-proxies";
import { async } from "@angular/core/testing";

@Component({
    selector: "createOrEditContactModal",
    templateUrl: "./create-or-edit-contact-modal.component.html"
})
export class CreateOrEditContactModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    contact: CreateOrEditContactDto = new CreateOrEditContactDto();
    businessEntitiesLookUp: GetBusinessEntitiesExcelDto[];
    BusinessEntity: BusinessEntityDto[] = [];
    contactTypesLookUp: ContactTypeDto[];
    constructor(
        injector: Injector,
        private _contactsServiceProxy: ContactsServiceProxy,
        private _contactTypeServiceProxy: ContactTypesServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _appSessionService: AppSessionService
    ) {
        super(injector);
    }

    async initializeBusinessEntitiesLookUp()
    {        
        this.BusinessEntity = [];
        this._businessEntitiesServiceProxy.getAllForBusinessEntity().subscribe(res => {            
            this.BusinessEntity = res;          
        });
    }

    initializeContactTypesLookUp()
    {
        this._contactTypeServiceProxy.getAllForLookUp().subscribe(res => {
            this.contactTypesLookUp = res;
        });
    }

    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    async show(contactId?: number)
    {       
        this.initializeContactTypesLookUp();              
        this.initializeBusinessEntitiesLookUp();                        
        if (!contactId) {
            
            this.contact = new CreateOrEditContactDto();
            this.contact.id = contactId;          
            this.active = true;
            this.modal.show();
        } else {            
            this._contactsServiceProxy
                .getContactForEdit(contactId)
                .subscribe(result => {
                    this.contact = result.contact;                   
                    this.active = true;
                    this.modal.show();
                });
        }
    }

    save(): void {
        this.saving = true;

        this._contactsServiceProxy
            .createOrEdit(this.contact)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l("SavedSuccessfully"));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
        
    }
}
