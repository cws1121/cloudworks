import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-stats-slide-out',
  styleUrls: ['./stats-slide-out.component.scss'],
  templateUrl: './stats-slide-out.component.html',
})
export class StatsSlideOutComponent {

  @Input() showVisitorsStatistics: boolean = false;

  toggleStatistics() {
    this.showVisitorsStatistics = !this.showVisitorsStatistics;
  }
}
