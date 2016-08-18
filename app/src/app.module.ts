import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';
import { NgbModule }      from '@ng-bootstrap/ng-bootstrap';

import { AccountAppComponent }       from './app.component';
import { routing,
         appRoutingProviders } from './app.routing';

import { AccountHomeComponent }         from './components/home.component';
import { AccountProfileComponent }    from './components/profile.component';
import { OrganizationListComponent }  from './components/organization-list.component';
import { OrganizationEditComponent }  from './components/organization-edit.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    NgbModule
  ],
  declarations: [
    AccountAppComponent,
    AccountHomeComponent,
    AccountProfileComponent,
    OrganizationListComponent
  ],
  providers: [
    appRoutingProviders,
    HTTP_PROVIDERS
  ],
  bootstrap: [ AccountAppComponent ]
})
export class AccountAppModule {
}