import {
    mergeMap as _observableMergeMap,
    catchError as _observableCatch,
    map
} from "rxjs/operators";
import {
    Observable,
    throwError as _observableThrow,
    of as _observableOf
} from "rxjs";
import { Injectable, Inject, Optional, InjectionToken } from "@angular/core";
import {
    HttpClient,
    HttpHeaders,
    HttpResponse,
    HttpResponseBase
} from "@angular/common/http";

import * as moment from "moment";
import { EntityDto, ApiException, API_BASE_URL } from "../service-proxies";

@Injectable()
export class ComplianceManagementServiceProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver:
        | ((key: string, value: any) => any)
        | undefined = undefined;

    constructor(
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    ImportAuthoritativeDocuments(formData: any): Observable<any> {
        let url_ = this.baseUrl + "/File/ImportAuthoritativeDocuments";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, formData);
    }

    ImportAuthoritativeDocumentDomains(formData: any): Observable<any> {
        let url_ = this.baseUrl + "/File/ImportAuthoritativeDocumentDomains";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, formData);
    }
    ImportControlStandards(formData: any): Observable<any> {
        let url_ = this.baseUrl + "/File/ImportControlStandards";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, formData);
    }
    ImportControlRequirements(formData: any): Observable<any> {
        let url_ = this.baseUrl + "/File/ImportControlRequirements";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, formData);
    }
}
