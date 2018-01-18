import { Component } from '@angular/core';

import { Http, Response } from '@angular/http';
//import 'rxjs/Rx';
import 'rxjs/add/operator/map'

import { AccountService } from '@gospeltoolbox/core';
import { OrganizationService } from '@gospeltoolbox/core';

@Component({
    selector: 'account-home',
    templateUrl: 'assets/templates/home.template.html',
})
export class AccountHomeComponent {
    public account: any;
    public organizations: any[];
    public errorMessage: string;

    constructor(
        private accountService: AccountService,
        private organizationService: OrganizationService
    ) { }

    ngOnInit() {
        this.getProfile();
        this.getOrganizations();
    }

    private getProfile() {
        this.accountService.getLoggedInAccount()
            .then(account => this.account = account)
            .catch(err => this.errorMessage = err.message || err);
    }

    private getOrganizations() {
        this.organizationService.getOrganizations()
            .then(organizations => this.organizations = organizations)
            .catch(err => this.errorMessage = err.message || err);
    }
}