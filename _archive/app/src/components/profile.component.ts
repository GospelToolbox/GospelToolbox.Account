import { Component } from '@angular/core';
import { AccountService } from '@gospeltoolbox/core';

import '../../assets/css/tabsExtended.css!';

@Component({
    selector: 'account-profile',
    templateUrl: 'assets/templates/profile.template.html',
})
export class AccountProfileComponent{
    public account: any;
    public errorMessage: string;

    constructor(
        private accountService: AccountService
        ) {}

    ngOnInit() {
        this.accountService.getLoggedInAccount()
            .then(account => this.account = account)
            .catch(err => this.errorMessage = err.message || err);
    }

    public saveProfile() {
    }

    public changePassword() {
    }

}