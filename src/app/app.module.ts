import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AdminModule } from './admin/admin.module';
import { SharingModule } from './sharing/sharing.module';
import { UserModule } from './user/user.module';
import { HttpClientModule, HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastrModule } from 'ngx-toastr';
import { MatSelectModule } from '@angular/material/select';  // Import MatSelectModule
import { MatOptionModule } from '@angular/material/core'; 

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AdminModule,
    SharingModule,
    UserModule,
    HttpClientModule,
    GraphQLModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    ToastrModule.forRoot()
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideAnimations(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
