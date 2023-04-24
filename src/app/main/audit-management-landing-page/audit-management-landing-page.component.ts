import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import {
    AuditDashboardServiceProxy, BusinessEntityDto, BusinessEntitysListDto, EntityType, BusinessEnityGroupWiesDto, BusinessEntitiesServiceProxy, GetBusinessEntitiesExcelDto, AuditDashboardDto, ExternalAssementCountDto, ExternalAuditFindingCountDto, AssementTypeCountDto, AssementByFiscalYearDto, EntityGroupDto, EntityGroupsServiceProxy, LeadAuditorByMonthDto
} from "@shared/service-proxies/service-proxies";
import * as moment from 'moment';

@Component({
    templateUrl: './audit-management-landing-page.component.html',
    styleUrls: ['./audit-management-landing-page.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class AuditManagementLandingPageComponent extends AppComponentBase {
    label1: any;
    label2: any;
    label3: any;
    dateRangeText: any;
    taskCard: any;
    colorScheme: any;
    dashboardCount: AuditDashboardDto = new AuditDashboardDto();
    externalAssessmentCount: any;
    findingCount: any;
    assementCount: AssementTypeCountDto[] = [];
    fiscalYear: AssementByFiscalYearDto[] = [];
    leadAuditor: LeadAuditorByMonthDto[] = [];
    entityGroup: EntityGroupDto[] = [];
    externalAudit: BusinessEntitysListDto[] = [];
    healthcare: BusinessEnityGroupWiesDto[] = [];
    data = [
        {
            "name": " Annual External Assessment",
            "value": 22,
            "label": " 25%  Annual External Assessment"
        },
        {
            "name": "Special Assessment",
            "value": 23,
            "label": " 21%  Special Assessment"
        },
        {
            "name": "Pre-Audit Questionnaire",
            "value": 44,
            "label": " 25%  Annual External Assessment"
        }
    ]

    view: any[] = [200, 200];

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
    teanentId: any;
    startDate: any;
    endDate: any;
    externalauditId: any;

    multi = [
        {
            "name": "2017",
            "series": [
                {
                    "name": "Ahmed Baig",
                    "value": 40
                },
                {
                    "name": "John Smith",
                    "value": 36
                },
                {
                    "name": "Reem Al Shehi",
                    "value": 31
                }
            ]
        },
        {
            "name": "2018",
            "series": [
                {
                    "name": "Ahmed Baig",
                    "value": 15
                },
                {
                    "name": "John Smith",
                    "value": 45
                },
                {
                    "name": "Reem Al Shehi",
                    "value": 37
                }
            ]
        },
        {
            "name": "2019",
            "series": [
                {
                    "name": "Ahmed Baig",
                    "value": 36
                },
                {
                    "name": "John Smith",
                    "value": 34,
                },
                {
                    "name": "Reem Al Shehi",
                    "value": 29
                }
            ]
        },
        {
            "name": "2020",
            "series": [
                {
                    "name": "Ahmed Baig",
                    "value": 36
                },
                {
                    "name": "John Smith",
                    "value": 34,
                },
                {
                    "name": "Reem Al Shehi",
                    "value": 29
                }
            ]
        }
    ];



    multi1 = [
        {
            "name": "January",
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
            "name": "February",
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
            "name": "March",
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
            "name": "April",
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
            "name": "May",
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

    externalAuditId: any;
    businessEntitiesLookUp: GetBusinessEntitiesExcelDto[] = [];
    businessEntity: BusinessEntityDto[] = [];
    healthentityId: any;
    entityGroupId: any;

    constructor(
        private _auditdashboardServiceProxy: AuditDashboardServiceProxy,
        private _businessEntitiesServiceProxy: BusinessEntitiesServiceProxy,
        private _entityGroupServiceProxy: EntityGroupsServiceProxy,
        injector: Injector) {
        super(injector);
        this.dashboardCount.externalAssessmentCount = null;
        this.fiscalYear = [];   
        this.taskCard = [
            { icon: 'la la-university', title: 'Total External Assessments', amt: '3 Assessments' },
            { icon: 'la la-university', title: 'Total External Audit Findinds ', amt: '5 Assessments' },
        ];
        this.colorScheme = {
            domain: ['#00c5dc', '#ffb822', '#716aca',"#90ee90"]
        };
    }

    ngOnInit() {
        this.getDashboardCount();
        this.initializeBusinessEntitiesLookUp();
        this.initializeAuditEntity();
        this.initializationEntityGroup();
    }

    getDashboardCount()
    {
        this._auditdashboardServiceProxy.getAuditDashBoardDetails(this.teanentId, this.startDate, this.endDate, this.healthentityId, this.externalAuditId, this.entityGroupId).subscribe(res => {
            this.dashboardCount = res;
            this.dashboardCount.externalAssessmentCount.count = res.externalAssessmentCount.count;
            this.dashboardCount.externalAuditFindingCount.count = res.externalAuditFindingCount.count;
            this.dashboardCount.auditProjectCount.count = res.auditProjectCount.count;
            let totalcount = 0;
            res.assementTypeCount.forEach(obj => {
                totalcount = totalcount + obj.value;
            })
            res.assementTypeCount.forEach(obj => {
                obj.label = obj.value + " - " + obj.label;
            })            
            this.assementCount = res.assementTypeCount;
            this.fiscalYear = res.assementByFiscalYear;
            this.leadAuditor = res.leadAuditorByMonth;
        })
    }

    onEntityChange(businessEntityId: number) {
        if (businessEntityId != null) {
            this.getDashboardCount();
        }
        else {
            this.externalAuditId = undefined;
            this.getDashboardCount();
        }


    }

    onhelthcareChange(healthenitiyId: number) {
        if (healthenitiyId! != null) {
            this.getDashboardCount();
        }
        else {
            this.healthentityId = undefined;
            this.getDashboardCount();
        }
    }

    onEntityGroupChange(entityGroupId: number) {
        if (entityGroupId! != null) {
            this.getDashboardCount();
        }
        else {
            this.entityGroupId = undefined;
            this.getDashboardCount();
        }
    }

    initializeBusinessEntitiesLookUp() {
       
        this._businessEntitiesServiceProxy.getBusinessEntityForLoginUser().subscribe(res => {
           
            this.healthcare = res;
        });
    }

    initializeAuditEntity() {
        
        this._auditdashboardServiceProxy.getExternalAudit().subscribe(res => {
           
            this.externalAudit = res;
        });
    }

    initializationEntityGroup() {
        this._entityGroupServiceProxy.getAllForLookUp().subscribe(res => {
           
            this.entityGroup = res;
        })
    }

    OndateChange(dateRangeText: any) {
        
        if (dateRangeText != undefined) {
            var date1 = dateRangeText + '';
            var t = date1.split(',');
            var startD = moment(t[0]).format("YYYY/MM/DD");
            var endD = moment(t[1]).format("YYYY/MM/DD");
            this.startDate = startD;
            this.endDate = endD;
        }
        this.getDashboardCount();
    }

    test()
    {

    }

}
