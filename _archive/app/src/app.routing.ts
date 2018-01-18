import { Routes, RouterModule } from '@angular/router';

import { OrganizationListComponent }  from './components/organization-list.component';
import { OrganizationEditComponent }  from './components/organization-edit.component';
import { AccountProfileComponent }    from './components/profile.component';
import { AccountHomeComponent }       from './components/home.component';

const appRoutes: Routes = [
  { path: '',                               component: AccountHomeComponent },
  { path: 'profile',                        component: AccountProfileComponent },
  { path: 'organizations',                  component: OrganizationListComponent },
  { path: 'organizations/new',              component: OrganizationEditComponent },
  { path: 'organizations/:organization_id', component: OrganizationEditComponent }

];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes);