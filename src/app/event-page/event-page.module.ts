import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { HazdevTemplateModule } from 'hazdev-template';

// Components
import { EventPageComponent } from './event-page/event-page.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

// Pipes
import { EventDateTimePipe } from './event-date-time.pipe';
import { EventDepthPipe } from './event-depth.pipe';
import { EventTitlePipe } from './event-title.pipe';
import { ContributorListPipe } from './contributor-list.pipe';
import { NavigationComponent } from './navigation/navigation.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    MatListModule,
    RouterModule,

    HazdevTemplateModule,
    SharedModule
  ],
  declarations: [
    // Components
    EventPageComponent,
    FooterComponent,
    HeaderComponent,

    // Pipes
    EventDateTimePipe,
    EventDepthPipe,
    EventTitlePipe,
    ContributorListPipe,
    NavigationComponent
  ],
  exports: [
    ContributorListPipe,
    EventPageComponent
  ],
})
export class EventPageModule { }
