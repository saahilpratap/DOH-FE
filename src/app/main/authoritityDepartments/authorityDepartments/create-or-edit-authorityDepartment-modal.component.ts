import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    Injectable
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import * as moment from "moment";
import { AuthorityDepartmentsServiceProxy, WorkFlowPageDto, GetContactForViewDto, BusinessEntityUserDto, AuthoritativeDocumentsServiceProxy, AuthoritativeDocumentDto, DynamicNameValueDto, CustomDynamicServiceProxy, BusinessEntitiesServiceProxy, CreateOrEditAuthorityDepartmentDto, ContactsServiceProxy } from "../../../../shared/service-proxies/service-proxies";
import { async } from "rxjs/internal/scheduler/async";

@Component({
    selector: "createOrEditAuthorityDepartmentModal",
    templateUrl: "./create-or-edit-authorityDepartment-modal.component.html"
})
@Injectable()
export class CreateOrEditAuthorityDepartmentModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    notifiersEntitiesLookup: GetContactForViewDto[];
    beUsers: BusinessEntityUserDto[] = [];
    authorityDepartment: CreateOrEditAuthorityDepartmentDto = new CreateOrEditAuthorityDepartmentDto();

    filterText: string;
    codeFilter: string;
    firstNameFilter: string;
    lastNameFilter: string;
    jobTitleFilter: string;
    mobileFilter: string;
    directPhoneFilter: string;
    workflow: WorkFlowPageDto[]=[];
    authoritavuieDocuments: AuthoritativeDocumentDto[];
    hideButton: any;
    constructor(
        injector: Injector,
        private _contactsServiceProxy: ContactsServiceProxy,
        private _authoritativeDocumentsServiceProxy: AuthoritativeDocumentsServiceProxy,
        private _businessentityServiceProxy: BusinessEntitiesServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy,
        private _authorityDepartmentsServiceProxy: AuthorityDepartmentsServiceProxy
    ) {
        super(injector);
    }

    show(authorityDepartmentId?: number, buttonStatus?: any): void {
        if (buttonStatus != undefined)
            this.hideButton = buttonStatus;
        else
            this.hideButton = 0;
        if (!authorityDepartmentId) {
            this.authorityDepartment = new CreateOrEditAuthorityDepartmentDto();
            this.authorityDepartment.id = authorityDepartmentId;

            this.active = true;
            this.modal.show();
        } else {
            this._authorityDepartmentsServiceProxy
                .getAuthorityDepartmentForEdit(authorityDepartmentId)
                .subscribe(async result => {                    
                    this.authorityDepartment = result.authorityDepartment;
                    await this.initializeNotifiers();
                    await this.approverAndReviwers();
                    await this.initializeWorkFlow();
                    await this.initializeAuthoritativeDocumentLookUp();
                    this.active = true;
                    this.modal.show();
                });
        }
    }

    setPrimaryReviewerId(id) {
        this.authorityDepartment.primaryReviewerId = id;
    }

    setPrimaryApproverId(id) {
        this.authorityDepartment.primaryApproverId = id;
    }

    initializeAuthoritativeDocumentLookUp()
    {     
        this.authoritavuieDocuments = [];
        this._authoritativeDocumentsServiceProxy.getallAuthorativeDocuments().subscribe(res => {
            this.authoritavuieDocuments = res;
        });
    }

    initializeNotifiers() {
        this._contactsServiceProxy
            .getAll(
                this.filterText,
                this.codeFilter,
                this.firstNameFilter,
                this.lastNameFilter,
                this.jobTitleFilter,
                this.mobileFilter,
                this.directPhoneFilter,
                undefined,
                0,
                1000
            )
            .subscribe((result) => {
                this.notifiersEntitiesLookup = result.items;
            });
    }

    approverAndReviwers() {
        this._businessentityServiceProxy.getAllAuthorativeUsers().subscribe(res => {
            this.beUsers = res;

        });
    }

    initializeWorkFlow() {
        this._authorityDepartmentsServiceProxy.getAllPages()
            .subscribe(res => {
                this.workflow = res;
            });
    }

    save(): void {
        this.saving = true;
       

        this._authorityDepartmentsServiceProxy
            .createOrEdit(this.authorityDepartment)
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
