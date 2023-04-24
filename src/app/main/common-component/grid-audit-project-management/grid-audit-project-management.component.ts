import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit, Input, Inject, ComponentFactoryResolver } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '../../../../shared/helpers/PrimengTableHelper';
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { LazyLoadEvent } from "primeng/public_api";
import { AuditProjectServiceProxy, QuestionGroup, AuditProjectDto, UserOriginType, AuditProjectStatusIds, DynamicNameValueDto, ExtAssementScheduleServiceProxy, CustomDynamicServiceProxy, BusinessEntityUserDto, GetCountryForViewDto, CountriesServiceProxy, CreateOrEditEntityGroupDto, AuditProjectAuthoritativeDocumentDto, AuthoritativeDocumentDto, AuthoritativeDocumentsServiceProxy, AuditProjectWithBusinessEntityFacility, AssessmentServiceProxy, CommonLookupServiceProxy, AuditProjectCloneServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { CreateEditAuditProjectManagementComponent } from '../../audit-project-management/create-edit-audit-project-management/create-edit-audit-project-management.component';
import { Router } from '@angular/router';
import { AuditProjectManagementModalComponent } from './audit-project-management-modal/audit-project-management-modal.component';
import { AppConsts } from '../../../../shared/AppConsts';
import * as moment from 'moment';
import { filter } from 'rxjs/operators';
import { CreateAuditProjectEmailNotificationModalComponent } from '../audit-project-email-notification/create-audit-project-email-notification-modal-component';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FindingReportCategory } from '../../../../shared/service-proxies/services/finding-report.service';
import { DOCUMENT } from '@angular/common';
import { AppSessionService } from "@shared/common/session/app-session.service";
import { ResponseRequestModalComponent } from './response-request-modal/response-request-modal.component';
import { FileDownloadService } from '../../../../shared/utils/file-download.service';
import { number } from '@amcharts/amcharts4/core';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { CloneOneModelComponent } from './clone-one-modal/clone-one-modal.component';
import { DataSharedService } from '../../../shared/common/data-shared/data-shared.service';

export class StatusJson {
    id: number;
    splitId: number;
    Name: string;
}

@Component({
    selector: 'grid-audit-project-management',
    templateUrl: './grid-audit-project-management.component.html',
})

