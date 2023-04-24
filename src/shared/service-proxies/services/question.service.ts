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
import { AnyARecord } from "dns";

@Injectable()
export class QuestionsServiceProxy {
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

    getQuestionForEdit(id: number): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/Questions/GetQuestionForEdit";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?id=" + id;
        return this.http.get(url_);
    }

    createOrEdit(question: CreateOrEditQuestionDto): Observable<any> {
        let url_ = this.baseUrl + "/api/services/app/Questions/CreateOrEdit";
        url_ = url_.replace(/[?&]$/, "");
        const options: any = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        var body = JSON.stringify(question);
        return this.http.post(url_, body, options);
    }

    getToExcel(): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/Questions/GetQuestionsToExcel";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                Accept: "text/plain"
            })
        };
        return this.http.get(url_);
    }
    Import(formData: any): Observable<any> {
        let url_ = this.baseUrl + "/api/services/app/Questions/ImportQuestions";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, formData);
    }

    delete(id: number): Observable<any> {
        return null;
    }

    getAll(
        sorting: string | undefined,
        skipCount: number | undefined,
        maxResultCount: number | undefined
    ): Observable<any> {
        let url_ = this.baseUrl + "/api/services/app/Questions/GetAll?";
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
        url_ = url_.replace(/[?&]$/, "");
        return this.http.get(url_);
    }
}
export class CreateOrEditQuestionDto implements ICreateOrEditQuestionDto {
    constructor() {
        this.answerOptions = [];
    }
    id: number;
    name: string;
    code: string;
    description: string;
    answerType: AnswerType;
    answerOptions: AnswerOptionDto[];
}
export interface ICreateOrEditQuestionDto {
    id: number;
    name: string;
    code: string;
    description: string;
    answerType: AnswerType;
    answerOptions: AnswerOptionDto[];
}

export class QuestionDto {
    id: number;
    code: string;
    name: string;
    description: string;
}

export enum AnswerType {
    List = 1,
    Logical
}

export class AnswerOptionDto {
    constructor(value: string, score: number) {
        this.value = value;
        this.score = score;
    }
    id: number;
    value: string;
    score: number;
}
