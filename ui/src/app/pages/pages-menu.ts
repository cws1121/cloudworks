import {NbMenuItem} from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/a/pages/dashboard',
    home: true,
  },
  {
    title: 'Files',
    icon: 'layout-outline',
    children: [
      {
        title: 'Images',
        link: '/a/pages/files/images',
      },
    ],
  },
  {
    title: 'Data',
    icon: 'grid-outline',
    children: [
      {
        title: 'Case Data',
        link: '/a/pages/data/case-data',
      },
      {
        title: 'Heatmap Data',
        link: '/a/pages/data/heatmap-data',
      },
    ],
  },













  // {
  //   title: '--------------',
  //   group: true,
  // },
  //   {
  //   title: '--------------',
  //   group: true,
  // },
  // {
  //   title: 'Test Sessions',
  //   icon: 'layers',
  //   link: '/a/pages/test_session',
  // },
  // {
  //   title: 'Test Results',
  //   icon: 'eye',
  //   link: '/a/pages/test_result',
  // },
  // {
  //   title: 'HOME PAGES',
  //   group: true,
  // },
  // {
  //   title: 'Home page 1',
  //   icon: 'home-outline',
  //   link: '/a/pages/home1',
  //   home: true,
  // },
  // {
  //   title: 'Home page 2',
  //   icon: 'home-outline',
  //   link: '/a/pages/home2',
  // },
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  // {
  //   title: 'Layout',
  //   icon: 'layout-outline',
  //   children: [
  //     {
  //       title: 'Stepper',
  //       link: '/a/pages/layout/stepper',
  //     },
  //     {
  //       title: 'List',
  //       link: '/a/pages/layout/list',
  //     },
  //     {
  //       title: 'Infinite List',
  //       link: '/a/pages/layout/infinite-list',
  //     },
  //     {
  //       title: 'Accordion',
  //       link: '/a/pages/layout/accordion',
  //     },
  //     {
  //       title: 'Tabs',
  //       pathMatch: 'prefix',
  //       link: '/a/pages/layout/tabs',
  //     },
  //   ],
  // },
  // {
  //   title: 'Forms',
  //   icon: 'edit-2-outline',
  //   children: [
  //     {
  //       title: 'Form Inputs',
  //       link: '/a/pages/forms/inputs',
  //     },
  //     {
  //       title: 'Form Layouts',
  //       link: '/a/pages/forms/layouts',
  //     },
  //     {
  //       title: 'Buttons',
  //       link: '/a/pages/forms/buttons',
  //     },
  //     {
  //       title: 'Datepicker',
  //       link: '/a/pages/forms/datepicker',
  //     },
  //   ],
  // },
  // {
  //   title: 'UI Features',
  //   icon: 'keypad-outline',
  //   link: '/a/pages/ui-features',
  //   children: [
  //     {
  //       title: 'Grid',
  //       link: '/a/pages/ui-features/grid',
  //     },
  //     {
  //       title: 'Icons',
  //       link: '/a/pages/ui-features/icons',
  //     },
  //     {
  //       title: 'Typography',
  //       link: '/a/pages/ui-features/typography',
  //     },
  //     {
  //       title: 'Animated Searches',
  //       link: '/a/pages/ui-features/search-fields',
  //     },
  //   ],
  // },
  // {
  //   title: 'Modal & Overlays',
  //   icon: 'browser-outline',
  //   children: [
  //     {
  //       title: 'Dialog',
  //       link: '/a/pages/modal-overlays/dialog',
  //     },
  //     {
  //       title: 'Window',
  //       link: '/a/pages/modal-overlays/window',
  //     },
  //     {
  //       title: 'Popover',
  //       link: '/a/pages/modal-overlays/popover',
  //     },
  //     {
  //       title: 'Toastr',
  //       link: '/a/pages/modal-overlays/toastr',
  //     },
  //     {
  //       title: 'Tooltip',
  //       link: '/a/pages/modal-overlays/tooltip',
  //     },
  //   ],
  // },
  // {
  //   title: 'Extra Components',
  //   icon: 'message-circle-outline',
  //   children: [
  //     {
  //       title: 'Calendar',
  //       link: '/a/pages/extra-components/calendar',
  //     },
  //     {
  //       title: 'Progress Bar',
  //       link: '/a/pages/extra-components/progress-bar',
  //     },
  //     {
  //       title: 'Spinner',
  //       link: '/a/pages/extra-components/spinner',
  //     },
  //     {
  //       title: 'Alert',
  //       link: '/a/pages/extra-components/alert',
  //     },
  //     {
  //       title: 'Calendar Kit',
  //       link: '/a/pages/extra-components/calendar-kit',
  //     },
  //     {
  //       title: 'Chat',
  //       link: '/a/pages/extra-components/chat',
  //     },
  //   ],
  // },
  // {
  //   title: 'Maps',
  //   icon: 'map-outline',
  //   children: [
  //     {
  //       title: 'Google Maps',
  //       link: '/a/pages/maps/gmaps',
  //     },
  //     {
  //       title: 'Leaflet Maps',
  //       link: '/a/pages/maps/leaflet',
  //     },
  //     {
  //       title: 'Bubble Maps',
  //       link: '/a/pages/maps/bubble',
  //     },
  //     {
  //       title: 'Search Maps',
  //       link: '/a/pages/maps/searchmap',
  //     },
  //   ],
  // },
  // {
  //   title: 'Charts',
  //   icon: 'pie-chart-outline',
  //   children: [
  //     {
  //       title: 'Echarts',
  //       link: '/a/pages/charts/echarts',
  //     },
  //     {
  //       title: 'Charts.js',
  //       link: '/a/pages/charts/chartjs',
  //     },
  //     {
  //       title: 'D3',
  //       link: '/a/pages/charts/d3',
  //     },
  //   ],
  // },
  // {
  //   title: 'Editors',
  //   icon: 'text-outline',
  //   children: [
  //     {
  //       title: 'TinyMCE',
  //       link: '/a/pages/editors/tinymce',
  //     },
  //     {
  //       title: 'CKEditor',
  //       link: '/a/pages/editors/ckeditor',
  //     },
  //   ],
  // },
  // {
  //   title: 'Tables & Data',
  //   icon: 'grid-outline',
  //   children: [
  //     {
  //       title: 'Smart Table',
  //       link: '/a/pages/tables/smart-table',
  //     },
  //     {
  //       title: 'Tree Grid',
  //       link: '/a/pages/tables/tree-grid',
  //     },
  //   ],
  // },
  // {
  //   title: 'Miscellaneous',
  //   icon: 'shuffle-2-outline',
  //   children: [
  //     {
  //       title: '404',
  //       link: '/a/pages/miscellaneous/404',
  //     },
  //   ],
  // },
  //
  //







  // {
  //   title: 'Auth',
  //   icon: 'lock-outline',
  //   children: [
  //     {
  //       title: 'Login',
  //       link: '/a/auth/login',
  //     },
  //     {
  //       title: 'Register',
  //       link: '/a/auth/register',
  //     },
  //     {
  //       title: 'Request Password',
  //       link: '/a/auth/request-password',
  //     },
  //     {
  //       title: 'Reset Password',
  //       link: '/a/auth/reset-password',
  //     },
  //   ],
  // },
];
