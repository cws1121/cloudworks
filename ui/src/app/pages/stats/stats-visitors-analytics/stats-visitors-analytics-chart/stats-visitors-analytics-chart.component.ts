import {filter, takeWhile} from 'rxjs/operators';
import {AfterViewInit, Component, Input, OnDestroy} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {LayoutService} from '../../../../@core/utils';
import {SharedService} from '../../../../shared.service';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'ngx-stats-visitors-analytics-chart',
  styleUrls: ['./stats-visitors-analytics-chart.component.scss'],
  template: `
    <div echarts
         [options]="option"
         [merge]="option"
         class="echart"
         (chartInit)="onChartInit($event)">
    </div>
  `,
})
export class StatsVisitorsAnalyticsChartComponent implements AfterViewInit, OnDestroy {

  private alive = true;

  option: any;
  themeSubscription: any;
  echartsIntance: any;
  chartData: any = [];

  constructor(private theme: NbThemeService,
              private layoutService: LayoutService,
              private sharedService: SharedService) {
    this.layoutService.onSafeChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(() => this.resizeChart());
  }

  ngAfterViewInit(): void {

    let globalStatsPromise = this.sharedService.globalStats;
    let jsThemePromise = this.theme.getJsTheme();

    combineLatest([globalStatsPromise, jsThemePromise])
      .pipe(filter(results => !!results[0].data))
      .pipe(takeWhile(() => this.alive))
      .subscribe(results => {
        this.chartData = results[0].data.readings_chart_data;
        const eTheme: any = results[1].variables.visitors;
        this.refreshChart(eTheme);
      });
  }

  setOptions(eTheme) {
    this.option = {
      legend: {
        show: true,
        textStyle: {
          color: 'white'
        },
        icon: 'rect'
      },
      grid: {
        left: 40,
        top: 50,
        right: 0,
        bottom: 60,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: eTheme.tooltipLineColor,
            width: eTheme.tooltipLineWidth,
          },
        },
        textStyle: {
          color: eTheme.tooltipTextColor,
          fontSize: 12,
          fontWeight: eTheme.tooltipFontWeight,
        },
        position: 'bottom',
        backgroundColor: eTheme.tooltipBg,
        borderColor: eTheme.tooltipBorderColor,
        borderWidth: 1,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        offset: 25,
        data: this.chartData['days'],
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: eTheme.axisTextColor,
          fontSize: eTheme.axisFontSize,
        },
        axisLine: {
          lineStyle: {
            color: eTheme.axisLineColor,
            width: '2',
          },
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: eTheme.axisLineColor,
            width: '1',
          },
        },
        axisLabel: {
          color: eTheme.axisTextColor,
          fontSize: eTheme.axisFontSize,
        },
        axisTick: {
          show: false,
        },
        splitLine: {

          lineStyle: {
            color: eTheme.yAxisSplitLine,
            width: '1',
          },
        },
      },
      series: this.generateSeries(eTheme),
    };
  }

  generateSeries(eTheme) {
    let output = [];

    for (let k in this.chartData) {
      if (k != 'days') {
        output.push(this.getOuterLine(eTheme, this.chartData[k], k));
      }
    }
    return output;
  }

  getOuterLine(eTheme, data, label) {
    return {
      name: label,
      type: 'line',
      smooth: true,
      symbolSize: 10,
      itemStyle: {
        color: this.intToHEX(this.hashCode(label)),
        normal: {
          opacity: 0,
          color: this.intToHEX(this.hashCode(label)),
        },
        emphasis: {
          color: '#ffffff',
          borderColor: eTheme.itemBorderColor,
          borderWidth: 1,
          opacity: 1,
        },
      },
      lineStyle: {
        normal: {
          width: eTheme.lineWidth,
          type: eTheme.lineStyle,
          color: this.intToHEX(this.hashCode(label)),
          shadowColor: eTheme.lineShadow,
          shadowBlur: 6,
          shadowOffsetY: 12,
        },
      },
      data: data,
    };
  }

  onChartInit(echarts) {
    this.echartsIntance = echarts;
  }

  refreshChart(eTheme) {
    this.setOptions(eTheme);
  }

  resizeChart() {
    if (this.echartsIntance) {
      this.echartsIntance.resize();
    }
  }

  hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  intToHEX(i) {
    var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
