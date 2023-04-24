import {
    Component,
    Injector,
    ViewEncapsulation,
    ViewChild,
    Injectable
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from "@shared/common/app-component-base";
import { TokenAuthServiceProxy, FindingReportServiceProxy, FindingReportType, CurrentUserRoleDto, AllclosedCapaDto, FindingReportCategory, FindingReportStatus, FindingReportAction, ControlRequirementsServiceProxy, BusinessEntitiesServiceProxy, CommonLookupServiceProxy, AuditProjectServiceProxy } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { FileDownloadService } from "@shared/utils/file-download.service";
import * as _ from "lodash";
import { ViewFindingReportModalComponent } from "../../../finding-report/view-finding-report-modal.component";
import { CreateOrEditfindingReportModalComponent } from "../../../finding-report/create-or-edit-findingReport-modal.component";
import { OnInit, Input, NgZone } from '@angular/core';
import { AppSessionService } from "@shared/common/session/app-session.service";
import { HttpClient } from "@angular/common/http";
import { AppConsts } from "../../../../../shared/AppConsts";
import { finalize } from 'rxjs/operators';
import { FileUpload } from 'primeng/fileupload';
import { FindingLogModalComponent } from "./finding-log-modal/finding-log-modal.component";
import { FindingCAPAListModalsComponent } from "./finding-capa-list-modal/finding-capa-list-modal.component";
import { DatePipe, formatDate } from '@angular/common';
import { start } from "repl";


@Component({
    selector: 'external-finding-grid',
    templateUrl: "./external-finding-grid.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
    providers: [DatePipe]
})
@Injectable()
export class ExternalFindingReportsComponent extends AppComponentBase {
    @ViewChild("viewFindingReportModals", { static: true }) viewFindingReportModals: ViewFindingReportModalComponent;
    @ViewChild("createOrEditfindingReportModal", { static: true }) createOrEditfindingReportModal: CreateOrEditfindingReportModalComponent;
    @ViewChild("findingLogModal", { static: true }) findingLogModal: FindingLogModalComponent;
    @ViewChild('ExcelFileUpload', { static: false }) excelFileUpload: FileUpload;
    @ViewChild('excelFileUploadCapa', { static: false }) excelFileUploadCapa: FileUpload;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild("findingCAPAListModals", { static: true }) findingCAPAListModals: FindingCAPAListModalsComponent;
    @Input('auditProId') auditProID: any;
    CurrentUserRoles: CurrentUserRoleDto[] = [];
    people = [
        {
            label: "CAPA Open",
            value: "5"
        },
        {
            label: "Work in Progress",
            value: "6"
        },
        {
            label: "CAPA Closed",
            value: "7"
        }
    ]
    progressInterval: any;
    value: any;
    importcode: string;
    importcodeCapa: string;
    advancedFiltersAreShown = false;
    selectedRowData: any[];
    allDelete: boolean;
    categoryID: any;
    titleFilter: any;
    classificationId: any;
    criticalityId: any;
    findingStageId: any;
    FindingAction = FindingReportAction;
    totalcountvalid: any
    checkcapaValid: boolean = false;
    checkfinialCappavalid: boolean = false;
    findingResponse: boolean = false;
    CAPAAccepted: boolean = false;
    CAPAApproved: boolean = false;
    isExternalAuditor: boolean = false;
    finialCapaSubmit: boolean = false;
    capaSubmit: boolean = true;
    findingStatus = FindingReportStatus;
    findingCategory: FindingReportCategory;
    frozeheight: any;
    closeCapaButton: boolean;
    showAuditstatusButton: boolean = false;
    uploadUrl = "";
    uploadCapaUrl = "";
    allcapaclosedlist: AllclosedCapaDto = new AllclosedCapaDto();
    //@Input("reauditPermission") reauditPermission: boolean;
    reauditPermission: boolean = true;
    beforeJanPermission: boolean = true;
    approveCAPA: boolean;
    acceptCAPA: boolean;
    finalSubmitCAPA: boolean;
   // stageEndDate: Date=null;
    fromDate: Date=null;
    stageEndDate = new Date();
    constructor(
        injector: Injector,
        private _tokenAuth: TokenAuthServiceProxy,
        private _appSessionService: AppSessionService,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _findingReportServiceProxy: FindingReportServiceProxy,
        private _router: Router,
        public _zone: NgZone,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _auditServiceProxy: AuditProjectServiceProxy,
        private _httpClient: HttpClient,
        private datePipe: DatePipe

    ) {
        super(injector);
        this.categoryID = 0;
        this.classificationId = 0;
        this.criticalityId = 0;
        this.findingCategory = FindingReportCategory.Stage1;
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Import/importExternalFindingResponse';
        this.uploadCapaUrl = AppConsts.remoteServiceBaseUrl + '/Import/importExternalCAPAResponse';
        this.refreshImport();
    }

    CapaAcceptedItemes() {
        this.findingCAPAListModals;
        this.acceptCAPA = true;
        this._findingReportServiceProxy.findingCAPAAccept(this.auditProID, this.findingCategory).
            subscribe(res => {
                if (res.status == true && res.findingIds.length == 0) {
                    this.acceptCAPA = false;
                    this.CAPAAccepted = false;
                    this.setcapasubmitedRefresh();
                    this.reloadPage();
                    this.message.warn("CAPA Accepted Sucessfully");                               
                }
                else {
                    this.acceptCAPA = false;
                    this.findingCAPAListModals.show('CAPA Accept', res.findingIds);
                }
            });
    }

    CapaApprovedItemes()
    {
        this.findingCAPAListModals;
        this.approveCAPA = true;
        if (this.dataTable.selection.length > 0) {
            this.allcapaclosedlist.findingIds = [];
            this.spinnerService.show();
            let items = this.dataTable.selection;
            for (let i = 0; i < this.dataTable.selection.length; i++) {
                var ids = this.dataTable.selection[i].id;
                this.allcapaclosedlist.findingIds.push(ids)
            }
            if (items.length > 0) {

                this.spinnerService.hide();

            }
            this.allcapaclosedlist.auditProjectId = this.auditProID;
            this.allcapaclosedlist.category = this.findingCategory;
            this._findingReportServiceProxy.findingCAPAApproved(this.allcapaclosedlist).
                subscribe(res => {

                    if (res.status == true && res.findingIds.length == 0) {
                       // this.CAPAApproved = false;
                        this.reloadPage();
                        this.setcapasubmitedRefresh();
                        this.spinnerService.hide();
                        this.approveCAPA = false;
                        this.closeCapaButton = false;
                        this.message.warn("CAPA Approved Sucessfully");
                    }
                    else {
                       // this.CAPAApproved = false;
                        this.reloadPage();
                        this.setcapasubmitedRefresh();
                        this.spinnerService.hide();
                        this.approveCAPA = false;
                        this.closeCapaButton = false;
                        this.selectedRow();
                        this.findingCAPAListModals.show('CAPA Approved', res.findingIds);
                    }
                });

            this.spinnerService.hide();

        }
        else {
            this.selectedRow();
        }

        
    }

    onSelectionChange(selection: any[]) {
        
        if (selection.length >= 1) {
            this.closeCapaButton = true;
        }
        else if (selection.length < 1) {
            this.closeCapaButton = false;           
            this.selectedRow();
        }
    }

    selectedRow() {
        this.selectedRowData = [];
        this.dataTable.selection = [];
    }

    deleteFinding(id)
    {
       

        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._findingReportServiceProxy.deleteFinding(id, this.auditProID)
                        .subscribe(() => {
                            this.reloadPage();
                            this.message.warn("Your record has been deleted");
                        });    
                }
            }
        );
    }


    ngOnInit() {

       this.ReauditPermissionCheck();
        this.getAuditProjectById(this.auditProID)
        
        if (this.auditProID > 0) {
            this.categoryID = 1;
            this.findingStageId = 1;
          
            this._findingReportServiceProxy.getcheckAuditStatus(this.auditProID).subscribe(res => {
                this.getCheckStatus();
                if (res.submitCapa == true) {
                    this.checkcapaValid = true;
                    this.checkfinialCappavalid = false;
                }

                else {
                    if (res.finicalCapaSubmit == true) {
                        this.checkcapaValid = false;
                        this.checkfinialCappavalid = true;
                    }

                }
            })
        }
        
    }

    checkType() {
        var checktype = this._appSessionService.user.type;
        switch (checktype) {
            case 0:
                {
                    this.showAuditstatusButton = true;
                    break;
                }
            case 1:
                {
                    this.showAuditstatusButton = false;
                    break;
                }
            case 2:
                {                       
                    this.showAuditstatusButton = true;                                             
                                                           
                    break;
                }
            case 3:
                {
                    this.showAuditstatusButton = true;
                    break;
                }
            case 4:
                {
                    this.showAuditstatusButton = false;
                    break;
                }
        }
    }

    setcapasubmitedRefresh() {
        this._findingReportServiceProxy.getcheckAuditStatus(this.auditProID).subscribe(res => {


            if (res.submitCapa == true) {
                this.checkcapaValid = true;
                this.checkfinialCappavalid = false;
            }
            else {
                if (res.finicalCapaSubmit == true) {
                    this.checkcapaValid = false;
                    this.checkfinialCappavalid = true;
                }
                else {
                    this.checkcapaValid = false;
                    this.checkfinialCappavalid = false;
                }

            }
        })
    }

    getCheckStatus() {
        this.CAPAApproved = false;
        this._findingReportServiceProxy.getCheckCAPASubmittedandCapaApprovedForFinding(this.auditProID, this.findingCategory).
            subscribe(res => {

                if (res.capaAccepted == false && res.capaApproved == false) {
                    this.CAPAAccepted = false;
                    this.CAPAApproved = false;
                }
                else {
                    if (res.capaAccepted == true) {
                        this.CAPAAccepted = true;
                        this.CAPAApproved = false;
                    }
                    if (res.capaApproved == true) {
                        this.CAPAAccepted = false;
                        this.CAPAApproved = true;
                    }
                }

            });
    }

    getFindingReports(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();
        this._findingReportServiceProxy
            .getAllFindingReportRelatedAuditProject(
                this.isInternal()
                    ? FindingReportType.Internal
                    : FindingReportType.External,
                this.auditProID,
                this.categoryID,
                this.classificationId,
                this.criticalityId,
                this.titleFilter,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount =
                    result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
                if (this.appSession.user.type == 2) {
                    this.frozeheight = "53px";
                }
                else if (this.appSession.user.type == 0) {
                    this.frozeheight = "53px";
                }
                else {
                    this.frozeheight = "0px";
                }
            });
    }

    checkfinding() {
        
        var itemcount = this.dataTable.selection.filter(e => e.findingAction != 2);
        if (itemcount.length > 0) {
            if (this.primengTableHelper.records.length == itemcount.length) {
                this.findingResponse = true;
            }
            else {
                this.findingResponse = false;
            }

        }
        else {
            this.findingResponse = false;
        }
    }

    //inviteSelectedItemes() {
    //    this.spinnerService.show();
    //    this._findingReportServiceProxy.setCAPASubmited(this.auditProID, this.findingCategory).subscribe(res => {
    //        if (res == true) {

    //            this.setcapasubmitedRefresh();
    //            this.reloadPage();
    //            this.message.warn("CAPA Submited Sucessfully!");                              
    //            this.spinnerService.hide();
    //        }
    //        else {
    //            this.spinnerService.hide();
    //        }

    //    });
    //}

    finalCapaSubmitted(): void {
        this.findingCAPAListModals;
        this.finalSubmitCAPA = true;
       
        this.message.confirm("Please ensure you have submitted Stage 1 CAPA if any findings are generated. You will not be able to do that later if you agree to this submission..!",
            this.l("Are you Sure?"), isConfirmed => {
                if (isConfirmed) {
                    this.finalSubmitCAPA = true;
                    this.spinnerService.show();
                    this._findingReportServiceProxy.finalCAPASubmitted(this.auditProID, FindingReportCategory.Stage2).subscribe(res => {
                        
                        if (res.status == true && res.findingIds.length == 0) {
                            this.finalSubmitCAPA = false;
                            this.setcapasubmitedRefresh();
                            this.reloadPage();
                            this.spinnerService.hide();
                            this.message.warn("Final Capa Submited Sucessfully!");
                        }
                        else {                            
                            this.finalSubmitCAPA = false;
                            this.spinnerService.hide();
                            this.findingCAPAListModals.show('CAPA Submitted Notification', res.findingIds);
                        }

                    });
                }
                else {
                    this.spinnerService.hide();
                    this.finalSubmitCAPA = false;
                    
                }              
            });
        
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createFindingReport(): void {
        let path = this.isInternal()
            ? "/app/main/findingReportings/findingReportings-internal/new"
            : "/app/main/findingReportings/findingReportings-external/new";
        this._router.navigate([path]);
    }

    editFindingReport(id: number): void {
        let path = this.isInternal()
            ? "/app/main/findingReportings/findingReportings-internal/new"
            : "/app/main/findingReportings/findingReportings-external/new";
        this._router.navigate([path], {
            queryParams: {
                id: id
            }
        });
    }

    hasCreatePermission(): boolean {
        return this.isInternal
            ? this.isGranted("Pages.HealthCareEntities.FindingReports.Create")
            : this.isGranted("Pages.AuditManagement.FindingReports.Create");
    }

    hasEditPermission(): boolean {
        return this.isInternal
            ? this.isGranted("Pages.HealthCareEntities.FindingReports.Edit")
            : this.isGranted("Pages.AuditManagement.FindingReports.Edit");
    }

    hasViewPermission(): boolean {
        return this.isInternal
            ? this.isGranted("Pages.HealthCareEntities.FindingReports.View")
            : this.isGranted("Pages.AuditManagement.FindingReports.View");
    }

    hasDeletePermission(): boolean {
        return this.isInternal
            ? this.isGranted("Pages.HealthCareEntities.FindingReports.Delete")
            : this.isGranted("Pages.AuditManagement.FindingReports.Delete");
    }

    isInternal(): boolean {
        return this._router.url.includes("internal");
    }

    stageChnage(val)
    {
        this.closeCapaButton = false;
        if (val != undefined) {
            this.categoryID = val;
            if (val == 1) {
                this.capaSubmit = true;
                this.finialCapaSubmit = false;
                this.findingCategory = FindingReportCategory.Stage1;
                this.getCheckStatus();
            }
            else {
                this.finialCapaSubmit = true;
                this.capaSubmit = false;
                this.findingCategory = FindingReportCategory.Stage2;
                this.getCheckStatus();
            }
            this.reloadPage();
        }
        else {
            this.finialCapaSubmit = false;
            this.capaSubmit = false;
            this.categoryID = 0;
            this.reloadPage();
        }
        this.selectedRow();
    }

    onChange(id: any, recordid: any)
    {
        this.closeCapaButton = false;
        this.message.confirm("You want to change the Status!", this.l("Are you Sure?"),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._findingReportServiceProxy.setFindingStatus(recordid, id).subscribe(res =>
                    {
                        if (res == true)
                        {
                            this.reloadPage();
                            this.message.success("Status Updated Successfully!");
                        }
                        else {
                            this.reloadPage();
                            this.message.warn("FND-"+ recordid + " "+"Cannot be closed as evidence is not attached")
                        }
                           
                    });
                }
            }
           );
    }


    refreshImport() {
        let self = this;
        abp.event.on('abp.notifications.received', userNotification => {
            self._zone.run(() => {
                this.reloadPage();
            });
        });
    }

    uploadExcel(event: any): void {
        const formData: FormData = new FormData();
        const file = event.target.files[0];
        var filename = file.name;
        var fileExtension = filename.split('.').pop();
        if (fileExtension.toLowerCase() == 'xlsx'.toLowerCase()) {
            this.message.confirm('', this.l('Are You Sure You Want To Import ' + file.name), (isConfirmed) => {
                if (isConfirmed) {
                    let teantid = this.appSession.tenantId;
                    let userid = this.appSession.userId;
                    formData.append('file', file, file.name);
                    formData.append('AuditProjectId', this.auditProID.toString());
                    formData.append('teantId', teantid.toString());
                    formData.append('userid', userid.toString());
                    this._httpClient
                        .post<any>(this.uploadUrl, formData)
                        .pipe(finalize(() => this.excelFileUpload.clear()))
                        .subscribe(response => {
                            if (response.success) {
                                this.notify.success(this.l('Import Process Start'));
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


    exportToExcel(): void {
        this._findingReportServiceProxy.getAllFindingByAuditProjects(this.auditProID)
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }


    exportToCapaExcel(): void {

        this._findingReportServiceProxy.getAllFindingCAPAByAuditProjects(this.auditProID)
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    uploadCapaExcel(event: any): void {

        const formData: FormData = new FormData();
        const file = event.target.files[0];
        var filename = file.name;
        var fileExtension = filename.split('.').pop();
        if (fileExtension.toLowerCase() == 'xlsx'.toLowerCase()) {
            this.message.confirm('', this.l('Are You Sure You Want To Import ' + file.name), (isConfirmed) => {
                if (isConfirmed) {
                    let teantid = this.appSession.tenantId;
                    let userid = this.appSession.userId;
                    formData.append('file', file, file.name);
                    formData.append('AuditProjectId', this.auditProID.toString());
                    formData.append('teantId', teantid.toString());
                    formData.append('userid', userid.toString());
                    this._httpClient
                        .post<any>(this.uploadCapaUrl, formData)
                        .pipe(finalize(() => this.excelFileUploadCapa.clear()))
                        .subscribe(response => {
                            if (response.success) {
                                this.notify.success(this.l('Import Process Start'));
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
                        this.reloadPage();
                    }
                })
            });
    }
    setIntrvl(code: string) {
        this.progressInterval = setInterval(() => this.RefreshComponent(code), 1000);
    }

    //External Audit Findings
    ReauditPermissionCheck() {
        this.CurrentUserRoles = [];
        this._commonLookupServiceProxy.getCurrentUserRoles().subscribe(
       
            (result) => {
                
                this.CurrentUserRoles = result;
                var roleList = result.map(x => x.roleName);
               
                this._auditServiceProxy.reauditPermissionCkeker().subscribe(res =>
                {
                    var isExist = res.find(x => x.id == this.auditProID);
                    var isBEA = roleList.find(x => x.trim().toLowerCase() == "Business Entity Admin".trim().toLowerCase());
                    var isEAA = roleList.find(x => x.trim().toLowerCase() == "External Audit Admin".trim().toLowerCase());
                    var isEA = roleList.find(x => x.trim().toLowerCase() == "External Auditors".trim().toLowerCase());
                    var isIEA = roleList.find(x => x.trim().toLowerCase() == "Insurance Entity Admin".trim().toLowerCase());
                    debugger
                    if (this.appSession.user.isAdmin)
                        this.reauditPermission = false;      

                    if (isExist != undefined)
                    {
                        switch (isExist.accessPermission) {

                            case 0:
                                {
                                    this.reauditPermission = true;
                                    break;
                                }
                            case 1:
                                {
                                    if (isBEA != undefined || isIEA != undefined)
                                        this.reauditPermission = false;
                                    else
                                        this.reauditPermission = true;
                                    break;
                                }
                            case 2:
                                {
                                    if (isEAA != undefined)
                                        this.reauditPermission = false;
                                    else
                                        this.reauditPermission = true;
                                    break;
                                }
                            case 3:
                                {
                                    if (isEAA != undefined || isBEA != undefined)
                                        this.reauditPermission = false;
                                    else
                                        this.reauditPermission = true;
                                    break;
                                }
                            case 4:
                                {

                                    if (isEA != undefined)
                                        this.reauditPermission = false;
                                    else
                                        this.reauditPermission = true;
                                    break;
                                    //  this.reauditPermission = this.appSession.user.isAuditer ? false : true;

                                }
                            case 5:
                                {
                                    if (isEA != undefined || isBEA != undefined)
                                        this.reauditPermission = false;
                                    else
                                        this.reauditPermission = true;
                                    break;
                                }
                            case 6:
                                {
                                    if (isEA != undefined || isEAA != undefined)
                                        this.reauditPermission = false;
                                    else
                                        this.reauditPermission = true;
                                    break;
                                }
                            case 7:
                                {
                                    this.reauditPermission = false;
                                    break;
                                }
                        }
                    }
                    else {
                        this.reauditPermission = false;
                    }                              
                });
            });
    }


    


    setDates(date: Date): Date {
        date.setDate(date.getDate());
        return date;
    }

    getAuditProjectById(id) {
        this._auditServiceProxy
            .getAuditProjectForEdit(this.auditProID)
            .subscribe((result) => {             
                var fdate = result.stageEndDate;             
                let fromDates : Date = new Date("2022-01-01");
                this.fromDate = fromDates;
                if (result.stageEndDate!= null) {
                    this.stageEndDate = this.setDates(new Date(Date.parse(result.stageEndDate.toString())))
                }
                this.ReauditPermissionCheck_BeforeJan();
               
            });

    }

    ReauditPermissionCheck_BeforeJan() {
        
        this._commonLookupServiceProxy.getCurrentUserRoles().subscribe(
            (result) => {
                var roleList = result.map(x => x.roleName);
                this._auditServiceProxy.reauditPermissionCkeker().subscribe(res => {
                    this.checkType();

                    var isExist = res.find(x => x.id == this.auditProID);                    
                    if (isExist != undefined)
                    {
                        
                        if (this.fromDate > this.stageEndDate)
                        {
                            this.beforeJanPermission = false;
                        }
                        else
                        {                           
                                this.beforeJanPermission = true;                                                  
                        }                       
                    }
                    else
                    {
                        this.beforeJanPermission = false;
                    }
                    if (this.appSession.user.isAdmin)
                        this.beforeJanPermission = false;
                });
            });
    }


}
