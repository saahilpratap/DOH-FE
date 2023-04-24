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
export class AuthorityDepartmentsServiceProxy {
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
    ): Observable<PagedResultDtoOfGetAuthorityDepartmentForViewDto> {
        let url_ =
            this.baseUrl + "/api/services/app/AuthorityDepartments/GetAll?";
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
                                    PagedResultDtoOfGetAuthorityDepartmentForViewDto
                                >
                            >(<any>_observableThrow(e));
                        }
                    } else
                        return <
                            Observable<
                                PagedResultDtoOfGetAuthorityDepartmentForViewDto
                            >
                        >(<any>_observableThrow(response_));
                })
            );
    }

    protected processGetAll(
        response: HttpResponseBase
    ): Observable<PagedResultDtoOfGetAuthorityDepartmentForViewDto> {
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
                    result200 = PagedResultDtoOfGetAuthorityDepartmentForViewDto.fromJS(
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
        return _observableOf<PagedResultDtoOfGetAuthorityDepartmentForViewDto>(
            <any>null
        );
    }



    getAllAuthorityDepartments(): Observable<AuthorityDepartmentDto[]> {
        let url_ = this.baseUrl + "/api/services/app/AuthorityDepartments/GetAllAuthorityDepartments";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetAllAuthorityDepartments(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllAuthorityDepartments(<any>response_);
                } catch (e) {
                    return <Observable<AuthorityDepartmentDto[]>><any>_observableThrow(e);
                }
            } else
                return <Observable<AuthorityDepartmentDto[]>><any>_observableThrow(response_);
        }));
    }

    protected processGetAllAuthorityDepartments(response: HttpResponseBase): Observable<AuthorityDepartmentDto[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } };
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                if (Array.isArray(resultData200)) {
                    result200 = [] as any;
                    for (let item of resultData200)
                        result200!.push(AuthorityDepartmentDto.fromJS(item));
                }
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<AuthorityDepartmentDto[]>(<any>null);
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getAuthorityDepartmentForView(
        id: number | undefined
    ): Observable<GetAuthorityDepartmentForViewDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/AuthorityDepartments/GetAuthorityDepartmentForView?";
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
                    return this.processGetAuthorityDepartmentForView(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetAuthorityDepartmentForView(
                                <any>response_
                            );
                        } catch (e) {
                            return <
                                Observable<GetAuthorityDepartmentForViewDto>
                            >(<any>_observableThrow(e));
                        }
                    } else
                        return <Observable<GetAuthorityDepartmentForViewDto>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processGetAuthorityDepartmentForView(
        response: HttpResponseBase
    ): Observable<GetAuthorityDepartmentForViewDto> {
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
                    result200 = GetAuthorityDepartmentForViewDto.fromJS(
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
        return _observableOf<GetAuthorityDepartmentForViewDto>(<any>null);
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getAuthorityDepartmentForEdit(
        id: number | undefined
    ): Observable<GetAuthorityDepartmentForEditOutput> {
        let url_ =
            this.baseUrl +
            "/api/services/app/AuthorityDepartments/GetAuthorityDepartmentForEdit?";
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
                    return this.processGetAuthorityDepartmentForEdit(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetAuthorityDepartmentForEdit(
                                <any>response_
                            );
                        } catch (e) {
                            return <
                                Observable<GetAuthorityDepartmentForEditOutput>
                            >(<any>_observableThrow(e));
                        }
                    } else
                        return <
                            Observable<GetAuthorityDepartmentForEditOutput>
                        >(<any>_observableThrow(response_));
                })
            );
    }

    protected processGetAuthorityDepartmentForEdit(
        response: HttpResponseBase
    ): Observable<GetAuthorityDepartmentForEditOutput> {
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
                    result200 = GetAuthorityDepartmentForEditOutput.fromJS(
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
        return _observableOf<GetAuthorityDepartmentForEditOutput>(<any>null);
    }

    /**
     * @param body (optional)
     * @return Success
     */
    createOrEdit(
        body: CreateOrEditAuthorityDepartmentDto | undefined
    ): Observable<void> {
        let url_ =
            this.baseUrl +
            "/api/services/app/AuthorityDepartments/CreateOrEdit";
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
        let url_ =
            this.baseUrl + "/api/services/app/AuthorityDepartments/Delete?";
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
    getAuthorityDepartmentsToExcel(
        filter: string | undefined,
        nameFilter: string | undefined
    ): Observable<FileDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/AuthorityDepartments/GetAuthorityDepartmentsToExcel?";
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
                    return this.processGetAuthorityDepartmentsToExcel(
                        response_
                    );
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetAuthorityDepartmentsToExcel(
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

    protected processGetAuthorityDepartmentsToExcel(
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

export class AuthorityDepartmentDto implements IAuthorityDepartmentDto {
    name!: string | undefined;
    id!: number;

    constructor(data?: IAuthorityDepartmentDto) {
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

    static fromJS(data: any): AuthorityDepartmentDto {
        data = typeof data === "object" ? data : {};
        let result = new AuthorityDepartmentDto();
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

export interface IAuthorityDepartmentDto {
    name: string | undefined;
    id: number;
}

export class GetAuthorityDepartmentForViewDto
    implements IGetAuthorityDepartmentForViewDto {
    authorityDepartment!: AuthorityDepartmentDto;

    constructor(data?: IGetAuthorityDepartmentForViewDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.authorityDepartment = data["authorityDepartment"]
                ? AuthorityDepartmentDto.fromJS(data["authorityDepartment"])
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetAuthorityDepartmentForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new GetAuthorityDepartmentForViewDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["authorityDepartment"] = this.authorityDepartment
            ? this.authorityDepartment.toJSON()
            : <any>undefined;
        return data;
    }
}

export interface IGetAuthorityDepartmentForViewDto {
    authorityDepartment: AuthorityDepartmentDto;
}

export class PagedResultDtoOfGetAuthorityDepartmentForViewDto
    implements IPagedResultDtoOfGetAuthorityDepartmentForViewDto {
    totalCount!: number;
    items!: GetAuthorityDepartmentForViewDto[] | undefined;

    constructor(data?: IPagedResultDtoOfGetAuthorityDepartmentForViewDto) {
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
                    this.items!.push(
                        GetAuthorityDepartmentForViewDto.fromJS(item)
                    );
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfGetAuthorityDepartmentForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new PagedResultDtoOfGetAuthorityDepartmentForViewDto();
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

export interface IPagedResultDtoOfGetAuthorityDepartmentForViewDto {
    totalCount: number;
    items: GetAuthorityDepartmentForViewDto[] | undefined;
}

export class CreateOrEditAuthorityDepartmentDto
    implements ICreateOrEditAuthorityDepartmentDto {
    name!: string | undefined;
    id!: number | undefined;
    tenantId: number | undefined;
    isDeleted!: boolean;
    deleterUserId!: number | undefined;
    deletionTime!: moment.Moment | undefined;
    lastModificationTime!: moment.Moment | undefined;
    lastModifierUserId!: number | undefined;
    creationTime!: moment.Moment;
    creatorUserId!: number | undefined;
   

    constructor(data?: ICreateOrEditAuthorityDepartmentDto) {
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

    static fromJS(data: any): CreateOrEditAuthorityDepartmentDto {
        data = typeof data === "object" ? data : {};
        let result = new CreateOrEditAuthorityDepartmentDto();
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

export interface ICreateOrEditAuthorityDepartmentDto {
    name: string | undefined;
    id: number | undefined;
}

export class GetAuthorityDepartmentForEditOutput
    implements IGetAuthorityDepartmentForEditOutput {
    authorityDepartment!: CreateOrEditAuthorityDepartmentDto;

    constructor(data?: IGetAuthorityDepartmentForEditOutput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.authorityDepartment = data["authorityDepartment"]
                ? CreateOrEditAuthorityDepartmentDto.fromJS(
                      data["authorityDepartment"]
                  )
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetAuthorityDepartmentForEditOutput {
        data = typeof data === "object" ? data : {};
        let result = new GetAuthorityDepartmentForEditOutput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["authorityDepartment"] = this.authorityDepartment
            ? this.authorityDepartment.toJSON()
            : <any>undefined;
        return data;
    }
}

export interface IGetAuthorityDepartmentForEditOutput {
    authorityDepartment: CreateOrEditAuthorityDepartmentDto;
}
