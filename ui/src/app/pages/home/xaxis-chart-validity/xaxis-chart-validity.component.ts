import {Component, OnDestroy} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {combineLatest} from 'rxjs';
import {SharedService} from '../../../shared.service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'ngx-xaxis-chart-validity',
  template: `
    <chart type="line" [data]="data" [options]="options"></chart>
  `,
})
export class XaxisChartValidityComponent implements OnDestroy {
  data: {};
  options: any;
  subscription: any;

  constructor(private theme: NbThemeService, private sharedService: SharedService) {
    let dashboardStatsPromise = this.sharedService.dashboardStats;
    let jsThemePromise = this.theme.getJsTheme();

    this.subscription = combineLatest([dashboardStatsPromise, jsThemePromise])
      .pipe(filter(results => !!results[0].data))
      .subscribe(results => {
        const chart_data: any = results[0].data.validity_chart_data;
        const colors: any = results[1].variables;
        const chartjs: any = results[1].variables.chartjs;

        this.data = {
          labels: chart_data.days,
          datasets: [{
            label: 'Results Valid',
            data: chart_data.results_valid,
            borderColor: colors.primary,
            backgroundColor: colors.primary,
            fill: false,
            borderDash: [5, 5],
            pointRadius: 8,
            pointHoverRadius: 10,
          }, {
            label: 'Results Expired',
            data: chart_data.results_expired,
            borderColor: colors.dangerLight,
            backgroundColor: colors.dangerLight,
            fill: false,
            borderDash: [5, 5],
            pointRadius: 8,
            pointHoverRadius: 10,
          }],
        };

        this.options = {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'bottom',
            labels: {
              fontColor: chartjs.textColor,
            },
          },
          hover: {
            mode: 'index',
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Month',
                },
                gridLines: {
                  display: true,
                  color: chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: chartjs.textColor,
                },
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Expiry %',
                },
                gridLines: {
                  display: true,
                  color: chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: chartjs.textColor,
                },
              },
            ],
          },
        };
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private random() {
    return Math.round(Math.random() * 100);
  }
}
