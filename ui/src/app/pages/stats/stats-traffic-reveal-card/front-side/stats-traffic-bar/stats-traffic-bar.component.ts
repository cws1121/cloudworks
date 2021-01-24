import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-stats-traffic-bar',
  styleUrls: ['./stats-traffic-bar.component.scss'],
  templateUrl: './stats-traffic-bar.component.html',
})
export class StatsTrafficBarComponent {

  @Input() barData: { prevDate: string; prevValue: number; nextDate: string; nextValue: number };
  @Input() successDelta: boolean;
}
