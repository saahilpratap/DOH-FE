import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import {
    AuthoritativeDocumentsServiceProxy,
    CreateOrEditAuthoritativeDocumentDto,    DynamicNameValueDto,
    AuthorityDepartmentDto,
    AuthoritativeDocumentListDto,
    BusinessEntityDto,
    AuthoritativeDocumentRelatedSelfDto,
    AuthoritativeDocumentAuditTypeDto,
    AuthorityDepartmentsServiceProxy,
    AuthritativeDocumentStatus
} from "@shared/service-proxies/service-proxies";

import { AppComponentBase } from "@shared/common/app-component-base";
import * as moment from "moment";

@Component({
    selector: "createOrEditAuthoritativeDocumentModal",
    templateUrl: "./create-or-edit-authoritativeDocument-modal.component.html"
})
export class CreateOrEditAuthoritativeDocumentModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    logoUpload: any;
    active = false;
    saving = false;
    isEdit: boolean;
    documentStatus: { id: number; name: string }[] = [];
    authoritativeDocument: CreateOrEditAuthoritativeDocumentDto = new CreateOrEditAuthoritativeDocumentDto();
    authorityDepartment: AuthorityDepartmentDto[];
    documentType: DynamicNameValueDto[] = [];
    category: DynamicNameValueDto[] = [];
    entity: DynamicNameValueDto[] = [];
    selectedEntity: DynamicNameValueDto[] = [];
    enable: boolean = false;
    thirdParty: BusinessEntityDto[] = [];
    relatedAD: AuthoritativeDocumentListDto[] = [];
    selectedAd: AuthoritativeDocumentListDto[] = [];
    isReadOnly: number = 0;
    constructor(
        injector: Injector,
        private _authoritativeDocumentsServiceProxy: AuthoritativeDocumentsServiceProxy,
        private _authorityDepartmentServiceProxy: AuthorityDepartmentsServiceProxy
    ) {
        super(injector);


    }

    ngOnInit() {


    }

    getDocumentStatus() {
        this.documentStatus = [];
        for (var n in AuthritativeDocumentStatus) {
            if (typeof AuthritativeDocumentStatus[n] === 'number') {
                this.documentStatus.push({ id: <any>AuthritativeDocumentStatus[n], name: n });
            }
        }
    }

    getallAuthorativeDocument() {
        this.getDocumentStatus();
        this.getApplicableEntities();
        this.getAuthorityDepartments();
        this.getDocumentType();
        this.getCategory();
        this.getThirdParty();
    }

    oncategoryChange(event) {

        if (event.name == ("Additional Document").trim()) {
            this.enable = true;
            this.getAuthorativeSelfLookup();
        }
        else {
            this.selectedAd = [];
            this.enable = false;
        }


    }

    uploadLogo() {
        const filePanCardUpload = document.getElementById('fileimageUpload') as HTMLInputElement;
        filePanCardUpload.onchange = () => {
            var size = (filePanCardUpload.files[0].size / 1024).toFixed(2);
            var Checksizes = parseInt(size);
            if (Checksizes <= (500)) {
                for (let index = 0; index < filePanCardUpload.files.length; index++) {
                    var reader = new FileReader();
                    reader.onload = (e: any) => {
                        this.authoritativeDocument.authoratativeDocumentLogo = e.target.result;
                        this.logoUpload = e.target.result;
                    }
                    reader.readAsDataURL(filePanCardUpload.files[index]);
                }
            }
            else {
                this.message.info("Please select Image below 500 KB");
            }
        };
        filePanCardUpload.click();
    }

    getCategory() {
        this._authoritativeDocumentsServiceProxy.getDynamicEntityCategory("Category").subscribe(result => {
            this.category = result;
            if (this.isEdit) {
                this.category.forEach(obj => {
                    if (obj.id == this.authoritativeDocument.categoryId) {
                        if (obj.name.trim() == ("Additional Document").trim()) {
                            this.enable = true;
                            this.getAuthorativeSelfLookup();
                        }
                        else {
                            this.enable = false;
                        }
                    }
                })
            }
        })
    }

    getApplicableEntities() {
        this._authoritativeDocumentsServiceProxy.getDynamicEntityAuditType("Applicable Entities").subscribe(result => {
            this.entity = result;
        })
    }

    getAuthorityDepartments() {
        this._authorityDepartmentServiceProxy
            .getAllAuthorityDepartments()
            .subscribe(result => {
                this.authorityDepartment = result;
            });
    }

    getDocumentType() {
        this._authoritativeDocumentsServiceProxy.getDynamicEntityDocumentType("Document Type").subscribe(result => {
            this.documentType = result;
        })
    }

    getThirdParty() {
        this._authoritativeDocumentsServiceProxy.getAllBusinessEntity().subscribe(result => {
            this.thirdParty = result;
        })
    }

    getAuthorativeSelfLookup() {
        this._authoritativeDocumentsServiceProxy.getAllAuthorativeDocument().subscribe(result => {
            this.relatedAD = result;
        })
    }

    show(authoritativeDocumentId?: number, isReadOnly?: number): void {
        if (isReadOnly != undefined)
            this.isReadOnly = isReadOnly;
         else 
            this.isReadOnly = 0;

        if (!authoritativeDocumentId) {
            this.logoUpload = null;
            this.authoritativeDocument = new CreateOrEditAuthoritativeDocumentDto();
            this.selectedEntity = [];
            this.selectedAd = [];
            this.getallAuthorativeDocument();
            this.authoritativeDocument.id = authoritativeDocumentId;
            this.authoritativeDocument.selectedAuthoritativeDocumentAuditTypes = this.authoritativeDocument.selectedAuthoritativeDocumentAuditTypes == undefined ? [] : this.authoritativeDocument.selectedAuthoritativeDocumentAuditTypes;
            this.authoritativeDocument.selectedAuthoritativeDocumentRelatedSelfs = this.authoritativeDocument.selectedAuthoritativeDocumentRelatedSelfs == undefined ? [] : this.authoritativeDocument.selectedAuthoritativeDocumentRelatedSelfs;
            this.authoritativeDocument.removedAuthoritativeDocumentAuditType = [];
            this.authoritativeDocument.removedAuthoritativeDocumentRelatedSelf = [];
            this.isEdit = false;
            this.active = true;
            this.modal.show();
        } else {
            this._authoritativeDocumentsServiceProxy
                .getAuthoritativeDocumentForEdit(authoritativeDocumentId)
                .subscribe(result => {
                    this.authoritativeDocument.id = authoritativeDocumentId;
                    this.getallAuthorativeDocument();
                    this.authoritativeDocument = result.authoritativeDocument;
                    this.authoritativeDocument.selectedAuthoritativeDocumentAuditTypes = result.selectedAuthoritativeDocumentAuditTypes;
                    this.authoritativeDocument.selectedAuthoritativeDocumentRelatedSelfs = result.selectedAuthoritativeDocumentRelatedSelfs;
                    this.authoritativeDocument.removedAuthoritativeDocumentAuditType = [];
                    this.authoritativeDocument.removedAuthoritativeDocumentRelatedSelf = [];
                    this.editRelatedAD();
                    this.editauditType();
                    this.logoUpload = result.authoritativeDocument.authoratativeDocumentLogo;

                    this.active = true;
                    this.isEdit = true;
                    this.modal.show();
                });
        }
    }

    auditTypeeChange() {
        this.filterAuthorativeDocumentMultipleSelect(this.authoritativeDocument.selectedAuthoritativeDocumentAuditTypes ?? [],
            this.selectedEntity, this.authoritativeDocument.removedAuthoritativeDocumentAuditType, "AuditType", this.isEdit).then((result: any) => {

                this.authoritativeDocument.selectedAuthoritativeDocumentAuditTypes = result.selectedItems;
                this.selectedEntity = result.dropDownItems;
                this.authoritativeDocument.removedAuthoritativeDocumentAuditType = result.removedItems;
            }).catch(exception => {
            });
    }

    editauditType() {

        this.selectedEntity = [];
        this.authoritativeDocument.selectedAuthoritativeDocumentAuditTypes.forEach(obj => {

            this.entity.forEach(team => {
                if (obj.auditTypeId == team.id) {

                    var temp = new DynamicNameValueDto();
                    temp.id = team.id;
                    temp.name = team.name;
                    this.selectedEntity.push(temp);
                }
            });
        });
    }

    editRelatedAD() {

        this.selectedAd = [];
        this.authoritativeDocument.selectedAuthoritativeDocumentRelatedSelfs.forEach(obj => {

            this.relatedAD.forEach(team => {
                if (obj.relatedADId == team.id) {

                    var temp = new AuthoritativeDocumentListDto();
                    temp.id = team.id;
                    temp.title = team.title;
                    this.selectedAd.push(temp);
                }
            });
        });
    }

    relatedAdChange() {
        this.filterAuthorativeDocumentMultipleSelect(this.authoritativeDocument.selectedAuthoritativeDocumentRelatedSelfs ?? [],
            this.selectedAd, this.authoritativeDocument.removedAuthoritativeDocumentRelatedSelf, "RelatedADId", this.isEdit).then((result: any) => {

                this.authoritativeDocument.selectedAuthoritativeDocumentRelatedSelfs = result.selectedItems;
                this.selectedAd = result.dropDownItems;
                this.authoritativeDocument.removedAuthoritativeDocumentRelatedSelf = result.removedItems;
            }).catch(exception => {
            });
    }

    filterAuthorativeDocumentMultipleSelect(source: any, dest: any, drop: any, filterFor: string, isEdit = false) {

        let promise = new Promise((resolve, reject) => {
            if (isEdit == true) {
                let prevData = source;
                if (dest.length > 0) {
                    prevData.forEach(data => {
                        let exist = false;
                        dest.forEach(obj => {
                            if (filterFor == "RelatedADId") {

                                if (data.relatedADId == obj.id) {

                                    exist = true;
                                }
                            } else {
                                if (filterFor == "AuditType") {

                                    if (data.auditTypeId == obj.id) {
                                        exist = true;
                                    }
                                }
                                else {

                                }
                            }
                        });
                        if (!exist) {
                            let index = source.findIndex(x => x.id == data.id);
                            drop.push(source[index].id);
                            source.splice(index, 1);
                        }
                    });
                }
                else {

                    prevData.forEach(data => {
                        drop.push(data.id);
                    });
                    source = [];
                }
            }

            dest.forEach(obj => {
                if (filterFor == "RelatedADId") {

                    let item = source.filter(t => t.relatedADId == obj.id);
                    if (item.length == 0) {

                        var selfId = new AuthoritativeDocumentRelatedSelfDto();
                        selfId.id = 0;
                        selfId.authoritativeDocumentId = 0;
                        selfId.relatedADId = obj.id;
                        source.push(selfId);
                    }
                }
                else {
                    if (filterFor == "AuditType") {

                        let item = source.filter(t => t.auditTypeId == obj.id);
                        if (item.length == 0) {

                            var auditType = new AuthoritativeDocumentAuditTypeDto();
                            auditType.id = 0;
                            auditType.authoritativeDocumentId = 0;
                            auditType.auditTypeId = obj.id;
                            source.push(auditType);
                        }
                    } else {
                    }
                }

            });

            resolve({ selectedItems: source, dropDownItems: dest, removedItems: drop });

        });
        return promise;
    }
    save(): void {
        this.saving = true;
        this._authoritativeDocumentsServiceProxy
            .createOrEdit(this.authoritativeDocument)
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
