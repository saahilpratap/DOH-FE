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
    FileDto,
    EntityType
} from "../service-proxies";

@Injectable()
export class FindingReportClassificationsServiceProxy {
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
    ): Observable<PagedResultDtoOfGetFindingReportClassificationForViewDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/FindingReportClassifications/GetAll?";
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
                                    PagedResultDtoOfGetFindingReportClassificationForViewDto
                                >
                            >(<any>_observableThrow(e));
                        }
                    } else
                        return <
                            Observable<
                                PagedResultDtoOfGetFindingReportClassificationForViewDto
                            >
                        >(<any>_observableThrow(response_));
                })
            );
    }
    getAllForLookUp(): Observable<any> {
        let url_ =
            this.baseUrl +
            "/api/services/app/FindingReportClassifications/GetAllForLookUp?";
        return this.http.get(url_);
    }
    protected processGetAll(
        response: HttpResponseBase
    ): Observable<PagedResultDtoOfGetFindingReportClassificationForViewDto> {
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
                    result200 = PagedResultDtoOfGetFindingReportClassificationForViewDto.fromJS(
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
        return _observableOf<
            PagedResultDtoOfGetFindingReportClassificationForViewDto
        >(<any>null);
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getFindingReportClassificationForView(
        id: number | undefined
    ): Observable<GetFindingReportClassificationForViewDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/FindingReportClassifications/GetFindingReportClassificationForView?";
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
                    return this.processGetFindingReportClassificationForView(
                        response_
                    );
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetFindingReportClassificationForView(
                                <any>response_
                            );
                        } catch (e) {
                            return <
                                Observable<
                                    GetFindingReportClassificationForViewDto
                                >
                            >(<any>_observableThrow(e));
                        }
                    } else
                        return <
                            Observable<GetFindingReportClassificationForViewDto>
                        >(<any>_observableThrow(response_));
                })
            );
    }

    protected processGetFindingReportClassificationForView(
        response: HttpResponseBase
    ): Observable<GetFindingReportClassificationForViewDto> {
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
                    result200 = GetFindingReportClassificationForViewDto.fromJS(
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
        return _observableOf<GetFindingReportClassificationForViewDto>(
            <any>null
        );
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getFindingReportClassificationForEdit(
        id: number | undefined
    ): Observable<GetFindingReportClassificationForEditOutput> {
        let url_ =
            this.baseUrl +
            "/api/services/app/FindingReportClassifications/GetFindingReportClassificationForEdit?";
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
                    return this.processGetFindingReportClassificationForEdit(
                        response_
                    );
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetFindingReportClassificationForEdit(
                                <any>response_
                            );
                        } catch (e) {
                            return <
                                Observable<
                                    GetFindingReportClassificationForEditOutput
                                >
                            >(<any>_observableThrow(e));
                        }
                    } else
                        return <
                            Observable<
                                GetFindingReportClassificationForEditOutput
                            >
                        >(<any>_observableThrow(response_));
                })
            );
    }

    protected processGetFindingReportClassificationForEdit(
        response: HttpResponseBase
    ): Observable<GetFindingReportClassificationForEditOutput> {
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
                    result200 = GetFindingReportClassificationForEditOutput.fromJS(
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
        return _observableOf<GetFindingReportClassificationForEditOutput>(
            <any>null
        );
    }

    /**
     * @param body (optional)
     * @return Success
     */
    createOrEdit(
        body: CreateOrEditFindingReportClassificationDto | undefined
    ): Observable<void> {
        let url_ =
            this.baseUrl +
            "/api/services/app/FindingReportClassifications/CreateOrEdit";
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
            this.baseUrl +
            "/api/services/app/FindingReportClassifications/Delete?";
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
    getFindingReportClassificationsToExcel(
        filter: string | undefined,
        nameFilter: string | undefined
    ): Observable<FileDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/FindingReportClassifications/GetFindingReportClassificationsToExcel?";
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
                    return this.processGetFindingReportClassificationsToExcel(
                        response_
                    );
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetFindingReportClassificationsToExcel(
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

    protected processGetFindingReportClassificationsToExcel(
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

export class FindingReportClassificationDto
    implements IFindingReportClassificationDto {
    name!: string | undefined;
    id!: number;

    constructor(data?: IFindingReportClassificationDto) {
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

    static fromJS(data: any): FindingReportClassificationDto {
        data = typeof data === "object" ? data : {};
        let result = new FindingReportClassificationDto();
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

export interface IFindingReportClassificationDto {
    name: string | undefined;
    id: number;
}

export class GetFindingReportClassificationForViewDto
    implements IGetFindingReportClassificationForViewDto {
    findingReportClassification!: FindingReportClassificationDto;

    constructor(data?: IGetFindingReportClassificationForViewDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.findingReportClassification = data[
                "findingReportClassification"
            ]
                ? FindingReportClassificationDto.fromJS(
                      data["findingReportClassification"]
                  )
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetFindingReportClassificationForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new GetFindingReportClassificationForViewDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["findingReportClassification"] = this.findingReportClassification
            ? this.findingReportClassification.toJSON()
            : <any>undefined;
        return data;
    }
}

export interface IGetFindingReportClassificationForViewDto {
    findingReportClassification: FindingReportClassificationDto;
}

export class PagedResultDtoOfGetFindingReportClassificationForViewDto
    implements IPagedResultDtoOfGetFindingReportClassificationForViewDto {
    totalCount!: number;
    items!: GetFindingReportClassificationForViewDto[] | undefined;

    constructor(
        data?: IPagedResultDtoOfGetFindingReportClassificationForViewDto
    ) {
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
                        GetFindingReportClassificationForViewDto.fromJS(item)
                    );
            }
        }
    }

    static fromJS(
        data: any
    ): PagedResultDtoOfGetFindingReportClassificationForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new PagedResultDtoOfGetFindingReportClassificationForViewDto();
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

export interface IPagedResultDtoOfGetFindingReportClassificationForViewDto {
    totalCount: number;
    items: GetFindingReportClassificationForViewDto[] | undefined;
}

export class CreateOrEditFindingReportClassificationDto
    implements ICreateOrEditFindingReportClassificationDto {
    name!: string | undefined;
    id!: number | undefined;

    constructor(data?: ICreateOrEditFindingReportClassificationDto) {
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

    static fromJS(data: any): CreateOrEditFindingReportClassificationDto {
        data = typeof data === "object" ? data : {};
        let result = new CreateOrEditFindingReportClassificationDto();
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

export interface ICreateOrEditFindingReportClassificationDto {
    name: string | undefined;
    id: number | undefined;
}

export class GetFindingReportClassificationForEditOutput
    implements IGetFindingReportClassificationForEditOutput {
    findingReportClassification!: CreateOrEditFindingReportClassificationDto;

    constructor(data?: IGetFindingReportClassificationForEditOutput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.findingReportClassification = data[
                "findingReportClassification"
            ]
                ? CreateOrEditFindingReportClassificationDto.fromJS(
                      data["findingReportClassification"]
                  )
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetFindingReportClassificationForEditOutput {
        data = typeof data === "object" ? data : {};
        let result = new GetFindingReportClassificationForEditOutput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["findingReportClassification"] = this.findingReportClassification
            ? this.findingReportClassification.toJSON()
            : <any>undefined;
        return data;
    }
}

export interface IGetFindingReportClassificationForEditOutput {
    findingReportClassification: CreateOrEditFindingReportClassificationDto;
}
@Injectable()
export class EntityGroupsServiceProxy {
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

    getAllForLookUp(): Observable<any> {
        let url_ =
            this.baseUrl + "/api/services/app/EntityGroups/GetAllForLookUp";
        return this.http.get(url_);
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
    ): Observable<PagedResultDtoOfGetEntityGroupForViewDto> {
        let url_ = this.baseUrl + "/api/services/app/EntityGroups/GetAll?";
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
                                    PagedResultDtoOfGetEntityGroupForViewDto
                                >
                            >(<any>_observableThrow(e));
                        }
                    } else
                        return <
                            Observable<PagedResultDtoOfGetEntityGroupForViewDto>
                        >(<any>_observableThrow(response_));
                })
            );
    }

    protected processGetAll(
        response: HttpResponseBase
    ): Observable<PagedResultDtoOfGetEntityGroupForViewDto> {
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
                    result200 = PagedResultDtoOfGetEntityGroupForViewDto.fromJS(
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
        return _observableOf<PagedResultDtoOfGetEntityGroupForViewDto>(
            <any>null
        );
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getEntityGroupForView(
        id: number | undefined
    ): Observable<GetEntityGroupForViewDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/EntityGroups/GetEntityGroupForView?";
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
                    return this.processGetEntityGroupForView(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetEntityGroupForView(
                                <any>response_
                            );
                        } catch (e) {
                            return <Observable<GetEntityGroupForViewDto>>(
                                (<any>_observableThrow(e))
                            );
                        }
                    } else
                        return <Observable<GetEntityGroupForViewDto>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processGetEntityGroupForView(
        response: HttpResponseBase
    ): Observable<GetEntityGroupForViewDto> {
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
                    result200 = GetEntityGroupForViewDto.fromJS(resultData200);
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
        return _observableOf<GetEntityGroupForViewDto>(<any>null);
    }

    /**
     * @param id (optional)
     * @return Success
     */
    getEntityGroupForEdit(
        id: number | undefined
    ): Observable<GetEntityGroupForEditOutput> {
        let url_ =
            this.baseUrl +
            "/api/services/app/EntityGroups/GetEntityGroupForEdit?";
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
                    return this.processGetEntityGroupForEdit(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetEntityGroupForEdit(
                                <any>response_
                            );
                        } catch (e) {
                            return <Observable<GetEntityGroupForEditOutput>>(
                                (<any>_observableThrow(e))
                            );
                        }
                    } else
                        return <Observable<GetEntityGroupForEditOutput>>(
                            (<any>_observableThrow(response_))
                        );
                })
            );
    }

    protected processGetEntityGroupForEdit(
        response: HttpResponseBase
    ): Observable<GetEntityGroupForEditOutput> {
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
                    result200 = GetEntityGroupForEditOutput.fromJS(
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
        return _observableOf<GetEntityGroupForEditOutput>(<any>null);
    }

    /**
     * @param body (optional)
     * @return Success
     */
    createOrEdit(
        body: CreateOrEditEntityGroupDto | undefined
    ): Observable<void> {
        let url_ = this.baseUrl + "/api/services/app/EntityGroups/CreateOrEdit";
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
        let url_ = this.baseUrl + "/api/services/app/EntityGroups/Delete?";
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
    getEntityGroupsToExcel(
        filter: string | undefined,
        nameFilter: string | undefined
    ): Observable<FileDto> {
        let url_ =
            this.baseUrl +
            "/api/services/app/EntityGroups/GetEntityGroupsToExcel?";
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
                    return this.processGetEntityGroupsToExcel(response_);
                })
            )
            .pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processGetEntityGroupsToExcel(
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

    protected processGetEntityGroupsToExcel(
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

export class EntityGroupDto implements IEntityGroupDto {
    name!: string | undefined;
    organizationUnitId: number;
    id!: number;

    constructor(data?: IEntityGroupDto) {
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
            this.organizationUnitId = data["organizationUnitId"];
        }
    }

    static fromJS(data: any): EntityGroupDto {
        data = typeof data === "object" ? data : {};
        let result = new EntityGroupDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["name"] = this.name;
        data["id"] = this.id;
        data["organizationUnitId"] = this.organizationUnitId;
        return data;
    }
}

export interface IEntityGroupDto {
    name: string | undefined;
    organizationUnitId: number;
    id: number;
}

export class GetEntityGroupForViewDto implements IGetEntityGroupForViewDto {
    entityGroup!: EntityGroupDto;

    constructor(data?: IGetEntityGroupForViewDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.entityGroup = data["entityGroup"]
                ? EntityGroupDto.fromJS(data["entityGroup"])
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetEntityGroupForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new GetEntityGroupForViewDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["entityGroup"] = this.entityGroup
            ? this.entityGroup.toJSON()
            : <any>undefined;
        return data;
    }
}

export interface IGetEntityGroupForViewDto {
    entityGroup: EntityGroupDto;
}

export class PagedResultDtoOfGetEntityGroupForViewDto
    implements IPagedResultDtoOfGetEntityGroupForViewDto {
    totalCount!: number;
    items!: GetEntityGroupForViewDto[] | undefined;

    constructor(data?: IPagedResultDtoOfGetEntityGroupForViewDto) {
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
                    this.items!.push(GetEntityGroupForViewDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfGetEntityGroupForViewDto {
        data = typeof data === "object" ? data : {};
        let result = new PagedResultDtoOfGetEntityGroupForViewDto();
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

export interface IPagedResultDtoOfGetEntityGroupForViewDto {
    totalCount: number;
    items: GetEntityGroupForViewDto[] | undefined;
}

export class CreateOrEditEntityGroupDto implements ICreateOrEditEntityGroupDto {
    name!: string | undefined;
    entityType: EntityType;
    primaryEntityId: number;
    code: string;
    groupedEntityIds: number[];
    id!: number | undefined;

    constructor(data?: ICreateOrEditEntityGroupDto) {
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
            this.entityType = data["entityType"];
            this.code = data["code"];
            this.primaryEntityId = data["primaryEntityId"];
            this.groupedEntityIds = data["groupedEntityIds"];
        }
    }

    static fromJS(data: any): CreateOrEditEntityGroupDto {
        data = typeof data === "object" ? data : {};
        let result = new CreateOrEditEntityGroupDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["name"] = this.name;
        data["id"] = this.id;
        data["entityType"] = this.entityType;
        data["code"] = this.code;
        data["primaryEntityId"] = this.primaryEntityId;
        data["groupedEntityIds"] = this.groupedEntityIds;
        return data;
    }
}

export interface ICreateOrEditEntityGroupDto {
    name: string | undefined;
    entityType: EntityType;
    primaryEntityId: number;
    code: string;
    groupedEntityIds: number[];
    id: number | undefined;
}

export class GetEntityGroupForEditOutput
    implements IGetEntityGroupForEditOutput {
    entityGroup!: CreateOrEditEntityGroupDto;

    constructor(data?: IGetEntityGroupForEditOutput) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.entityGroup = data["entityGroup"]
                ? CreateOrEditEntityGroupDto.fromJS(data["entityGroup"])
                : <any>undefined;
        }
    }

    static fromJS(data: any): GetEntityGroupForEditOutput {
        data = typeof data === "object" ? data : {};
        let result = new GetEntityGroupForEditOutput();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["entityGroup"] = this.entityGroup
            ? this.entityGroup.toJSON()
            : <any>undefined;
        return data;
    }
}

export interface IGetEntityGroupForEditOutput {
    entityGroup: CreateOrEditEntityGroupDto;
}
