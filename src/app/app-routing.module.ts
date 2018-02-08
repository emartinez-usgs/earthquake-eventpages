import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UnknownEventPageComponent } from './unknown-event-page/unknown-event-page.component';
import { EventPageComponent } from './event-page/event-page/event-page.component';

import { ExecutiveComponent } from './executive/executive/executive.component';
import { RegionInfoComponent } from './region-info/region-info/region-info.component';

const appRoutes = [
  {
    path: 'unknown',
    component: UnknownEventPageComponent
  },
  {
    path: ':eventid',
    component: EventPageComponent,
    children: [
      {
        path: 'executive',
        component: ExecutiveComponent
      },
      {
        path: 'region-info',
        component: RegionInfoComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'executive'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/unknown',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
