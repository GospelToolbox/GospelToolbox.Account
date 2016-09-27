import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule  } from '@angular/http';
import { NgbModule }      from '@ng-bootstrap/ng-bootstrap';
import { AccountModule } from '@gospeltoolbox/core';
import { CoreModule } from '@gospeltoolbox/core';

import { AccountAppComponent }       from './app.component';
import { routing,
  appRoutingProviders } from './app.routing';

import { AccountHomeComponent }         from './components/home.component';
import { AccountProfileComponent }    from './components/profile.component';
import { OrganizationListComponent }  from './components/organization-list.component';
import { OrganizationEditComponent }  from './components/organization-edit.component';

import { UsernameComponent } from './components/username.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    NgbModule,
    HttpModule,
    AccountModule.forRoot(),
    CoreModule
  ],
  declarations: [
    AccountAppComponent,
    AccountHomeComponent,
    AccountProfileComponent,
    OrganizationListComponent,
    OrganizationEditComponent,
    UsernameComponent
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AccountAppComponent]
})
export class AccountAppModule { }