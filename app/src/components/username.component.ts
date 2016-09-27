import { Component } from '@angular/core';
import { AccountService } from '@gospeltoolbox/core';

@Component({
    selector: 'gtbox-username',
    template: '{{account?.email}}',
})
export class UsernameComponent{
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
}