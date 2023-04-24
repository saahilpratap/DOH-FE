
import { AbpMultiTenancyService } from 'abp-ng2-module';
//import { AbpMultiTenancyService } from "@abp/multi-tenancy/abp-multi-tenancy.service";
import { Injectable } from '@angular/core';
import { ApplicationInfoDto, GetCurrentLoginInformationsOutput, SessionServiceProxy, TenantLoginInfoDto, UserLoginInfoDto, UiCustomizationSettingsDto, UserOriginType, EntityApplicationSettingDto } from '@shared/service-proxies/service-proxies';

@Injectable()
export class AppSessionService {

    private _user: UserLoginInfoDto;
    private _tenant: TenantLoginInfoDto;
    private _application: ApplicationInfoDto;
    private _theme: UiCustomizationSettingsDto;
    private _appSettings: EntityApplicationSettingDto;
    constructor(
        private _sessionService: SessionServiceProxy,
        private _abpMultiTenancyService: AbpMultiTenancyService) {

    }

    get businessEntityId(): number {
        return this._user.businessEntityId;
    }
    get isAuthorityUser(): boolean {
        return this._user.type == UserOriginType.Authority || this._user.type == UserOriginType.Admin;
    }


    get application(): ApplicationInfoDto {
        return this._application;
    }

    set application(val: ApplicationInfoDto) {
        this._application = val;
    }

    get user(): UserLoginInfoDto {
        return this._user;
    }

    get appSettings(): EntityApplicationSettingDto {
        return this._appSettings;
    }

    get userId(): number {
        return this.user ? this.user.id : null;
    }

    get tenant(): TenantLoginInfoDto {
        return this._tenant;
    }

    get tenancyName(): string {
        return this._tenant ? this.tenant.tenancyName : '';
    }

    get tenantId(): number {
        return this.tenant ? this.tenant.id : null;
    }

    getShownLoginName(): string {
        const userName = this._user.userName;
        if (!this._abpMultiTenancyService.isEnabled) {
            return userName;
        }

        return (this._tenant ? this._tenant.tenancyName : '.') + '\\' + userName;
    }

    get theme(): UiCustomizationSettingsDto {
        return this._theme;
    }

    set theme(val: UiCustomizationSettingsDto) {
        this._theme = val;
    }

    init(): Promise<UiCustomizationSettingsDto> {
        return new Promise<UiCustomizationSettingsDto>((resolve, reject) => {
            this._sessionService.getCurrentLoginInformations().toPromise().then((result: GetCurrentLoginInformationsOutput) => {

                if (result.user != undefined) {
                    if (result.user.reloadPage) {
                        location.reload();
                    }
                }
                this._application = result.application;
                this._user = result.user;
                this._tenant = result.tenant;
                this._theme = result.theme;
                this._appSettings = result.appSettings;
                resolve(result.theme);
            }, (err) => {
                reject(err);
            });
        });
    }

    changeTenantIfNeeded(tenantId?: number): boolean {
        if (this.isCurrentTenant(tenantId)) {
            return false;
        }

        abp.multiTenancy.setTenantIdCookie(tenantId);
        location.reload();
        return true;
    }

    private isCurrentTenant(tenantId?: number) {
        let isTenant = tenantId > 0;

        if (!isTenant && !this.tenant) { // this is host
            return true;
        }

        if (!tenantId && this.tenant) {
            return false;
        } else if (tenantId && (!this.tenant || this.tenant.id !== tenantId)) {
            return false;
        }

        return true;
    }
}
