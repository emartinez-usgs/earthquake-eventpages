import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatMenuModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';

import { ProductPageModule } from '../product-page/product-page.module';
import { SharedModule } from '@shared/shared.module';
import { IntensityComponent } from './intensity/intensity.component';
import { InputComponent } from './metadata/input/input.component';
import { MetadataComponent } from './metadata/metadata.component';
import { MultiGmpeComponent } from './metadata/multigmpe/multigmpe.component';
import { OutputComponent } from './metadata/output/output.component';
import { ProcessingComponent } from './metadata/processing/processing.component';
import { PgaComponent } from './pga/pga.component';
import { PgvComponent } from './pgv/pgv.component';
import { PsaComponent } from './psa/psa.component';
import { ShakemapRoutingModule } from './shakemap-routing.module';
import { ShakemapComponent } from './shakemap/shakemap.component';
import { StationListComponent } from './station-list/station-list.component';
import { LegendComponent } from './legend/legend.component';

@NgModule({
  declarations: [
    ShakemapComponent,
    StationListComponent,
    MetadataComponent,
    MultiGmpeComponent,
    InputComponent,
    OutputComponent,
    ProcessingComponent,
    IntensityComponent,
    PgaComponent,
    PgvComponent,
    PsaComponent,
    LegendComponent
  ],
  exports: [StationListComponent, MetadataComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatMenuModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    ProductPageModule,
    SharedModule,
    ShakemapRoutingModule
  ]
})
export class ShakemapModule {}
