import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy, ControlType, ControlRequirementsServiceProxy, ControlRequirementDto, CommonLookupServiceProxy } from "@shared/service-proxies/service-proxies";
import { CreateOrEditControlRequirementModalComponent } from "./create-or-edit-controlRequirement-modal.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import * as moment from "moment";
import { ComplianceManagementServiceProxy } from "@shared/service-proxies/services/compliance-management.service";
import { AppConsts } from "../../../../shared/AppConsts";
import { HttpClient } from "@angular/common/http";
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './controlRequirements.component.html',
   // styleUrls: ['./controlRequirements.component.less'],
    encapsulation: ViewEncapsulation.None,    
    animations: [appModuleAnimation()]
})
export class ControlRequirementsComponent extends AppComponentBase {
    @ViewChild("createOrEditControlRequirementModal", { static: true })
    createOrEditControlRequirementModal: CreateOrEditControlRequirementModalComponent;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild('ExcelFileRequirementsUpload', { static: false }) excelFileUpload: FileUpload;

    advancedFiltersAreShown = false;
    filterText = "";
    codeFilter = "";
    originalIdFilter = "";
    domainNameFilter = "";
    controlTypeFilter = -1;
    controlRequirementFilter = "";
    controlStandardNameFilter = "";

    controlType = ControlType;
    style: any;
    scrollHeight: string;
    uploadUrl = "";
    importRequirements = "";
    setInterval = setInterval;
    progressInterval: any;
    value: any;
    importcode: string;
    exportButtonHide: boolean;
    constructor(
        injector: Injector,
        private _controlRequirementsServiceProxy: ControlRequirementsServiceProxy,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService, private _httpClient: HttpClient,
        private _complianceManagementService: ComplianceManagementServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy
    ) {
        super(injector);
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/File/ImportControlRequirements';
        this.importRequirements = AppConsts.remoteServiceBaseUrl + '/Import/ImportControlRequirements';
    }

    
    getControlRequirements(event?: LazyLoadEvent) {
      
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._controlRequirementsServiceProxy
            .getAll(this.filterText, this.codeFilter, this.originalIdFilter, this.domainNameFilter, this.controlTypeFilter, this.controlRequirementFilter, this.controlStandardNameFilter, this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event))
            
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                if (this.codeFilter != "") {
                    this.primengTableHelper.records = result.items.filter(res => {
                        return res.controlRequirement.code.toLocaleLowerCase().match(this.codeFilter.toLocaleLowerCase().trim());
                    });
                }
                else {
                    this.primengTableHelper.records = result.items;
                }
                this.primengTableHelper.hideLoadingIndicator();
                this.exportHide();
            });
    }
 
   
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createControlRequirement(): void {
        this.createOrEditControlRequirementModal.show();
    }

    deleteControlRequirement(controlRequirement: ControlRequirementDto): void {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"), isConfirmed => {
            if (isConfirmed) {
                this._controlRequirementsServiceProxy
                    .delete(controlRequirement.id)
                    .subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l("SuccessfullyDeleted"));
                    });
            }
        });
    }

    exportToExcel(): void {
        this._controlRequirementsServiceProxy
            .getControlRequirementsToExcel(
                this.filterText,
                this.codeFilter,
                this.originalIdFilter,
                this.domainNameFilter,
                this.controlTypeFilter,
                this.controlRequirementFilter,
                this.controlStandardNameFilter
            )
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    uploadFile(event) {
        let file = event.target.files[0];
        let formData: FormData = new FormData();
        formData.append("files", file, file.name);
        this._httpClient
            .post<any>(this.uploadUrl, formData)
            .subscribe(response => {
                if (response.success) {
                    this.notify.success(this.l('Import Process Start'));
                } else if (response.error != null) {
                    this.notify.error(this.l('Import Process Failed'));
                }
            }); 
    }

    uploadExcel(data: { files: File }): void {
        const formData: FormData = new FormData();
        const file = data.files[0];
        var filename = file.name;
        var fileExtension = filename.split('.').pop();
        if (fileExtension.toLowerCase() == 'xlsx'.toLowerCase()) {
            this.message.confirm('', this.l('Are You Sure You Want To Import ' + file.name), (isConfirmed) => {
                if (isConfirmed) {
                    let teantid = this.appSession.tenantId;
                    let userid = this.appSession.userId;
                    formData.append('file', file, file.name);
                    formData.append('teantId', teantid.toString());
                    formData.append('userid', userid.toString());
                    this._httpClient
                        .post<any>(this.importRequirements, formData)
                        .pipe(finalize(() => this.excelFileUpload.clear()))
                        .subscribe(response => {
                            if (response.success) {
                                this.notify.success(this.l('Import Process Start'));
                                this.importcode = response.result.getRandom;
                                this.setIntrvl(this.importcode);
                            } else if (response.error != null) {
                                this.notify.error(this.l('Import Process Failed'));
                            }

                        });
                }
            });
        }
        else {
            this.notify.error(this.l('Please use the correct file format - .xlsx is required'));
        }
    }
 RefreshComponent(code: string) {
        this._commonLookupServiceProxy.getCommonNotificationRefresh(this.appSession.userId, this.appSession.tenantId, code).subscribe(
            (result) => {
                this.value = result;
                let list = this.value;
                list.forEach((value, index) => {
                   
                    if (value.match(code)) {                      
                        clearInterval(this.progressInterval);
                        this.getControlRequirements();
                    }
                })
            });    
       
    }

    setIntrvl(code: string) {
      
        this.progressInterval = setInterval(() => this.RefreshComponent(code), 1000);
    }

    exportHide() {
        if (this.primengTableHelper.totalRecordsCount == 0) {
            this.exportButtonHide = false;
        }
        else {
            this.exportButtonHide = true;
        }
    }
}
