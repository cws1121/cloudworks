import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme';
import {Router} from '@angular/router';
import {LayoutService} from '../../../@core/utils';
import {map, takeUntil, filter} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NbAuthService, NbTokenService} from '@nebular/auth';
import {SharedService} from '../../../shared.service';
import * as moment from 'moment';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  context: any;
  currentDomain: any;
  dateRange: any;
  availableDomains: any = [];
  domainSearch: any = '';

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [{title: 'Log out'}];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private sharedService: SharedService,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private authService: NbAuthService,
              private router: Router,
              private tokenService: NbTokenService) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.sharedService.currentContext
      .pipe(filter(context => !!context.data))
      .subscribe(context => {
        this.context = context.data;
        this.user = context.data.user;
        this.currentDomain = context.data.current_domain;
        this.availableDomains = context.data.available_domains;
      });

    const {xl} = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({name}) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.menuService.onItemClick()
      .pipe(
        filter(({tag}) => tag === 'user-context-menu'),
        map(({item: {title}}) => title),
      )
      .subscribe(title => {
        if (title == 'Log out') {
          this.authService.logout('email');
          this.tokenService.clear();
          this.router.navigate(['a/auth/login/']);
        }
      });

    this.dateRange = {
      start: this.sharedService.dateRange.startDate.toDate(),
      end: this.sharedService.dateRange.endDate.toDate(),
    };
  }

  getFilteredDomains() {
    function containsString(wordToCompare) {
      return function (domain) {
        return domain.name.indexOf(wordToCompare) >= 0;
      };
    }

    return this.availableDomains.filter(containsString(this.domainSearch));
  }

  switchDomain(domain_id: string) {
    if (domain_id != this.currentDomain.id) {
      this.sharedService.switchDomain(domain_id).subscribe(
        (data: any) => {
          window.location.reload();
        },
        (err: any) => console.error('switchDomain: ERROR')
      );
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  updateDateRange(event: any) {
    if (event.start && event.end) {
      this.sharedService.dateRange.startDate = moment(event.start);
      this.sharedService.dateRange.endDate = moment(event.end);
      this.sharedService.reloadDateRange();
    }
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
