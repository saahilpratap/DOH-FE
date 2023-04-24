import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { Router } from '@angular/router';

@Component({
    selector: 'questionnaire-group',
    templateUrl: './questionnaire-group.component.html',
})
export class QuestionnaireGroupComponent extends AppComponentBase implements AfterViewInit {

    constructor(
        injector: Injector,
        private _router: Router, 
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {

    }
    questionnaireGroup() {
        this._router.navigate(['/app/main/create-edit-questionnaire-group']);
    }
}
