import {
    mergeMap as _observableMergeMap,
    catchError as _observableCatch,
    map
} from "rxjs/operators";
import {
    Observable,
    throwError as _observableThrow,
    of as _observableOf,
    ObservableLike
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
export class AgreementAcceptanceService {
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
    getAll(fromDate: Date, toDate: Date): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/AgreementAcceptanceLog/GetAll";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?fromDate=" + fromDate.toISOString();
        url_ += "&toDate=" + toDate.toISOString();
        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                Accept: "text/plain"
            })
        };
        return this.http.get(url_);
    }
}

export class AgreementAcceptanceDto implements IAgreementAcceptance {
    entityId: string;
    assessmentId: number;
    username: string;
    date: Date;
    signature: string;
    hasAccepted: boolean;
}

export interface IAgreementAcceptance {
    entityId: string;
    assessmentId: number;
    username: string;
    date: Date;
    signature: string;
    hasAccepted: boolean;
}
