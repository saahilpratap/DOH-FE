import { Component, Injector, ViewChild, OnInit } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { AppSessionService } from "@shared/common/session/app-session.service";
import { finalize } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import {
    RemediationServiceProxy,
    UserListDto,
    AttachmentWithTitleDto,
    UserServiceProxy,
    EntityType,
    BusinessEntitiesServiceProxy,
    UserOriginType,
    RemediationDto,
    BusinessEntityUserDto,
    DynamicNameValueDto,
    GetBusinessEntitiesExcelDto, BusinessEntityDto
} from "@shared/service-proxies/service-proxies";
import { DomSanitizer } from "@angular/platform-browser";
import { FileDownloadService } from "../../../../shared/utils/file-download.service";
import { StorageServiceProxy } from "@shared/service-proxies/services/storage.service";
import { SignaturePad } from "angular2-signaturepad";
import { async } from "@angular/core/testing";
import { FileUploadComponent } from "../../../shared/common/file-upload/file-upload.component";
import { parse } from "querystring";

@Component({
    //  selector: "create-edit-remediation-plan",
    templateUrl: "./create-edit-remediation-plan.component.html",
})
export class CreateEditRemediationPlanComponent extends AppComponentBase
    implements OnInit {
    dateRange: Date;
    businessEntitiesLookUp: GetBusinessEntitiesExcelDto[] = [];
    beUsers: BusinessEntityUserDto[] = [];
    remediation: RemediationDto = new RemediationDto();
    authorativeUser: BusinessEntityUserDto[] = [];
    status: DynamicNameValueDto[] = [];
    autorativeUser: UserListDto[] = [];
    primarReviwerId = 0;
    primaryApproverId = 0;
    @ViewChild("riginsign") private authoritySign: SignaturePad;
    @ViewChild("entitySignaturen") private entitysign: SignaturePad;
    @ViewChild(FileUploadComponent) fileUpload: FileUploadComponent;
    recordId: any;
    isedit: boolean;
    statusId: any;
    entityReview: any;
    authorityReview: any;
    Remediationstatus: any;
    attachedFileCodes = [];
    active = false;
    signaturePadOptions: Object = {
        minWidth: 0.1,
        canvasWidth: 275,
        canvasHeight: 80,
        penColor: "rgb(0, 0, 128)",
    };
    BusinessEntity: BusinessEntityDto[] = [];
    value: any;
    attachmentData: any;
    attachmentCode: AttachmentWithTitleDto[] = [];
    arrayCount: number = 0;
    signatureShow: boolean = false;
    isCheck: boolean;
    hideButton: any;
    hideButtons: number;
    constructor(
        injector: Injector,
        private _userServiceProxy: UserServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _activatedRoute: ActivatedRoute,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _appSessionService: AppSessionService,
        private _remediationServiceProxy: RemediationServiceProxy,
        private _router: Router,
        private readonly _storageService: StorageServiceProxy,
        private _sanitizer: DomSanitizer
    ) {
        super(injector);
        this.remediation.businessEntityId = this._appSessionService.user.businessEntityId;
    }

    close() {
        this.active = false;
        this._router.navigate(["/app/main/remediation-plan"]);
    }

    ngOnInit(): void {
        this.active = true;
        this._activatedRoute.queryParams.subscribe((params) => {
            this.recordId = params["remediationId"];
            this.hideButton =  params["buttonStatus"];
        });
        if (this.hideButton == '1')
            this.hideButtons = 1;
        else
            this.hideButtons = 0;
        if (this.recordId) {
            this._appSessionService.user.type == UserOriginType.BusinessEntity ||
                this._appSessionService.user.type == UserOriginType.ExternalAuditor;
            this.isedit = true;
            this.getallremediation(this.recordId);
        } else {
            
            this.isedit = false;
            this.getallremediation(this.recordId);
            this.initializeBusinessEntitiesLookUp();
            this.getAuthorativeUser();
            this.initializeAuthorityUsersLookUp();
            this.entityReview = true;
            this.authorityReview = true;
        }
    }
    signatureUrl(e) {
        this.remediation.signature = e;
    }
    signatureUrl1(e) {
        this.remediation.authoritysignature = e;
    }
    Setstatus() {
        if (!this.isedit) {
            this.status.forEach((obj) => {
                if (obj.name == "New") {
                    this.remediation.remediationPlanStatusId = obj.id;
                }
            });
        }
    }

    getstatus(remediation) {
        this.status.forEach((obj) => {
            if (obj.id == remediation) {
                this.Remediationstatus = obj.name;
            }
        });
    }

    initializeAuthorityUsersLookUp() {
        this._userServiceProxy
            .getUsers(
                undefined,
                undefined,
                undefined,
                false,
                true,
                undefined,
                1000,
                0
            )
            .subscribe((result) => {
                this.autorativeUser = result.items;
                this.autorativeUser.forEach((u: any) => {
                    u.fullname = u.name + " " + u.surname;
                });
            });
    }

    getAuthorativeUser() {
        this._businessEntitiesServiceProxy
            .getAllAuthorativeUsers()
            .subscribe((res) => {
                this.authorativeUser = res;
            });
    }

    isBusinessEntityUser() {
        this.remediation.businessEntityId = this._appSessionService.businessEntityId;
        //return (
        //  this._appSessionService.user.type == UserOriginType.BusinessEntity ||
        //  this._appSessionService.user.type == UserOriginType.ExternalAuditor
        //);
    }

    async getallremediation(recordId) {
        if (recordId) {
            this._remediationServiceProxy
                .getRemediation(recordId)
                .subscribe(async (result) => {
                    this.initializeBusinessEntitiesLookUp();
                    this.remediation = result;
                    this.getAuthorativeUser();
                    this.initializeAuthorityUsersLookUp();
                    this.remediation.attachments.forEach((obj) => {
                        this.attachedFileCodes.push(obj);
                    });


                    this.status = result.remediationPlanStatusList;
                    if (this.isedit) {
                        this.getstatus(this.remediation.remediationPlanStatusId);
                        this.editguser(this.remediation.businessEntityId);
                    }                    
                    this.attachedFileCodes = result.attachments
                    this.fileUpload.getData(result.attachments);

                    this.entityReview = false;
                    this.authorityReview = false;
                });
        }
    }

    clearImage(e) {
        if (e == "entityReview") {
            this.entityReview = true;
        } else if (e == "authorityReview") {
            this.authorityReview = true;
        }
    }

    editguser(businessEntityId) {
        this.beUsers = [];
        this._businessEntitiesServiceProxy
            .getAllUsers(businessEntityId)
            .subscribe((res) => {
                this.beUsers = res;

                this.checkEntityReviewer();
            });
    }

    checkEntityReviewer() {
        this.beUsers.forEach((obj: any) => {

        });
        this.beUsers.forEach((obj: any) => {
            if (this.appSession.userId == obj.id) {
                this.signatureShow = true;
            }
        });
    }

    initializeBeLookUpFields() {
        this.initializeUsersLookUp();
    }

    async initializeBusinessEntitiesLookUp() {
        this._businessEntitiesServiceProxy
            .getAllBusinessEntityType(EntityType.HealthcareEntity)
            .subscribe(res => {
                this.BusinessEntity = res;
                this.remediation.businessEntityId = this.remediation.businessEntityId != null ? this.remediation.businessEntityId : this._appSessionService.user.businessEntityId;
            });
    }

    initializeUsersLookUp() {
        this.remediation.businessEntityId = !this.remediation.businessEntityId
            ? this._appSessionService.user.businessEntityId
            : this.remediation.businessEntityId;
        this._businessEntitiesServiceProxy
            .getAllUsers(this.remediation.businessEntityId)
            .subscribe((res) => {
                this.beUsers = res;
                let approver = this.beUsers.filter((a) =>
                    this.BusinessEntity.find(
                        (b) => b.primaryApproverId == a.id
                    )
                );
                if (approver.length > 0) {
                    this.remediation.entityApproverId =
                        this.remediation.entityApproverId == null
                            ? approver[0].id
                            : this.remediation.entityApproverId;
                }
                let reviewer = this.beUsers.filter((a) =>
                    this.BusinessEntity.find(
                        (b) => b.primaryReviewerId == a.id
                    )
                );
                if (approver.length > 0) {
                    this.remediation.expertReviewerId =
                        this.remediation.expertReviewerId == null
                            ? reviewer[0].id
                            : this.remediation.expertReviewerId;
                }
            });
    }

    downloadAttachment(code: string) {
        const self = this;
        self._fileDownloadService.downloadRemediationAttachment(code);
    }

    addAttachmentInputs() {
        this.attachedFileCodes.push(new AttachmentWithTitleDto());
    }

    deleteAttachmentInput(input) {
        const self = this;
        self._fileDownloadService
            .deleteRemediationAttachment(input.code)
            .subscribe(() => {
                this.attachedFileCodes = this.attachedFileCodes.filter(
                    (item) => item != input
                );
                this.notify.success("File removed Successfully");
            });
    }

    uploadAttachment(event: any, attachment: AttachmentWithTitleDto) {
        var file = event.target.files[0];
        let formData: FormData = new FormData();
        formData.append("file", file, file.name);
        this.spinnerService.show();
        this._storageService.AddRemediationAttachment(formData).subscribe(
            (res) => {
                this.spinnerService.hide();
                attachment.code = res.result.code;
            },
            (error) => {
                console.log(error);
                this.spinnerService.hide();
                this.message.error("Couldn't upload file at this time, try later :)!");
            }
        );
    }

    getAttachment(e) {
        this.attachmentData = e;
    }

    async save() {
        this.arrayCount = 0;
        this.attachmentCode = [];
        if (this.attachmentData == undefined || this.attachmentData == 0) {
            this.saveData();
        }
        else {
            this.attachmentData.forEach(item => {
                if (!item.code) {
                    let blob = new Blob([item], { type: item.extention });
                    let formData: FormData = new FormData();
                    formData.append("File", blob, item.name);
                    this.spinnerService.show();
                    this._storageService.AddRemediationAttachment(formData).subscribe(
                        res => {
                            this.arrayCount++;
                            this.spinnerService.hide();
                            let items = new AttachmentWithTitleDto();
                            items.code = res.result.code;
                            items.title = item.name;
                            this.attachmentCode.push(items);                         
                            if (this.attachmentData.length == this.arrayCount) {
                                this.saveData();
                            }
                        },
                        error => {
                            console.log(error);
                            this.spinnerService.hide();
                            this.message.error(
                                "Couldn't upload file at this time, try later :)!"
                            );
                        });
                }
                else {
                    this.arrayCount++;
                }
            });
        }
    }

    saveData(): void {
        this.Setstatus();
        this.remediation.attachments = this.attachmentCode.filter(e => e.code != "");
        this._remediationServiceProxy
            .createorUpdateRemediation(this.remediation)
            .pipe(finalize(() => { }))
            .subscribe(() => {
                this.notify.info(this.l("SavedSuccessfully"));
                this.close();
            });
    }

    checkEntityApprovedId(id) {
        if (id === null) {
            this.entitysign.off();
        }
    }

    checkAuthorityApprovedId(id) {
        if (id === null) {
            this.authoritySign.off();
        }
    }
}
