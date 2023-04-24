import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    BusinessEntitiesServiceProxy, IncidentExceptionBusinessRiskCountDto, IRMSummaryDetailDto, SalesSummaryDatePeriod, BusinessEnityGroupWiesDto, HealthCareLandingServiceProxy, GetBusinessEntitiesExcelDto, UserOriginType, EntityType, AuditDashboardServiceProxy, IncidentExceptionFindingDto, AssementTypeCountDto, BusinessEntitysListDto, HealthcarelandingDto
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/common/session/app-session.service";
import * as moment from 'moment';

@Component({
    templateUrl: './organization-setup-landing-page.component.html',
    styleUrls: ['./organization-setup-landing-page.component.less'],
})
export class OrganizationSetupLandingPageComponent extends AppComponentBase implements AfterViewInit {

    
    view: any[] = [700, 400];

    // options
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = true;
    showLegend: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = '';
    showYAxisLabel: boolean = true;
    yAxisLabel: string = '';
    legendTitle: string = '';

    healthcare: BusinessEnityGroupWiesDto[] = [];
    assessmentType: AssementTypeCountDto[] = [];
    IncidentExceptionFinding: IncidentExceptionFindingDto[] = [];
    IncidentExceptionFindings: AssementTypeCountDto[] = [];

    businessEntityId: any;
    businessEntitiesLookUp: GetBusinessEntitiesExcelDto[] = [];
    healthcareDashboard: HealthcarelandingDto = new HealthcarelandingDto();
    IncidentExceptionBusinessRiskCount: IncidentExceptionBusinessRiskCountDto[] = [];
    colorScheme = {
        domain: ['#00c5dc', '#ffb822', '#716aca']
    };

    data = [
        {
            "name": " Incidents",
            "value": 22
        },
        {
            "name": "Exceptions",
            "value": 23
        },
        {
            "name": "Business Risks",
            "value": 44
        }
    ]

    multi = [
        {
            "name": "Incidents",
            "series": [
                {
                    "name": "2010",
                    "value": 40632
                },
                {
                    "name": "2000",
                    "value": 36953
                },
                {
                    "name": "1990",
                    "value": 31476
                }
            ]
        },
        {
            "name": "Exceptions",
            "series": [
                {
                    "name": "2010",
                    "value": 15000
                },
                {
                    "name": "2000",
                    "value": 45986
                },
                {
                    "name": "1990",
                    "value": 37060
                }
            ]
        },
        {
            "name": "Business Risks",
            "series": [
                {
                    "name": "2010",
                    "value": 36745
                },
                {
                    "name": "2000",
                    "value": 34774,
                },
                {
                    "name": "1990",
                    "value": 29476
                }
            ]
        },
        {
            "name": "Assessments",
            "series": [
                {
                    "name": "2010",
                    "value": 36745
                },
                {
                    "name": "2000",
                    "value": 34774,
                },
                {
                    "name": "1990",
                    "value": 29476
                }
            ]
        }
    ];

    stackedData = [
        {
            "name": "Incidents",
            "series": [
                {
                    "value": 4554,
                    "name": "A"
                },
                {
                    "value": 5682,
                    "name": "B"
                },
                {
                    "value": 2956,
                    "name": "C"
                },
                {
                    "value": 4792,
                    "name": "D"
                },
                {
                    "value": 4809,
                    "name": "E"
                }
            ]
        },
        {
            "name": "Exceptions",
            "series": [
                {
                    "value": 2375,
                    "name": "A"
                },
                {
                    "value": 4589,
                    "name": "B"
                },
                {
                    "value": 6988,
                    "name": "C"
                },
                {
                    "value": 5857,
                    "name": "D"
                },
                {
                    "value": 3143,
                    "name": "E"
                }
            ]
        },
        {
            "name": "Business Risks",
            "series": [
                {
                    "value": 5740,
                    "name": "A"
                },
                {
                    "value": 2870,
                    "name": "B"
                },
                {
                    "value": 6301,
                    "name": "C"
                },
                {
                    "value": 6757,
                    "name": "D"
                },
                {
                    "value": 3708,
                    "name": "E"
                }
            ]
        },
        {
            "name": "Assessments",
            "series": [
                {
                    "value": 3296,
                    "name": "A"
                },
                {
                    "value": 2309,
                    "name": "B"
                },
                {
                    "value": 5972,
                    "name": "C"
                },
                {
                    "value": 6490,
                    "name": "D"
                },
                {
                    "value": 5285,
                    "name": "E"
                }
            ]
        }
    ]

