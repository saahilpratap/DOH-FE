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
export class ContactTypesServiceProxy {
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
    ): Observable<PagedResultDtoOfGetContactTypeForViewDto> {
        let url_ = this.baseUrl + "/api/services/app/ContactTypes/GetAll?";
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
                                    PagedResultDtoOfGetContactTypeForViewDto
                                >
                            >(<any>_observableThrow(e));
                        }
                    } else
                        return <
                            Observable<PagedResultDtoOfGetContactTypeForViewDto>
                        >(<any>_observableThrow(response_));
                })
            );
    }
    getAllForLookUp(): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/ContactTypes/GetAllForLookUp";
        url_ = url_.replace(/[?&]$/, "");

        return this.http.get(url_);
    }

    protected processGetAll(
        response: HttpResponseBase
    ): Observable<PagedResultDtoOfGetContactTypeForViewDto> {
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
                    result200 = PagedResultDtoOfGetContactTypeForViewDto.fromJS(
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
        return _observableOf<PagedResultDtoOfGetContactTypeForViewDto>(
            <any>null
        );
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getContactTypeForView(
        id: number | undefined
    ): Observable<GetContactTypeForViewDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/ContactTypes/GetContactTypeForView?";
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
                    return this.processGetContactTypeForView(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetContactTypeForView(
                                <any>response_
                            );
                        } catch (e) {
                            return <Observable<GetContactTypeForViewDto>>(
                                (<any>_observableThrow(e))
                            );
                        }
                    } else
                        return <Observable<GetContactTypeForViewDto>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processGetContactTypeForView(
        response: HttpResponseBase
    ): Observable<GetContactTypeForViewDto> {
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
                    result200 = GetContactTypeForViewDto.fromJS(resultData200);
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
        return _observableOf<GetContactTypeForViewDto>(<any>null);
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getContactTypeForEdit(
        id: number | undefined
    ): Observable<GetContactTypeForEditOutput> {
        let url_ =
            this.baseUrl +
            "/api/services/app/ContactTypes/GetContactTypeForEdit?";
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
                    return this.processGetContactTypeForEdit(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetContactTypeForEdit(
                                <any>response_
                            );
                        } catch (e) {
                            return <Observable<GetContactTypeForEditOutput>>(
                                (<any>_observableThrow(e))
                            );
                        }
                    } else
                        return <Observable<GetContactTypeForEditOutput>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processGetContactTypeForEdit(
        response: HttpResponseBase
    ): Observable<GetContactTypeForEditOutput> {
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
                    result200 = GetContactTypeForEditOutput.fromJS(
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
        return _observableOf<GetContactTypeForEditOutput>(<any>null);
    }

    /**
     * @param body (optional)
     * @return Success
     */
    createOrEdit(
        body: CreateOrEditContactTypeDto | undefined
    ): Observable<void> {
        let url_ = this.baseUrl + "/api/services/app/ContactTypes/CreateOrEdit";
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
        let url_ = this.baseUrl + "/api/services/app/ContactTypes/Delete?";
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
    getContactTypesToExcel(
        filter: string | undefined,
        nameFilter: string | undefined
    ): Observable<FileDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/ContactTypes/GetContactTypesToExcel?";
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
                    return this.processGetContactTypesToExcel(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetContactTypesToExcel(
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

    protected processGetContactTypesToExcel(
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
export class ContactsServiceProxy {
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
     * @param codeFilter (optional)
     * @param firstNameFilter (optional)
     * @param lastNameFilter (optional)
     * @param jobTitleFilter (optional)
     * @param mobileFilter (optional)
     * @param directPhoneFilter (optional)
     * @param sorting (optional)
     * @param skipCount (optional)
     * @param maxResultCount (optional)
     * @return Success
     */
    getAll(
        filter: string | undefined,
        codeFilter: string | undefined,
        firstNameFilter: string | undefined,
        lastNameFilter: string | undefined,
        jobTitleFilter: string | undefined,
        mobileFilter: string | undefined,
        directPhoneFilter: string | undefined,
        sorting: string | undefined,
        skipCount: number | undefined,
        maxResultCount: number | undefined
    ): Observable<PagedResultDtoOfGetContactForViewDto> {
        let url_ = this.baseUrl + "/api/services/app/Contacts/GetAll?";
        if (filter === null)
            throw new Error("The parameter 'filter' cannot be null.");
        else if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&";
        if (codeFilter === null)
            throw new Error("The parameter 'codeFilter' cannot be null.");
        else if (codeFilter !== undefined)
            url_ += "CodeFilter=" + encodeURIComponent("" + codeFilter) + "&";
        if (firstNameFilter === null)
            throw new Error("The parameter 'firstNameFilter' cannot be null.");
        else if (firstNameFilter !== undefined)
            url_ +=
                "FirstNameFilter=" +
                encodeURIComponent("" + firstNameFilter) +
                "&";
        if (lastNameFilter === null)
            throw new Error("The parameter 'lastNameFilter' cannot be null.");
        else if (lastNameFilter !== undefined)
            url_ +=
                "LastNameFilter=" +
                encodeURIComponent("" + lastNameFilter) +
                "&";
        if (jobTitleFilter === null)
            throw new Error("The parameter 'jobTitleFilter' cannot be null.");
        else if (jobTitleFilter !== undefined)
            url_ +=
                "JobTitleFilter=" +
                encodeURIComponent("" + jobTitleFilter) +
                "&";
        if (mobileFilter === null)
            throw new Error("The parameter 'mobileFilter' cannot be null.");
        else if (mobileFilter !== undefined)
            url_ +=
                "MobileFilter=" + encodeURIComponent("" + mobileFilter) + "&";
        if (directPhoneFilter === null)
            throw new Error(
                "The parameter 'directPhoneFilter' cannot be null."
            );
        else if (directPhoneFilter !== undefined)
            url_ +=
                "DirectPhoneFilter=" +
                encodeURIComponent("" + directPhoneFilter) +
                "&";
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
                                Observable<PagedResultDtoOfGetContactForViewDto>
                            >(<any>_observableThrow(e));
                        }
                    } else
                        return <
                            Observable<PagedResultDtoOfGetContactForViewDto>
                        >(<any>_observableThrow(response_));
                })
            );
    }

    protected processGetAll(
        response: HttpResponseBase
    ): Observable<PagedResultDtoOfGetContactForViewDto> {
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
                    result200 = PagedResultDtoOfGetContactForViewDto.fromJS(
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
        return _observableOf<PagedResultDtoOfGetContactForViewDto>(<any>null);
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getContactForView(
        id: number | undefined
    ): Observable<GetContactForViewDto> {
        let url_ =
            this.baseUrl + "/api/services/app/Contacts/GetContactForView?";
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
                    return this.processGetContactForView(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetContactForView(
                                <any>response_
                            );
                        } catch (e) {
                            return <Observable<GetContactForViewDto>>(
                                (<any>_observableThrow(e))
                            );
                        }
                    } else
                        return <Observable<GetContactForViewDto>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processGetContactForView(
        response: HttpResponseBase
    ): Observable<GetContactForViewDto> {
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
                    result200 = GetContactForViewDto.fromJS(resultData200);
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
        return _observableOf<GetContactForViewDto>(<any>null);
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getContactForEdit(
        id: number | undefined
    ): Observable<GetContactForEditOutput> {
        let url_ =
            this.baseUrl + "/api/services/app/Contacts/GetContactForEdit?";
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
                    return this.processGetContactForEdit(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetContactForEdit(
                                <any>response_
                            );
                        } catch (e) {
                            return <Observable<GetContactForEditOutput>>(
                                (<any>_observableThrow(e))
                            );
                        }
                    } else
                        return <Observable<GetContactForEditOutput>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processGetContactForEdit(
        response: HttpResponseBase
    ): Observable<GetContactForEditOutput> {
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
                    result200 = GetContactForEditOutput.fromJS(resultData200);
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
        return _observableOf<GetContactForEditOutput>(<any>null);
    }

    /**
     * @param body (optional)
     * @return Success
     */
    createOrEdit(body: CreateOrEditContactDto | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/services/app/Contacts/CreateOrEdit";
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
        let url_ = this.baseUrl + "/api/services/app/Contacts/Delete?";
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
     * @param codeFilter (optional)
     * @param firstNameFilter (optional)
     * @param lastNameFilter (optional)
     * @param jobTitleFilter (optional)
     * @param mobileFilter (optional)
     * @param directPhoneFilter (optional)
     * @return Success
     */
    getContactsToExcel(
        filter: string | undefined,
        codeFilter: string | undefined,
        firstNameFilter: string | undefined,
        lastNameFilter: string | undefined,
        jobTitleFilter: string | undefined,
        mobileFilter: string | undefined,
        directPhoneFilter: string | undefined
    ): Observable<FileDto> {
        let url_ =
            this.baseUrl + "/api/services/app/Contacts/GetContactsToExcel?";
        if (filter === null)
            throw new Error("The parameter 'filter' cannot be null.");
        else if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&";
        if (codeFilter === null)
            throw new Error("The parameter 'codeFilter' cannot be null.");
        else if (codeFilter !== undefined)
            url_ += "CodeFilter=" + encodeURIComponent("" + codeFilter) + "&";
        if (firstNameFilter === null)
            throw new Error("The parameter 'firstNameFilter' cannot be null.");
        else if (firstNameFilter !== undefined)
            url_ +=
                "FirstNameFilter=" +
                encodeURIComponent("" + firstNameFilter) +
                "&";
        if (lastNameFilter === null)
            throw new Error("The parameter 'lastNameFilter' cannot be null.");
        else if (lastNameFilter !== undefined)
            url_ +=
                "LastNameFilter=" +
                encodeURIComponent("" + lastNameFilter) +
                "&";
        if (jobTitleFilter === null)
            throw new Error("The parameter 'jobTitleFilter' cannot be null.");
        else if (jobTitleFilter !== undefined)
            url_ +=
                "JobTitleFilter=" +
                encodeURIComponent("" + jobTitleFilter) +
                "&";
        if (mobileFilter === null)
            throw new Error("The parameter 'mobileFilter' cannot be null.");
        else if (mobileFilter !== undefined)
            url_ +=
                "MobileFilter=" + encodeURIComponent("" + mobileFilter) + "&";
        if (directPhoneFilter === null)
            throw new Error(
                "The parameter 'directPhoneFilter' cannot be null."
            );
        else if (directPhoneFilter !== undefined)
            url_ +=
                "DirectPhoneFilter=" +
                encodeURIComponent("" + directPhoneFilter) +
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
                    return this.processGetContactsToExcel(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetContactsToExcel(
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

    protected processGetContactsToExcel(
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

export class ContactTypeDto implements IContactTypeDto {
    name!: string | undefined;
    id!: number;

    constructor(data?: IContactTypeDto) {
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

    static fromJS(data: any): ContactTypeDto {
        data = typeof data === "object" ? data : {};
        let result = new ContactTypeDto();
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

export interface IContactTypeDto {
    name: string | undefined;
    id: number;
}

export class GetContactTypeForViewDto implements IGetContactTypeForViewDto {
    contactType!: ContactTypeDto;

    constructor(data?: IGetContactTypeForViewDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.contactType = data["contactType"]
                ? ContactTypeDto.fromJS(data["contactType"])
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetContactTypeForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new GetContactTypeForViewDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["contactType"] = this.contactType
            ? this.contactType.toJSON()
            : <any>undefined;
        return data;
    }
}

export interface IGetContactTypeForViewDto {
    contactType: ContactTypeDto;
}

export class PagedResultDtoOfGetContactTypeForViewDto
    implements IPagedResultDtoOfGetContactTypeForViewDto {
    totalCount!: number;
    items!: GetContactTypeForViewDto[] | undefined;

    constructor(data?: IPagedResultDtoOfGetContactTypeForViewDto) {
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
                    this.items!.push(GetContactTypeForViewDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfGetContactTypeForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new PagedResultDtoOfGetContactTypeForViewDto();
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

export interface IPagedResultDtoOfGetContactTypeForViewDto {
    totalCount: number;
    items: GetContactTypeForViewDto[] | undefined;
}

export class CreateOrEditContactTypeDto implements ICreateOrEditContactTypeDto {
    name!: string | undefined;
    id!: number | undefined;

    constructor(data?: ICreateOrEditContactTypeDto) {
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

    static fromJS(data: any): CreateOrEditContactTypeDto {
        data = typeof data === "object" ? data : {};
        let result = new CreateOrEditContactTypeDto();
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

export interface ICreateOrEditContactTypeDto {
    name: string | undefined;
    id: number | undefined;
}

export class GetContactTypeForEditOutput
    implements IGetContactTypeForEditOutput {
    contactType!: CreateOrEditContactTypeDto;

    constructor(data?: IGetContactTypeForEditOutput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.contactType = data["contactType"]
                ? CreateOrEditContactTypeDto.fromJS(data["contactType"])
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetContactTypeForEditOutput {
        data = typeof data === "object" ? data : {};
        let result = new GetContactTypeForEditOutput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["contactType"] = this.contactType
            ? this.contactType.toJSON()
            : <any>undefined;
        return data;
    }
}

export interface IGetContactTypeForEditOutput {
    contactType: CreateOrEditContactTypeDto;
}

export class ContactDto implements IContactDto {
    code!: string | undefined;
    firstName!: string | undefined;
    lastName!: string | undefined;
    jobTitle!: string | undefined;
    mobile!: string | undefined;
    directPhone!: string | undefined;
    id!: number;

    constructor(data?: IContactDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.code = data["code"];
            this.firstName = data["firstName"];
            this.lastName = data["lastName"];
            this.jobTitle = data["jobTitle"];
            this.mobile = data["mobile"];
            this.directPhone = data["directPhone"];
            this.id = data["id"];
        }
    }

    static fromJS(data: any): ContactDto {
        data = typeof data === "object" ? data : {};
        let result = new ContactDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["code"] = this.code;
        data["firstName"] = this.firstName;
        data["lastName"] = this.lastName;
        data["jobTitle"] = this.jobTitle;
        data["mobile"] = this.mobile;
        data["directPhone"] = this.directPhone;
        data["id"] = this.id;
        return data;
    }
}

export interface IContactDto {
    code: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    jobTitle: string | undefined;
    mobile: string | undefined;
    directPhone: string | undefined;
    id: number;
}

export class GetContactForViewDto implements IGetContactForViewDto {
    contact!: ContactDto;

    constructor(data?: IGetContactForViewDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.contact = data["contact"]
                ? ContactDto.fromJS(data["contact"])
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetContactForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new GetContactForViewDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["contact"] = this.contact ? this.contact.toJSON() : <any>undefined;
        return data;
    }
}

export interface IGetContactForViewDto {
    contact: ContactDto;
}

export class PagedResultDtoOfGetContactForViewDto
    implements IPagedResultDtoOfGetContactForViewDto {
    totalCount!: number;
    items!: GetContactForViewDto[] | undefined;

    constructor(data?: IPagedResultDtoOfGetContactForViewDto) {
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
                    this.items!.push(GetContactForViewDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfGetContactForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new PagedResultDtoOfGetContactForViewDto();
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

export interface IPagedResultDtoOfGetContactForViewDto {
    totalCount: number;
    items: GetContactForViewDto[] | undefined;
}

export class EmailAddressDto {
    constructor(address: string) {
        this.address = address;
    }
    address: string;
}

export class CreateOrEditContactDto implements ICreateOrEditContactDto {
    code!: string | undefined;
    firstName!: string | undefined;
    lastName!: string | undefined;
    jobTitle!: string | undefined;
    mobile!: string | undefined;
    directPhone!: string | undefined;
    companyId!: number | undefined;
    contactTypeId: number | undefined;
    id!: number | undefined;
    email: string | undefined;
    secondaryEmail: string | undefined;

    constructor(data?: ICreateOrEditContactDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.code = data["code"];
            this.firstName = data["firstName"];
            this.lastName = data["lastName"];
            this.jobTitle = data["jobTitle"];
            this.mobile = data["mobile"];
            this.directPhone = data["directPhone"];
            this.id = data["id"];
            this.email = data["email"];
            this.secondaryEmail = data["secondaryEmail"];
            this.companyId = data["companyId"];
            this.contactTypeId = data["contactTypeId"];
        }
    }

    static fromJS(data: any): CreateOrEditContactDto {
        data = typeof data === "object" ? data : {};
        let result = new CreateOrEditContactDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["code"] = this.code;
        data["firstName"] = this.firstName;
        data["lastName"] = this.lastName;
        data["jobTitle"] = this.jobTitle;
        data["mobile"] = this.mobile;
        data["directPhone"] = this.directPhone;
        data["id"] = this.id;
        data["email"] = this.email;
        data["secondaryEmail"] = this.secondaryEmail;
        data["companyId"] = this.companyId;
        data["contactTypeId"] = this.contactTypeId;

        return data;
    }
}

export interface ICreateOrEditContactDto {
    code: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    jobTitle: string | undefined;
    mobile: string | undefined;
    directPhone: string | undefined;
    id: number | undefined;
    email: string | undefined;
    secondaryEmail: string | undefined;
    companyId: number | undefined;
    contactTypeId: number | undefined;
}

export class GetContactForEditOutput implements IGetContactForEditOutput {
    contact!: CreateOrEditContactDto;

    constructor(data?: IGetContactForEditOutput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.contact = data["contact"]
                ? CreateOrEditContactDto.fromJS(data["contact"])
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetContactForEditOutput {
        data = typeof data === "object" ? data : {};
        let result = new GetContactForEditOutput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["contact"] = this.contact ? this.contact.toJSON() : <any>undefined;
        return data;
    }
}

export interface IGetContactForEditOutput {
    contact: CreateOrEditContactDto;
}
