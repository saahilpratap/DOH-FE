import { Component, OnInit, Injector, ViewChild, Input } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { Router, ActivatedRoute } from "@angular/router";
import {
  AuditProjectServiceProxy,
  CreateOrEditEntityGroupDto,
  BusinessEntitiesServiceProxy,
  EntityGroupDto,
  BusinessEnityGroupWiesDto,
  EntityGroupsServiceProxy,
  AuditProjectGroupDto,
  KeyContactDto,
  AuditProjectDto,
  BusinessEntityDto,
  ExternalQuestionGroupDto,
  AssessmentServiceProxy,
} from "../../../../shared/service-proxies/service-proxies";
import { AuditProjectGroupDashboardComponent } from "./dashboard/dashboard.component";
import * as Sticky from "sticky-js";
import { SelfAssessmentComponent } from "./self-assessment/self-assessment.component";
@Component({
  selector: "audit-project-group",
  templateUrl: "./audit-project-group.component.html",
  styleUrls: ["./audit-project-group.component.css"],
})
export class AuditProjectGroupComponent extends AppComponentBase
  implements OnInit {
  selectedItem: any;
  type: any;
  auditProjectId: any;

  selectedInternalAssessmentId: any;
  entityGroup: EntityGroupDto[] = [];
  keycontact: KeyContactDto = new KeyContactDto();
  businessEntity: BusinessEntityDto[] = [];
  questionGroup: ExternalQuestionGroupDto[] = [];
  auditproject: AuditProjectDto = new AuditProjectDto();
  auditprojectgroup: AuditProjectGroupDto = new AuditProjectGroupDto();
  businessentity: BusinessEnityGroupWiesDto[] = [];
    selectedBusinessEntity: BusinessEnityGroupWiesDto[] = []; 
    @ViewChild(SelfAssessmentComponent) tabViewSelfAssessment: SelfAssessmentComponent;
  entityGroupId: any;
  auditName = [
    {
      id: "1",
      icon: "fas fa-tachometer-alt",
      name: "Dashboard",
      description: "Audit Project Dashboard",
    },
    {
      id: "2",
      icon: "fas fa-clock",
      name: "Audit Plan",
      description: "Audit Plan and Schedule",
    },
    {
      id: "3",
      icon: "fas fa-file-import rotate-180",
      name: "Self Assessment",
      description: "Evidence Collection",
    },
    {
      id: "4",
      icon: "fas fa-external-link-square-alt",
      name: "External Assessment",
      description: "Assessment & Evidence Collection",
    },
    {
      id: "5",
      icon: "fas fa-search",
      name: "Finding",
      description: "Audit Finding",
    },
    {
      id: "6",
      icon: "fa fa-file",
      name: "Audit Report",
      description: "Audit Reporting",
    },
    {
      id: "7",
      icon: "fas fa-clock",
      name: "Corrective Action Plan",
      description: "Remeditaiton Plan / CAPA",
    },
    {
      id: "8",
      icon: "fas fa-laptop-code",
      name: "Surviellance Program",
      description: "Next Surviellance Program",
    },
    {
      id: "9",
      icon: "fas fa-certificate",
      name: "Certification Proposal",
      description: "Certification porposal Submission",
    },
    {
      id: "10",
      icon: "fas fa-users",
      name: "Decision",
      description: "Technical Commitee Decision",
    },
    {
      id: "11",
      icon: "fas fa-certificate",
      name: "Certificate",
      description: "Certificate Issuance",
    },
  ];
  entityId: any;
  vendorId: any;
  entitygroupDetails: CreateOrEditEntityGroupDto = new CreateOrEditEntityGroupDto();

  @ViewChild(AuditProjectGroupDashboardComponent)
  auditProjectDashboard: AuditProjectGroupDashboardComponent;
  constructor(
    _injector: Injector,
    private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
    private _entityGroupServiceProxy: EntityGroupsServiceProxy,
    private _auditProjectservice: AuditProjectServiceProxy,
    public _assessmentServiceProxy: AssessmentServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    super(_injector);
    var sticky = new Sticky(".sticky");
    sticky.update();
  }
  ngOnInit() {
    this.spinnerService.show();
    this._activatedRoute.queryParams.subscribe((params) => {
      this.type = params["type"];
      this.auditProjectId = params["auditProjectId"];
      this.selectedItem = 0;
    });
    this.getauditProject();
  }
  getauditProject() {
    this._auditProjectservice
      .getAuditProjectGroup(this.auditProjectId)
      .subscribe((res) => {
        this.auditprojectgroup = res;

        this.vendorId = res.auditProject.vendorId;
        this.auditproject = res.auditProject;
        this.entityGroupId = res.auditProject.entityGroupId;
        this.entitygroupDetails = res.auditProject.entityGroup;
        this.questionGroup = res.externalQuestionGroup;
        this.businessEntity = res.businessEntity;
        this.keycontact = res.keyContact;
        this.entityId = res.keyContact.id;

        if (this.auditproject.entityGroupId != null) {
          this.initializationEntityGroup();
          this.onEntityChange(this.auditproject.entityGroupId);
        } else {
          this.getbusinessEntityByProject(this.entityId);
        }
        this.spinnerService.hide();
      });
  }

  getbusinessEntityByProject(Id: number) {
    this._businessEntitiesServiceProxy
      .getBusinessEntityes(Id)
      .subscribe((res) => {
        this.businessentity = res;
      });
  }

  onEntityChange(id: number) {
    this._businessEntitiesServiceProxy
      .getBusinessEntityGroupWies(id)
      .subscribe((res) => {
        this.businessentity = res;
      });
  }

  initializationbusinessEntity(id: number) {
    this._businessEntitiesServiceProxy
      .getBusinessEntityGroupWies(id)
      .subscribe((res) => {
        this.businessentity = res;
      });
  }

  initializationEntityGroup() {
    this._entityGroupServiceProxy.getAllForLookUp().subscribe((res) => {
      this.entityGroup = res;
    });
  }

  getbusinessEntity(id: number) {
    this.auditProjectDashboard.getContact(id);
  }

  nextStep(idx: number) {
    this.selectedItem = idx + 1;
  }

  previous(idx: number) {
    this.selectedItem = idx - 1;
  }

    selectTab(idx: number) {
        //if (idx == 2) {
        //    this.tabViewSelfAssessment.hideTabView();
        //}

    this.selectedItem = idx;
  }
}
