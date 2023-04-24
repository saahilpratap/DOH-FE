import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'entity-review-approval',
    templateUrl: './entity-review-approval.component.html',
})
export class EntityReviewApprovalComponent extends AppComponentBase implements AfterViewInit {
    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
    }     
}
