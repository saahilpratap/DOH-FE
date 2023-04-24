import { Component, Injector, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './public.component.html',
    styleUrls: ['./public.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class PublicComponent extends AppComponentBase implements OnInit {

    private viewContainerRef: ViewContainerRef;
    tenancyId: number;
    currentYear: number = moment().year();
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    
    public constructor(
        injector: Injector,
        public _router: Router,
        private _uiCustomizationService: AppUiCustomizationService,
        viewContainerRef: ViewContainerRef
    ) {
        super(injector);

    }
    ngOnInit(): void {
       
    }
}
