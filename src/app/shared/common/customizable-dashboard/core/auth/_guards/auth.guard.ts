// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// NGRX
import { select, Store } from '@ngrx/store';
// Auth reducers and selectors
import { AppState} from '../../../core/reducers/';
import { isLoggedIn } from '../_selectors/auth.selectors';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private store: Store<AppState>, private router: Router) { }

    canActivate() {
      
        if (localStorage.getItem('authToken')) {
            return true;
        }

        this.router.navigate(['/auth/login']);
        return false;

        // return this.store
        //     .pipe(
        //         select(isLoggedIn),
        //         tap(loggedIn => {
        //             if (!loggedIn) {
        //                 this.router.navigateByUrl('/auth/login');
        //             }
        //         })
        //     );
    }
    getBearerToken(){
        if (localStorage.getItem('authToken')) {
            return localStorage.getItem('token');
        } else{
            return false;
        }
    }
}
