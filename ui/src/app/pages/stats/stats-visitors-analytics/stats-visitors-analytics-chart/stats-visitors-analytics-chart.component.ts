import {delay, filter, takeWhile} from 'rxjs/operators';
import {AfterViewInit, Component, Input, OnDestroy} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {LayoutService} from '../../../../@core/utils';
import {OutlineData} from '../../../../@core/data/visitors-analytics';
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
  chartData:any =[];

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
        this.refreshChart(eTheme)
      });
  }

  setOptions(eTheme) {
    this.option = {
      grid: {
        left: 40,
        top: 20,
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
          fontSize: 20,
          fontWeight: eTheme.tooltipFontWeight,
        },
        position: 'top',
        backgroundColor: eTheme.tooltipBg,
        borderColor: eTheme.tooltipBorderColor,
        borderWidth: 1,
        formatter: (params) => {
          return Math.round(parseInt(params[0].value, 10));
        },
        extraCssText: eTheme.tooltipExtraCss,
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
      type: 'line',
      smooth: true,
      symbolSize: 20,
      itemStyle: {
        normal: {
          opacity: 0,
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

  getInnerLine(eTheme, data, label) {
    return {
      type: 'line',
      smooth: true,
      symbolSize: 20,
      tooltip: {
        show: false,
        extraCssText: '',
      },
      itemStyle: {
        normal: {
          opacity: 0,
        },
        emphasis: {
          opacity: 0,
        },
      },
      lineStyle: {
        normal: {
          width: eTheme.innerLineWidth,
          type: eTheme.innerLineStyle,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1),
        },
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: this.intToHEX(this.hashCode(label)),
          }, {
            offset: 1,
            color: this.intToHEX(this.hashCode(label)),
          }]),
          opacity: 0.8,
        },
      },
      data: data,
    };
  }

  onChartInit(echarts) {
    this.echartsIntance = echarts;
  }

  refreshChart(eTheme){
    this.setOptions(eTheme)
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
