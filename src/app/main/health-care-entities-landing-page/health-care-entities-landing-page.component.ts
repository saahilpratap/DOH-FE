import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import { AppSessionService } from "@shared/common/session/app-session.service";

import {
    BusinessEntitiesServiceProxy, AssessmentServiceProxy, IncidentExceptionBusinessRiskCountDto, ADControlrequirementCountDto, IdNameDto, DashboardDOmainGraphDto, BusinessEnityGroupWiesDto, HealthCareLandingServiceProxy, GetBusinessEntitiesExcelDto, UserOriginType, EntityType, AuditDashboardServiceProxy, IncidentExceptionFindingDto, AssementTypeCountDto, BusinessEntitysListDto,HealthcarelandingDto
} from "@shared/service-proxies/service-proxies";
import { async } from '@angular/core/testing';

@Component({
    templateUrl: './health-care-entities-landing-page.component.html',
    styleUrls: ['./health-care-entities-landing-page.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class HealthCareEntitiesLandingPageComponent extends AppComponentBase {
    //single: any[];
    view: any[] = [500, 200];
    // options
    showLegend: boolean = true;
    showLabels: boolean = true;
    gradient: boolean = true;
    isDoughnut: boolean = false;
    legendPosition: string = 'below';
   
    single = [
        {
            "name": "Incidents",
            "value": 8940000
        },
        {
            "name": "Exceptions",
            "value": 5000000
        },
        {
            "name": "Business Risks",
            "value": 7200000
        }
    ];
    view11: any[] = [500, 350];
    single11 = [
        {
            "name": "Score",
            "value": 89
        }
    ];
    //multi: any[];
    view1: any[] = [700, 300];

    // options
    legend: boolean = true;
    //showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = '';
    yAxisLabel: string = '';
    timeline: boolean = true;

    healthcare: BusinessEnityGroupWiesDto[] = [];
    assessmentType: AssementTypeCountDto[] = [];
    IncidentExceptionFinding: IncidentExceptionFindingDto[] = [];
    showXAxis: boolean = true;
    showYAxis: boolean = true;
   
    legendTitle: string = '';

    colorScheme = {
        domain: ['#00c5dc', '#ffb822', '#716aca']
    };

    data = [
        {
            "name": " Annual External Assessment",
            "value": 22
        },
        {
            "name": "Special Assessment",
            "value": 23
        },
        {
            "name": "Pre-Audit Questionnaire",
            "value": 44
        }
    ]

    multi = [
        {
            "name": "2017",
            "series": [
                {
                    "name": "Incident",
                    "value": 40
                },
                {
                    "name": "Exception",
                    "value": 36
                },
                {
                    "name": "BusniessRisk",
                    "value": 31
                }
            ]
        },
        {
            "name": "2018",
            "series": [
                {
                    "name": "Incident",
                    "value": 40
                },
                {
                    "name": "Exception",
                    "value": 36
                },
                {
                    "name": "BusniessRisk",
                    "value": 31
                }
            ]
        },
        {
            "name": "2019",
            "series": [
                {
                    "name": "Incident",
                    "value": 40
                },
                {
                    "name": "Exception",
                    "value": 36
                },
                {
                    "name": "BusniessRisk",
                    "value": 31
                }
            ]
        },
        {
            "name": "2020",
            "series": [
                {
                    "name": "Incident",
                    "value": 40
                },
                {
                    "name": "Exception",
                    "value": 36
                },
                {
                    "name": "BusniessRisk",
                    "value": 31
                }
            ]
        }
    ];

    multi1 = [       
        {
            "name": "June",
            "series": [
                {
                    "name": "John Smith",
                    "value": 15
                },
                {
                    "name": "Reem Al Shehi",
                    "value": 45
                }
            ]
        },
        {
            "name": "July",
            "series": [
                {
                    "name": "John Smith",
                    "value": 36
                },
                {
                    "name": "Reem Al Shehi",
                    "value": 34,
                }
            ]
        },
        {
            "name": "August",
            "series": [
                {
                    "name": "John Smith",
                    "value": 36
                },
                {
                    "name": "Reem Al Shehi",
                    "value": 34,
                }
            ]
        },
        {
            "name": "September",
            "series": [
                {
                    "name": "John Smith",
                    "value": 40
                },
                {
                    "name": "Reem Al Shehi",
                    "value": 36
                }
            ]
        },
        {
            "name": "October",
            "series": [
                {
                    "name": "John Smith",
                    "value": 15
                },
                {
                    "name": "Reem Al Shehi",
                    "value": 45
                }
            ]
        },
        {
            "name": "November",
            "series": [
                {
                    "name": "John Smith",
                    "value": 36
                },
                {
                    "name": "Reem Al Shehi",
                    "value": 34,
                }
            ]
        },
        {
            "name": "December",
            "series": [
                {
                    "name": "John Smith",
                    "value": 36
                },
                {
                    "name": "Reem Al Shehi",
                    "value": 34,
                }
            ]
        }
    ];

    taskCard = [
        { icon: 'la la-university', title: 'Internal Assessments', amt: '5 Assessments' },
        { icon: 'la la-university', title: 'External Assessments', amt: '10 Assessments' },
        { icon: 'la la-university', title: 'Findings', amt: '7 Findings' },
        { icon: 'la la-university', title: 'External Audit Findings', amt: '15 Audit Findings' }
    ];

    ProgressBar = [
        { name: 'Human Resources Security', persentage: '20', color: 'info' },
        { name: 'Asset Management', persentage: '50', color: 'danger' },
        { name: 'Physical and Enviromental Security', persentage: '100', color: 'warning' },
        { name: 'Access Control', persentage: '30', color: 'info' },
        { name: 'Operations Management', persentage: '70', color: 'danger' },
        { name: 'Communications', persentage: '65', color: 'success' },
        { name: 'Health Information and Security', persentage: '25', color: 'warning' },
        { name: 'Third Party Security', persentage: '15', color: 'info' },
        { name: 'Information system  Acquisition', persentage: '45', color: 'success' },
        { name: 'Information Security Incident Management', persentage: '95', color: 'warning' },
        { name: 'Information System Continuity', persentage: '35', color: 'danger' },
    ]

    businessEntityId: any;
    businessEntitiesLookUp: GetBusinessEntitiesExcelDto[] = [];
    healthcareDashboard: HealthcarelandingDto = new HealthcarelandingDto();
    IncidentExceptionBusinessRiskCount: IncidentExceptionBusinessRiskCountDto[] = [];

    entityList: IdNameDto[] = [];
    entityId: number = 0;
    domainList: DashboardDOmainGraphDto[] = [];
    finalPercentage: number = 0;
   // single: any[];
   // view: any[] = [300, 300];
    incidentExceptionFindingDto: IncidentExceptionFindingDto[] = [];

    colorSchemescore = {
        domain: ['#5AA454', '#ffb822']
    };

    ProgressBarscore: ADControlrequirementCountDto[] = [];



    constructor(
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _healthCareServiceProxy: HealthCareLandingServiceProxy,
        private _appSessionService: AppSessionService,
        private _auditdashboardServiceProxy: AuditDashboardServiceProxy,
        private _assessmentServiceProxy: AssessmentServiceProxy,
        injector: Injector) {
        super(injector);
    }

    async loadData() {
        this._assessmentServiceProxy.assessmentBusinessEntity().subscribe(async res => {
            this.entityList = res;
            if (res.length != 0) {
                this.entityId = this.entityList[0].id;
                this.onEntityChange(this.entityId);
            }
        });
    }

    onEntityChange(val) {
        this._assessmentServiceProxy.dashboardDOmainGraphEntityId(val).subscribe(res => {
            this.domainList = res;
            let final = 0;
            this.domainList.forEach(x => {
                final = final + x.percentage
            });
            this.finalPercentage = Math.round((final) / this.domainList.length);
            var a = new IncidentExceptionFindingDto();
            a.name = "All Domain";
            a.value = this.finalPercentage;

            var b = new IncidentExceptionFindingDto();
            b.name = "";
            b.value = 100 - this.finalPercentage;
            this.incidentExceptionFindingDto.push(a);
            this.incidentExceptionFindingDto.push(b);
          
        });
    }

    async ngOnInit()
    {       
        this.initializeBusinessEntitiesLookUp();
        await this.loadData();
    }

    isBusinessEntityUser() {
        return (
            this._appSessionService.user.type ==
            UserOriginType.BusinessEntity ||
            this._appSessionService.user.type == UserOriginType.ExternalAuditor
        );
    } 

    initializeBusinessEntitiesLookUp() {
        this._businessEntitiesServiceProxy.getBusinessEntityForLoginUser().subscribe(res => {
            this.healthcare = res;
            this.businessEntityId = this._appSessionService.user.businessEntityId;
            this.getHealthCareDashboard();
        });
    }

    onhelthcareChange(healthenitiyId: number) {
        if (healthenitiyId! != null) {
            this.getHealthCareDashboard();
        }
        else {
            this.businessEntityId = undefined;
            this.getHealthCareDashboard();
        }
    }

    getHealthCareDashboard()
    {       
        this._healthCareServiceProxy.getHealthCareLandingDashBoard(this.businessEntityId).subscribe(res => {
            this.healthcareDashboard = res;
            this.IncidentExceptionBusinessRiskCount = res.incidentExceptionBusinessRiskCount;
            this.IncidentExceptionFinding = res.incidentExceptionFindingCount;
            let totalcount = 0;
            res.assementTypeCount.forEach(obj => {
                totalcount = totalcount + obj.value;
            })
            res.assementTypeCount.forEach(obj => {
                obj.label = Math.round ((100 / totalcount) * (obj.value)) + "% " + obj.label;
            })
            this.assessmentType = res.assementTypeCount;
        })
    }

    test() {
    }
}
