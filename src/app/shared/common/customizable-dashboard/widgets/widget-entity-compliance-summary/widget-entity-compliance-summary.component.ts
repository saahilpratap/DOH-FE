import { Component, OnInit, Injector } from '@angular/core';
import { TenantDashboardServiceProxy, AssessmentServiceProxy, IdNameDto } from '@shared/service-proxies/service-proxies';
import { DashboardChartBase } from '../dashboard-chart-base';
import { WidgetComponentBase } from '../widget-component-base';


declare var $: any;


@Component({
    selector: 'widget-entity-compliance-summary',
    templateUrl: './widget-entity-compliance-summary.component.html',
    styleUrls: ['./widget-entity-compliance-summary.component.css']
})
export class WidgetEntityComplianceSummaryComponent extends WidgetComponentBase implements OnInit {

    initialLoad = false;
    sliderLoaded = false;
    graphData: any;
    entityList: IdNameDto[] = [];
    entityId: number = 0;

    _lineType = { solid: 'solid', dashed: 'dashed' };
    _context;
    _data;
    _numXPoints = 0;
    _numYPoints = 0;
    _font = "12pt Calibri";
    _padding = 25;
    _axisColor = "#555";
    _fontHeight = 12;
    _xStart = 0;
    _yStart = 0;
    _width = 0;
    _height = 0;
    _prevX = 0;
    _prevY = 0;
    _currentAge = 0;
    _isSliderSelected = false;
    _sliderWidth = 100;
    _sliderPositionMin = 0;
    _sliderPositionMax = 0;
    _sliderPositionCurrent = 0;
    _silderPositionStart = 0;
    _sliderOnMouseStart = 0;
    _sliderOnMouseEnd = 0;
    _sliderMove = 0;
    retirementAgeGraphKeys: any;

    public canvasWidth = 270
    public needleValue = 0
    public centralLabel = ''
    public name = ''
    public bottomLabel = ''
    public options = {
        hasNeedle: true,
        needleColor: 'black',
        needleUpdateSpeed: 1000,
        arcColors: ['#b31217', '#ffb822', '#1dc9b7'],
        arcDelimiters: [85,95],
        rangeLabel: ['0', '100'],
        needleStartValue: 50,
    }

    NonCompliantCount: number = 0;
    PartiallyCompliantCount: number = 0;
    FullyCompliantCount: number = 0;
    NotApplicableCount: number = 0;
    NotSelectedCount: number = 0;
    TotalCount: number = 0;

    constructor(injector: Injector,
        private _tenantdashboardService: TenantDashboardServiceProxy,
        private _assessmentServiceProxy: AssessmentServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {       
        this.loadData();
        //this.render();
        //this.test();
    }

    onEntityChange(val) {

        if (val != null) {

            this._assessmentServiceProxy.getReviewDataByBusinessEntityId(val).subscribe(res => {
                var data = res;
                this.NonCompliantCount = 0;
                this.PartiallyCompliantCount = 0;
                this.FullyCompliantCount = 0;
                this.NotApplicableCount = 0;
                this.NotSelectedCount = 0;
                this.TotalCount = 0;
                data.reviewDatas.forEach(x => {
                    switch (x.responseType) {
                        case 4:
                            this.FullyCompliantCount = this.FullyCompliantCount + 1;
                            this.TotalCount = this.TotalCount + 1;
                            break;
                        case 3:
                            this.PartiallyCompliantCount = this.PartiallyCompliantCount + 1;
                            this.TotalCount = this.TotalCount + 1;
                            break;
                        case 2:
                            this.NonCompliantCount = this.NonCompliantCount + 1;
                            this.TotalCount = this.TotalCount + 1;
                            break;
                        case 1:
                            this.NotApplicableCount = this.NotApplicableCount + 1;
                            this.TotalCount = this.TotalCount + 1;
                            break;
                        default:                        
                            this.NotSelectedCount = this.NotSelectedCount + 1;
                            this.TotalCount = this.TotalCount + 1;
                    }
                });
                this.needleValue = data.reviewScore;

                if (data.flag==false) {
                    this.needleValue = 0;
                    this.NonCompliantCount = 0;
                    this.PartiallyCompliantCount = 0;
                    this.FullyCompliantCount = 0;
                    this.NotApplicableCount = 0;
                    this.NotSelectedCount = 0;
                }
            });
        }
        else {
            this.NonCompliantCount = 0;
            this.PartiallyCompliantCount = 0;
            this.FullyCompliantCount = 0;
            this.NotApplicableCount = 0;
            this.NotSelectedCount = 0;
            this.TotalCount = 0;
            this.needleValue = 0;
        }
    }

    loadData() {
        this._assessmentServiceProxy.assessmentBusinessEntity().subscribe(res => {
            this.entityList = res;         
            if (res.length != 0) {
                this.entityId = this.entityList[0].id;
                this.onEntityChange(this.entityId);
            }
        });
    }

    render() {
        let canvas: any = document.getElementById("myCanvas");
        canvas.width = 600;
        canvas.height = 600;
        this._context = canvas.getContext("2d");
        this._context.clearRect(0, 0, canvas.width, canvas.height);
        this._context.beginPath();
        this._context.arc(95, 50, 40, 0, 2 * Math.PI);
        this._context.lineWidth = 15;

        let gradient = this._context.createLinearGradient(0, 0, 170, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");

        this._context.strokeStyle = gradient;
        this._context.stroke();

    }

    test() {
        let canvas: any = document.getElementById("canvas");
        const ctx = canvas.getContext('2d');

        // Tangential lines
        ctx.beginPath();
        ctx.strokeStyle = 'gray';
        ctx.moveTo(200, 20);
        ctx.lineTo(200, 130);
        ctx.lineTo(50, 20);
        ctx.stroke();

        // Arc
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.moveTo(200, 20);
        ctx.arcTo(200, 130, 50, 20, 40);
        ctx.stroke();

        // Start point
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.arc(200, 20, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Control points
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(200, 130, 5, 0, 2 * Math.PI); // Control point one
        ctx.arc(50, 20, 5, 0, 2 * Math.PI);   // Control point two
        ctx.fill();
    }
}
