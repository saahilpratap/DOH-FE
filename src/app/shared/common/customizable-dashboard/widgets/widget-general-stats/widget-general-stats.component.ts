import { Component, OnInit, Injector } from '@angular/core';
import { DashboardChartBase } from '../dashboard-chart-base';
import { TenantDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { WidgetComponentBase } from '../widget-component-base';

class GeneralStatsPieChart extends DashboardChartBase {

  public data = [];

  constructor(private _dashboardService: TenantDashboardServiceProxy) {
    super();
  }

  init(transactionPercent, newVisitPercent, bouncePercent) {
    this.data = [
      {
        'name': 'Incidents',
        'value': transactionPercent
      }, {
        'name': 'Execeptions',
        'value': newVisitPercent
      }, {
        'name': 'Business Risks',
        'value': bouncePercent
      }];

    this.hideLoading();
  }

  reload() {
    this.showLoading();
    this._dashboardService
      .getGeneralStats()
      .subscribe(result => {
        this.init(result.transactionPercent, result.newVisitPercent, result.bouncePercent);
      });
  }
}
@Component({
  selector: 'app-widget-general-stats',
  templateUrl: './widget-general-stats.component.html',
  styleUrls: ['./widget-general-stats.component.css']
})
export class WidgetGeneralStatsComponent extends WidgetComponentBase implements OnInit {

  generalStatsPieChart: GeneralStatsPieChart;
  constructor(injector: Injector,
    private _dashboardService: TenantDashboardServiceProxy) {
    super(injector);
    this.generalStatsPieChart = new GeneralStatsPieChart(this._dashboardService);
  }

  ngOnInit() {
    this.generalStatsPieChart.reload();
  }
}
