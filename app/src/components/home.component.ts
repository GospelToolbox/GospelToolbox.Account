import { Component } from '@angular/core';

import { Http, Response } from '@angular/http';
//import 'rxjs/Rx';
import 'rxjs/add/operator/map'

@Component({
    selector: 'account-home',
    templateUrl: 'assets/templates/home.template.html',
})
export class AccountHomeComponent {
    public account: any;
    public organizations: any[];
    public errorMessage: string;

    constructor(private http: Http) {
        this.http.get('/api/accounts/current')
            .map((res: Response) => {
                return res.json();
            })
            .subscribe(
            account => this.account = account,
            error => this.errorMessage = <any>error);

        this.http.get('/api/organizations')
            .map((res: Response) => {
                return res.json();
            })
            .subscribe(
            organizations => this.organizations = organizations,
            error => this.errorMessage = <any>error);
    }
}