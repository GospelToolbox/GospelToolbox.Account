import { Component } from '@angular/core';

import { UsernameComponent } from './components/username.component';

import '../assets/css/header.css!';
//import template from './app.template.html!ng-template'

@Component({
    selector: 'account-app',
    templateUrl: 'assets/templates/app.template.html',
    directives: [
        UsernameComponent
    ],
    host: {
        '[class.loaded]': 'isLoaded',
    }
})
export class AccountAppComponent {
    isLoaded: boolean = false;

    ngAfterViewInit() {
        setTimeout(() => this.isLoaded = true, 5);
    }
}