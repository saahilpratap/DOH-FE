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
import {
    CreateOrEditEntityGroupDto,
    EntityGroupsServiceProxy,
    BusinessEntitiesServiceProxy,
    GetBusinessEntitiesExcelDto,
    EntityType,
    BusinessEntityUserDto,
} from "../../../../shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/common/session/app-session.service";

@Component({
    selector: "createOrEditNewEntityGroupModal",
    templateUrl: "./create-or-edit-newEntityGroup-modal.component.html",
})
export class CreateOrEditNewEntityGroupModalComponent extends AppComponentBase {
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
    isReadOnly: boolean = true;
    user: BusinessEntityUserDto[] = [];
    businessentityId: any;
    EntityTypes: EntityType;
    checktype: any;
    showquestionRadiobutton: boolean;
    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private _entityGroupsServiceProxy: EntityGroupsServiceProxy,
        private _businessEntityServiceProxy: BusinessEntitiesServiceProxy
    ) {
        super(injector);
    }

    getUserList() {
        this.user = [];
        this._businessEntityServiceProxy.getEntityAdminUser(this.businessentityId).subscribe(result => {
            this.user = result;
        })
    }

    changeuserprimaryEntity(userId) {
       
        if (userId != '0') {
            this.entityGroup.userId = userId;
        }
        else {
            this.entityGroup.userId = null;
        }

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
            .getUserAssignEntities(type)
            .subscribe((res) => {
                this.businessEntitiesLookUp = res;
                this.spinnerService.hide();
            });
    }

    show(isReadOnly: boolean, entityGroupId?: number): void {
        // this.entityGroup.entityType = EntityType.HealthcareEntity;
        this.isReadOnly = isReadOnly;
        if (!entityGroupId) {
            var checktype = this._appSessionService.user.type;

            switch (checktype) {
                case 0:
                    {
                        this.EntityTypes = EntityType.HealthcareEntity;
                        this.showquestionRadiobutton = true;
                        break;

                    }
                case 1:
                    {
                        this.EntityTypes = EntityType.HealthcareEntity;
                        this.showquestionRadiobutton = false;
                        break;
                    }
                case 2:
                    {
                        this.EntityTypes = EntityType.ExternalAudit;
                        this.showquestionRadiobutton = false;
                        break;

                    }
                case 3:
                    {
                        this.EntityTypes = EntityType.HealthcareEntity;
                        this.showquestionRadiobutton = true;
                        break;
                    }
                case 4:
                    {
                        this.EntityTypes = EntityType.InsuranceFacilities;
                        this.showquestionRadiobutton = false;
                        break;
                    }
            }
            this.entityGroup = new CreateOrEditEntityGroupDto();
            this.initializeBusinessEntitiesLookUp(this.EntityTypes);
            this.entityGroup.id = entityGroupId;
            this.active = true;
            this.entityGroup.entityType = this.EntityTypes;

            if (this.appSession.user.businessEntityId == 0) 
                this.checktype = false;
            else
                this.checktype = true;

            this.modal.show();
        } else {
            this._entityGroupsServiceProxy
                .getEntityGroupForEdit(entityGroupId)
                .subscribe((result) => {
                    this.entityGroup = result.entityGroup;
                    this.entityGroup.entityType = result.entityGroup.entityType;
                    this.businessentityId = this.entityGroup.primaryEntityId;
                    this.getUserList();
                    this.initializeBusinessEntitiesLookUp(result.entityGroup.entityType);
                    this._businessEntityServiceProxy
                        .getAllAuditablesForLookUp(result.entityGroup.entityType)
                        .subscribe((res) => {
                            this.groupedEntities = res.filter(
                                (e) =>
                                    result.entityGroup.groupedEntityIds.find(
                                        (x) => x == e.businessEntity.id
                                    ) != null
                            );
                        });
                    this.active = true;
                    if (this.appSession.user.businessEntityId == 0)
                        this.checktype = false;
                    else
                        this.checktype = true;
                    this.modal.show();
                });
        }
    }

    setFlag(val): boolean {
       return (this.isReadOnly) ?  this.isReadOnly : val;
    }

  checkprimaryEntity(BusinessEntityId: number) {
      if (BusinessEntityId != undefined) {
          this.entityGroup.userId = null;
          this.businessentityId = BusinessEntityId;
          this.getUserList();
      this._entityGroupsServiceProxy
        .getCheckPrmariyEntity(BusinessEntityId)
          .subscribe((result) => {             
              this._entityGroupsServiceProxy.getPersonCount(BusinessEntityId).subscribe(res => {
                  this.entityGroup.contractPersonnel = res.contractPersonnel;
                  this.entityGroup.itSecurityStaff = res.itSecurityStaff;
                  this.entityGroup.numberEmpWork = res.numberEmpWork;
                  this.entityGroup.totalPersonnel = res.totalPersonnel;              
            if (result == true) {

            this.isPrimaryEntity = result;
          } else {
            this.entityGroup.primaryEntityId = null;
                this.message.warn("No user associated as primary entity found. The primary entity of the group should be same as the primary entity of the user.");
          }
              });
          });
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
            return this.message.warn("Please select More Than one Entity");

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
    }

    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
}
