import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { PatientAuthenticationPlatformServiceProxy, CreateOrEditPatientAuthenticationPlatformContactInformationDto, CreateOrEditPatientAuthenticationPlatformDto, BusinessEntitiListDto, AttachmentWithTitleDto, CreateOrEditPatientAuthenticationPlatformSelectedEntityDto, CommonLookupServiceProxy, CustomDynamicServiceProxy, DynamicNameValueDto } from '../../../../shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppSessionService } from '../../../../shared/common/session/app-session.service';
import * as _ from 'lodash';
import { StorageServiceProxy } from '../../../../shared/service-proxies/services/storage.service';
import { FileUploadComponent } from '../../../shared/common/file-upload/file-upload.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2'
import { number } from '@amcharts/amcharts4/core';

@Component({
    selector: 'pAPEnrollmentModals',
    templateUrl: './pap-enrollment-modal.component.html',
    styleUrls: ['./pap-enrollment-modal.component.css']
})


export class PAPEnrollmentModalComponent extends AppComponentBase {
    active = false;
    saving = false;
    saving1 = false;
    @ViewChild('pAPEnrollmentModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    userRoll: any;
    licenseNumber: any;
    businessentiesList: any;
    attachmentData: any;
    attachedFileCodes = [];
    userRoles: string[] = [];
    isBusinessEntityAdmin: boolean = false;
    isSuperAdmin: boolean = false;
    @ViewChild(FileUploadComponent) _fileUpload: FileUploadComponent;
    input: CreateOrEditPatientAuthenticationPlatformDto = new CreateOrEditPatientAuthenticationPlatformDto();
    contactInfo: CreateOrEditPatientAuthenticationPlatformContactInformationDto[] = [];
    entityList: BusinessEntitiListDto[] = [];
    selectedentityList: BusinessEntitiListDto[] = [];
    licenseNo: BusinessEntitiListDto[] = [];
    attachmentCode: AttachmentWithTitleDto[] = [];
    arrayCount: number = 0;
    inputselectedEntity: CreateOrEditPatientAuthenticationPlatformSelectedEntityDto[] = [];
    BusinessEntityAdminField: boolean = false;
    SuperAdminField: boolean = false;
    statusName: string = "";
    papStatus: DynamicNameValueDto[];
    papID: number;
    submitBussonFlag: boolean = false;
    InprogressFlag: boolean = false;
    completedFlag: boolean = false;
    btnDisable: boolean;
    productForm: FormGroup;
    contactFlag: boolean = true;
    ContactInformation: boolean = false;
    isUser: any;

    constructor(_injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _appSessionService: AppSessionService,
        private readonly _storageService: StorageServiceProxy,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _patientAuthenticationPlatformServiceProxy: PatientAuthenticationPlatformServiceProxy,
        private _customDynamicService: CustomDynamicServiceProxy,
        private fb: FormBuilder,
        private _router: Router,
    ) {
        super(_injector);
        this.GetUserAllRoles();
        this.initializeStatus();
        this.productForm = this.fb.group({
            fName: '',
            lName: '',
            mpNo: '',
            email: ''
        });
    }

    initializeStatus() {
        this.papStatus = [];
        this._customDynamicService.getDynamicEntityDatabyName("PAP Status")
            .subscribe(res => {
                this.papStatus = res;
            });
    }

    show(Id: number, status: string) {
        this.btnDisable = false;
        this.contactFlag = true;
        this.papID = Id;
        this.entityList = [];
        this.isUser = this.appSession;
        var userId = this.appSession.userId;
        this._patientAuthenticationPlatformServiceProxy.businessEntitiesByUserId(userId, Id).subscribe(res => {
            this.entityList = res;
            this.loadGroupName(this.entityList);
            this.contactInfo = [];
            this.attachmentCode = [];
            this.attachmentData = [];
            this.attachedFileCodes = [];
            this.userRoles = [];
            this.submitBussonFlag = false;
            this.InprogressFlag = false;
            this.completedFlag = false;

            if (Id == 0) {
                this.ContactInformation = this.isBusinessEntityAdmin ? false : true;
                this.BusinessEntityAdminField = this.isBusinessEntityAdmin ? false : true;
                this.SuperAdminField = true;
            }
            else {

                this.BusinessEntityAdminField = true;
                this.SuperAdminField = this.isSuperAdmin ? false : true;
            }

            let count = 0
            this.active = true;
            this.attachmentData = [];
            this.userRoll = this.appSession.tenancyName;
            if (Id == 0) {
                this.active = true;
                this.statusName = status;
                this.submitBussonFlag = this.isBusinessEntityAdmin ? true : false;
                this.addContactInfo();
                this.modal.show();
            }
            else {
                this._patientAuthenticationPlatformServiceProxy
                    .getPatientAuthenticationPlatformById(Id)
                    .subscribe(result => {
                        this.input = result;
                        if (this.input.patientAuthenticationPlatformSelectedEntityDtos.length > 0) {
                            var filterdate = _.uniqBy(this.input.patientAuthenticationPlatformSelectedEntityDtos, 'businessEntityId');
                            var ids = (filterdate).map(i => Number(i.businessEntityId));
                            this.selectedentityList = this.entityList.filter(x => _.includes(ids, x.id));
                        }
                        result.patientAuthenticationPlatformAttachmentDtos.forEach(x => {
                            var temp = new AttachmentWithTitleDto();
                            temp.code = x.code;
                            temp.title = x.title;
                            temp.static = x.static;
                            this.attachedFileCodes.push(temp);
                            count++
                        });
                        this.contactInfo = result.patientAuthenticationPlatformContactInformationDtos;
                        if (this.contactInfo.length == 0) {
                            this.addContactInfo();
                        }
                        var tempStatus = this.papStatus.find(x => x.id == this.input.statusId).name;
                        this.statusName = tempStatus;

                        if (tempStatus.trim().toLocaleLowerCase() == "submitted".trim().toLocaleLowerCase()) {
                            this.InprogressFlag = this.isSuperAdmin ? true : false;
                            this.contactFlag = this.isBusinessEntityAdmin ? false : true;
                        }
                        else if (tempStatus.trim().toLocaleLowerCase() == "under process".trim().toLocaleLowerCase()) {
                            this.completedFlag = this.isSuperAdmin ? true : false;
                            this.contactFlag = this.isBusinessEntityAdmin ? false : true;
                        }
                        else if (tempStatus.trim().toLocaleLowerCase() == "completed".trim().toLocaleLowerCase()) {
                            this.contactFlag = this.isBusinessEntityAdmin ? false : true;
                        }

                        this.active = true;
                        this.modal.show();
                        if (result.patientAuthenticationPlatformAttachmentDtos.length == count) {
                            this._fileUpload.getData(this.attachedFileCodes);
                        }
                    });
            }

        });
    }
    close(): void {
        this.active = false;
        this.clearData();
        this.modal.hide();
    }

    GetUserAllRoles() {
        this._commonLookupServiceProxy.getCurrentUserRoles().subscribe(
            (result) => {
                this.userRoles = result.map(x => x.roleName);
                var adminList = this.userRoles.filter(x => x.trim().toLowerCase() == "Business Entity Admin".trim().toLowerCase() || x.trim().toLowerCase() == "Insurance Entity Admin".trim().toLowerCase());
                var SuperAdminList = this.userRoles.filter(x => x.trim().toLowerCase() == "Admin".trim().toLowerCase());
                if (adminList.length > 0) {
                    this.isBusinessEntityAdmin = true;
                }
                else if (SuperAdminList.length > 0) {
                    this.isSuperAdmin = true;
                }
            });
    }

    saveData(val: number) {
        if (val == 4)
            this.saving1 = true;
        else
            this.saving = true;

        this.input.patientAuthenticationPlatformContactInformationDtos = this.contactInfo;
        if (this.input.patientAuthenticationPlatformContactInformationDtos.length > 10) {
            this.saving1 = false;
            this.saving = false;
            return Swal.fire('', 'maximum limit reach!', 'error');
        }

        this.input.patientAuthenticationPlatformSelectedEntityDtos = [];
        this.selectedentityList.forEach(x => {
            var temp = new CreateOrEditPatientAuthenticationPlatformSelectedEntityDto();
            temp.businessEntityId = x.id;
            temp.papId = this.input.id;
            this.input.patientAuthenticationPlatformSelectedEntityDtos.push(temp);
        });

        this._patientAuthenticationPlatformServiceProxy.createOrEdit(val, this.input)
            .pipe(
                finalize(() => {
                    if (val == 4)
                        this.saving1 = true;
                    else
                        this.saving = true;
                })
            ).subscribe(res => {
                if (res.length > 0) {
                    this.licenseNo = res;
                    let licenseNo = "";
                    let connectingValue = "";
                    if (this.input.connecting == true) {
                        connectingValue = '<span class="text-capitalize pr-1 pl-1 font-weight-bold text-danger"> Yes </span>'
                    } else {
                        connectingValue = '<span class="text-capitalize pr-1 pl-1 font-weight-bold text-danger"> No </span>'
                    }
                    res.forEach((item, index: number) => {                     
                        licenseNo = licenseNo + "" + ('<span></span><div class="text-left font-12 pt-2"><span>' + (index + 1) + '</span>.<span class="pl-1">' + item.name + '</span></div>');
                    });
                    console.log(licenseNo);
                    Swal.fire({
                        width: 750,
                        icon: 'warning',
                        titleText: '',                        
                        html:
                            '<div class="text-left">' +
                            '<span class="">PAP Enrollment request for the below facility(s) already exists for the selected option</span>' +
                            '<span [innerHTML]=' + connectingValue + '</span>' +
                            '<span class="">therefore it will be skipped&#44; whereas the request will be created for the rest of the selected facility(s). </span>' +
                            '<div class="border mt-2">'+
                            '<div class="text-left p-1 font-weight-bold border-bottom"> Duplicate Facility(s) List</div>' +
                            '<div class="p-1" [innerHTML]=' + licenseNo + '</div></div>' + 
                            '</div>' +                                                       
                            '<div> Do you want to Continue?</div>',
                        showCloseButton: false,                       
                        customClass: {                          
                            header: '.header-class-swal',                          
                        },
                        showCancelButton: true,
                        focusConfirm: true,
                        allowOutsideClick: false,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#fd397a'
                    }).then((result) => {
                        if (result.value) {
                            this._patientAuthenticationPlatformServiceProxy.createPAPwithSkip(val, this.input).subscribe(res => {
                                this.notify.success(this.l("SavedSuccessfully"));
                                this.close();
                                this.modalSave.emit(null);
                            });
                        } else if (result.dismiss) {
                            this.saving1 = false;
                        }
                    });
                }
                else {
                    this.notify.info(this.l("SavedSuccessfully"));
                    this.clearData();
                    this.close();
                    this.modalSave.emit(null);
                }
            });
    }

    addContactInfo() {
        if (this.contactInfo.length >= 10) {
            return Swal.fire('', 'maximum limit reach !', 'error');
            //return this.message.warn("maximum limit reached", "contact information !");
        }
        else {
            var tempObj = new CreateOrEditPatientAuthenticationPlatformContactInformationDto();
            tempObj.id = 0;
            this.contactInfo.push(tempObj);
        }
    }

    loadGroupName(val: BusinessEntitiListDto[]) {
        this._patientAuthenticationPlatformServiceProxy.getGroupName(val).subscribe(res => {
            this.input.groupName = res;
        });
    }

    addItem(item) {
        this.addContactInfo();
    }

    changeValue(e) {
        this.input.connecting = e;
        this.btnDisable = true;
    }
    removeItem(i: number, val: CreateOrEditPatientAuthenticationPlatformContactInformationDto, gridData) {
        if (val.id == 0) {
            this.contactInfo.splice(i, 1);
        }
        else {
            //this._patientAuthenticationPlatformServiceProxy.delete(val.id).subscribe(res => {
            //    this.show(this.input.id, this.statusName);
            this.contactInfo.splice(i, 1);
            /* });*/
        }
    }

    getAttachment(e) {
        this.attachmentData = e;
    }

    clearData() {
        this.selectedentityList = [];
        this.input = new CreateOrEditPatientAuthenticationPlatformDto();
    }

    save(val: number, status: string): void {
        this.arrayCount = 0;
        this.attachmentCode = [];
        if (this.attachmentData == undefined || this.attachmentData == 0) {
            this.saveData(val);
        }
        else {
            this.attachmentData.forEach(item => {
                if (!item.code) {
                    let blob = new Blob([item], { type: item.extention });
                    let formData: FormData = new FormData();
                    formData.append("File", blob, item.name);
                    formData.append("title", this.input.id + "," + "0");
                    this.spinnerService.show();
                    this._storageService.AddPAPAttachment(formData).subscribe(
                        res => {
                            this.arrayCount++;
                            this.spinnerService.hide();
                            let items = new AttachmentWithTitleDto();
                            items.code = res.result.code;
                            items.title = item.name;
                            this.attachmentCode.push(items);
                            if (this.attachmentData.length == this.arrayCount) {
                                this.saveData(val);
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
            if (this.attachmentData.length == this.arrayCount) {
                this.saveData(val);
            }
        }
    }
}
