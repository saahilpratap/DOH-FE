import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FileDownloadService } from '../../../../shared/utils/file-download.service';
import { DxReportDesignerComponent } from 'devexpress-reporting-angular';
import { appModuleAnimation } from '../../../../shared/animations/routerTransition';
import { DxReportViewerComponent } from 'devexpress-reporting-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConsts } from '../../../../shared/AppConsts';
import { AuditProjectServiceProxy } from '../../../../shared/service-proxies/service-proxies';


@Component({
    selector: 'dev-express-report',
    templateUrl: './dev-express-report.component.html',
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.None,    
})

export class DevExpressReportComponent extends AppComponentBase implements OnInit {

    @Input('btnName') btnName: any;
    @Input('reportName') reportName: any;
    @Input('ids') ids: any;
    @Input('btnDisable') btnDisable: any;
    @Input('class') class: any;

    @ViewChild(DxReportViewerComponent, { static: false }) viewer: DxReportViewerComponent;
   
    reportUrl: string
   
    hostUrl: string = AppConsts.remoteServiceBaseUrl + '/';
   
    invokeAction: string = 'DXXRDV';

    constructor(
        injector: Injector,
        private _auditServiceProxy: AuditProjectServiceProxy,
        private sanitizer: DomSanitizer,
    ) {
        super(injector);
    }

    ngOnInit() {

    }
    ngAfterViewInit() {
    }
    reportGenerate(id) {        
        //this.reportUrl = this.reportName + '?id=' + id;
        this._auditServiceProxy.getCheckFileAndQuesgtionGenerated(id).subscribe(res => {
            if (res == true) {
                this.reportUrl = this.reportName + '?id=' + id;
                this.spinnerService.show();
            }        
        });
       
    }
    OnCustomizeExportOptions(event) {
        this.notify.info(this.l("Generate Report Successfully"));
        this.spinnerService.hide();
    }
}
