import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PAPEnrollmentModalComponent } from './pap-enrollment-modal/pap-enrollment-modal.component';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';
import { PatientAuthenticationPlatformServiceProxy, DynamicNameValueDto, CustomDynamicServiceProxy, CreateorEditPatientAuthenticationPlatformGlobalAttachmentDto, PatientAuthenticationPlatformGlobalAttachmentDto } from '../../../shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { StorageServiceProxy } from '../../../shared/service-proxies/services/storage.service';
import { FileUploadComponent } from '../../shared/common/file-upload/file-upload.component';
import { custom } from 'devextreme/ui/dialog';

@Component({
    templateUrl: './pap-enrollment.component.html',
    styleUrls: ['./pap-enrollment.component.less'],
})

export class PAPEnrollmentComponent extends AppComponentBase {
    @ViewChild('pAPEnrollmentModals', { static: true }) pAPEnrollmentModals: PAPEnrollmentModalComponent;
    @ViewChild(FileUploadComponent) childFileUploadSection: FileUploadComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    primengTableHelper = new PrimengTableHelper();
    filterText = "";
    papStatus: DynamicNameValueDto[];
    testpapStatus: DynamicNameValueDto[];
    attachmentList: CreateorEditPatientAuthenticationPlatformGlobalAttachmentDto = new CreateorEditPatientAuthenticationPlatformGlobalAttachmentDto();
    StatusId: any;
    selectedItem: any;
    attachedFileCodes: any = [];
    attachmentData: any = [];
    patientAuthenticationPlatformGlobalAttachment: PatientAuthenticationPlatformGlobalAttachmentDto[];
    fileExtensionList = ['docx', 'doc', 'pdf', 'xlsx', 'ppt', 'eml', 'rar', 'zip', 'png', 'jpg', 'jpeg', 'msg', 'csv', 'svg'];
    FormDatas = new FormData();
    message1 = "PAP Enrollment request for the below facility(s) already exists for the selected option";
    message2 = "therefore it will be skipped whereas the request will be created for the rest of the selected facilities. Display List Do you want to Continue?";
    message: any;
    dataTrue1 = 'True';

    constructor(
        injector: Injector,
        private _patientAuthenticationPlatformServiceProxy: PatientAuthenticationPlatformServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy,
        private readonly _storageService: StorageServiceProxy,

    ) {
        super(injector);
        this.initializeStatus();
    }
    ngOnInit() {
        this.selectedItem = 1;
        this.getPAPGlobalAttachment();
        let dataTrue = 'True';
        this.message = 'User knows <b style="color:green;">' + dataTrue + ' </b> from <b>' + dataTrue + ' years</b> , provided rating as <b>' + dataTrue + '</b>.'
    }
    selectTab(e) {
        this.childFileUploadSection
        let attachment = this.attachedFileCodes = [];
        this.selectedItem = e;
        switch (e) {
            case 1:
                this.attachmentData = [];
                this.childFileUploadSection.getData(attachment);
                break;
            case 2:
                this.getPAPGlobalAttachment();
                break;
        }
    }
    changeStatusFields(event) {
        let val;
        if (event == undefined) {
            this.StatusId = 0;
            val = 0;
        } else if (event) {
            this.StatusId = event.id;
            val = event.id;
        }
        if (val == null) {
            this.StatusId = 0;
        }
        if (val != undefined) {
            this.primengTableHelper.showLoadingIndicator();
            this._patientAuthenticationPlatformServiceProxy
                .getAll(this.StatusId, this.filterText, this.primengTableHelper.getSorting(this.dataTable), this.primengTableHelper.getSkipCount(this.paginator, event), this.primengTableHelper.getMaxResultCount(this.paginator, event))
                .subscribe(result => {
                    this.primengTableHelper.totalRecordsCount = result.totalCount;
                    this.primengTableHelper.records = result.items;
                    this.primengTableHelper.hideLoadingIndicator();
                });
        }
        else {
            this.getData();
        }
    }

    initializeStatus() {
        this.papStatus = [];
        this._customDynamicService.getDynamicEntityDatabyName("PAP Status")
            .subscribe(res => {
                this.papStatus = res;
                this.testpapStatus = res;
            });
    }

    getData(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();
        if (this.StatusId == undefined) {
            this.StatusId = 0;
        }
        this._patientAuthenticationPlatformServiceProxy
            .getAll(this.StatusId, this.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event))
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
        this.primengTableHelper.hideLoadingIndicator();
    }

    delete(id?: number) {
        let recordDeleted = custom({
            showTitle: false,
            messageHtml: '<div><div class="flaticon-danger font-icon-size-dev-express text-center text-warning"></div><div class="h3 text-center">Are you sure?</div><div class="h5 text-center">You won&#8242t be able to revert this!</div></div>',
            buttons: [{
                text: "Yes, delete it!",
                onClick: (e) => {
                    return { buttonText: e.component.option("text") }
                }
            },
            {
                text: "Cancel",
                onClick: (e) => {
                    return { buttonText: e.component.option("text") }
                }

            }]
        });
        recordDeleted.show().then((dialogResult) => {          
            if (dialogResult.buttonText == "Yes, delete it!") {
                this._patientAuthenticationPlatformServiceProxy.delete(id).subscribe(() => {
                    this.notify.error('SuccessfullyDeleted');
                    this.reloadPage();
                });
            }
        });
    }
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }
    getDeleteCode(e) {
        this.attachmentData = [];
    }

    getAttachment(e) {
        this.attachmentData = e;
        this.saveAttacment(e);
    }
    getPAPGlobalAttachment() {
        this.spinnerService.show();
        this.primengTableHelper.showLoadingIndicator();
        this.childFileUploadSection
        this._patientAuthenticationPlatformServiceProxy.getAllPAPGlobalAttachemnt().subscribe(res => {
            this.attachedFileCodes.push(res);
            this.childFileUploadSection.getData(res);
            this.primengTableHelper.hideLoadingIndicator();
            this.spinnerService.hide();
        });
    }
    savePAPAchamrnt() {
        this.spinnerService.show();
        this._storageService.addGlobalFilePAPAttachment(this.FormDatas).subscribe(
            res => {
                this.notify.success('File upload successfully');
                this.getPAPGlobalAttachment();
                this.attachmentData = [];
                this.spinnerService.hide();
            },
            error => {
                console.log(error);
                this.spinnerService.hide();
                this.message.error(
                    "Couldn't upload file at this time, try later :)!"
                );
            });
    }
    saveAttacment(item) {
        this.FormDatas = new FormData();
        this.attachmentList.patientAuthenticationPlatformGlobalAttachmentDto = [];
        for (const file of item) {
            this.FormDatas.append(file.name, file);
        }
    }
}
