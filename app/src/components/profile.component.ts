import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
//import 'rxjs/Rx';
import 'rxjs/add/operator/map'


import '../../assets/css/tabsExtended.css!';

@Component({
    selector: 'account-profile',
    templateUrl: 'assets/templates/profile.template.html',
})
export class AccountProfileComponent{
    public account: any;
    public errorMessage: string;

    constructor(private http: Http) {
        this.http.get('/api/accounts/current')
            .map((res: Response) => {
                return res.json();
            })
            .subscribe(
            account => this.account = account,
            error => this.errorMessage = <any>error);
    }

    public saveProfile() {
    }

    public changePassword() {
    }

}