    appSalesSummaryDateInterval = SalesSummaryDatePeriod;
    startdate: Date;
    enddate: Date;
    StartDates: any;
    EndDates: any;
    incidentTotal: number = 0;
    exceptionTotal: number = 0;
    businessRiskTotal: number = 0;
    findingTotal: number = 0;
    result: IRMSummaryDetailDto[] = [];   
    type: string = 'Yearly';

    taskCard = [
        { icon: 'la la-university', title: 'Internal Assessments', amt: '5 Assessments' },
        { icon: 'la la-university', title: 'External Assessments', amt: '10 Assessments' },
        { icon: 'la la-university', title: 'Internal Assessments', amt: '15 Assessments' },
        { icon: 'la la-university', title: 'External Assessments', amt: '15 Assessments' }
    ];
    constructor(
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _healthCareServiceProxy: HealthCareLandingServiceProxy,
        private _appSessionService: AppSessionService,
        private _auditdashboardServiceProxy: AuditDashboardServiceProxy,
        injector: Injector,
    ) {
        super(injector);
        this.startdate = new Date(Date.now());
        this.enddate = new Date(Date.now());
    }

    ngAfterViewInit(): void {

    }
    onSelect(data): void {

    }

    onActivate(data): void {

    }

    onDeactivate(data): void {

    }


    ngOnInit() {
        this.initializeBusinessEntitiesLookUp();
        this.getincidnetaexceptionBusinessRisk();       
        this.getRecord();
    }

    getRecord()
    {
        this.EndDates = moment(this.enddate).toDate();
        this.StartDates = moment(this.startdate).toDate();
        this.StartDates.setDate(this.StartDates.getDate() - 365);
        this._healthCareServiceProxy.getAllIRMSummary(this.StartDates, this.EndDates, this.businessEntityId).subscribe(res => {
            this.result = res;
            this.exceptionTotal = 0;
            this.incidentTotal = 0;
            this.findingTotal = 0;
            this.businessRiskTotal = 0;

            var incidentInfo = res.find(x => x.name == 'Incident');
            if (incidentInfo != undefined) {
                incidentInfo.series.forEach(x => {
                    this.incidentTotal = this.incidentTotal + x.value;
                });
            }
            var exceptionInfo = res.find(x => x.name == 'Exception');
            if (exceptionInfo != undefined) {
                exceptionInfo.series.forEach(x => {
                    this.exceptionTotal = this.exceptionTotal + x.value;
                });
            }
            var findingInfo = res.find(x => x.name == 'Finding');
            if (findingInfo != undefined) {
                findingInfo.series.forEach(x => {
                    this.findingTotal = this.findingTotal + x.value;
                });
            }
            var businessRiskInfo = res.find(x => x.name == 'Business Risk');
            if (businessRiskInfo != undefined) {
                businessRiskInfo.series.forEach(x => {
                    this.businessRiskTotal = this.businessRiskTotal + x.value;
                });
            }

        });
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
            this.getincidnetaexceptionBusinessRisk();
            this.getRecord();
        });
    }

    async onhelthcareChange(healthenitiyId: number) {
        if (healthenitiyId! != null) {
            await this.getHealthCareDashboard();
            await this.getincidnetaexceptionBusinessRisk();
        }
        else {
            this.businessEntityId = undefined;
            this.getHealthCareDashboard();
        }
    }

    getincidnetaexceptionBusinessRisk()
    {
        this._healthCareServiceProxy.getDashboardBusinessIncidentRisk(this.businessEntityId).subscribe(res => {
            //   this.IncidentExceptionFinding = res;
            //this.IncidentExceptionFinding = res.incidentExceptionFindingCount;
            let totalcount = 0;
            res.forEach(obj => {
                totalcount = totalcount + obj.value;
            })
            res.forEach(obj => {
                obj.label = Math.round((100 / totalcount) * (obj.value)) + "% " + obj.name;
            })
            this.IncidentExceptionFindings = res;
        })
    }

    getHealthCareDashboard() {
        this._healthCareServiceProxy.getHealthCareLandingDashBoard(this.businessEntityId).subscribe(res => {
            this.healthcareDashboard = res;
            this.IncidentExceptionBusinessRiskCount = res.incidentExceptionBusinessRiskCount;
            this.IncidentExceptionFinding = res.incidentExceptionFindingCount;
            let totalcount = 0;
            res.assementTypeCount.forEach(obj => {
                totalcount = totalcount + obj.value;
            })
            res.assementTypeCount.forEach(obj => {
                obj.label = Math.round((100 / totalcount) * (obj.value)) + "% " + obj.label;
            })
            this.assessmentType = res.assementTypeCount;
        })
    }
}
