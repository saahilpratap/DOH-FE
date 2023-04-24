import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Subscription, Observable } from 'rxjs';
import { timer } from 'rxjs';
import { LoginService } from './login.service';
import { Pipe, PipeTransform } from "@angular/core";


@Component({
    templateUrl: './validate-two-factor-code.component.html',
    styleUrls: ['./validate-two-factor-code.component.less'],
    animations: [accountModuleAnimation()]
})
export class ValidateTwoFactorCodeComponent extends AppComponentBase implements CanActivate, OnInit, OnDestroy {

    code: string;
    submitting = false;
    remainingSeconds = 300;
    timerSubscription: Subscription;

    constructor(
        injector: Injector,
        public loginService: LoginService,
        private _router: Router
    ) {
        super(injector);
    }

    canActivate(): boolean {
        if (this.loginService.authenticateModel &&
            this.loginService.authenticateResult
        ) {
            return true;
        }

        return false;
    }

    ngOnInit(): void {
        if (!this.canActivate()) {
            this._router.navigate(['account/login']);
            return;
        }
        debugger
        const timerSource = timer(1000, 1000);
        this.timerSubscription = timerSource.subscribe(() => {
            this.remainingSeconds = this.remainingSeconds - 1;
            if (this.remainingSeconds === 0) {
                this.message.warn(this.l('TimeoutPleaseTryAgain')).then(() => {
                    this.loginService.authenticateModel.twoFactorVerificationCode = null;
                    this._router.navigate(['account/login']);
                });
            }
        });
    }

    ngOnDestroy(): void {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
            this.timerSubscription = null;
        }
    }

    submit(): void {
        this.loginService.authenticateModel.twoFactorVerificationCode = this.code;
        this.loginService.authenticate();
    }
}

@Pipe({
    name: "formatTime"
})
export class FormatTimePipe implements PipeTransform {
    transform(value: number): string {
        const minutes: number = Math.floor(value / 60);
        return (('00' + minutes).slice(-2) + ' min : ' + ('00' + Math.floor(value - minutes * 60)).slice(-2) + 'sec');
    }
}
