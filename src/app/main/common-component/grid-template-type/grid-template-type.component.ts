import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { TemplateChecklistServiceProxy, CommonLookupServiceProxy, AuditProjectServiceProxy } from "@shared/service-proxies/service-proxies";

import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Router } from '@angular/router';
import { CreateEditTemplateTypeComponent } from '@app/main/template-type/create-edit-template-type/create-edit-template-type.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'grid-template-type',
    templateUrl: './grid-template-type.component.html',
})
export class GridTemplateTypeComponent extends AppComponentBase implements AfterViewInit {
    @ViewChild("createEditTemplateTypeModals", { static: true })
    createEditTemplateTypeModals: CreateEditTemplateTypeComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;

    filterText = "";
    auditProjectManagementDetail: any;
    templateTypeDetail: any;
    @Input('auditProjectBtn') auditProjectBtn: boolean;
    @Input('auditProId') auditProId: any;
    @Input('vendorId') vendorId: any;
    @Input("reauditPermission") reauditPermission: boolean;
   // reauditPermission: boolean;

    @Output() showTab = new EventEmitter();
    tabData = [
        { tabName: 'templateTab', tabShow: true }
    ];

    @Input('selectedItem') selectedItem: any;



    editorConfig: AngularEditorConfig = {
        editable: false,
        spellcheck: false,
        height: 'auto',
        minHeight: 'auto',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: 'auto',
        translate: 'yes',
        enableToolbar: false,
        showToolbar: false,

        defaultParagraphSeparator: '',
        defaultFontName: '',
        defaultFontSize: '',
        fonts: [
            { class: 'arial', name: 'Arial' },
            { class: 'times-new-roman', name: 'Times New Roman' },
            { class: 'calibri', name: 'Calibri' },
            { class: 'comic-sans-ms', name: 'Comic Sans MS' }
        ],
        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
        uploadUrl: 'v1/image',
        uploadWithCredentials: false,
        sanitize: false,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            ['bold', 'italic'],
            ['fontSize']
        ]

    }

    constructor(
        injector: Injector,
        private _router: Router,
        private _templateservice: TemplateChecklistServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _auditServiceProxy: AuditProjectServiceProxy
    ) {
        super(injector);
        this.primengTableHelper = new PrimengTableHelper();

    }
    ngOnInit() {
      //  this.ReauditPermissionCheck();
    }
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    getData() {

        this.paginator.changePage(this.paginator.getPage());
    }

    getAllTemplatecheck(event?: LazyLoadEvent) {


        this.spinnerService.show();
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this._templateservice
            .getAllTemplate(this.filterText,
                this.selectedItem,
                this.auditProId,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.spinnerService.hide();

            });
    }

    ediTemplate(recordIds: any) {
        this._router.navigate(['/app/main/create-edit-template-type'], {
            queryParams: {
                recordId: recordIds
            }
        });
    }

    ediTemplateTab(recordIds: any) {

        this.showTab.emit(this.tabData);
    }

    removereTemplate(Id) {
        this.message.confirm("", this.l("AreYouSure"), isConfirmed => {
            if (isConfirmed) {
                this._templateservice
                    .deleteTemplateCheckList(Id)
                    .subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l("SuccessfullyDeleted"));
                    });
            }
        });

    }

    ngAfterViewInit(): void {

    }

   


}
