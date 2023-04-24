import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PivotGridService } from './pivot-grid.service';
import {
    DxChartComponent, DxPivotGridComponent
} from 'devextreme-angular';

@Component({
    selector: 'pivot-grid',
    templateUrl: './pivot-grid.component.html',
    styleUrls: ['./pivot-grid.component.css']
})
export class PivotGridComponent extends AppComponentBase implements OnInit {
    @Input('data') data1: any;
    @ViewChild(DxPivotGridComponent, { static: false }) pivotGrid: DxPivotGridComponent;
    @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;

    pivotGridDataSource: any;

    format: any;


    constructor(_injector: Injector,
        private pivotGridService: PivotGridService,

    ) {
        super(_injector);
    }

    ngOnInit() {       
       
    }
    ngAfterViewInit() {
        this.pivotGrid.instance.bindChart(this.chart.instance, {
            dataFieldsDisplayMode: "splitPanes",
            alternateDataFields: false
        });

        setTimeout(() => {
            var dataSource = this.pivotGrid.instance.getDataSource();
            dataSource.expandHeaderItem('row', ['North America']);
            dataSource.expandHeaderItem('column', [2013]);
        }, 0);
    }
    assessmentData(e) {
        this.format = "percent";
        this.pivotGridDataSource = {
            fields: [{
                caption: "Year",
                dataField: "creationTime",
                dataType: "string",
                area: "row"
            }, {
                caption: "Assessment Name",
                dataField: "assessmentName",
                width: 250,
                area: "row"
                }, {
                    caption: "Facility Type Name",
                    dataField: "facilityTypeName",
                    dataType: "string",
                    area: "column"
                }, {
                groupName: "date",
                groupInterval: "month",
                visible: false
            }, {
                caption: "Review Score",
                dataField: "reviewScore",
                dataType: "number",
                summaryType: "avg",
                format: { percentage: '%', type: 'percent' },
                //summaryDisplayMode: "percentOfRowGrandTotal",
                //    summaryDisplayMode: "percentOfColumnGrandTotal",
                area: "data"
            }],
            store: e
            
        }
        this.spinnerService.hide();
    }
    auditProgramData(e) {
        this.format = "fixedPoint";
        this.pivotGridDataSource = {
            fields: [{
                caption: "Audit Status",
                width: 250,
                dataField: "auditStatus",
                area: "row",
                sortBySummaryField: "Total"
            }, {
                    caption: "Fiscal Year",
                    dataField: "fiscalYear",
                    dataType: "string",
                    area: "column"
                }, {
                    caption: "Lead Auditor",
                    dataField: "leadAuditor",
                    dataType: "string",
                    area: "column"
                }, {
                    caption: "Count",
                    dataField: "count",
                    dataType: "number",
                    area: "data",
                   // summaryDisplayMode: "percentOfColumnGrandTotal"
                }],
            store: e
        }
        this.spinnerService.hide();
    }

    onResetButtonClick() {
        this.pivotGridDataSource;
    }
    customizeTooltip(args) {
        return {
            html: args.seriesName + " | Total<div class='currency'>" + args.valueText + "</div>"
        };
    }     
}
