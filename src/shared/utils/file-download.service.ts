import { Injectable, Optional, Inject } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { FileDto, API_BASE_URL } from '@shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FileDownloadService {

    private http: HttpClient;
    protected jsonParseReviver:
        | ((key: string, value: any) => any)
        | undefined = undefined;

    constructor(
        @Inject(HttpClient) http: HttpClient,
    ) {
        this.http = http;
    }


    downloadTempFile(file: FileDto) {
        const url = AppConsts.remoteServiceBaseUrl + '/File/DownloadTempFile?fileType=' + file.fileType + '&fileToken=' + file.fileToken + '&fileName=' + file.fileName;
        location.href = url; //TODO: This causes reloading of same page in Firefox
    }

    addAttachment(reviewDataId: number, file: any): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/UploadReviewAttachment";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, file);
    }

    addAttachmentToQuestion(
        reviewQuestionId: number,
        file: any
    ): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/UploadQuestionAttachment";
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, file);
    }

    downloadAttachment(code: string) {
        if (code == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/Download";
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

    downloadAuditQuestionResponse(code: string) {
        if (code == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/DownloadAuditQuestionResponse";
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

    downloadAssessmentQuestionResponse(code: string) {
        if (code == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/DownloadAssessmentQuestionResponse";
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

    downloadAuditAttachment(code: string) {
        if (code == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/DownloadAuditAttachment";
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

    downloadPAPAttachment(code: string) {
        if (code == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/DownloadPAPAttachment";
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

    downloadRemediationAttachment(code: string) {
        if (code == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/DownloadRemediationAttachment";
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

    downloadAuditSubAttachment(code: string) {
        if (code == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/DownloadAuditSubAttachment";
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

    downloadWorkflowTeamplateAttachment(code: string, id: number) {        
        if (code == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + '/File/DownloadWorkflowTeamplateAttachment';
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?file=" + code + "&id=" + id;
        //url_ += "?Id=" + id;
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.href = url_;
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);
    }

    downloadEmailNotificationAttachment(code: string,id:number) {
        if (code == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + '/File/DownloadEmailNotificationAttachment';
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?file=" + code + "&id=" + id;
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.href = url_;
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);
    }

    downloadEmailReminderAttachment(code: string, id: number) {        
        if (code == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/DownloadEmailReminderAttachment";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?file=" + code + "&id=" + id;
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.href = url_;
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);
    }


    downloadReport(fileName: string) {
        if (fileName == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/Downloadreports";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?file=" + fileName;
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.href = url_;
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);
    }

    downloadCertificate(fileName: string) {
        if (fileName == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/DownloadCertificates";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?file=" + fileName;
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.href = url_;
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);
    }

    downloadEntityCertificate(fileName: string) {
        if (fileName == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/DownloadEntityCertificate";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?file=" + fileName;
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.href = url_;
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);
    }

    downloadTTXFile(fileName: string) {
        if (fileName == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/DownloadTTXAttachment";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?file=" + fileName;
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.href = url_;
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);
    }

    DownloadTTEENtityAttachment(fileName: string) {
        if (fileName == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/DownloadTTEENtityAttachment";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?file=" + fileName;
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.href = url_;
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);
    }
    downloadPAPGlobalAttachment(fileName: string) {
        if (fileName == "") return;
        let url_ = AppConsts.remoteServiceBaseUrl + "/File/DownloadPAPGlobalAttachment";
        url_ = url_.replace(/[?&]$/, "");
        url_ += "?file=" + fileName;
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.href = url_;
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);
    }

    removeAttachment(code: string): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + '/File/DeleteAttachment?code=' + code;
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, code);
    }



    deleteAuditAttachment(code: string): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + '/File/DeleteAuditAttachment?code=' + code;
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, code);
    }

    deletePAPAttachment(code: string): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + '/File/DeletePAPAttachment?code=' + code;
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, code);
    }

    deleteRemediationAttachment(code: string): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + '/File/DeleteRemediationAttachment?code=' + code;
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, code);
    }

    deleteAuditSubAttachment(code: string): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + '/File/DeleteAuditSubAttachment?code=' + code;
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, code);
    }

    deleteWorkflowTeamplateAttachment(code: string, id: number): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + '/File/DeleteWorkflowTeamplateAttachment?code=' + code + '&id=' + id;
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, code);
    }

    deleteEmailNotificationAttachment(code: string, id: number): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + '/File/DeleteEmailNotificationAttachment?code=' + code + '&id=' + id;
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, code);
    }

    deleteEmailReminderAttachment(code: string, id: number): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + '/File/DeleteEmailReminderAttachment?code=' + code + '&id=' + id;
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, code);
    }

    deleteAuditQuestionResponse(code: string): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + '/File/DeleteAuditQuestionResponse?code=' + code;
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, code);
    }

    deleteAssessmentQuestionResponse(code: string): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + '/File/DeleteAssessmentQuestionResponse?code=' + code;
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, code);
    }
    deleteTTXFile(code: string): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + '/File/DeleteTTXfile?code=' + code;
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, code);
    }
    deletePAPGlobalAttachmentfile(code: string): Observable<any> {
        let url_ = AppConsts.remoteServiceBaseUrl + '/File/DeletePAPGlobalAttachmentfile?code=' + code;
        url_ = url_.replace(/[?&]$/, "");
        return this.http.post(url_, code);
    }

}
