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

@Injectable()
export class IncidentTypesServiceProxy {
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

    /**
     * @param filter (optional)
     * @param nameFilter (optional)
     * @param sorting (optional)
     * @param skipCount (optional)
     * @param maxResultCount (optional)
     * @return Success
     */
    getAll(
        filter: string | undefined,
        nameFilter: string | undefined,
        sorting: string | undefined,
        skipCount: number | undefined,
        maxResultCount: number | undefined
    ): Observable<PagedResultDtoOfGetIncidentTypeForViewDto> {
        let url_ = this.baseUrl + "/api/services/app/IncidentTypes/GetAll?";
        if (filter === null)
            throw new Error("The parameter 'filter' cannot be null.");
        else if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&";
        if (nameFilter === null)
            throw new Error("The parameter 'nameFilter' cannot be null.");
        else if (nameFilter !== undefined)
            url_ += "NameFilter=" + encodeURIComponent("" + nameFilter) + "&";
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
                    return this.processGetAll(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetAll(<any>response_);
                        } catch (e) {
                            return <
                                Observable<
                                    PagedResultDtoOfGetIncidentTypeForViewDto
                                >
                            >(<any>_observableThrow(e));
                        }
                    } else
                        return <
                            Observable<
                                PagedResultDtoOfGetIncidentTypeForViewDto
                            >
                        >(<any>_observableThrow(response_));
                })
            );
    }

    protected processGetAll(
        response: HttpResponseBase
    ): Observable<PagedResultDtoOfGetIncidentTypeForViewDto> {
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
                    result200 = PagedResultDtoOfGetIncidentTypeForViewDto.fromJS(
                        resultData200
                    );
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
        return _observableOf<PagedResultDtoOfGetIncidentTypeForViewDto>(
            <any>null
        );
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getIncidentTypeForView(
        id: number | undefined
    ): Observable<GetIncidentTypeForViewDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/IncidentTypes/GetIncidentTypeForView?";
        if (id === null) throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "id=" + encodeURIComponent("" + id) + "&";
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
                    return this.processGetIncidentTypeForView(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetIncidentTypeForView(
                                <any>response_
                            );
                        } catch (e) {
                            return <Observable<GetIncidentTypeForViewDto>>(
                                (<any>_observableThrow(e))
                            );
                        }
                    } else
                        return <Observable<GetIncidentTypeForViewDto>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processGetIncidentTypeForView(
        response: HttpResponseBase
    ): Observable<GetIncidentTypeForViewDto> {
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
                    result200 = GetIncidentTypeForViewDto.fromJS(resultData200);
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
        return _observableOf<GetIncidentTypeForViewDto>(<any>null);
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getIncidentTypeForEdit(
        id: number | undefined
    ): Observable<GetIncidentTypeForEditOutput> {
        let url_ =
            this.baseUrl +
            "/api/services/app/IncidentTypes/GetIncidentTypeForEdit?";
        if (id === null) throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "Id=" + encodeURIComponent("" + id) + "&";
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
                    return this.processGetIncidentTypeForEdit(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetIncidentTypeForEdit(
                                <any>response_
                            );
                        } catch (e) {
                            return <Observable<GetIncidentTypeForEditOutput>>(
                                (<any>_observableThrow(e))
                            );
                        }
                    } else
                        return <Observable<GetIncidentTypeForEditOutput>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processGetIncidentTypeForEdit(
        response: HttpResponseBase
    ): Observable<GetIncidentTypeForEditOutput> {
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
                    result200 = GetIncidentTypeForEditOutput.fromJS(
                        resultData200
                    );
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
        return _observableOf<GetIncidentTypeForEditOutput>(<any>null);
    }

    /**
     * @param body (optional)
     * @return Success
     */
    createOrEdit(
        body: CreateOrEditIncidentTypeDto | undefined
    ): Observable<void> {
        let url_ =
            this.baseUrl + "/api/services/app/IncidentTypes/CreateOrEdit";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json"
            })
        };

        return this.http
            .request("post", url_, options_)
            .pipe(
                _observableMergeMap((response_: any) => {
                    return this.processCreateOrEdit(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processCreateOrEdit(<any>response_);
                        } catch (e) {
                            return <Observable<void>>(<any>_observableThrow(e));
                        }
                    } else
                        return <Observable<void>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
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

    /**
     * @param id (optional)
     * @return Success
     */
    delete(id: number | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/services/app/IncidentTypes/Delete?";
        if (id === null) throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "Id=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({})
        };

        return this.http
            .request("delete", url_, options_)
            .pipe(
                _observableMergeMap((response_: any) => {
                    return this.processDelete(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processDelete(<any>response_);
                        } catch (e) {
                            return <Observable<void>>(<any>_observableThrow(e));
                        }
                    } else
                        return <Observable<void>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processDelete(response: HttpResponseBase): Observable<void> {
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

    /**
     * @param filter (optional)
     * @param nameFilter (optional)
     * @return Success
     */
    getIncidentTypesToExcel(
        filter: string | undefined,
        nameFilter: string | undefined
    ): Observable<FileDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/IncidentTypes/GetIncidentTypesToExcel?";
        if (filter === null)
            throw new Error("The parameter 'filter' cannot be null.");
        else if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&";
        if (nameFilter === null)
            throw new Error("The parameter 'nameFilter' cannot be null.");
        else if (nameFilter !== undefined)
            url_ += "NameFilter=" + encodeURIComponent("" + nameFilter) + "&";
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
                    return this.processGetIncidentTypesToExcel(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetIncidentTypesToExcel(
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

    protected processGetIncidentTypesToExcel(
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
}

@Injectable()
export class IncidentImpactsServiceProxy {
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

    /**
     * @param filter (optional)
     * @param nameFilter (optional)
     * @param sorting (optional)
     * @param skipCount (optional)
     * @param maxResultCount (optional)
     * @return Success
     */
    getAll(
        filter: string | undefined,
        nameFilter: string | undefined,
        sorting: string | undefined,
        skipCount: number | undefined,
        maxResultCount: number | undefined
    ): Observable<PagedResultDtoOfGetIncidentImpactForViewDto> {
        let url_ = this.baseUrl + "/api/services/app/IncidentImpacts/GetAll?";
        if (filter === null)
            throw new Error("The parameter 'filter' cannot be null.");
        else if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&";
        if (nameFilter === null)
            throw new Error("The parameter 'nameFilter' cannot be null.");
        else if (nameFilter !== undefined)
            url_ += "NameFilter=" + encodeURIComponent("" + nameFilter) + "&";
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
                    return this.processGetAll(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetAll(<any>response_);
                        } catch (e) {
                            return <
                                Observable<
                                    PagedResultDtoOfGetIncidentImpactForViewDto
                                >
                            >(<any>_observableThrow(e));
                        }
                    } else
                        return <
                            Observable<
                                PagedResultDtoOfGetIncidentImpactForViewDto
                            >
                        >(<any>_observableThrow(response_));
                })
            );
    }

    protected processGetAll(
        response: HttpResponseBase
    ): Observable<PagedResultDtoOfGetIncidentImpactForViewDto> {
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
                    result200 = PagedResultDtoOfGetIncidentImpactForViewDto.fromJS(
                        resultData200
                    );
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
        return _observableOf<PagedResultDtoOfGetIncidentImpactForViewDto>(
            <any>null
        );
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getIncidentImpactForView(
        id: number | undefined
    ): Observable<GetIncidentImpactForViewDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/IncidentImpacts/GetIncidentImpactForView?";
        if (id === null) throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "id=" + encodeURIComponent("" + id) + "&";
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
                    return this.processGetIncidentImpactForView(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetIncidentImpactForView(
                                <any>response_
                            );
                        } catch (e) {
                            return <Observable<GetIncidentImpactForViewDto>>(
                                (<any>_observableThrow(e))
                            );
                        }
                    } else
                        return <Observable<GetIncidentImpactForViewDto>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processGetIncidentImpactForView(
        response: HttpResponseBase
    ): Observable<GetIncidentImpactForViewDto> {
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
                    result200 = GetIncidentImpactForViewDto.fromJS(
                        resultData200
                    );
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
        return _observableOf<GetIncidentImpactForViewDto>(<any>null);
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getIncidentImpactForEdit(
        id: number | undefined
    ): Observable<GetIncidentImpactForEditOutput> {
        let url_ =
            this.baseUrl +
            "/api/services/app/IncidentImpacts/GetIncidentImpactForEdit?";
        if (id === null) throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "Id=" + encodeURIComponent("" + id) + "&";
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
                    return this.processGetIncidentImpactForEdit(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetIncidentImpactForEdit(
                                <any>response_
                            );
                        } catch (e) {
                            return <Observable<GetIncidentImpactForEditOutput>>(
                                (<any>_observableThrow(e))
                            );
                        }
                    } else
                        return <Observable<GetIncidentImpactForEditOutput>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processGetIncidentImpactForEdit(
        response: HttpResponseBase
    ): Observable<GetIncidentImpactForEditOutput> {
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
                    result200 = GetIncidentImpactForEditOutput.fromJS(
                        resultData200
                    );
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
        return _observableOf<GetIncidentImpactForEditOutput>(<any>null);
    }

    /**
     * @param body (optional)
     * @return Success
     */
    createOrEdit(
        body: CreateOrEditIncidentImpactDto | undefined
    ): Observable<void> {
        let url_ =
            this.baseUrl + "/api/services/app/IncidentImpacts/CreateOrEdit";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json"
            })
        };

        return this.http
            .request("post", url_, options_)
            .pipe(
                _observableMergeMap((response_: any) => {
                    return this.processCreateOrEdit(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processCreateOrEdit(<any>response_);
                        } catch (e) {
                            return <Observable<void>>(<any>_observableThrow(e));
                        }
                    } else
                        return <Observable<void>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
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

    /**
     * @param id (optional)
     * @return Success
     */
    delete(id: number | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/services/app/IncidentImpacts/Delete?";
        if (id === null) throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "Id=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({})
        };

        return this.http
            .request("delete", url_, options_)
            .pipe(
                _observableMergeMap((response_: any) => {
                    return this.processDelete(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processDelete(<any>response_);
                        } catch (e) {
                            return <Observable<void>>(<any>_observableThrow(e));
                        }
                    } else
                        return <Observable<void>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processDelete(response: HttpResponseBase): Observable<void> {
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

    /**
     * @param filter (optional)
     * @param nameFilter (optional)
     * @return Success
     */
    getIncidentImpactsToExcel(
        filter: string | undefined,
        nameFilter: string | undefined
    ): Observable<FileDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/IncidentImpacts/GetIncidentImpactsToExcel?";
        if (filter === null)
            throw new Error("The parameter 'filter' cannot be null.");
        else if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&";
        if (nameFilter === null)
            throw new Error("The parameter 'nameFilter' cannot be null.");
        else if (nameFilter !== undefined)
            url_ += "NameFilter=" + encodeURIComponent("" + nameFilter) + "&";
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
                    return this.processGetIncidentImpactsToExcel(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetIncidentImpactsToExcel(
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

    protected processGetIncidentImpactsToExcel(
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
}

export class IncidentTypeDto implements IIncidentTypeDto {
    name!: string | undefined;
    id!: number;

    constructor(data?: IIncidentTypeDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.name = data["name"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): IncidentTypeDto {
        data = typeof data === "object" ? data : {};
        let result = new IncidentTypeDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["name"] = this.name;
        data["id"] = this.id;
        return data;
    }
}

export interface IIncidentTypeDto {
    name: string | undefined;
    id: number;
}

export class GetIncidentTypeForViewDto implements IGetIncidentTypeForViewDto {
    incidentType!: IncidentTypeDto;

    constructor(data?: IGetIncidentTypeForViewDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.incidentType = data["incidentType"]
                ? IncidentTypeDto.fromJS(data["incidentType"])
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetIncidentTypeForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new GetIncidentTypeForViewDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["incidentType"] = this.incidentType
            ? this.incidentType.toJSON()
            : <any>undefined;
        return data;
    }
}

export interface IGetIncidentTypeForViewDto {
    incidentType: IncidentTypeDto;
}

export class PagedResultDtoOfGetIncidentTypeForViewDto
    implements IPagedResultDtoOfGetIncidentTypeForViewDto {
    totalCount!: number;
    items!: GetIncidentTypeForViewDto[] | undefined;

    constructor(data?: IPagedResultDtoOfGetIncidentTypeForViewDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.totalCount = data["totalCount"];
            if (Array.isArray(data["items"])) {
                this.items = [] as any;
                for (let item of data["items"])
                    this.items!.push(GetIncidentTypeForViewDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfGetIncidentTypeForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new PagedResultDtoOfGetIncidentTypeForViewDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["totalCount"] = this.totalCount;
        if (Array.isArray(this.items)) {
            data["items"] = [];
            for (let item of this.items) data["items"].push(item.toJSON());
        }
        return data;
    }
}

export interface IPagedResultDtoOfGetIncidentTypeForViewDto {
    totalCount: number;
    items: GetIncidentTypeForViewDto[] | undefined;
}

export class CreateOrEditIncidentTypeDto
    implements ICreateOrEditIncidentTypeDto {
    name!: string | undefined;
    id!: number | undefined;

    constructor(data?: ICreateOrEditIncidentTypeDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.name = data["name"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): CreateOrEditIncidentTypeDto {
        data = typeof data === "object" ? data : {};
        let result = new CreateOrEditIncidentTypeDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["name"] = this.name;
        data["id"] = this.id;
        return data;
    }
}

export interface ICreateOrEditIncidentTypeDto {
    name: string | undefined;
    id: number | undefined;
}

export class GetIncidentTypeForEditOutput
    implements IGetIncidentTypeForEditOutput {
    incidentType!: CreateOrEditIncidentTypeDto;

    constructor(data?: IGetIncidentTypeForEditOutput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.incidentType = data["incidentType"]
                ? CreateOrEditIncidentTypeDto.fromJS(data["incidentType"])
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetIncidentTypeForEditOutput {
        data = typeof data === "object" ? data : {};
        let result = new GetIncidentTypeForEditOutput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["incidentType"] = this.incidentType
            ? this.incidentType.toJSON()
            : <any>undefined;
        return data;
    }
}

export interface IGetIncidentTypeForEditOutput {
    incidentType: CreateOrEditIncidentTypeDto;
}

export class IncidentImpactDto implements IIncidentImpactDto {
    name!: string | undefined;
    id!: number;

    constructor(data?: IIncidentImpactDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.name = data["name"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): IncidentImpactDto {
        data = typeof data === "object" ? data : {};
        let result = new IncidentImpactDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["name"] = this.name;
        data["id"] = this.id;
        return data;
    }
}

export interface IIncidentImpactDto {
    name: string | undefined;
    id: number;
}

export class GetIncidentImpactForViewDto
    implements IGetIncidentImpactForViewDto {
    incidentImpact!: IncidentImpactDto;

    constructor(data?: IGetIncidentImpactForViewDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.incidentImpact = data["incidentImpact"]
                ? IncidentImpactDto.fromJS(data["incidentImpact"])
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetIncidentImpactForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new GetIncidentImpactForViewDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["incidentImpact"] = this.incidentImpact
            ? this.incidentImpact.toJSON()
            : <any>undefined;
        return data;
    }
}

export interface IGetIncidentImpactForViewDto {
    incidentImpact: IncidentImpactDto;
}

export class PagedResultDtoOfGetIncidentImpactForViewDto
    implements IPagedResultDtoOfGetIncidentImpactForViewDto {
    totalCount!: number;
    items!: GetIncidentImpactForViewDto[] | undefined;

    constructor(data?: IPagedResultDtoOfGetIncidentImpactForViewDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.totalCount = data["totalCount"];
            if (Array.isArray(data["items"])) {
                this.items = [] as any;
                for (let item of data["items"])
                    this.items!.push(GetIncidentImpactForViewDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfGetIncidentImpactForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new PagedResultDtoOfGetIncidentImpactForViewDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["totalCount"] = this.totalCount;
        if (Array.isArray(this.items)) {
            data["items"] = [];
            for (let item of this.items) data["items"].push(item.toJSON());
        }
        return data;
    }
}

export interface IPagedResultDtoOfGetIncidentImpactForViewDto {
    totalCount: number;
    items: GetIncidentImpactForViewDto[] | undefined;
}

export class CreateOrEditIncidentImpactDto
    implements ICreateOrEditIncidentImpactDto {
    name!: string | undefined;
    id!: number | undefined;

    constructor(data?: ICreateOrEditIncidentImpactDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.name = data["name"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): CreateOrEditIncidentImpactDto {
        data = typeof data === "object" ? data : {};
        let result = new CreateOrEditIncidentImpactDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["name"] = this.name;
        data["id"] = this.id;
        return data;
    }
}

export interface ICreateOrEditIncidentImpactDto {
    name: string | undefined;
    id: number | undefined;
}

export class GetIncidentImpactForEditOutput
    implements IGetIncidentImpactForEditOutput {
    incidentImpact!: CreateOrEditIncidentImpactDto;

    constructor(data?: IGetIncidentImpactForEditOutput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.incidentImpact = data["incidentImpact"]
                ? CreateOrEditIncidentImpactDto.fromJS(data["incidentImpact"])
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetIncidentImpactForEditOutput {
        data = typeof data === "object" ? data : {};
        let result = new GetIncidentImpactForEditOutput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["incidentImpact"] = this.incidentImpact
            ? this.incidentImpact.toJSON()
            : <any>undefined;
        return data;
    }
}

export interface IGetIncidentImpactForEditOutput {
    incidentImpact: CreateOrEditIncidentImpactDto;
}
