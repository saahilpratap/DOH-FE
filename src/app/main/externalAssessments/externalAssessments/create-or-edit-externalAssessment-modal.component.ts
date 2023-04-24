import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    OnInit,

    Input
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import * as moment from "moment";
import { AppSessionService } from "@shared/common/session/app-session.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ExternalAssessmentsServiceProxy, AuthoritativeDocumentsServiceProxy, AuthoritativeDocumentDto, BusinessEntitiesServiceProxy, CreateOrEditExternalAssessmentDto, GetAuthoritativeDocumentForViewDto, GetBusinessEntitiesExcelDto, BusinessEntityUserDto, UserOriginType, EntityType, DynamicNameValueDto, ExtAssementScheduleServiceProxy, AuditProjectServiceProxy, CommonLookupServiceProxy } from "../../../../shared/service-proxies/service-proxies";
import { ExternalAssessmentWorkPaperModalComponent } from "./auditWorkPaper/add-externalAssessment-work-paper-modal.component";
import { PrimengTableHelper } from "../../../../shared/helpers/PrimengTableHelper";
import { FileDownloadService } from "../../../../shared/utils/file-download.service";
import { join } from "@amcharts/amcharts4/core";
import { setTimeout } from "timers";

@Component({
    selector: "createOrEditExternalAssessmentModal",
    templateUrl: "./create-or-edit-externalAssessment-modal.component.html",
    styleUrls: ["./create-or-edit-externalAssessment-modal.component.css"]
})
export class CreateOrEditExternalAssessmentModalComponent
    extends AppComponentBase
    implements OnInit {
    @Input('auditProjectId') auditProjectId: number;
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    externalAssessment: CreateOrEditExternalAssessmentDto = {} as any;
    leadAssessorEmail: string;
    leadAssessorPhone: string;
    auditeeEmail: string;
    auditeeName: string;
    auditeeSurname: string;
    auditeePhone: string;
    authoritativeDocuments: GetAuthoritativeDocumentForViewDto[];

    authorativeDocument: AuthoritativeDocumentDto[] = [];
    selectedauthorativeDocument: AuthoritativeDocumentDto[] = [];

    businessEntitiesLookUp: GetBusinessEntitiesExcelDto[] = [];
    auditCompaniesLookUp: GetBusinessEntitiesExcelDto[] = [];
    leadAssessors: BusinessEntityUserDto[] = [];
    beAuditees: BusinessEntityUserDto[] = [];
    filterText = "";
    active = false;
    saving = false;
    model = [];
    workPaperTableHelper: PrimengTableHelper;
    assessmentTypes: DynamicNameValueDto[];
    auditorTeam: BusinessEntityUserDto[] = [];
    auditeeTeam: BusinessEntityUserDto[] = [];
    readonly: boolean = false;
    hideButtons: number;
    reauditPermission: boolean = false;
    cUserName: string;
    IsAdmin : boolean;
    constructor(
        injector: Injector,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _externalAssessmentService: ExternalAssessmentsServiceProxy,
        private _authDocumentServiceProxy: AuthoritativeDocumentsServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _appSessionService: AppSessionService,
        private _router: Router, private _assementScheduleAppService: ExtAssementScheduleServiceProxy,
        private _activatedRoute: ActivatedRoute, private _fileDownloadService: FileDownloadService,
        private _auditServiceProxy: AuditProjectServiceProxy
    ) {
        super(injector);
        this.workPaperTableHelper = new PrimengTableHelper();

    }

    ngOnInit(): void {
        this.IsAdmin = this.appSession.user.isAdmin;
        let id = this._activatedRoute.snapshot.queryParams["id"];
        let status = this._activatedRoute.snapshot.queryParams["buttonstatus"];
        this.show(id, status);
        this.ReauditPermissionCheck();
    }

    isAuditEntityUser() {
        return (
            this._appSessionService.user.type == UserOriginType.ExternalAuditor
        );
    }
    initializeBusinessEntitiesLookUp() {
        this._businessEntitiesServiceProxy.getAllForLookUp(EntityType.HealthcareEntity,false).subscribe(res => {
            this.businessEntitiesLookUp = res;
        });
    }

    initializeBeAuditees() {       
        this._businessEntitiesServiceProxy
            .getAllUsers(this.externalAssessment.vendorId)
            .subscribe(res => {
                this.leadAssessors = res;
                if (this.externalAssessment.auditorTeam != null) {
                    let ids = this.externalAssessment.auditorTeam.split(",");
                    ids.forEach(obj => {
                        let id = Number(obj);
                        if (this.leadAssessors.find(i => i.id == id)) {
                            let team = this.leadAssessors.filter(i => i.id == id);
                            this.auditorTeam.push(team[0]);
                        }
                    })
                }
            });
    }

    initializeLeadAssessors()
    {
        this._businessEntitiesServiceProxy
            .getAllUsers(this.externalAssessment.businessEntityId)
            .subscribe(res => {
                this.beAuditees = res;
                if (this.externalAssessment.auditeeTeam != null) {
                    let ids = this.externalAssessment.auditeeTeam.split(",");
                    ids.forEach(obj => {
                        let id = Number(obj);
                        if (this.beAuditees.find(i => i.id == id)) {
                            let team = this.beAuditees.filter(i => i.id == id);
                            this.auditeeTeam.push(team[0]);
                        }
                    })
                }
            });
    }

    initializeAuditCompaniesLookUp() {
        this._businessEntitiesServiceProxy
            .getAllForLookUp(EntityType.ExternalAudit, false)
            .subscribe(res => {
                this.auditCompaniesLookUp = res;
                if (
                    this._appSessionService.user.type ==
                    UserOriginType.ExternalAuditor
                )
                    this.externalAssessment.vendorId = this._appSessionService.user.businessEntityId;
            });
    }

    initializeAssessmentTypes() {
        this._assementScheduleAppService.getAssessmentTypes().subscribe(res => {
            this.assessmentTypes = res;
        });
    }

    onVendorChange(businessEntityId: number) {
        console.log(businessEntityId);
        this._businessEntitiesServiceProxy
            .getAllUsers(businessEntityId)
            .subscribe(res => {
                this.leadAssessors = res;
            });
    }

    onEntityChange(businessEntityId: number) {
        this._businessEntitiesServiceProxy
            .getAllUsers(businessEntityId)
            .subscribe(res => {
                this.beAuditees = res;
            });
    }

    initializeAuthoritativeDocuments()
    {
        
       // this.selectedauthorativeDocument = [];
        this.authorativeDocument = [];
        this._authDocumentServiceProxy.getallAuthorativeDocuments().subscribe(res => {          
                res.forEach(obj => {
                    var item = new AuthoritativeDocumentDto();
                    item.id = obj.id;
                    item.name = obj.name;
                    this.authorativeDocument.push(item);
                })                   
        });
    }


    editAuthorativeDocuments() {

        this.selectedauthorativeDocument = [];
        this.externalAssessment.authoritativeDocumentIds.forEach(obj => {
            
            this.authorativeDocument.forEach(item => {
                
                if (obj == item.id) {
                    var document = new AuthoritativeDocumentDto()
                    document.id = item.id;
                    document.name = item.name;                                     
                    this.selectedauthorativeDocument.push(document);
                }
            });
        });
    }

    authDocumentChange(event) {
        this.externalAssessment.authoritativeDocumentIds = [];
        event.value.forEach(obj => {
            this.externalAssessment.authoritativeDocumentIds.push(obj.id);
        })

    }

    show(externalAssessmentId?: number, status?: any): void {
       
        if (status == '1') {
            this.hideButtons = 1;
        }
        else {
            this.hideButtons = 0;
        }
            this.initializeAuthoritativeDocuments();
            this.initializeBusinessEntitiesLookUp();
            this.initializeAuditCompaniesLookUp();
            this.initializeAssessmentTypes();
      
        if (!externalAssessmentId) {
            this.externalAssessment = {} as any;
            this.externalAssessment.id = externalAssessmentId;

            this.active = true;
        } else {
            this.workPaperTableHelper.showLoadingIndicator();
            this.spinnerService.show();
            this._externalAssessmentService
                .getExternalAssessmentForEdit(externalAssessmentId)
                .subscribe(
                    result => {
                        
                        this.externalAssessment = result.externalAssessment;
                        this.readonly = true;                       
                        this.externalAssessment.startDate = result.externalAssessment.startDate;
                        this.externalAssessment.endDate = result.externalAssessment.endDate;
                        this.auditeeEmail = result.auditeeEmail;
                        this.auditeeName = result.auditeeName;
                        this.auditeeSurname = result.auditeeSurname;
                        this.auditeePhone = result.auditeePhone;
                        this.leadAssessorEmail = result.leadAssessorEmail;
                        this.leadAssessorPhone = result.leadAssessorPhone;
                        this.active = true;
                        this.initializeLeadAssessors();
                        this.initializeBeAuditees();                      
                        this.editAuthorativeDocuments();                                       
                        this.spinnerService.hide();
                        this.workPaperTableHelper.totalRecordsCount = result.externalAssessment.externalAssessmentAuditWorkPapers.length;
                        this.workPaperTableHelper.records = result.externalAssessment.externalAssessmentAuditWorkPapers;
                        this.workPaperTableHelper.hideLoadingIndicator();

                    },
                    error => {
                        this.message.error(
                            "Couldn't fetch external assessment details at this time!"
                        );
                        this.spinnerService.hide();
                        this.close();
                    }
                );
        }
    }

    save(): void {
        if (
            this.externalAssessment.vendorId == 0 ||
            this.externalAssessment.vendorId == undefined
        ) {
            this.message.error("Choose Vendor!");
            return;
        }
        if (
            this.externalAssessment.businessEntityId == 0 ||
            this.externalAssessment.businessEntityId == undefined
        ) {
            this.message.error("Choose Entity!");
            return;
        }
        this.saving = true;
        this.externalAssessment.auditeeTeam = this.auditeeTeam.map(item => item.id).join(",");
        this.externalAssessment.auditorTeam = this.auditorTeam.map(item => item.id).join(",");

        this.externalAssessment.auditeeTeam = this.externalAssessment.auditeeTeam == "" ? null : this.externalAssessment.auditeeTeam;
        this.externalAssessment.auditorTeam = this.externalAssessment.auditorTeam == "" ? null : this.externalAssessment.auditorTeam;

        this._externalAssessmentService
            .createOrEdit(this.externalAssessment)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l("SavedSuccessfully"));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this._router.navigate([
            "/app/main/externalAssessments/externalAssessments"
        ]);
    }

    ReauditPermissionCheck() {
        this._commonLookupServiceProxy.getCurrentUserRoles().subscribe(
            (result) => {
                this.reauditPermission = false;
                //var roleList = result.map(x => x.roleName);
                //this._auditServiceProxy.reauditPermissionCkeker().subscribe(res => {
                //    var isExist = res.find(x => x.id == this.auditProjectId);
                //    var isBEA = roleList.find(x => x.toLowerCase() == "Business Entity Admin".toLowerCase());

                //    if (isExist != undefined) {
                //        if (isExist.accessPermission == 0) {
                //            this.reauditPermission = true;
                //        }
                //        else if (isExist.accessPermission == 1) {
                //            this.reauditPermission = this.appSession.user.isAuditer ? false : true;
                //        }
                //        else if (isExist.accessPermission == 2) {
                //            if (isBEA != undefined)
                //                this.reauditPermission = false;
                //            else
                //                this.reauditPermission = true;
                //        }
                //        else if (isExist.accessPermission == 3) {
                //            this.reauditPermission = this.appSession.user.isAuditer ? false : true;
                //            if (this.reauditPermission) {
                //                //copy condition two here
                //                if (isBEA != undefined) {
                //                    this.reauditPermission = false;
                //                }
                //                else {
                //                    this.reauditPermission = true;
                //                }
                //            }
                //        }
                //    }
                //    else {
                //        this.reauditPermission = false;
                //    }
                //    if (this.appSession.user.isAdmin)
                //        this.reauditPermission = false;
                //});
            });
    }


}
