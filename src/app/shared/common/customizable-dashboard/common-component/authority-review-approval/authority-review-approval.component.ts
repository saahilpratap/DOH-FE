import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'authority-review-approval',
    templateUrl: './authority-review-approval.component.html',
})
export class AuthorityReviewApprovalComponent extends AppComponentBase implements AfterViewInit {
    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
    }
}
