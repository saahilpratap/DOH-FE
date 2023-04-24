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
export class StorageServiceProxy {
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

    AddAttachment(attachment: any): Observable<any> {
        let url_ = this.baseUrl + "/File/UploadAttachments";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, attachment);
    }
    AddTtxSectionAttachment(attachment: any): Observable<any> {
        let url_ = this.baseUrl + "/File/UploadTTXFileSystem";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, attachment);
    }


    AddAuditAttachment(attachment: any): Observable<any> {
        let url_ = this.baseUrl + "/File/UploadAuditProjectAttachments";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, attachment);
    }

    AddAuditSubDocAttachment(attachment: any): Observable<any> {
        let url_ = this.baseUrl + "/File/UploadAuditSubDocProjAttachments";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, attachment);
    }

    AddRemediationAttachment(attachment: any): Observable<any> {
        let url_ = this.baseUrl + "/File/UploadRemediationAttachments";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, attachment);
    }

    AddTeamplateAttachment(attachment: any): Observable<any> {
        let url_ = this.baseUrl + "/File/UploadTeamplateAttachments";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, attachment);
    }

    AddWorkflowTeamplateAttachment(attachment: any): Observable<any> {
      
        let url_ = this.baseUrl + "/File/UploadWorkflowTeamplateAttachments";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, attachment);
    }

    AddEmailNotificationAttachment(attachment: any): Observable<any> {
       
        let url_ = this.baseUrl + "/File/UploadEmailNotificationAttachments";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, attachment);
    }

    AddEmailReminderAttachment(attachment: any): Observable<any> {

        let url_ = this.baseUrl + "/File/UploadEmailReminderAttachments";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, attachment);
    }

    AddAuditQuestionnaryResponseAttachment(attachment: any): Observable<any> {       
        let url_ = this.baseUrl + "/File/UploadAuditQuestResponseAttachments";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, attachment);
    }

    AddAssessmentQuestionResponseAttachment(attachment: any): Observable<any> {
        let url_ = this.baseUrl + "/File/UploadAssessmentQuestionResponse";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, attachment);
    }

    AddPAPAttachment(attachment: any): Observable<any> {
        let url_ = this.baseUrl + "/File/UploadPAPAttachments";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, attachment);
    }

    AddTTEEntityAttachment(attachment: any): Observable<any> {
        let url_ = this.baseUrl + "/File/UploadTTEENtityAttachment";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, attachment);
    }
    addGlobalFilePAPAttachment(attachment: any): Observable<any> {       
        let url_ = this.baseUrl + "/File/UploadPAPGlobalFileSystems";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, attachment);
    }

}
