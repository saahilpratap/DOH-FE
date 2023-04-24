import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { AuditProjectServiceProxy, KeyContactDto, ContactsServiceProxy, AnswerType, ContactDto, ExternalQuestionGroupDto, EntityType, BusinessEntityDto, CreateOrEditEntityGroupDto} from '../../../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'audit-project-group-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class AuditProjectGroupDashboardComponent extends AppComponentBase implements OnInit {
    
 
  
    @Input('auditProjectId') auditProjectId: any;

    keycontact: KeyContactDto = new KeyContactDto();
    questionGroups: ExternalQuestionGroupDto[] = [];
    entitygroupinfo: CreateOrEditEntityGroupDto = new CreateOrEditEntityGroupDto();
    businessEntity: BusinessEntityDto[] = [];
    anserType = AnswerType;
    contact: ContactDto[] = [];
    entityType=EntityType;
    logo: any;
    data1 = [
        { name: '', type: '', location: '', license: '', staff: '' },
        { name: '', type: '', location: '', license: '', staff: '' },
        { name: '', type: '', location: '', license: '', staff: '' },
        { name: '', type: '', location: '', license: '', staff: '' },
        { name: '', type: '', location: '', license: '', staff: '' }
    ];

   
    constructor(_injector: Injector,
        private _auditProjectservice: AuditProjectServiceProxy,
        private _contactsServiceProxy: ContactsServiceProxy,
        private _router: Router,
    ) {
       
        super(_injector);
        this.logo = "../../../../../assets/common/images/lockThreatLogo.png";
    }
    ngOnInit()
    {         
        this.getauditProject();
    }


    getauditProject()
    {
        this.spinnerService.show();
        this._auditProjectservice.getAuditProjectGroup(this.auditProjectId).subscribe(res =>
        {
            
            this.entitygroupinfo = res.auditProject.entityGroup;
            this.questionGroups = res.externalQuestionGroup;
            this.businessEntity = res.businessEntity;
            this.keycontact = res.keyContact;
           this.getContact(this.keycontact.id);
            this.spinnerService.hide();
        })
        this.spinnerService.hide();
    }



    getContact(entityId)
    {
        this._contactsServiceProxy.getContactByBusinessEntity(entityId).subscribe(res => {
            
            this.contact = res;
          
        })
    }
    
}
