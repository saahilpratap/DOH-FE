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
    FileDto
} from "../service-proxies";
import { AnswerOptionDto } from "./question.service";

@Injectable()
export class AssessmentsServiceProxy {
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
        sorting: string | undefined,
        skipCount: number | undefined,
        maxResultCount: number | undefined
    ): Observable<any> {

        
        let url_ = this.baseUrl + "/api/services/app/Assessment/GetAll?";
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
    getAllForLookUp(): Observable<any> {
        let url_ = this.baseUrl + "/api/services/app/Assessment/GetAll?";
        return this.http.get(url_);
    }

    getAllForLookUpByBEId(businessEntityId: number): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/Assessment/GetAll?businessEntityId=";
        url_ += businessEntityId;
        return this.http.get(url_);
    }

    getAllBusinessEntitiesForLookUp(): Observable<any> {
        
        let url_ =
            this.baseUrl +
            "/api/services/app/BusinessEntities/GetAllAuditablesForLookUp?";
        return this.http.get(url_);
    }

    createOrEdit(input: CreateOrEditAssessmentDto): Observable<any> {
        let url_ = this.baseUrl + "/api/services/app/Assessment/CreateOrEdit";
        url_ = url_.replace(/[?&]$/, "");
        const options: any = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const content_ = JSON.stringify(input);
        return this.http.post(url_, content_, options);
    }

    protected processCreateOrEdit(
        response: HttpResponseBase
    ): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse
                ? response.body
                : (<any>response).error instanceof Blob
                ? (<any>response).error
                : undefined;

        let _headers: any = {};
        if (response.headers) {
            for (let key of response.headers.keys()) {
                _headers[key] = response.headers.get(key);
            }
        }
        if (status === 200) {
            return blobToText(responseBlob).pipe(
                _observableMergeMap(_responseText => {
                    return _observableOf<void>(<any>null);
                })
            );
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(
                _observableMergeMap(_responseText => {
                    return throwException(
                        "An unexpected server error occurred.",
                        status,
                        _responseText,
                        _headers
                    );
                })
            );
        }
        return _observableOf<void>(<any>null);
    }

    delete(id: number): Observable<void> {
        return null;
    }

    copyAnswersFromPreviousAssessment(id: number): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/Assessment/GetAssessmentWithPreviousAnswers";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?Id=" + id;
        return this.http.get(url_);
    }

    getAssessmentForEdit(id: number): Observable<any> {
        
        let url_ = this.baseUrl + "/api/services/app/Assessment/GetForEdit";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?Id=" + id;
        return this.http.get(url_);
    }

    getAssessmentQuestionares(id: number): Observable<any> {
        let url_ = this.baseUrl + "/api/services/app/Assessment/GetById";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?Id=" + id;
        return this.http.get(url_);
    }

    saveAssessment(
        assessmentSubmission: AssessmentSubmissionDto
    ): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/Assessment/SaveAssessmentReviews";
        url_ = url_.replace(/[?&]$/, "");
        const options: any = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const content_ = JSON.stringify(assessmentSubmission);
        return this.http.post(url_, content_, options);
    }

    publishAssessment(assessmentId: number): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/Assessment/PublishAssessmentReviews";
        url_ = url_.replace(/[?&]$/, "");
        const options: any = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        var content = {
            id: assessmentId
        };
        var body = JSON.stringify(content);
        return this.http.post(url_, body, options);
    }

    submitAssessment(assessmentId: number): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/Assessment/SubmitAssessment";
        url_ = url_.replace(/[?&]$/, "");
        const options: any = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        var content = {
            id: assessmentId
        };
        var body = JSON.stringify(content);
        return this.http.post(url_, body, options);
    }

    getAssessmentExportToExcel(): Observable<FileDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/Assessment/GetAssessmentExportToExcel";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                Accept: "text/plain"
            })
        };

        return this.http
            .request("get", url_, options_)
            .pipe(
                _observableMergeMap((response_: any) => {
                    return this.processGetAssessmentExportToExcel(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetAssessmentExportToExcel(
                                <any>response_
                            );
                        } catch (e) {
                            return <Observable<FileDto>>(
                                (<any>_observableThrow(e))
                            );
                        }
                    } else
                        return <Observable<FileDto>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processGetAssessmentExportToExcel(
        response: HttpResponseBase
    ): Observable<FileDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse
                ? response.body
                : (<any>response).error instanceof Blob
                ? (<any>response).error
                : undefined;

        let _headers: any = {};
        if (response.headers) {
            for (let key of response.headers.keys()) {
                _headers[key] = response.headers.get(key);
            }
        }
        if (status === 200) {
            return blobToText(responseBlob).pipe(
                _observableMergeMap(_responseText => {
                    let result200: any = null;
                    let resultData200 =
                        _responseText === ""
                            ? null
                            : JSON.parse(_responseText, this.jsonParseReviver);
                    result200 = FileDto.fromJS(resultData200);
                    return _observableOf(result200);
                })
            );
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(
                _observableMergeMap(_responseText => {
                    return throwException(
                        "An unexpected server error occurred.",
                        status,
                        _responseText,
                        _headers
                    );
                })
            );
        }
        return _observableOf<FileDto>(<any>null);
    }

    acceptAgreement(
        signature: string,
        hasAccepted: boolean,
        assessmentId: number
    ): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/Assessment/AcceptAgreementTerms";
        url_ = url_.replace(/[?&]$/, "");
        const options: any = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        var content = {
            signature: signature,
            hasAccepted: hasAccepted,
            assessmentId: assessmentId
        };
        var body = JSON.stringify(content);
        return this.http.post(url_, body, options);
    }

    approveAssessment(assessmentId: number): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/Assessment/ApproveAssessment";
        url_ = url_.replace(/[?&]$/, "");
        const options: any = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        var content = {
            assessmentId: assessmentId
        };
        var body = JSON.stringify(content);
        return this.http.post(url_, body, options);
    }

    requestClarification(assessmentId: number): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/Assessment/RequestClarification";
        url_ = url_.replace(/[?&]$/, "");
        const options: any = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        var content = {
            id: assessmentId
        };
        var body = JSON.stringify(content);
        return this.http.post(url_, body, options);
    }

    addAttachment(reviewDataId: number, file: any): Observable<any> {
        let url_ = this.baseUrl + "/File/UploadReviewAttachment";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, file);
    }
    addAttachmentToQuestion(
        reviewQuestionId: number,
        file: any
    ): Observable<any> {
        let url_ = this.baseUrl + "/File/UploadQuestionAttachment";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, file);
    }

    downloadAttachment(code: string) {
        if (code == "") return;
        let url_ = this.baseUrl + "/File/Download";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?file=" + code;
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.href = url_;
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);
    }
}

