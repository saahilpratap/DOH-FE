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
export class StatisticsServiceProxy {
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

    getEntitiesStatistics(): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/Statistic/GetEntitiesStatistics";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.get(url_);
    }
    getNewExternalAuditsStatistics(): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/Statistic/GetNewExternalAuditsStatistics";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.get(url_);
    }
    getNewUsersStatistics(): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/Statistic/GetNewUsersStatistics";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.get(url_);
    }

    getEntitiesStatisticByFacilityType(): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/Statistic/GetEntitiesStatisticByFacilityType";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.get(url_);
    }
    getAssessmentSubmissions(): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/Statistic/GetAssessmentSubmissions";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.get(url_);
    }

    getBusinessRiskStatistics(forDaysCount: number): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/Statistic/GetBusinessRiskStatistics";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?fordaysCount=" + forDaysCount;
        return this.http.get(url_);
    }

    getExternalAssessmentsStatistics(): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/Statistic/GetNewExternalAssessmentsStatistics";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.get(url_);
    }

    getSecurityIncidentStatistics(forDaysCount: number): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/Statistic/GetSecurityIncidentsStatistics";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?fordaysCount=" + forDaysCount;
        return this.http.get(url_);
    }

    getExceptionStatistics(forDaysCount: number): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/Statistic/GetExceptionStatistics";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?fordaysCount=" + forDaysCount;
        return this.http.get(url_);
    }
    getAssessmentStatistics(): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/Statistic/GetAssessmentStatistics";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.get(url_);
    }
}
