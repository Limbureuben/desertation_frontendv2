import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserHeaderComponent } from './user-header/user-header.component';
import { UserFooterComponent } from './user-footer/user-footer.component';
import { MapDisplayComponent } from './map-display/map-display.component';
import { MapComponent } from './map/map.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { MatMenuModule } from '@angular/material/menu';
import { ReportFormComponent } from './report-form/report-form.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { UserHomeComponent } from './user-home/user-home.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { SharingModule } from '../sharing/sharing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnonymousreportComponent } from './anonymousreport/anonymousreport.component';
import { ViewHistoryComponent } from './view-history/view-history.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ProfileComponent } from './profile/profile.component';
import { ReviewreportComponent } from './reviewreport/reviewreport.component';

@NgModule({
  declarations: [
    UserDashboardComponent,
    UserHeaderComponent,
    UserFooterComponent,
    MapDisplayComponent,
    MapComponent,
    ReportFormComponent,
    UserHomeComponent,
    AnonymousreportComponent,
    ViewHistoryComponent,
    ProfileComponent,
    ReviewreportComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    UserRoutingModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatDialogModule,
    MatGridListModule,
    SharingModule,
    MatPaginatorModule,
    MatTableModule,
  ],
  exports: [
    MapDisplayComponent,
    MapComponent
  ]
})
export class UserModule { }