@Injectable()
export class ExternalAssessmentsServiceProxy {
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
        sorting: string | undefined,
        skipCount: number | undefined,
        maxResultCount: number | undefined
    ): Observable<any> {
        
        let url_ =
            this.baseUrl + "/api/services/app/ExternalAssessments/GetAll?";
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

    createOrEdit(
        externalAssessment: CreateOrEditExternalAssessmentDto
    ): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/ExternalAssessments/CreateOrEdit";
        url_ = url_.replace(/[?&]$/, "");
        const options: any = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const content_ = JSON.stringify(externalAssessment);
        return this.http.post(url_, content_, options);
    }

    getExternalAssessmentForEdit(id: number): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/ExternalAssessments/GetExternalAssessmentForEdit";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?Id=" + id;
        return this.http.get(url_);
    }

    generateQuestionaire(id: number): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/ExternalAssessments/GenerateQuestionaire";
        url_ = url_.replace(/[?&]$/, "");
        const options: any = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        var content = {
            id: id
        };
        const content_ = JSON.stringify(content);
        return this.http.post(url_, content_, options);
    }

    getQuestionaire(id: number): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/ExternalAssessments/GetQuestionaire?Id=";
        return this.http.get(url_ + id);
    }

    saveAssessment(
        assessmentSubmission: AssessmentSubmissionDto
    ): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/ExternalAssessments/SaveAssessmentReviews";
        url_ = url_.replace(/[?&]$/, "");
        const options: any = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const content_ = JSON.stringify(assessmentSubmission);
        return this.http.post(url_, content_, options);
    }

}

export interface IAssessmentSubmissionDto {
    assessmentId: number;
    reviews: ReviewDataItem[];
}

