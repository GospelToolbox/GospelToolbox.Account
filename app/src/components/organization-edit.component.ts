import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
        private http: Http
    ) { }

    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            let id = params['organization_id'];

            if (id) {
                this.http.get('/api/organizations/' + id)
                    .map((res: Response) => {
                        return res.json();
                    })
                    .subscribe(
                    organization => this.organization = organization,
                    error => this.errorMessage = <any>error);
            } else {
                this.organization = {
                };
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    public saveOrganization(org) {
        if (org._id != null) {
            console.log('existing...', org, org._id);
            this.http.put('/api/organizations/' + org._id, org)
                .map((res: Response) => {
                    return res.json();
                })
                .subscribe(organization => this.organization = organization,
                error => this.errorMessage = <any>error);
        } else {
            console.log('new...', org, org._id);
            this.http.post('/api/organizations', org)
                .map((res: Response) => {
                    return res.json();
                })
                .subscribe(organization => this.router.navigate(['/organizations', organization.data._id]),
                error => this.errorMessage = <any>error);
        }
    }
}