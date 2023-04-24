import { Component, OnInit, ViewChild, Injector } from "@angular/core";
import { CreateOrEditBusinessEntityModalComponent } from "../businessEntities/businessEntities/create-or-edit-businessEntity-modal.component";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-business-entity-details",
    templateUrl: "./business-entity-details.component.html",
    styleUrls: ["./business-entity-details.component.css"]
})
export class BusinessEntityDetailsComponent implements OnInit {
    @ViewChild("createOrEditBusinessModal", { static: true })
    createOrEditBusinessEntityModal: CreateOrEditBusinessEntityModalComponent;
    businessEntityId: number;
    constructor(injector: Injector, private _activatedRoute: ActivatedRoute) {
        const routeParams = this._activatedRoute.snapshot.params;
        this.businessEntityId = routeParams.id;
    }

    ngOnInit() {}

    showBEProfile() {
        this.createOrEditBusinessEntityModal.show(this.businessEntityId);
    }
}
