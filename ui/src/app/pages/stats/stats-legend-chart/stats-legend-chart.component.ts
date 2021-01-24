import { Component, Input } from '@angular/core';

import { NgxLegendItemColor } from './stats-enum.legend-item-color';

@Component({
  selector: 'ngx-stats-legend-chart',
  styleUrls: ['./stats-legend-chart.component.scss'],
  templateUrl: './stats-legend-chart.component.html',
})
export class StatsLegendChartComponent {

  /**
   * Take an array of legend items
   * Available iconColor: 'green', 'purple', 'light-purple', 'blue', 'yellow'
   * @type {{iconColor: string; title: string}[]}
   */
  @Input()
  legendItems: { iconColor: NgxLegendItemColor; title: string }[] = [];
}
