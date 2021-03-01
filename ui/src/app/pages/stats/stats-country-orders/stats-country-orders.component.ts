import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { CountryOrderData } from '../../../@core/data/country-order';

@Component({
  selector: 'ngx-stats-country-orders',
  styleUrls: ['./stats-country-orders.component.scss'],
  template: `
    <nb-card [size]="breakpoint.width >= breakpoints.md ? 'medium' : 'giant'">
      <nb-card-header>Country/Region Readings Statistics</nb-card-header>
      <nb-card-body>
        <ngx-stats-country-orders-map (select)="selectCountryById($event)"
                                countryId="USA">
        </ngx-stats-country-orders-map>
        <ngx-stats-country-orders-chart [countryName]="countryName"
                                  [data]="readingsCountry"
                                  [labels]="testTypesForSelectedContry"
                                  maxValue="1500">
        </ngx-stats-country-orders-chart>
      </nb-card-body>
    </nb-card>
  `,
})
export class StatsCountryOrdersComponent implements OnInit, OnDestroy {

  private alive = true;

  countryName = '';
  countryData: number[] = [];
  countriesCategories: string[];
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;
  readingsCountry = [1100, 500]
  testTypesForSelectedContry = ["sd_bioline", "carestart"]

  constructor(private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private countryOrderService: CountryOrderData) {
    this.breakpoints = this.breakpointService.getBreakpointsMap();
  }

  ngOnInit() {
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
    this.countryOrderService.getCountriesCategories()
      .pipe(takeWhile(() => this.alive))
      .subscribe((countriesCategories) => {
        this.countriesCategories = countriesCategories;
      });
  }

  selectCountryById(countryName: string) {
    this.countryName = countryName;

    this.countryOrderService.getCountriesCategoriesData(countryName)
      .pipe(takeWhile(() => this.alive))
      .subscribe((countryData) => {
        this.countryData = countryData;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
