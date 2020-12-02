import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme';
import {Router} from '@angular/router';
import {UserData} from '../../../@core/data/users';
import {LayoutService} from '../../../@core/utils';
import {map, takeUntil, filter} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NbAuthService, NbAuthJWTToken, NbTokenService} from '@nebular/auth';
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
  domain: any;
  dateRange: any;

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

  userMenu = [{title: 'Profile'}, {title: 'Log out'}];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private sharedService: SharedService,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private authService: NbAuthService,
              private router: Router,
              private tokenService: NbTokenService) {

    // this.authService.onTokenChange()
    //   .subscribe((token: NbAuthJWTToken) => {
    //
    //     if (token.isValid()) {
    //       this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable
    //     }
    //
    //   });

  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.sharedService.updateContext();
    this.sharedService.currentContext
      .pipe(filter(context => !!context.data))
      .subscribe(context => {
        this.context = context.data;
        this.user = context.data.user;
        this.domain = context.data.domain;
      });

    // this.userService.getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => this.user = users.nemanja);

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
        start: this.sharedService.startDate.toDate(),
        end: this.sharedService.endDate.toDate(),
      };
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

  updateDateRange(event: any){
    // Broadcast a signal here??
    if (event.start && event.end){
      this.sharedService.startDate = moment(event.start)
      this.sharedService.endDate = moment(event.end)
    }
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