export class AssessmentSubmissionDto implements IAssessmentSubmissionDto {
    assessmentId: number;
    reviews: ReviewDataItem[];
}
export class ReviewDataItem {
    id: number;
    comment: string;
    clarification: string;
    reviewDataResponseType: ReviewDataResponseType;
    questions: FilledQuestionDto[];
}

export class FilledQuestionDto {
    constructor(
        questionId: number,
        selectedAnswerOptionId: number,
        comment: string
    ) {
        this.questionId = questionId;
        this.selectedAnswerOptionId = selectedAnswerOptionId;
        this.comment = comment;
    }
    questionId: number;
    selectedAnswerOptionId: number;
    comment: string;
}
export interface CreateOrEditAssessmentDto {
    id: number;
    name: string;
    businessEntityIds: number[];
    reportingDate: Date;
    assessmentDate: Date;
    authoritativeDocumentId: number;
    infoText: string;
    sendEmailNotification: string;
    sendSmsNotification: string;
    type: AssessmentType;
    feedback: string;
    authoritativeDocumentName: string;
}

export enum AssessmentType {
    SelfAssessment = 1,
    ExternalAssessor
}
export enum ReviewDataResponseType {
    NotSelected = 0,
    NotApplicable,
    NonCompliant,
    PartiallyCompliant,
    FullyCompliant
}

export enum AssessmentStatus {
    Initialized = 1,
    InReview,
    SentToAuthority,
    Approved,
    NeedsClarification
}

export interface AssessmentWithQuestionaireDto {
    reportingDate: Date;
    name: string;
    status: AssessmentStatus;
    assessmentType: AssessmentType;
    Feedback: string;
    businessEntityName: string;
    reviewScore: number;
    authorityDocumentName: number;
    reviews: ReviewDto[];
}
export interface ReviewDto {
    id: number;
    assessmentName: string;
    controlRequirementOriginalId: number;
    controlRequirementDescription: string;
    controlRequirementDomainName: string;
    type: ReviewDataResponseType;
    responseType: any;
    responseTypes: any[];
    comment: string;
    clarification: string;
    additionalComment: string;
    isExpanded: boolean;
    responseClassName: string;
    isChangedSinceLastResponse: boolean;
    lastResponseType: ReviewDataResponseType;
    attachments: AttachmentDto[];
    reviewQuestions: ReviewQuestionDto[];
}

export class ReviewQuestionDto {
    id: number;
    questionId: number;
    questionName: string;
    questionDescription: string;
    comment: string;
    answerOptions: AnswerOptionDto[];
    selectedAnswerOptionId: number;
    selectedAnswerOption: any;
    selectedAnswerOptions: any[];
    attachments: AttachmentDto[];
}

export class AttachmentDto {
    constructor(code: string, fileName: string) {
        this.code = code;
        this.fileName = fileName;
    }
    code: string;
    fileName: string;
}
export class AssessmentDto extends EntityDto {
    reportingDate: Date;
    name: string;
    assessmentType: AssessmentType;
    Feedback: string;
    businessEntityName: string;
    reviewScore: number;
    authorityDocumentName: number;
}

export enum ExternalAssessmentType {
    Anual,
    Quarterly,
    OnDemand
}
export interface CreateOrEditExternalAssessmentDto {
    id: number;
    code: string;
    name: string;
    type: ExternalAssessmentType;
    authoritativeDocumentIds: number[];
    fiscalYear: Date;
    startDate: Date;
    endDate: Date;
    vendorId: number;
    leadAssessorId: number;
    businessEntityId: number;
    BusinessEntityLeadAssessorId: number;
}

export interface ExternalAssessmentDto {
    name: string;
    startDate: Date;
    endDate: Date;
    type: ExternalAssessmentType;
    businessEntityName: string;
}

export interface GetExternalAssessmentForEditOutput {
    externalAssessment: CreateOrEditExternalAssessmentDto;
}

function throwException(
    message: string,
    status: number,
    response: string,
    headers: { [key: string]: any },
    result?: any
): Observable<any> {
    if (result !== null && result !== undefined)
        return _observableThrow(result);
    else
        return _observableThrow(
            new ApiException(message, status, response, headers, null)
        );
}

function blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: any) => {
        if (!blob) {
            observer.next("");
            observer.complete();
        } else {
            let reader = new FileReader();
            reader.onload = event => {
                observer.next((<any>event.target).result);
                observer.complete();
            };
            reader.readAsText(blob);
        }
    });
}
