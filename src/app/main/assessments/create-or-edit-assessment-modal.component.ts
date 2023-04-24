import { Injectable, Component, ViewChild, Output, EventEmitter, Injector, OnInit } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { ModalDirective } from "ngx-bootstrap";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { finalize } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { BusinessEntitiesServiceProxy, EntityGroupsServiceProxy, BusinessEnityGroupWiesDto, BusinessEntitiesListDto, EntityGroupDto, AssessmentServiceProxy, AuthoritativeDocumentsServiceProxy, GetAuthoritativeDocumentForViewDto, GetBusinessEntitiesExcelDto, CreateOrEditAssessmentInput, AssessmentDto, AssementScheduleServiceProxy, DynamicNameValueDto, EntityType } from "../../../shared/service-proxies/service-proxies";
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: "createOrEditAssessmentModal",
    templateUrl: "./create-or-edit-assessment-modal.component.html",
    styleUrls: ["./create-or-edit-assessment-modal.component.less"]
})
@Injectable()
export class CreateOrEditAssessmentModalComponent extends AppComponentBase
    implements OnInit {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    assessment: CreateOrEditAssessmentInput = {} as any;

    businessEntitiesLookUp: GetBusinessEntitiesExcelDto[];

    authoritativeDocumentsLookUp: GetAuthoritativeDocumentForViewDto[];
    assessmentTypes: DynamicNameValueDto[];

    allBESelected: boolean = true;
    selectedvalue: any;

    entityGroup: EntityGroupDto[] = [];
    selectedEntityGroup: EntityGroupDto[] = [];

    businessentity: BusinessEnityGroupWiesDto[] = [];
    selectedBusinessEntity: BusinessEnityGroupWiesDto[] = [];

    businessEntitiesLookUps: BusinessEntitiesListDto[] = [];
    selectedBusinessEntitys: BusinessEntitiesListDto[] = [];

    constructor(
        injector: Injector,
        private _assessmentsServiceProxy: AssessmentServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _authoritativeDocumentsServiceProxy: AuthoritativeDocumentsServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _entityGroupServiceProxy: EntityGroupsServiceProxy,
        private _router: Router, private _assementScheduleAppService: AssementScheduleServiceProxy
    ) {
        super(injector);
        this.selectedvalue = 1;
    }

    active = false;
    saving = false;

    ngOnInit(): void
    {
        let assessmentId = this._activatedRoute.snapshot.queryParams["id"];
        this.active = true;
        this.initializeAssessmentTypes();
        this.initializationEntityGroup();
        this.show(assessmentId);
    }

    onItemChange(event, id) {

        switch (id) {
            case 1: {
                this.selectedvalue = 1;
                this.assessment.businessEntityIds = [];
                this.selectedEntityGroup = [];
                this.businessentity = [];
                break;
            }
            case 2: {
                this.selectedvalue = 2;               
                this.selectedBusinessEntitys = [];
                this.assessment.businessEntityIds = [];
                this.initializeBusinessEntitiesLookUps(EntityType.HealthcareEntity);
                //statements; 
                break;
            }
            default: {
                this.selectedvalue = 3;
                this.selectedBusinessEntitys = [];
                this.assessment.businessEntityIds = [];
                this.initializeBusinessEntitiesLookUps(EntityType.InsuranceFacilities);
                break;
            }
        }

    }

    onEntityChange(event) {
        
        if (event.value != null) {
            this.assessment.entityGroupId = event.value.id;
            this.selectedBusinessEntity = [];
            this._businessEntitiesServiceProxy.getBusinessEntityGroupWies(event.value.id).subscribe(res => {
                this.businessentity = res;
            })
        }
        else {
            this.businessentity = [];
            this.selectedBusinessEntity = [];
            this.assessment.entityGroupId = undefined;
        }
      
    }

    onBusinessEntityChange(event)
    {
        this.assessment.businessEntityIds = [];
        var temp = this.selectedBusinessEntity;
       
        temp.forEach(obj => {
            this.assessment.businessEntityIds.push(obj.id);
        })
    }

    onBusinessEntityChanges(event) {
        this.assessment.businessEntityIds = [];
        var temp = this.selectedBusinessEntitys;
      
        temp.forEach(obj => {
            this.assessment.businessEntityIds.push(obj.id);
        })
    }

    initializeBusinessEntitiesLookUps(type) {

        this.businessEntitiesLookUps = [];
        this._businessEntitiesServiceProxy.getAllExcludeMembers(type)
            .subscribe(res => {
                this.businessEntitiesLookUps = res;
            });
    }

    initializationEntityGroup() {
        this._entityGroupServiceProxy.getAllEntityGroupForLookUp().subscribe(res => {
            this.entityGroup = res;
        })
    }   

    initializeAssessmentTypes() {
        this._assementScheduleAppService.getAssessmentTypes().subscribe(res => {
            this.assessmentTypes = res;
        });
    }
  
    initializeAuthoritativeDocumentLookUp() {
        this._authoritativeDocumentsServiceProxy.getAllAuthoritativeDocument().subscribe(res => {
            this.authoritativeDocumentsLookUp = res;
        });
    }

    save(): void
    {
        
        if (this.assessment.businessEntityIds.length == 0) {
            this.message.error("You should use at least one Business Entity!");
        } else {
            this.assessment.authoritativeDocumentName = document.getElementById(
                "authoritativeId"
            ).innerText;
            this.saving = true;
            this._assessmentsServiceProxy.createAssement(this.assessment).pipe(finalize(() => {this.saving = false;}))
                .subscribe(
                    (result) => {
                        this._assessmentsServiceProxy.updateAssessmentStatusLogInitial(result).pipe(finalize(() => { this.saving = false; }))
                            .subscribe(
                                () => {
                                    this.notify.info(this.l("SavedSuccessfully"));
                                    this.close();
                                    this.modalSave.emit(null);
                                },
                                error => {
                                    this.message.error(error.error.error.message);
                                    this.close();
                                    this.modalSave.emit(null);
                                }
                            );
                    },
                    error => {
                        this.message.error(error.error.error.message);
                        this.close();
                        this.modalSave.emit(null);
                    }
                );
        }
    }

    toggleBESelection() {
        this.allBESelected = !this.allBESelected;
        if (this.allBESelected) {
            this.assessment.businessEntityIds = this.businessEntitiesLookUp.map(
                item => item.businessEntity.id
            );
        } else {
            this.assessment.businessEntityIds = [];
        }
    }

    close(): void {
        this.active = false;
        this._router.navigate(["/app/main/assessments/assessments"]);
    }

    show(assessmentId?: number): void {
       // this.initializeBusinessEntitiesLookUp();
        this.initializeAuthoritativeDocumentLookUp();
        if (!assessmentId) {
            this.assessment = {} as any;

            this.active = true;
            if (this.modal != undefined) {
                this.modal.show();
            } 
        } else {
            this._assessmentsServiceProxy
                .getForEdit(assessmentId)
                .subscribe(result => {
                    this.assessment = result;
                    this.assessment.authoritativeDocumentId =
                        result.authoritativeDocumentId;
                    this.assessment.assessmentTypeId = result.assessmentTypeId;
                    this.assessment.reportingDate = result.reportingDate;
                    this.assessment.assessmentDate =result.assessmentDate;
                    this.assessment.sendEmailNotification =result.sendEmailNotification;
                    this.assessment.sendSmsNotification =result.sendSmsNotification;
                    this.assessment.info = result.info;
                    this.active = true;
                    if (this.modal != undefined) {
                        this.modal.show();
                    } 
                });
        }
    }
}
