import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { User } from "../_models/user.model";
import { Permission } from "../_models/permission.model";
import { Role } from "../_models/role.model";
import { catchError, map } from "rxjs/operators";
import { QueryParamsModel, QueryResultsModel } from "../../_base/crud";
import { Router } from "@angular/router";

const API_USERS_URL = "";
const API_PERMISSION_URL = "api/permissions";
const API_ROLES_URL = API_USERS_URL + "getRoleById";

@Injectable()
export class AuthService {
    constructor(private http: HttpClient) {}
    // Authentication/Authorization
    login(email: string, password: string): Observable<User> {
        return this.http.post<User>(API_USERS_URL + "login", {
            email,
            password
        });
    }

    getaccounttype() {
        return this.http.get(API_USERS_URL + "getaccounttype");
    }

    getuserlist() {
        const userToken = localStorage.getItem("authToken");
        let header = new HttpHeaders();
        header.append("Content-Type", "application/json");
        let httpheader = header.append("Authorization", userToken);
        return this.http.get(API_USERS_URL + "getuserlist", {
            headers: httpheader
        });
    }
    getroles() {
        const userToken = localStorage.getItem("authToken");
        let header = new HttpHeaders();
        header.append("Content-Type", "application/json");
        let httpheader = header.append("Authorization", userToken);
        return this.http.get(API_USERS_URL + "getroles", {
            headers: httpheader
        });
    }

    getUserByToken(): Observable<User> {
        return of.apply(new User());
    }

    register(user: User): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set("Content-Type", "application/json");
        return this.http
            .post<User>(API_USERS_URL + "registration", user, {
                headers: httpHeaders
            })
            .pipe(
                map((res: User) => {
                    return res;
                }),
                catchError(err => {
                    return null;
                })
            );
    }

    /*
     * Submit forgot password request
     *
     * @param {string} email
     * @returns {Observable<any>}
     */
    public requestPassword(email: string): Observable<any> {
        return this.http
            .get(API_USERS_URL + "/forgot?=" + email)
            .pipe(catchError(this.handleError("forgot-password", [])));
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(API_USERS_URL);
    }

    getUserById(userId: number): Observable<User> {
        return this.http.get<User>(API_USERS_URL + `/${userId}`);
    }

    // DELETE => delete the user from the server
    deleteUser(userId: number) {
        const userToken = localStorage.getItem("authToken");
        let header = new HttpHeaders();
        header.append("Content-Type", "application/json");
        let httpheader = header.append("Authorization", userToken);

        return this.http.post<User>(
            API_USERS_URL + "deleteUser",
            { userId },
            { headers: httpheader }
        );
        // const url = `${API_USERS_URL}/${userId}`;
        // return this.http.delete(url);
    }

    // DELETE => delete the user from the server
    deleterole(roleId: number) {
        const userToken = localStorage.getItem("authToken");
        let header = new HttpHeaders();
        header.append("Content-Type", "application/json");
        let httpheader = header.append("Authorization", userToken);

        return this.http.post<Role>(
            API_USERS_URL + "deleteRole",
            { roleId },
            { headers: httpheader }
        );
        // const url = `${API_USERS_URL}/${userId}`;
        // return this.http.delete(url);
    }

    // UPDATE => PUT: update the user on the server
    updateUser(_user: User): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set("Content-Type", "application/json");
        return this.http.put(API_USERS_URL, _user, { headers: httpHeaders });
    }

    // CREATE =>  POST: add a new user to the server
    createUser(user: User): Observable<User> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set("Content-Type", "application/json");
        return this.http.post<User>(API_USERS_URL, user, {
            headers: httpHeaders
        });
    }

    // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
    // items => filtered/sorted result
    findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set("Content-Type", "application/json");
        return this.http.post<QueryResultsModel>(
            API_USERS_URL + "/findUsers",
            queryParams,
            { headers: httpHeaders }
        );
    }

    // Permission
    getAllPermissions(): Observable<Permission[]> {
        return this.http.get<Permission[]>(API_PERMISSION_URL);
    }

    getRolePermissions(roleId: number): Observable<Permission[]> {
        return this.http.get<Permission[]>(
            API_PERMISSION_URL + "/getRolePermission?=" + roleId
        );
    }

    // Roles
    getAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(API_ROLES_URL);
    }

    getRoleById(roleId: number): Observable<Role> {
        return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
    }

    // CREATE =>  POST: add a new role to the server
    createRole(role: Role): Observable<Role> {
        // Note: Add headers if needed (tokens/bearer)
        const httpHeaders = new HttpHeaders();
        httpHeaders.set("Content-Type", "application/json");
        return this.http.post<Role>(API_ROLES_URL, role, {
            headers: httpHeaders
        });
    }

    // UPDATE => PUT: update the role on the server
    updateRole(role: Role): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set("Content-Type", "application/json");
        return this.http.put(API_ROLES_URL, role, { headers: httpHeaders });
    }

    // DELETE => delete the role from the server
    deleteRole(roleId: number): Observable<Role> {
        const url = `${API_ROLES_URL}/${roleId}`;
        return this.http.delete<Role>(url);
    }

    // Check Role Before deletion
    isRoleAssignedToUsers(roleId: number): Observable<boolean> {
        return this.http.get<boolean>(
            API_ROLES_URL + "/checkIsRollAssignedToUser?roleId=" + roleId
        );
    }

    findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls
        const httpHeaders = new HttpHeaders();
        httpHeaders.set("Content-Type", "application/json");
        return this.http.post<QueryResultsModel>(
            API_ROLES_URL + "/findRoles",
            queryParams,
            { headers: httpHeaders }
        );
    }

    /*
     * Handle Http operation that failed.
     * Let the app continue.
     *
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = "operation", result?: any) {
        return (error: any): Observable<any> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result);
        };
    }
}
