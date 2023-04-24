// Angular
import { Injectable } from "@angular/core";
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse
} from "@angular/common/http";
// RxJS
import { Observable, BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";

/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {
    // intercept request and add token
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // tslint:disable-next-line:no-debugger
        // modify request
        // request = request.clone({
        // 	setHeaders: {
        // 		Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        // 	}
        // });
        // console.log('----request----');
        // console.log(request);
        // console.log('--- end of request---');

        return next.handle(request).pipe(
            tap(
                event => {
                    if (event instanceof HttpResponse) {
                        // console.log('all looks good');
                        // http response status code
                        //console.log('statusCode',event);
                        if (event.body["statusCode"] == 404) {
                            if (localStorage.getItem("authToken") != "") {
                                localStorage.removeItem("authToken");
                                localStorage.removeItem("profile");
                            }

                            window.location.replace("/");
                        }
                    }
                },
                error => {
                    // http response status code
                    // console.log('----response----');
                    // console.error('status code:');
                    // tslint:disable-next-line:no-debugger
                    console.error(error.status);
                    console.error(error.message);
                    // console.log('--- end of response---');
                }
            )
        );
    }
}
// @Injectable()
// export class HTTPStatus {
//   private requestInFlight$: BehaviorSubject<boolean>;
//   constructor() {
//     this.requestInFlight$ = new BehaviorSubject(false);
//   }

//   setHttpStatus(inFlight: boolean) {
//     this.requestInFlight$.next(inFlight);
//   }

//   getHttpStatus(): Observable<boolean> {
//     return this.requestInFlight$.asObservable();
//   }
// }
