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
import {
    EntityDto,
    ApiException,
    API_BASE_URL,
    blobToText,
    throwException,
    FileDto
} from "../service-proxies";
import { AnyARecord } from "dns";
//import { AttachmentWithTitleDto } from "./storage.service";

@Injectable()
export class FindingReportServiceProxy {
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

    getAll(
        findingReportType: FindingReportType,
        sorting: string | undefined,
        skipCount: number | undefined,
        maxResultCount: number | undefined
    ): Observable<any> {
        let url_ = this.baseUrl + "/api/services/app/FindingReport/GetAll?";
        url_ += "type=" + findingReportType + "&";
        if (sorting === null)
            throw new Error("The parameter 'sorting' cannot be null.");
        else if (sorting !== undefined)
            url_ += "Sorting=" + encodeURIComponent("" + sorting) + "&";
        if (skipCount === null)
            throw new Error("The parameter 'skipCount' cannot be null.");
        else if (skipCount !== undefined)
            url_ += "SkipCount=" + encodeURIComponent("" + skipCount) + "&";
        if (maxResultCount === null)
            throw new Error("The parameter 'maxResultCount' cannot be null.");
        else if (maxResultCount !== undefined)
            url_ +=
                "MaxResultCount=" +
                encodeURIComponent("" + maxResultCount) +
                "&";
        return this.http.get(url_);
    }

    getfindingReportForEdit(input: number): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/FindingReport/GetFindingReportForEdit";
        url_ += "?Id=" + input;
        return this.http.get(url_);
    }

    createOrEdit(input: CreateOrEditFindingReportDto): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/FindingReport/CreateOrEdit";
        const options: any = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const content_ = JSON.stringify(input);
        return this.http.post(url_, content_, options);
    }
}

export interface CreateOrEditFindingReportDto {
    id: number;
    code: string;
    title: string;
    category: FindingReportCategory;
    categoryName: string;
    finderId: number;
    assessmentId: number;
    auditorId: number;
    assignedToUserId: number;
    findingManagerId: number;
    findingCoordinatorId: number;
    findingOwnerId: number;
    findingReportClassificationId: number;
    findingAction: FindingAction;
    details: string;
    relatedBusinessRisks: number[];
    relatedIncidents: number[];
    relatedExceptions: number[];
    controlRequirementId: number;
    businessEntityId: number;
    //attachments: AttachmentWithTitleDto[];
}

export enum FindingReportCategory {
    RegulatoryReporting = 1,
    Revenue,
    Other
}

export enum FindingAction {
    Accept = 1,
    Mitigate,
    Transfer
}

export enum FindingReportType {
    Internal = 1,
    External
}
