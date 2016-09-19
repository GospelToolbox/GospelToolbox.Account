import { Component, Subscription } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OrganizationService } from '@gospeltoolbox/core';

import { Http, Response } from '@angular/http';
//import 'rxjs/Rx';
import 'rxjs/add/operator/map'


@Component({
    selector: 'organization-edit',
    templateUrl: 'assets/templates/organization-edit.template.html',
})
export class OrganizationEditComponent {

    public organization: any;
    private sub: Subscription;
    public errorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: Http,
        private organizationService: OrganizationService
    ) { }

    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            let id = params['organization_id'];

            if (id) {
                this.getOrganization(id);
            } else {
                this.organization = { };
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    public getOrganization(id: string) {
        this.organizationService.getOrganization(id)
            .then(org => this.organization = org)
            .catch(err => this.errorMessage = err.message || err);
    }

    public saveOrganization(org) {
        if (org._id != null) {
            this.organizationService.saveOrganization(org)
                .then(org => this.organization = org)
                .catch(err => this.errorMessage = err.message || err);
        } else {
            this.organizationService.saveOrganization(org)
                .then(org => this.router.navigate(['/organizations', org.data._id]))
                .catch(err => this.errorMessage = err.message || err);
        }
    }
}