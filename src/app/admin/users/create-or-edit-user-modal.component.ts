import { AfterViewChecked, Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateUserInput, OrganizationUnitDto, BusinessEntityDto, EntityGroupsServiceProxy, PasswordComplexitySetting, ProfileServiceProxy, UserEditDto, UserRoleDto, UserServiceProxy, UserOriginType, BusinessEntitiesServiceProxy, GetBusinessEntitiesExcelDto, EntityType } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { IOrganizationUnitsTreeComponentData, OrganizationUnitsTreeComponent } from '../shared/organization-unit-tree.component';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { PermissionCheckerService } from 'abp-ng2-module';
import { AppSessionService } from '../../../shared/common/session/app-session.service';
import * as $ from 'jquery';
import { UserDeleted } from '../../shared/common/customizable-dashboard/core/auth';
@Component({
    selector: 'createOrEditUserModal',
    templateUrl: './create-or-edit-user-modal.component.html',
    styles: [`.user-edit-dialog-profile-image {
             margin-bottom: 20px;
        }`
    ]
})
export class CreateOrEditUserModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('organizationUnitTree') organizationUnitTree: OrganizationUnitsTreeComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    oldValue: number = 0;
    active = false;
    saving = false;
    canChangeUserName = true;
    isTwoFactorEnabled: boolean = this.setting.getBoolean('Abp.Zero.UserManagement.TwoFactorLogin.IsEnabled');
    isLockoutEnabled: boolean = this.setting.getBoolean('Abp.Zero.UserManagement.UserLockOut.IsEnabled');
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    type: any;
    user: UserEditDto = new UserEditDto();
    roles: UserRoleDto[];
    sendActivationEmail = true;
    setRandomPassword = true;
    passwordComplexityInfo = '';
    profilePicture: string;
    businessEntitiesLookUp: BusinessEntityDto[] = [];
    allOrganizationUnits: OrganizationUnitDto[];
    memberedOrganizationUnits: string[];
    selectedOrganizationUnitId = 0;
    userPasswordRepeat = '';
    showActiveBtn = false;
    isAuthorityUser: boolean = false;
    isReviwerUser: boolean = false;
    isExternalAuditUser: boolean = false;
    isBusinessEntityUser: boolean = true;
    isInsuranceEntityUser: boolean = false;
    disabledEntitySelectiondropdown = false;
    businessEntityId: any;
    isEdit: boolean = false;
    checkPrimaryEntitys: boolean = false;
    EntityTypes: EntityType;
    checkbusinessEntity: boolean = true;
    isdiable: boolean = false;
    UserOriginType: any;
    selectedEntities: BusinessEntityDto[] = [];

    multipleselected: BusinessEntityDto[] = [];
    selectedMultiple: any[];
    selectedMultiple1: any[];
    allBusinessEntitiesList: BusinessEntityDto[] = [];

    input = new CreateOrUpdateUserInput();
    roleTabTrue: boolean = true;
    userTypeByType: any;
    selectedIndex: number;
    constructor(
        injector: Injector,
        private _userService: UserServiceProxy, private _appSessionService: AppSessionService,
        private _entityGroupsServiceProxy: EntityGroupsServiceProxy,
        private _profileService: ProfileServiceProxy, private _permissionCheckerService: PermissionCheckerService,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
    ) {
        super(injector);
    }

   

    changeSelection(event, index) {
        let count = 0;      
        this.roles.forEach(obj => {
            if (count != index) {                
                obj.isAssigned = false;
            } 
            count++
        });
        
        this.selectedIndex = event.target.checked ? index : undefined;
    }


    SelectedMultipleEntity(item: BusinessEntityDto[]) {
        this.multipleselected = [];       
        if (item.length > 0) {

            item.forEach(obj => {
                let a = new BusinessEntityDto();
                a.id = obj.id;
                a.name = obj.name;
                this.multipleselected.push(a);

            })
        }
        else {
            this.multipleselected = [];
            this.user.businessEntityId = null;
        }   
    }

    onSearch(val) {
       
      
        var top10entities = _.take(this.allBusinessEntitiesList, 10);

        var searchEntity = [];
        var selecEntity = [];

        //selected entities push in search array
        _.uniq(this.selectedMultiple).forEach(x => {
            var obj = this.allBusinessEntitiesList.find(y => y.id == x);
            if (obj != undefined) {
                selecEntity.push(obj);
            }
        });

        var allentitiesId = this.allBusinessEntitiesList.map(x => x.id);
        var selectedEntitiesId = _.uniq(this.selectedMultiple);
        var notselectedEntities = _.difference(allentitiesId, selectedEntitiesId);

        //search entities push in search array
        this.allBusinessEntitiesList.filter(x => notselectedEntities.includes(x.id)).forEach(x => {
            if (_.includes(x.name, val.term)) {
                searchEntity.push(x);
            }
        });

        if (searchEntity.length > 10) {
            searchEntity = _.take(searchEntity, 10);
        }

        this.businessEntitiesLookUp = selecEntity.concat(searchEntity).concat(top10entities);
        this.businessEntitiesLookUp = _.uniqBy(this.businessEntitiesLookUp, 'name');
    }

    initializeBusinessEntitiesLookUp(type) {
        this.spinnerService.show();
        this.selectedEntities = [];
        this.multipleselected = [];
        this.selectedMultiple = [];
        this.selectedMultiple1 = [];
        this._businessEntitiesServiceProxy.getAllUsersByUser(type, true).subscribe(res => {

           // this.businessEntitiesLookUp = res;
            this.allBusinessEntitiesList = res;
            if (this.isEdit) {
                if (this.input.businessEntityIds == undefined)
                {
                    this.selectedEntities = [];
                    this.selectedMultiple = [];
                    this.multipleselected = [];
                    this.selectedMultiple1 = [];
                }
                else
                {
                    this.selectedMultiple = [];
                    this.selectedMultiple1 = [];
                    res.forEach(obj => {
                        let check = this.input.businessEntityIds.find(y => y == obj.id);
                        if (check != undefined) {
                            this.selectedMultiple.push(obj.id);
                            this.selectedMultiple1.push(this.allBusinessEntitiesList.find(x => x.id == obj.id));
                        }

                    })
                    this.multipleselected = res.filter(x => this.input.businessEntityIds.find(y => y == x.id));
                }
            }

            var top10entities = _.take(res, 10);
            this.businessEntitiesLookUp = _.uniqBy(this.selectedMultiple1.concat(top10entities), 'name');
            this.selectAllForDropdownItems(this.businessEntitiesLookUp);
            this.spinnerService.hide();
        });
    }
    selectAllForDropdownItems(items: any[]) {
      
        let allSelect = items => {
            items.forEach(element => {
                element['selectedAllGroup'] = 'selectedAllGroup';
            });
        };
        allSelect(items);
    }
    selectEntities(e) {        
        if (e == 'businesEntities') {
            this.checkbusinessEntity = false;
            this.disabledEntitySelectiondropdown = false;
            this.isBusinessEntityUser = true;
            this.isAuthorityUser = false;
            this.isReviwerUser = false;
            this.isExternalAuditUser = false;
            this.isInsuranceEntityUser = false;

            this.businessEntitiesLookUp = [];
            this.UserOriginType = UserOriginType.BusinessEntity
            this.getUser(this.user.id);

            setTimeout(() => {
                $("#isBusinessEntityUser").prop("checked", true);
            }, 500);
            this.EntityTypes = EntityType.HealthcareEntity;
            this.initializeBusinessEntitiesLookUp(EntityType.HealthcareEntity);
            this.user.type = this.UserOriginType;
            this.userTypeByType = this.appSession.user.type;
        }

        else if (e == 'isAuthorityUser') {
            this.userTypeByType = this.appSession.user.type;
            this.checkbusinessEntity = true;
            this.isBusinessEntityUser = false;
            this.isAuthorityUser = true;
            this.isReviwerUser = false;
            this.isExternalAuditUser = false;
            this.isInsuranceEntityUser = false;
            this.businessEntitiesLookUp = [];
            this.selectedMultiple = [];

            this.UserOriginType = UserOriginType.Authority;
            this.getUser(this.user.id);
            setTimeout(() => { $("#isAuthorityUser").prop("checked", true); }, 500);

            this.user.type = this.UserOriginType;

            this.disabledEntitySelectiondropdown = true;
        }

        else if (e == 'isReviwerUser') {
            this.userTypeByType = this.appSession.user.type;
            this.checkbusinessEntity = true;
            this.isBusinessEntityUser = false;
            this.isAuthorityUser = false;
            this.isReviwerUser = true;
            this.isExternalAuditUser = true;
            this.isInsuranceEntityUser = false;
            this.businessEntitiesLookUp = [];

            this.UserOriginType = UserOriginType.Reviwer;
            this.getUser(this.user.id);
            setTimeout(() => { $("#isReviwerUser").prop("checked", true); }, 500);
            this.EntityTypes = EntityType.ExternalAudit;
            this.initializeBusinessEntitiesLookUp(EntityType.ExternalAudit);

            this.user.type = this.UserOriginType;

            this.disabledEntitySelectiondropdown = false;
        }

        else if (e == 'isExternalAuditUser') {
            this.userTypeByType = this.appSession.user.type;
            this.checkbusinessEntity = false;
            this.isBusinessEntityUser = false;
            this.isAuthorityUser = false;
            this.isReviwerUser = false;
            this.isExternalAuditUser = true;
            this.isInsuranceEntityUser = false;
            this.disabledEntitySelectiondropdown = false;
            this.businessEntitiesLookUp = [];
            this.UserOriginType = UserOriginType.ExternalAuditor;
            this.getUser(this.user.id);
            setTimeout(() => { $("#isExternalAuditUser").prop("checked", true); }, 500);
            this.EntityTypes = EntityType.ExternalAudit;
            this.initializeBusinessEntitiesLookUp(EntityType.ExternalAudit);
            this.user.type = this.UserOriginType;
        }

        else if (e == 'insuranceEntity') {
            this.userTypeByType = this.appSession.user.type;
            this.checkbusinessEntity = false;
            this.isBusinessEntityUser = false;
            this.isAuthorityUser = false;
            this.isReviwerUser = false;
            this.isExternalAuditUser = false;
            this.isInsuranceEntityUser = true;
            this.disabledEntitySelectiondropdown = false;
            this.businessEntitiesLookUp = [];
            this.UserOriginType = UserOriginType.InsuranceEntity;
            this.getUser(this.user.id);
            setTimeout(() => { $("#isInsuranceEntityUser").prop("checked", true); }, 500);
            this.EntityTypes = EntityType.InsuranceFacilities;
            this.initializeBusinessEntitiesLookUp(EntityType.InsuranceFacilities);
            this.user.type = this.UserOriginType;
        }
    }

    disabledEntitySelection() {
        this.disabledEntitySelectiondropdown = this.isAuthorityUser || this.isReviwerUser ? true : this.user.type == UserOriginType.Admin ? true : false;
    }

    show(userId?: number): void {       
        this.checkPrimaryEntitys = false;
        this.selectedEntities = [];
        this.userTypeByType = this.appSession.user.type;
        
        if (!userId) {

            this.isEdit = false;
            this.active = true;
            this.setRandomPassword = true;
            this.sendActivationEmail = true;
            this.checkType();
        }
        if (userId != null) {
            this.checkType();
        }
        if (userId) {
            
            if (this.appSession.userId == userId) {
                this.roleTabTrue = false;
            }
            else {
                this.roleTabTrue = true;
            }
           
        }
        
        this._userService.getUserForEdit(userId, this.user.type).subscribe(userResult => {
            this.user = userResult.user;                      
            this.input.businessEntityIds = userResult.businessEntityIds;
            if (this.user.businessEntityId != undefined) {
                this.input.businessEntityIds.push(this.user.businessEntityId);
            }

            if (this.user.id != null) {
                this.isEdit = true;
            }
            this.businessEntityId = this.user.businessEntityId;
            this.oldValue = this.user.businessEntityId;


            if (userResult.user.id == null && userResult.user.isActive == true) {
                this.user.isActive = false;
            }
            if (!this.appSession.appSettings.enableNewUserApproval) {
                this.showActiveBtn = true;
            } else {
                if (this.appSession.appSettings.enableNewUserApproval && this._permissionCheckerService.isGranted("Pages.Administration.Users.Active")) {
                    this.showActiveBtn = true;
                }
            }
            if (this.user.id != null) {
                this.isAuthorityUser = this.user.type == UserOriginType.Authority ? true : this.user.type == UserOriginType.Admin ? true : false;
                if (this.isAuthorityUser) {
                    $("#isAuthorityUser").prop("checked", true);
                    this.selectEntities('isAuthorityUser');
                }

                this.isReviwerUser = this.user.type == UserOriginType.Reviwer ? true : false;
                if (this.isReviwerUser) {
                    $("#isReviwerUser").prop("checked", true);
                    this.selectEntities('isReviwerUser');
                }

                this.isBusinessEntityUser = this.user.type == UserOriginType.BusinessEntity ? true : false;
                if (this.isBusinessEntityUser) {
                    $("#isBusinessEntityUser").prop("checked", true);
                    this.selectEntities('businesEntities');
                }
                this.isExternalAuditUser = this.user.type == UserOriginType.ExternalAuditor ? true : false;
                if (this.isExternalAuditUser) {
                    $("#isExternalAuditUser").prop("checked", true);
                    this.selectEntities('isExternalAuditUser');
                }
                this.isInsuranceEntityUser = this.user.type == UserOriginType.InsuranceEntity ? true : false;
                if (this.isInsuranceEntityUser) {
                    $("#isInsuranceEntityUser").prop("checked", true);
                    this.selectEntities('insuranceEntity');
                }

                this.disabledEntitySelection();
                // this.checkType();
            }
            else {
                this.checkType();
            }
            this.user.businessEntityId = this.user.id == null ? this.appSession.user.businessEntityId : this.user.businessEntityId;
            this.roles = userResult.roles;           
            this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;
            this.allOrganizationUnits = userResult.allOrganizationUnits;
            this.memberedOrganizationUnits = userResult.memberedOrganizationUnits;
            this.selectedOrganizationUnitId = userResult.organizationUnitId;
            this.getProfilePicture(userResult.profilePictureId);

            if (userId) {
                this.active = true;
                setTimeout(() => {
                    this.setRandomPassword = false;
                }, 0);
                this.sendActivationEmail = false;
            }

            this._profileService.getPasswordComplexitySetting().subscribe(passwordComplexityResult => {
                this.passwordComplexitySetting = passwordComplexityResult.setting;
                this.setPasswordComplexityInfo();
                this.modal.show();
            });
        });
    }


    getUser(userId?: number) {
        this.roles = [];
        userId = userId == null ? undefined : userId;
        this._userService.getUserForEdit(userId, this.UserOriginType).subscribe(userResult => {
            this.user = userResult.user;           
            this.roles = userResult.roles;
        });
    }

    checkType() {
        var checktype = this._appSessionService.user.type;
        switch (checktype) {
            case 0:
                {
                    $("#isBusinessEntityUser").prop("checked", true);
                    this.selectEntities('businesEntities');
                    this.isdiable = false;
                    this.user.shouldChangePasswordOnNextLogin = true;
                    this.setRandomPassword = true;

                    break;
                }
            case 1:
                {
                    $("#isBusinessEntityUser").prop("checked", true);
                    this.selectEntities('businesEntities');
                    this.isdiable = true;

                    this.setRandomPassword = true;
                    this.user.shouldChangePasswordOnNextLogin = true;
                    break;
                }
            case 2:
                {
                    $("#isBusinessEntityUser").prop("checked", true);
                    this.selectEntities('isExternalAuditUser');
                    this.initializeBusinessEntitiesLookUp(this.EntityTypes);
                    this.isdiable = true;
                    this.user.shouldChangePasswordOnNextLogin = true;
                    this.setRandomPassword = true;
                    break;
                }
            case 3:
                {
                    $("#isBusinessEntityUser").prop("checked", true);
                    this.selectEntities('isAuthorityUser');
                    this.checkbusinessEntity = false;
                    this.user.shouldChangePasswordOnNextLogin = true;
                    this.isdiable = false;
                    this.setRandomPassword = true;
                    break;
                }
            case 4:
                {
                    $("#isBusinessEntityUser").prop("checked", true);
                    this.selectEntities('insuranceEntity');
                    this.isdiable = true;
                    this.setRandomPassword = true;
                    this.user.shouldChangePasswordOnNextLogin = true;
                    break;
                }
            case 5:
                {
                    $("#isBusinessEntityUser").prop("checked", true);
                    this.selectEntities('isReviwerUser');
                    this.isdiable = true;
                    this.setRandomPassword = true;
                    this.user.shouldChangePasswordOnNextLogin = true;
                    break;
                }
        }
    }

    setPasswordComplexityInfo(): void {

        this.passwordComplexityInfo = '<ul>';

        if (this.passwordComplexitySetting.requireDigit) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireDigit_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireLowercase) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireLowercase_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireUppercase) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireUppercase_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireNonAlphanumeric) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireNonAlphanumeric_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requiredLength) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequiredLength_Hint', this.passwordComplexitySetting.requiredLength) + '</li>';
        }

        this.passwordComplexityInfo += '</ul>';
    }

    getProfilePicture(profilePictureId: string): void {
        if (!profilePictureId) {
            this.profilePicture = this.appRootUrl() + 'assets/common/images/default-profile-picture.png';
        } else {
            this._profileService.getProfilePictureById(profilePictureId).subscribe(result => {

                if (result && result.profilePicture) {
                    this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
                } else {
                    this.profilePicture = this.appRootUrl() + 'assets/common/images/default-profile-picture.png';
                }
            });
        }
    }

    onShown(): void {
        if (this.shouldDisplayOrganizationUnits()) {
            this.organizationUnitTree.data = <IOrganizationUnitsTreeComponentData>
                {
                    allOrganizationUnits: this.allOrganizationUnits,
                    selectedOrganizationUnits: this.memberedOrganizationUnits,
                    selectedOrganizationUnitId: this.selectedOrganizationUnitId
                };
        }
        document.getElementById("Name").focus();
    }

    save(): void {
        this.user.businessEntityId = this.isAuthorityUser ? null : this.user.businessEntityId;
        if (this.isAuthorityUser) {
            this.user.businessEntityId = null;
        }
        else if (this.isReviwerUser) {
            if (this.user.businessEntityId == undefined || this.user.businessEntityId == null) {
                return this.message.info("Please select Primary Entity");
            }
            if (this.multipleselected == undefined || this.multipleselected.length == null) {
                return this.message.info("Please select Entity");
            }
        }
        else {
            if (this.user.businessEntityId == undefined || this.user.businessEntityId == null) {
                return this.message.info("Please select Primary Entity");
            }
            if (this.multipleselected == undefined || this.multipleselected.length == null) {
                return this.message.info("Please select Entity");
            }
        }
        if (this.UserOriginType != undefined) {
            this.user.type = this.UserOriginType;
        }
        this.input.user = this.user;
        this.input.setRandomPassword = this.setRandomPassword;
        this.input.sendActivationEmail = this.sendActivationEmail;
        this.input.businessEntityIds = this.multipleselected.map(x => x.id);
        this.input.assignedRoleNames =
            _.map(
                _.filter(this.roles, { isAssigned: true, inheritedFromOrganizationUnit: false }), role => role.roleName
            );

        this.input.organizationUnits = this.shouldDisplayOrganizationUnits()
            ? this.organizationUnitTree.getSelectedOrganizations()
            : [];

        this.saving = true;
        if (this.isEdit == true) {
            if (this.checkPrimaryEntitys == true) {

            }
        }


        this._userService.createOrUpdateUser(this.input)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    shouldDisplayOrganizationUnits() {
        return (
            this._appSessionService.user.type != UserOriginType.BusinessEntity &&

            this._appSessionService.user.type != UserOriginType.ExternalAuditor && this._appSessionService.user.type != UserOriginType.InsuranceEntity && this._appSessionService.user.type != UserOriginType.Reviwer
        );
    }

    initializeBeLookUpFields(val: any) {
        if (val != undefined) {


            if (this.isEdit) {
                this._entityGroupsServiceProxy.checkEntityPrimary(this.user.id).subscribe(res => {
                    if (!res.checkPrimaryEntity) {
                        if (val != null) {
                            this.user.businessEntityId = val;
                        }
                        else {
                            // this.user.businessEntityId=
                        }

                    }
                    else {
                        if (this.businessEntityId == res.primaryEntityId && res.checkPrimaryEntity == true) {
                            this.message.warn("You can not change entity because it's the Primary entity in the group.");
                            this.checkPrimaryEntitys = true;
                            if (this.oldValue != 0) {

                                this.user.businessEntityId = this.oldValue;
                            }
                        }
                        else {
                            this.user.businessEntityId = val;
                        }

                    }

                });

            }
        }
        else {

            // this.user.businessEntityId = this.oldValue;
            this.message.warn("Please select valid entity.");
        }
    }

    close(): void {
        this.active = false;
        this.userPasswordRepeat = '';
        this.modal.hide();
    }

    getAssignedRoleCount(): number {
        return _.filter(this.roles, { isAssigned: true }).length;
    }
}