export class GridAuditProjectManagementComponent extends AppComponentBase implements AfterViewInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('auditProjectManagementQuestionaireModal', { static: true }) createEditAuditProjectManagementModals: CreateEditAuditProjectManagementComponent;
    @ViewChild('auditProjectManagementModals', { static: true }) auditProjectManagementModals: AuditProjectManagementModalComponent;
    @ViewChild('createAuditProjectEmailNotificationModal', { static: true }) createAuditProjectEmailNotificationModal: CreateAuditProjectEmailNotificationModalComponent;
    @ViewChild('responseRequestModals', { static: true }) responseRequestModals: ResponseRequestModalComponent;
    @ViewChild('CloneOneModals', { static: true }) CloneOneModals: CloneOneModelComponent;
    
    reportUrl: string = '';
    invokeAction: string = 'DXXRDV';
    uploadUrl: string;
    showBtn: boolean = false;
    auditProjectManagementDetail: any;
    showStatuslable: boolean = false;
    hideStatuslable: boolean = false;
    @Input('auditProjects') auditProjects: PrimengTableHelper;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    advancedFiltersAreShown = false;
    auditProject = new AuditProjectDto();
    auditTypes: DynamicNameValueDto[];
    assessmentTypes: DynamicNameValueDto[];
    auditAreas: DynamicNameValueDto[];
    auditAgencyAdmins: BusinessEntityUserDto[] = [];
    countriesLookUp: GetCountryForViewDto[];
    leadAuditorLookUp: BusinessEntityUserDto[] = [];
    filterText = "";
    filterType:number = 0;
    filterSearch = "";
    filterCode = "";
    filterTitle = "";
    filterYear = "";
    groupName: QuestionGroup;
    groupList: any;
    vendorId: any;
    auditAreaId: number;
    auditTypeId: number;
    countryId: number;
    filterdateRange: any;
    startDate: any;
    endDate: any;
    statusId: any;
    noData: any;
    authoritavuieDocuments: AuthoritativeDocumentDto[];
    auditStatus: DynamicNameValueDto[];
    businessEntityAndFacilityTypeList: AuditProjectWithBusinessEntityFacility[];
    StatusId: any;
    statuslabel: string;
    auditstatusId: any;
    aduitIdList: AuditProjectStatusIds = new AuditProjectStatusIds();
    statusname: string;
    printUrl = this.sanitizer.bypassSecurityTrustResourceUrl("");
    leadAuditorId: number;
    skipStatusHideShow: boolean = false;
    skipstatuslabel: any;
    skipAuditStatuId: any;
    messageskip: any;
    EntityTypes: UserOriginType;
    licenseNumber: string;
    showAuditstatusButton: boolean = false;
    requestButton: boolean = false;
    responseButton: boolean = false;
    capavalidate: boolean = false;
    CheckResquest: number;
    CheckResponse: number;
    isAdminFlag: boolean;
    isadminandExternalAdmin: boolean = false;
    StatusJsonList: StatusJson[] = [];
    testAuditStatus = [];
    ReauditPermissionCheckIds = [];
    filteraudit = [
        { id: 1, name: 'All' },
        { id: 2, name: 'Locked' },
        { id: 3, name: 'Unlocked' }
    ];
    selectedfilterauditid: any;
    data: AuditProjectDto[];
    filteredData: AuditProjectDto[];

    constructor(
        injector: Injector, private _router: Router,
        private _auditServiceProxy: AuditProjectServiceProxy,
        private _auditProjectClone: AuditProjectCloneServiceProxy,
        private _appSessionService: AppSessionService,
        private _assementScheduleAppService: ExtAssementScheduleServiceProxy,
        private _authoritativeDocumentsServiceProxy: AuthoritativeDocumentsServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy,
        private _countriesServiceProxy: CountriesServiceProxy,
        private sanitizer: DomSanitizer,
        private _httpClient: HttpClient,
        private _assessmentServiceProxy: AssessmentServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _commonlookupServiceProxy: CommonLookupServiceProxy,
        private _dataSharedService: DataSharedService,
        @Inject(DOCUMENT) private document: Document
    ) {
        super(injector);
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/AuditProjectReport/GetAuditProjectFindingStage1';
    }



    skipStatusSelectedItemes(
        authoritativeDocument: AuthoritativeDocumentDto
    ): void {
        this.message.confirm(this.messageskip, this.l("Are you Sure?"), isConfirmed => {
            if (isConfirmed) {
                if (this.dataTable.selection.length > 0 && this.dataTable.selection != undefined) {
                    this.aduitIdList.auditProjectId = [];
                    this.spinnerService.show();
                    var items = this.dataTable.selection;
                    this.aduitIdList.auditProjectId = items.map(x => x.id);
                    this.aduitIdList.auditStatusId = this.skipAuditStatuId;
                    if (items.length > 0) {
                        this.createAuditProjectEmailNotificationModal.show(this.aduitIdList);
                        this.spinnerService.hide();
                    }
                    else {
                        this.spinnerService.hide();
                    }
                    this.dataTable.selection = [];
                }
                else {
                    this.dataTable.selection = [];
                    this.message.info(this.l("Please Select Audit Project"));
                }
            }
        });
    }

    clearSelection() {
        this.dataTable.selection = [];
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

    initializeBeLookUpFields(val) {
        if (val != undefined) {
            var item = this.testAuditStatus.find(x => x.id == val);
            this.filterText = val;
            let status = item.name.trim().toLowerCase();
            this.getStatus(status);
            var item = this.testAuditStatus.find(x => x.name.trim().toLowerCase() == this.statusname.trim().toLowerCase());
            this.auditstatusId = item.id;
            this.getAuditProjectManagement();
            this.checkRequestAndResponse();

        }
        else {
            this.filterText = "";
            this.messageskip = "";
            this.skipstatuslabel = "";
            this.showStatuslable = false;
            this.skipStatusHideShow = false;
            this.skipAuditStatuId = null;
            this.getAuditProjectManagement();
        }
    }

    getStatus(items: string) {
        switch (items) {
            case "new audit":
                this.statuslabel = "Update Audit Plan";
                this.statusname = "Plan Updated";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;
            case "plan updated":
                this.statuslabel = "Notify Entity";
                this.statusname = "Entity Notified";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;
            case "entity notified":
                this.statuslabel = "Entity Accepted";
                this.statusname = "Entity Notified";
                this.skipstatuslabel = "Request Pre-Audit Information";
                var item = this.testAuditStatus.find(x => x.name.trim().toLowerCase() == "pre-audit information requested".trim().toLowerCase());
                this.skipAuditStatuId = item.id;
                this.showStatuslable = false;
                this.skipStatusHideShow = true;
                this.hideStatuslable = false;
                this.capavalidate = false;
                this.messageskip = "You want to skip the entity acceptance & Request Pre-Audit Information..!";
                break;
            case "entity accepted":
                this.statuslabel = "Pre-Audit Information Requested";
                this.statusname = "Pre-Audit Information Requested";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;
            case "pre-audit information requested":
                this.statusname = "pre-audit information requested";
                this.statuslabel = "Stage 1 Info Submitted";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.capavalidate = false;
                this.skipstatuslabel = "Start Stage 1";
                var item = this.testAuditStatus.find(x => x.name.trim().toLowerCase() == "stage 1-started".trim().toLowerCase());
                this.skipAuditStatuId = item.id;
                this.skipStatusHideShow = true;
                this.messageskip = "You want to skip the Pre Audit Information Response & Start Stage 1 Audit..!";


                break;
            case "pre-audit information submitted":
                this.statusname = "stage 1-started";
                this.statuslabel = "Start Stage 1 Audit";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;
            case "stage 1-started":
                this.statusname = "stage 1-completed & audit findings reported";
                this.statuslabel = "Send Stage 1 Report";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.capavalidate = false;


                this.skipstatuslabel = "Start Stage 2 Audit";
                var item = this.testAuditStatus.find(x => x.name.trim().toLowerCase() == "stage 2-started".trim().toLowerCase());
                this.skipAuditStatuId = item.id;
                this.skipStatusHideShow = true;
                this.messageskip = "You want to skip Stage 1 Audit & Start Stage 2 Audit..!";
                break;
            case "stage 1-completed & audit findings reported":
                this.statusname = "stage 1-completed & audit findings reported";
                this.statuslabel = "Request Stage 1 CAPA";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.capavalidate = false;

                this.skipstatuslabel = "Send Stage-2-Notification";
                var item = this.testAuditStatus.find(x => x.name.trim().toLowerCase() == "Stage 2-Notification".trim().toLowerCase());
                this.skipAuditStatuId = item.id;
                this.skipStatusHideShow = true;
                this.messageskip = "You want to skip the CAPA Submission & Start Stage 2 Audit..!";
                break;
            case "capa submitted":
                this.statusname = "capa submitted";
                this.statuslabel = "Accept CAPA";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = true;
                break;
            case "capa submission delayed":
                this.statuslabel = "Send Reminder";
                this.statusname = "capa submission delayed";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                break;

            case "capa accepted":
                this.statusname = "capa accepted";
                this.statuslabel = "Accept CAPA";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = true;
                break;
            case "capa validated":
                this.statusname = "Stage 2-Notification";
                this.statuslabel = "Notify Stage 2";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;
            case "stage 2-notification":
                this.statusname = "Stage 2-Information Requested";
                this.statuslabel = "Remind Entity for Stage 2";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;
            case "stage 2-information requested":
                this.statusname = "stage 2-information submitted";
                this.statuslabel = "Request Stage 2 Pre-Audit Information";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.capavalidate = false;
                this.skipstatuslabel = "Start Stage-2";
                var item = this.testAuditStatus.find(x => x.name.trim().toLowerCase() == "stage 2-started".trim().toLowerCase());
                this.skipAuditStatuId = item.id;
                this.skipStatusHideShow = true;
                this.messageskip = "You want to skip the Stage 2-Pre Audit Information Response & Start Stage 2 Audit..!";
                break;
            case "stage 2-information submitted":
                this.statusname = "stage 2-started";
                this.statuslabel = "Start Stage 2 Audit";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;
            case "stage 2-started":
                this.statusname = "stage 2-completed & findings report submitted";
                this.statuslabel = "Send Stage 2 Audit Finding";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;
            case "stage 2-completed & findings report submitted":
                this.statusname = "stage 2-completed & findings report submitted";
                this.statuslabel = "Request CAPA Reminder";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.capavalidate = false;


                this.skipstatuslabel = "Start Draft Audit Report";
                var item = this.testAuditStatus.find(x => x.name.trim().toLowerCase() == "draft audit report submitted".trim().toLowerCase());
                this.skipAuditStatuId = item.id;
                this.skipStatusHideShow = true;
                this.messageskip = "You want to skip the Stage 2-Final CAPA Response & Start Draft Audit Report..!";

                break;
            case "final capa submitted":
                this.statusname = "final capa submitted";
                this.statuslabel = "Accept Final CAPA";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = true;
                break;
            case "final capa submission delayed":
                this.statusname = "final capa submission delayed";
                this.statuslabel = "Request CAPA Reminder ";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;

            case "final capa accepted":
                this.statusname = "final capa accepted";
                this.statuslabel = "Accept Final CAPA";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = true;
                break;
            case "final capa validated":
                this.statusname = "draft audit report submitted";
                this.statuslabel = "Submit Draft Audit Report";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;
            case "draft audit report submitted":
                this.statusname = "authority review(in progress)";
                this.statuslabel = "";
                this.showStatuslable = true;
                this.hideStatuslable = true;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;
            case "authority review(in progress)":
                this.statusname = "authority approved";
                this.statuslabel = "Review Completed";
                this.showStatuslable = true;
                this.hideStatuslable = true;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;

            case "authority(clarification needed)":
                this.statusname = "authority(clarification needed)";
                this.statuslabel = "Request/Respond Clarification";
                this.showStatuslable = true;
                this.hideStatuslable = true;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;
            case "authority approved":
                this.statusname = "final summary report submitted";
                this.statuslabel = "Send Report to Auditee";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;
            case "final summary report submitted":
                this.statusname = "audit completed";
                this.statuslabel = "Issue Entity Certificate";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;           
            case "audit completed":
                this.statusname = "audit completed";
                this.statuslabel = "Issue Entity Certificate";
                this.showStatuslable = false;
                this.hideStatuslable = false;
                this.skipStatusHideShow = false;
                this.capavalidate = false;
                break;
            default:
        }
    }

    inviteSelectedItemes() {

        if (this.dataTable.selection.length > 0) {
            this.aduitIdList.auditProjectId = [];
            this.spinnerService.show();
            var items = this.dataTable.selection;
            this.aduitIdList.auditProjectId = items.map(x => x.id);
            this.aduitIdList.auditStatusId = this.auditstatusId;
            if (items.length > 0) {
                this.createAuditProjectEmailNotificationModal.show(this.aduitIdList);
                this.spinnerService.hide();
            }
            else {

            }
            this.dataTable.selection = [];

        }
    }

    RequestClarification() {

        if (this.dataTable.selection.length > 0) {
            this.aduitIdList.auditProjectId = [];
            this.spinnerService.show();
            var items = this.dataTable.selection;
            this.aduitIdList.auditProjectId = items.map(x => x.id);
            this.statusname = "authority(clarification needed)";
            var item = this.testAuditStatus.find(x => x.name.trim().toLowerCase() == this.statusname.trim().toLowerCase());
            this.auditstatusId = item.id;
            this.aduitIdList.auditStatusId = this.auditstatusId;
            if (items.length > 0) {
                this.createAuditProjectEmailNotificationModal.show(this.aduitIdList);
                this.spinnerService.hide();
            }
            else {

            }
            this.dataTable.selection = [];
        }
        else {
            this.message.info(this.l("Please Select Project"));
        }
    }

    ApproveReport() {

        if (this.dataTable.selection.length > 0) {
            this.aduitIdList.auditProjectId = [];
            this.spinnerService.show();
            var items = this.dataTable.selection;
            this.aduitIdList.auditProjectId = items.map(x => x.id);
            this.statusname = "authority approved";
            var item = this.testAuditStatus.find(x => x.name.trim().toLowerCase() == this.statusname.trim().toLowerCase());
            this.auditstatusId = item.id;
            this.aduitIdList.auditStatusId = this.auditstatusId;
            if (items.length > 0) {
                this.createAuditProjectEmailNotificationModal.show(this.aduitIdList);
                this.spinnerService.hide();
            }
            else {

            }
            this.dataTable.selection = null;
        }
        else {
            this.message.info(this.l("Please Select Project"));
        }
    }    
    async ngOnInit() {
        this._dataSharedService.callFuction.subscribe((res) => {
            this.paginator.changePage(this.paginator.getPage());
            this.reloadPage();
        })
        await this.getallOnInit();
        this.checkType();
        this.checkAdminandExternalAdmin();
          
    }
   
    async getallOnInit() {
        this.initializeAuthoritativeDocumentLookUp();
        this.initializeBusinessEntityAndFacilityType();
        this.initializeAssessmentTypes();
        this.initializeAuditAreas();
        this.initializeAuditStatus();
        this.initializeCountriesForLookUp();
        this.initializeLeadAuditorForLookUp();
        this.getauditProjectStatus();
        this.checkUserType();
    }

    inviteSelectedItems() {
        if (this.dataTable.selection.length > 0) {
            this.spinnerService.show();
            let items = this.dataTable.selection.filter(e => e.auditStatusId == this.statusId);
            if (items.length > 0) {
                this._auditServiceProxy.sendnotificationtoEntity(items)
                    .subscribe(res => {
                        if (res.sendMailCout > 0 || res.notSendMailCount > 0) {
                            this.notify.success("" + res.sendMailCout + " successfully Invited!  " + res.notSendMailCount + "  Not Invited !");
                        }
                        this.spinnerService.hide();
                        this.getAuditProjectManagement();
                    });
            } else {
                this.spinnerService.hide();
                this.getAuditProjectManagement();
            }
            this.dataTable.selection = [];
        }
    }

    refreshDate() {
        this.startDate = "";
        this.endDate = "";
        this.filterdateRange = undefined;
        this.getAuditProjectManagement();
    }

    getauditProjectStatus() {
        this._auditServiceProxy.auditProjectStatusId().subscribe(res => {
            this.statusId = res;
        })
    }

    ngAfterViewInit(): void {
        //abp.event.on('app.onAuditProjectAdded', () => {
        //    this.getAuditProjectManagement();
        //});
    }

    getAuditProjectManagement(event?: LazyLoadEvent) { 
        if(this.filterType == null)
        {
            this.filterType = 1;
        }
        this.dataTable.selection = [];
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();
        if (this.leadAuditorId == null && this.leadAuditorId == undefined) {
            this.leadAuditorId = 0;
        }
        this._auditServiceProxy
            .getAuditProjects(this.filterText, this.filterType, this.filterCode, this.filterTitle, this.filterYear, this.auditAreaId, this.auditTypeId, 0, 0, this.leadAuditorId, 0, this.countryId, this.startDate, this.endDate, this.licenseNumber,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event)
            )
            .subscribe(result => {                
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.data = result.items;
                console.log("Response",result.items);
                this.getReauditPermissionCheck();
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    deleteAuditProject(id) {
        this.message.confirm(
            this.l('Audit-Project will be deleted '),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._auditServiceProxy.deleteAuditProject(id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    showAuditProject(auditProjectId) {
        this._router.navigate(['app/main/audit-project-group'], { queryParams: { type: 1, auditProjectId: auditProjectId } });
    }

    clickListQu(e) {
        this._auditServiceProxy.getQuestionGroupByAuditProjectId(e)
            .subscribe(result => {
                this.groupList = result;
                this.noData = result.length;
            });
    }

    initializeAssessmentTypes() {
        this._assementScheduleAppService.getAssessmentTypes().subscribe(res => {
            this.assessmentTypes = res;
        });
    }

    initializeAuditAreas() {
        this._customDynamicService.getDynamicEntityDatabyName("Audit Area")
            .subscribe(res => {
                this.auditAreas = res;
            });
    }

    initializeCountriesForLookUp() {
        this._countriesServiceProxy.getallCountry().subscribe(res => {
            this.countriesLookUp = res;
        });
    }

    initializeLeadAuditorForLookUp() {
        this._auditServiceProxy.getAllLeadAuditorUsers().subscribe(res => {
            this.leadAuditorLookUp = res;
        });
    }

    checkAdminandExternalAdmin() {
        this._commonlookupServiceProxy.checkAdminAndExternalAuditorAdmin().subscribe(res => {
            this.isadminandExternalAdmin = res;
        })
    }


    pdfAuditProject(id) {
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/AuditProjectReport/CertificationProposalReport/' + id;
        window.open(this.uploadUrl, '_blank');
    }

    OndateChange(dateRangeText: any) {
        if (dateRangeText != undefined) {
            var date1 = dateRangeText + '';
            var t = date1.split(',');
            var startD = moment(t[0]).format("YYYY/MM/DD");
            var endD = moment(t[1]).format("YYYY/MM/DD");
            this.startDate = startD + " 00:00:00 AM";
            this.endDate = endD + " 11:59:00 PM";
        }
        //this.getAuditProjectManagement();
    }

    onAllRowSelect(event) {
        if (this.dataTable.selection.length > 0) {
            this.showBtn = true;
        }
        else {
            this.showBtn = false;
        }
    }

    onRowSelect(event) {
        if (this.dataTable.selection.length > 0) {
            this.showBtn = true;
        }
    }

    onRowUnselect(event) {
        if (this.dataTable.selection.length === 0) {
            this.showBtn = false;
        }
    }

    setGroupName(val: CreateOrEditEntityGroupDto): string {
        var result = '';
        if (val != undefined) {
            result = val.name;
        }
        return result;
    }

    setAD(val: AuditProjectAuthoritativeDocumentDto[]): string {
        var result = '';
        if (val.length != 0) {
            var query = this.authoritavuieDocuments.find(x => x.id == val[0].authoritativeDocumentId);
            if (query != undefined) {
                result = "" + query.name;
            }
        }
        return result;
    }

    initializeAuthoritativeDocumentLookUp() {
        this.authoritavuieDocuments = [];
        this._authoritativeDocumentsServiceProxy.getallAuthorativeDocuments().subscribe(res => {
            this.authoritavuieDocuments = res;
        });
    }

    initializeAuditStatus() {

        this.auditStatus = [];
        this._customDynamicService.getDynamicEntityDatabyName("Audit Status")
            .subscribe(res => {
                if (res.length > 0) {
                    res.forEach(x => {
                        var temp = new StatusJson();
                        temp.id = x.id;
                        var tempObj = x.name.split('.');
                        temp.splitId = Number(tempObj[0]);
                        temp.Name = tempObj[1];
                        this.StatusJsonList.push(temp);
                    });

                    //var temp2 = new StatusJson();
                    //temp2.id = 101;
                    //temp2.splitId = 3;
                    //temp2.Name = "AA";
                    //var temp1 = new StatusJson();
                    //temp1.id = 2;
                    //temp1.splitId = 2;
                    //temp1.Name = "BB";
                    //var temp3 = new StatusJson();
                    //temp3.id = 102;
                    //temp3.splitId = 1;
                    //temp3.Name = "CC";
                    //this.StatusJsonList.push(temp2);
                    //this.StatusJsonList.push(temp1);
                    //this.StatusJsonList.push(temp3);

                    var a = _.sortBy(this.StatusJsonList, 'splitId');

                    const newAuditStatus = a.map(i => {
                        return { id: i.id, name: i.Name };
                    });

                    a.forEach(yy => {
                        var obj = new DynamicNameValueDto();
                        obj.id = yy.id;
                        obj.name = yy.Name;
                        this.auditStatus.push(obj);
                    });
                    this.testAuditStatus = newAuditStatus;

                    this.checkRequestAndResponse()
                }
            });
    }

    checkRequestAndResponse() {
        this.CheckResquest = 0;
        this.CheckResponse = 0;
        let checkRequestes = this.testAuditStatus.find(x => x.name.trim().toLowerCase() == "Draft Audit Report Submitted".trim().toLowerCase() || x.name.trim().toLowerCase() == "Authority Review(in progress)".trim().toLowerCase());
        let checkResponses = this.testAuditStatus.find(x => x.name.trim().toLowerCase() == "Authority(Clarification Needed)".trim().toLowerCase());
        if (checkRequestes != undefined) {
            this.CheckResquest = checkRequestes.id;
        }
        if (checkResponses != undefined) {
            this.CheckResponse = checkResponses.id;
        }

    }

    initializeBusinessEntityAndFacilityType() {
        this._auditServiceProxy.getAuditProjectBusinessEntityFacilities()
            .subscribe(res => {

                this.businessEntityAndFacilityTypeList = res;
            });
    }

    setStatus(val: number): string {
        var result = '';
        var query = this.testAuditStatus.find(x => x.id == val);
        if (query != undefined) {
            result = "" + query.name;
        }
        return result;
    }

    setAuditType(val: number): string {
        var result = '';
        var query = this.assessmentTypes.find(x => x.id == val);
        if (query != undefined) {
            result = "" + query.name;
        }
        return result == '' ? '-' : result;
    }

    setBusinessEntity(val: number): string {
        var result = '';
        var query = this.businessEntityAndFacilityTypeList.filter(x => x.auditProjectId == val);
        if (query != undefined) {
            query.forEach(x => {
                result = result + ", " + x.businessEntityName;
            });
        }
        result = result.substr(1, result.length);
        return result;
    }

    setFacilityType(val: number): string {
        var result = '';
        var query = this.businessEntityAndFacilityTypeList.find(x => x.auditProjectId == val);
        if (query != undefined) {
            result = query.facilityType;
        }
        return result;
    }

    refreshComponent() {
        this.getAuditProjectManagement();
    }
    reportViwe(CName, id) {
        this._httpClient
            .get<any>(this.uploadUrl + '?id=' + id)
            .subscribe(response => {

            });
    }
    editAuditProjectManagement(id) {
        this._assessmentServiceProxy.getEncryptAssessmentParameter(id, true).subscribe((encryptRessult) => {
            this._router.navigate(["/app/main/edit-audit-project-management"], {
                queryParams: {
                    auditProjectId: encryptRessult.assessmentId
                }
            });
        });

    }

    export(event?: LazyLoadEvent) {
        this.spinnerService.show();
        if (this.leadAuditorId == null) {
            this.leadAuditorId = 0;
        }
        this._auditServiceProxy
            .getAuditToExcel(this.filterText,this.filterType,this.filterCode, this.filterTitle, this.filterYear, this.auditAreaId, this.auditTypeId, 0, 0, this.leadAuditorId, 0, this.countryId, this.startDate, this.endDate, this.licenseNumber,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event))
            .subscribe(
                (result) => {
                    this.spinnerService.hide();
                    this._fileDownloadService.downloadTempFile(result);
                },
                (error) => {
                    this.spinnerService.hide();
                    this.message.error(
                        'Couldn\'t download Audit Project Data for now, try later!'
                    );
                }
            );
    };

    checkUserType() {
        var checktype = this._appSessionService.user.type;
        switch (checktype) {
            case 0:
                {
                    this.isAdminFlag = true;
                    break;
                }
            case 1:
            case 2:
            case 3:
            case 4:
            default:
                {
                    this.isAdminFlag = false;
                    break;
                }

        }
    }

    



    cloneAuditProject(id, code) {

        this.CloneOneModals.show(id, code);

        
    }
    auditidforpermission: number = 0;
    inpureq: string = "";
    selectedId: number = 0;
    EA: boolean;
    EAA: boolean;
    BEA: boolean;

    permissionuser(id, permissionuser): void {
        this.auditidforpermission = id;

        switch (permissionuser) {
            case 0: this.EA = false; this.EAA = false; this.BEA = false;
                break;
            case 1: this.EA = false; this.EAA = false; this.BEA = true;
                break;
            case 2: this.EA = false; this.EAA = true; this.BEA = false;
                break;
            case 3: this.EA = false; this.EAA = true; this.BEA = true;
                break;
            case 4: this.EA = true; this.EAA = false; this.BEA = false;
                break;
            case 5: this.EA = true; this.EAA = false; this.BEA = true;
                break;
            case 6: this.EA = true; this.EAA = true; this.BEA = false;
                break;
            case 7: this.EA = true; this.EAA = true; this.BEA = true;
                break;
        }
        this.modal.show();
    }
    close() {
        this.modal.hide();
        /*this.userpermission.value = undefined;*/
    }

    savepermission() {
        var temp = "";
        if (this.EA == true)
            temp = temp + "1";
        else
            temp = temp + "0";
        if (this.EAA == true)
            temp = temp + "1";
        else
            temp = temp + "0";
        if (this.BEA == true)
            temp = temp + "1";
        else
            temp = temp + "0";
        var a = parseInt(temp, 2);
        this._auditServiceProxy.updateAccessPermissionField(this.auditidforpermission, a).subscribe(res => {


            this.getAuditProjectManagement();
        })

        this.modal.hide();

    }
    getReauditPermissionCheck() {
        this._auditServiceProxy.reauditPermissionDateCkekers().subscribe(res => {
            this.ReauditPermissionCheckIds = res;
        })

    }

    filterauditproject(val) {
        const date = new Date();
        date.setDate(date.getDate() - 120);
        this.primengTableHelper.records = this.data;
        //this.primengTableHelper.records = this.filteredData;
        if (val == 2) {
            this.primengTableHelper.records = this.primengTableHelper.records.filter(x => x.accessPermission == 0 && x.stageEndDate < date);
            this.filteredData = this.primengTableHelper.records;
        }
        else if (val == 3) {
            this.primengTableHelper.records = this.primengTableHelper.records.filter(x => x.accessPermission != 0 && x.stageEndDate < date);
            this.filteredData = this.primengTableHelper.records;
        }
        else if (val == 1) {
            this.dataTable.reset();
        }
    }

    getLockUnlockAudit(val) {
        this.filterType = val;
            this.getAuditProjectManagement();
            this.checkRequestAndResponse();
        

    }

    pageLoad() {
        this.initializeBusinessEntityAndFacilityType();
        this.paginator.changePage(this.paginator.getPage());
    }

}
