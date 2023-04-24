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
import { CreateOrEditControlStandardDto, GetDomainForViewDto, ControlStandardsServiceProxy, DomainsServiceProxy, GetAuthoritativeDocumentForViewDto, AuthoritativeDocumentsServiceProxy, IdNameDto, DomainIdNameDto } from "../../../../shared/service-proxies/service-proxies";

@Component({
    selector: "createOrEditControlStandardModal",
    templateUrl: "./create-or-edit-controlStandard-modal.component.html"
})
export class CreateOrEditControlStandardModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    controlStandard: CreateOrEditControlStandardDto = new CreateOrEditControlStandardDto();
    domains: DomainIdNameDto[];
    // allDomains: GetDomainForViewDto[];
    authoritativeDocumentLists: IdNameDto[];
    domainName = "";
    selectedADid: number = 0;
    selectedDomainid: number = 0;
    hideButton: any;
    constructor(
        injector: Injector,
        private _controlStandardsServiceProxy: ControlStandardsServiceProxy,
        private _authDocumentServiceProxy: AuthoritativeDocumentsServiceProxy,
        private _domainServiceProxy: DomainsServiceProxy
    ) {
        super(injector);
    }

    setDomainList() {
        this._domainServiceProxy.getAllDomainsByAuthoritativeDocumentId(this.selectedADid).subscribe(res => {
            this.domains = res;
            this.selectedDomainid = 0;
        });
    }

    setDomainId(val) {
        this.controlStandard.domainId = val;
        this.controlStandard.domainName = this.domains.find(x => x.id == val).name;
    }

    show(controlStandardId?: number, buttonStatus?: any): void {
        if (buttonStatus != undefined)
            this.hideButton = buttonStatus;
        else
            this.hideButton = 0;
        this._authDocumentServiceProxy.getAllAuthoritativeDocuments().subscribe(res => {
            this.authoritativeDocumentLists = res;
            if (!controlStandardId) {
              
                this.controlStandard = new CreateOrEditControlStandardDto();
                this.controlStandard.id = controlStandardId;
                this.selectedADid = controlStandardId;
                this.domainName = "";
                this.domains = [];
                this.active = true;
                this.modal.show();
            } else {
                this.editControlStandard(controlStandardId);
            }
        });
    }

    public setADid(domainId: number) {
        this._domainServiceProxy.getAuthoritativeDocumentDomainsById(domainId).subscribe(result => {
            this._domainServiceProxy.getAllDomainsByAuthoritativeDocumentId(result).subscribe(res => {
                this.domains = res;
                this.selectedDomainid = domainId;
                this.selectedADid = result;
            });
        });
    }

    public editControlStandard(controlStandardId: number) {
        this._controlStandardsServiceProxy.getControlStandardForEdit(controlStandardId).subscribe(result => {
            this.controlStandard = result.controlStandard;
            this.domainName = result.domainName;
            this.selectedDomainid = this.controlStandard.domainId;
            this._domainServiceProxy.getAuthoritativeDocumentDomainsById(this.selectedDomainid).subscribe(result => {
                this._domainServiceProxy.getAllDomainsByAuthoritativeDocumentId(result).subscribe(res => {
                    this.domains = res;
                    this.selectedADid = result;
                    this.selectedDomainid = this.selectedDomainid;
                    this.active = true;
                    this.modal.show();
                });
            });
        });
    }

    save(): void {
        this.saving = true;
        this.controlStandard.domainId = this.selectedDomainid;
            this._controlStandardsServiceProxy
                .createOrEdit(this.controlStandard)
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

    setDomainIdNull() {
        this.controlStandard.domainId = null;
        this.domainName = "";
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
