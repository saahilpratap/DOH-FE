import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    OnInit,
    AfterViewInit
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import {
    AuthoritativeDocumentsServiceProxy,
    DomainsServiceProxy,
    CreateOrEditDomainDto,
    AuthoritativeDocumentDto,
    PagedResultDtoOfGetDomainForViewDto,
    GetAuthoritativeDocumentForViewDto
} from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/common/app-component-base";
import * as moment from "moment";
import { Observable } from "rxjs";

@Component({
    selector: "createOrEditDomainModal",
    templateUrl: "./create-or-edit-domain-modal.component.html"
})
export class CreateOrEditDomainModalComponent extends AppComponentBase
    implements AfterViewInit {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    domain: CreateOrEditDomainDto = new CreateOrEditDomainDto();
    authoritativeDocumentName = "";
    authoritativeDocuments: GetAuthoritativeDocumentForViewDto[];
    authorativeDocument: AuthoritativeDocumentDto[] = [];
    isReadOnly: number = 0;
  constructor(
        injector: Injector,
        private _domainsServiceProxy: DomainsServiceProxy,
        private _authDocumentServiceProxy: AuthoritativeDocumentsServiceProxy
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this._authDocumentServiceProxy.getAllAuthoritativeDocument().subscribe(res => {
            this.authoritativeDocuments = res;
            this.authorativeDocument= [];
            res.forEach(obj => {
                var item = new AuthoritativeDocumentDto();
                item.name = obj.authoritativeDocument.name;
                item.id = obj.authoritativeDocument.id;
                item.departmentName = obj.authoritativeDocument.departmentName;
                this.authorativeDocument.push(item);
            })
        });
    }

    show(domainId?: number, isReadOnly?: number): void {
        if (isReadOnly != undefined)
            this.isReadOnly = isReadOnly;
        else
            this.isReadOnly = 0;

        if (!domainId) {
            this.domain = new CreateOrEditDomainDto();
            this.domain.id = domainId;
            this.authoritativeDocumentName = "";

            this.active = true;
            this.modal.show();
        } else {
            this._domainsServiceProxy
                .getDomainForEdit(domainId)
                .subscribe(result => {
                    this.domain = result.domain;

                    this.authoritativeDocumentName =
                        result.authoritativeDocumentName;

                    this.active = true;
                    this.modal.show();
                });
        }
    }

    save(): void {
        this.saving = true;

        this._domainsServiceProxy
            .createOrEdit(this.domain)
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

    setAuthoritativeDocumentIdNull() {
        this.domain.authoritativeDocumentId = null;
        this.authoritativeDocumentName = "";
    }

    close(): void {
        this.active = false;
        this.modal.hide();
        console.log(this.domain);
    }
}
