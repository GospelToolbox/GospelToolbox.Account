import { Component } from '@angular/core';

import { OrganizationService } from '@gospeltoolbox/core';

//import 'rxjs/Rx';
import 'rxjs/add/operator/map'

@Component({
    selector: 'organization-list',
    templateUrl: 'assets/templates/organization-list.template.html'
})
export class OrganizationListComponent{
    public organizations: any;
    public errorMessage: string;

    constructor(
        private organizationService: OrganizationService
    ) { }

    ngOnInit() {
        this.loadOrganizations();
    }

    ngOnDestroy() {
    }

    private loadOrganizations() {
        this.organizationService.getOrganizations()
            .then(organizations => this.organizations = organizations)
            .catch(err => this.errorMessage = err.message || err);
    }
}