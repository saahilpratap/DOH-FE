import { Component, Injector, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    HealthCareLandingServiceProxy, ComplianceDashboardDto
} from "@shared/service-proxies/service-proxies";

@Component({
    templateUrl: './compliance-management-landing-page.component.html',
    styleUrls: ['./compliance-management-landing-page.component.less'],
})
export class ComplianceManagementLandingPageComponent extends AppComponentBase implements AfterViewInit {

    taskCard = [
        { icon: 'la la-university', title: 'Internal Assessments', amt: '5 Assessments' },
        { icon: 'la la-university', title: 'External Assessments', amt: '10 Assessments' },
        { icon: 'la la-university', title: 'Internal Assessments', amt: '15 Assessments' },
        { icon: 'la la-university', title: 'External Assessments', amt: '15 Assessments' }
    ];

    single = [
        {
            "name": "Germany",
            "value": 8940000
        },
        {
            "name": "USA",
            "value": 5000000
        },
        {
            "name": "France",
            "value": 7200000
        }
    ];

    multi = [
        {
            "name": "Germany",
            "series": [
                {
                    "name": "2010",
                    "value": 7300000
                },
                {
                    "name": "2011",
                    "value": 8940000
                }
            ]
        },

        {
            "name": "USA",
            "series": [
                {
                    "name": "2010",
                    "value": 7870000
                },
                {
                    "name": "2011",
                    "value": 8270000
                }
            ]
        },

        {
            "name": "France",
            "series": [
                {
                    "name": "2010",
                    "value": 5000002
                },
                {
                    "name": "2011",
                    "value": 5800000
                }
            ]
        }
    ];

    totalcount: ComplianceDashboardDto = new ComplianceDashboardDto();
    view: any[] = [700, 400];

    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'Country';
    showYAxisLabel = true;
    yAxisLabel = 'Population';

    colorScheme = {
        domain: ['#00c5dc', '#ffb822', '#716aca', '#AAAAAA']
    };
    constructor(
        injector: Injector,
        private _healthCareServiceProxy: HealthCareLandingServiceProxy,
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {

    }

    ngOnInit() {
        this.getcount();
    }

    getcount() {
        this._healthCareServiceProxy.getComplianceDashboard().subscribe(res => {
            this.totalcount = res;
           
        })
    }
}
