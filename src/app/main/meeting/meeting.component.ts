import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateEditAuditProjectManagementComponent } from '../audit-project-management/create-edit-audit-project-management/create-edit-audit-project-management.component';

@Component({
    selector: 'meeting',
    templateUrl: './meeting.component.html',
})
export class MeetingComponent extends AppComponentBase implements AfterViewInit {
    @ViewChild('createEditMeetingModals', { static: true }) createEditMeetingModals: CreateEditAuditProjectManagementComponent;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
    }
}
