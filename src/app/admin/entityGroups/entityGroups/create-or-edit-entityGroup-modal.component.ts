import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import { AppSessionService } from "@shared/common/session/app-session.service";
import {
    CreateOrEditEntityGroupDto,
    EntityGroupsServiceProxy,
    BusinessEntitiesServiceProxy,
    GetBusinessEntitiesExcelDto,
    EntityType, BusinessEntityDto,
    BusinessEntityUserDto
} from "../../../../shared/service-proxies/service-proxies";

@Component({
    selector: "createOrEditEntityGroupModal",
    templateUrl: "./create-or-edit-entityGroup-modal.component.html",
})
export class CreateOrEditEntityGroupModalComponent extends AppComponentBase {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    entityType: EntityType;
    entityGroup: CreateOrEditEntityGroupDto = new CreateOrEditEntityGroupDto();
    businessEntitiesLookUp: GetBusinessEntitiesExcelDto[] = [];
    selectedEntities: number[] = [];
    entityIdsToDeattach: number[] = [];
    groupedEntities: GetBusinessEntitiesExcelDto[] = [];
    isPrimaryEntity: boolean;
    user: BusinessEntityUserDto[] = [];
    businessentityId: any;
    BusinessEntityPrimary: BusinessEntityDto[] = [];
    item: BusinessEntityDto[] = [];
    checktype: any;
    EntityTypes: EntityType;
    hideButton: any;

    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private _entityGroupsServiceProxy: EntityGroupsServiceProxy,
        private _businessEntityServiceProxy: BusinessEntitiesServiceProxy
    ) {
        super(injector);
        this.hideButton = true;
    }

    addtotarget(e: any) {
        this.setBusinessEntityPrimary();
    }

    onmovetosource(e: GetBusinessEntitiesExcelDto) {
        let check = this.businessEntitiesLookUp.filter(x => x.businessEntity.id == this.entityGroup.primaryEntityId);
        if (check.length != 0) {
            this.entityGroup.primaryEntityId = null;
            this.entityGroup.userId = null;
            this.user = [];
        }
        this.setBusinessEntityPrimary();
    }

    addEntities() {
        this.selectedEntities.forEach((e) => {
            if (this.groupedEntities.find((x) => x.businessEntity.id == e) == null) {
                var entityToAdd = this.businessEntitiesLookUp.find(
                    (x) => x.businessEntity.id == e
                );
                if (entityToAdd != null) {
                    this.groupedEntities.push(entityToAdd);
                }
            }
        });
    }

    removeEntities() {
        this.entityGroup.primaryEntityId = null;
        this.groupedEntities = this.groupedEntities.filter(
            (e) =>
                this.entityIdsToDeattach.find((x) => x == e.businessEntity.id) == null
        );
    }

    initializeBusinessEntitiesLookUp(type) {
        this.spinnerService.show();
        this.groupedEntities = [];
        this._businessEntityServiceProxy
            .getAllExcludedEntityGroupMembers(type)
            .subscribe((res) => {
                this.businessEntitiesLookUp = res;
                this.spinnerService.hide();
            });
    }

    getUserList(businessentityIds: any) {
        this.user = [];
        //this.entityGroup.userId = null;
        this._businessEntityServiceProxy.getEntityAdminUser(businessentityIds).subscribe(result => {
            this.user = result;
        })
    }

    show(entityGroupId?: number, buttonStatus?: any): void {
        if (buttonStatus != undefined)
            this.hideButton = buttonStatus;
        else
            this.hideButton = 0;

        var checktype = this._appSessionService.user.type;
        switch (checktype) {
            case 0:
                {
                    this.EntityTypes = EntityType.HealthcareEntity;
                    break;

                }
            case 1:
                {
                    this.EntityTypes = EntityType.HealthcareEntity;
                    break;
                }
            case 2:
                {
                    this.EntityTypes = EntityType.ExternalAudit;
                    break;

                }
            case 3:
                {
                    this.EntityTypes = EntityType.HealthcareEntity;
                    break;
                }
            case 4:
                {
                    this.EntityTypes = EntityType.InsuranceFacilities;
                    break;
                }
        }

        if (!entityGroupId) {
            if (this.appSession.user.businessEntityId == 0) {

                this.checktype = false;
            } else {
                this.checktype = true;
            }
            this.entityGroup = new CreateOrEditEntityGroupDto();
            this.initializeBusinessEntitiesLookUp(this.EntityTypes);
            this.entityGroup.id = entityGroupId;
            this.active = true;
            this.entityGroup.entityType = this.EntityTypes;
            this.modal.show();
        }

        else {
            if (this.appSession.user.businessEntityId == 0) {

                this.checktype = true;
            } else {
                this.checktype = true;
            }
            this._entityGroupsServiceProxy
                .getEntityGroupForEdit(entityGroupId)
                .subscribe((result) => {                   
                    this.initializeBusinessEntitiesLookUp(result.entityGroup.entityType);
                    this.entityGroup = result.entityGroup;
                    this.businessentityId = this.entityGroup.primaryEntityId;
                    this.getUserList(this.businessentityId);
                    this.entityGroup.entityType = result.entityGroup.entityType;

                    this._businessEntityServiceProxy
                        .getAllAuditablesForLookUp(result.entityGroup.entityType)
                        .subscribe((res) => {
                            this.groupedEntities = res.filter(
                                (e) =>
                                    result.entityGroup.groupedEntityIds.find(
                                        (x) => x == e.businessEntity.id
                                    ) != null
                            );

                            this.setBusinessEntityPrimary();
                        });
                    this.active = true;
                    this.modal.show();
                });
        }

    }

    checkprimaryEntity(BusinessEntityId: number) {
        if (BusinessEntityId != undefined) {
            this.entityGroup.userId = null;
            this.businessentityId = BusinessEntityId;
            this.getUserList(this.businessentityId);
            this._entityGroupsServiceProxy
                .getCheckPrmariyEntity(BusinessEntityId)
                .subscribe((result) => {
                    if (result == true) {
                        this.isPrimaryEntity = result;
                    } else {
                        this.entityGroup.primaryEntityId = null;
                        this.message.warn("No user associated as primary entity found.The primary entity of the group should be same as the primary entity of the user.");
                    }
                });
        }
    }

    changeuserprimaryEntity(userId) {
        
        if (userId != '0') {
            this.entityGroup.userId = userId;
        }
        else {
            this.entityGroup.userId = null;
        }

    }

    save(): void {
        this.saving = true;
        this.entityGroup.groupedEntityIds = this.groupedEntities.map(
            (e) => e.businessEntity.id
        );
        if (this.entityGroup.primaryEntityId == null) {
            this.saving = false;
            return this.message.warn("Please select Primary Entity");
        }

        if (this.groupedEntities.length <= 1) {
            this.saving = false;
            return this.message.warn("Group can be created only with more than one entity. Please select more entities");
        }
        this._entityGroupsServiceProxy
            .createOrEdit(this.entityGroup)
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
        this.groupedEntities = [];
        this.user = [];
        this.BusinessEntityPrimary = [];
    }

    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    setBusinessEntityPrimary() {
        this.BusinessEntityPrimary = [];
        this.BusinessEntityPrimary = this.groupedEntities.map(x => x.businessEntity);
    }
}
