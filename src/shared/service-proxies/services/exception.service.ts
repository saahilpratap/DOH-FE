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
export class ExceptionTypesServiceProxy {
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
    ): Observable<PagedResultDtoOfGetExceptionTypeForViewDto> {
        let url_ = this.baseUrl + "/api/services/app/ExceptionTypes/GetAll?";
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
                                    PagedResultDtoOfGetExceptionTypeForViewDto
                                >
                            >(<any>_observableThrow(e));
                        }
                    } else
                        return <
                            Observable<
                                PagedResultDtoOfGetExceptionTypeForViewDto
                            >
                        >(<any>_observableThrow(response_));
                })
            );
    }
    getAllForLookUp(): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/ExceptionTypes/GetAllForLookUp";
        return this.http.get(url_);
    }

    protected processGetAll(
        response: HttpResponseBase
    ): Observable<PagedResultDtoOfGetExceptionTypeForViewDto> {
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
                    result200 = PagedResultDtoOfGetExceptionTypeForViewDto.fromJS(
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
        return _observableOf<PagedResultDtoOfGetExceptionTypeForViewDto>(
            <any>null
        );
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getExceptionTypeForView(
        id: number | undefined
    ): Observable<GetExceptionTypeForViewDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/ExceptionTypes/GetExceptionTypeForView?";
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
                    return this.processGetExceptionTypeForView(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetExceptionTypeForView(
                                <any>response_
                            );
                        } catch (e) {
                            return <Observable<GetExceptionTypeForViewDto>>(
                                (<any>_observableThrow(e))
                            );
                        }
                    } else
                        return <Observable<GetExceptionTypeForViewDto>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processGetExceptionTypeForView(
        response: HttpResponseBase
    ): Observable<GetExceptionTypeForViewDto> {
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
                    result200 = GetExceptionTypeForViewDto.fromJS(
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
        return _observableOf<GetExceptionTypeForViewDto>(<any>null);
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getExceptionTypeForEdit(
        id: number | undefined
    ): Observable<GetExceptionTypeForEditOutput> {
        let url_ =
            this.baseUrl +
            "/api/services/app/ExceptionTypes/GetExceptionTypeForEdit?";
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
                    return this.processGetExceptionTypeForEdit(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetExceptionTypeForEdit(
                                <any>response_
                            );
                        } catch (e) {
                            return <Observable<GetExceptionTypeForEditOutput>>(
                                (<any>_observableThrow(e))
                            );
                        }
                    } else
                        return <Observable<GetExceptionTypeForEditOutput>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processGetExceptionTypeForEdit(
        response: HttpResponseBase
    ): Observable<GetExceptionTypeForEditOutput> {
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
                    result200 = GetExceptionTypeForEditOutput.fromJS(
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
        return _observableOf<GetExceptionTypeForEditOutput>(<any>null);
    }

    /**
     * @param body (optional)
     * @return Success
     */
    createOrEdit(
        body: CreateOrEditExceptionTypeDto | undefined
    ): Observable<void> {
        let url_ =
            this.baseUrl + "/api/services/app/ExceptionTypes/CreateOrEdit";
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
        let url_ = this.baseUrl + "/api/services/app/ExceptionTypes/Delete?";
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
    getExceptionTypesToExcel(
        filter: string | undefined,
        nameFilter: string | undefined
    ): Observable<FileDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/ExceptionTypes/GetExceptionTypesToExcel?";
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
                    return this.processGetExceptionTypesToExcel(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetExceptionTypesToExcel(
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

    protected processGetExceptionTypesToExcel(
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
export class ExceptionsServiceProxy {
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
        let url_ = this.baseUrl + "/api/services/app/Exceptions/GetAll?";
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

    getAllForLookUp(businessEntityId: number): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/Exceptions/GetAllForLookUp?";
        url_ += "businessEntityId=" + businessEntityId;
        return this.http.get(url_);
    }

    getExceptionForEdit(exceptionId: number): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/Exceptions/GetExceptionForEdit?";
        url_ += "id=" + exceptionId;
        return this.http.get(url_);
    }
    createOrEdit(exception: CreateOrEditExceptionDto): Observable<any> {
        let url_ = this.baseUrl + "/api/services/app/Exceptions/CreateOrEdit";
        url_ = url_.replace(/[?&]$/, "");
        const options: any = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const content_ = JSON.stringify(exception);
        return this.http.post(url_, content_, options);
    }
    getBusinessRisksForLookUp(businessEntityId: number): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/BusinessRisks/GetAllForLookUp?";
        if (businessEntityId != null)
            url_ += "businessEntityId=" + businessEntityId;
        return this.http.get(url_);
    }
    getControlRequirementsForLookUp(): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/ControlRequirements/GetAllForLookUp?";
        return this.http.get(url_);
    }
}

export enum ReviewStatus {
    NoStatus = 1,
    Requested,
    Review,
    Extension,
    Approved,
    Closed
}

export class ExceptionDto {
    id: number;
    code: string;
    title: string;
    typeName: string;
    status: ReviewStatus;
    requestDate: Date;
}
export interface CreateOrEditExceptionDto {
    id: number;
    code: string;
    typeId: number;
    title: string;
    nextReviewDate: Date;
    approvedTillDate: Date;
    comment: string;
    impactedControlRequirementIds: number[];
    compensatingControlIds: number[];
    relatedBusinessRiskIds: number[];
    businessEntityId: number;
    expertReviewerId: number;
    approverId: number;
    //attachments: AttachmentWithTitleDto[];
}

export class ExceptionTypeDto implements IExceptionTypeDto {
    name!: string | undefined;
    id!: number;

    constructor(data?: IExceptionTypeDto) {
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

    static fromJS(data: any): ExceptionTypeDto {
        data = typeof data === "object" ? data : {};
        let result = new ExceptionTypeDto();
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

export interface IExceptionTypeDto {
    name: string | undefined;
    id: number;
}

export class GetExceptionTypeForViewDto implements IGetExceptionTypeForViewDto {
    exceptionType!: ExceptionTypeDto;

    constructor(data?: IGetExceptionTypeForViewDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.exceptionType = data["exceptionType"]
                ? ExceptionTypeDto.fromJS(data["exceptionType"])
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetExceptionTypeForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new GetExceptionTypeForViewDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["exceptionType"] = this.exceptionType
            ? this.exceptionType.toJSON()
            : <any>undefined;
        return data;
    }
}

export interface IGetExceptionTypeForViewDto {
    exceptionType: ExceptionTypeDto;
}

export class PagedResultDtoOfGetExceptionTypeForViewDto
    implements IPagedResultDtoOfGetExceptionTypeForViewDto {
    totalCount!: number;
    items!: GetExceptionTypeForViewDto[] | undefined;

    constructor(data?: IPagedResultDtoOfGetExceptionTypeForViewDto) {
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
                    this.items!.push(GetExceptionTypeForViewDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfGetExceptionTypeForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new PagedResultDtoOfGetExceptionTypeForViewDto();
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

export interface IPagedResultDtoOfGetExceptionTypeForViewDto {
    totalCount: number;
    items: GetExceptionTypeForViewDto[] | undefined;
}

export class CreateOrEditExceptionTypeDto
    implements ICreateOrEditExceptionTypeDto {
    name!: string | undefined;
    id!: number | undefined;

    constructor(data?: ICreateOrEditExceptionTypeDto) {
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

    static fromJS(data: any): CreateOrEditExceptionTypeDto {
        data = typeof data === "object" ? data : {};
        let result = new CreateOrEditExceptionTypeDto();
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

export interface ICreateOrEditExceptionTypeDto {
    name: string | undefined;
    id: number | undefined;
}

export class GetExceptionTypeForEditOutput
    implements IGetExceptionTypeForEditOutput {
    exceptionType!: CreateOrEditExceptionTypeDto;

    constructor(data?: IGetExceptionTypeForEditOutput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.exceptionType = data["exceptionType"]
                ? CreateOrEditExceptionTypeDto.fromJS(data["exceptionType"])
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetExceptionTypeForEditOutput {
        data = typeof data === "object" ? data : {};
        let result = new GetExceptionTypeForEditOutput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["exceptionType"] = this.exceptionType
            ? this.exceptionType.toJSON()
            : <any>undefined;
        return data;
    }
}

export interface IGetExceptionTypeForEditOutput {
    exceptionType: CreateOrEditExceptionTypeDto;
}
