import {
    Component,
    Injector,
    ViewChild,
    ViewEncapsulation,
    AfterViewInit,
    Input,
    Output,
    EventEmitter,
} from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { PrimengTableHelper } from "../../../../shared/helpers/PrimengTableHelper";
import { LazyLoadEvent } from "primeng/public_api";
import { Table } from "primeng/table";
import { Paginator } from "primeng/paginator";
import { CreateEditAuditProjectManagementComponent } from "../../audit-project-management/create-edit-audit-project-management/create-edit-audit-project-management.component";
import { MeetingServiceProxy } from "../../../../shared/service-proxies/service-proxies";
import { string } from "@amcharts/amcharts4/core";
import { AppConsts } from "../../../../shared/AppConsts";
import { CreateEditMeetingComponent } from "../../meeting/create-edit-meeting/create-edit-meeting.component";
@Component({
    selector: "grid-meeting",
    templateUrl: "./grid-meeting.component.html",
})
export class GridMeetingComponent extends AppComponentBase
    implements AfterViewInit {
    @ViewChild("createEditMeetingModals", { static: true })
    createEditMeetingModals: CreateEditMeetingComponent;
    auditProjectManagementDetail: any;
    @Input("auditProjects") auditProjects: PrimengTableHelper;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    filterText = "";

    @Input("auditProjectBtn") auditProjectBtn: boolean;
    @Input("reauditPermission") reauditPermission: boolean;
    @Output() showTab = new EventEmitter();
    tabData = [{ tabName: "MettingTab", tabShow: true, currentMeetingId: null }];
    currentMeetingId: any;
    uploadUrl: string;
    @Input('auditProId') auditProID: any;
    @Input('vendorId') vendorId: any;
    id: any;
    constructor(
        injector: Injector,
        private _meetingServiceProxy: MeetingServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {       
    }

    ngAfterViewInit(): void {
        abp.event.on("app.onMeetingAdded", () => {         
            this.getAllMeetings();
        });
    }

    getAllMeetings(event?: LazyLoadEvent) {

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._meetingServiceProxy
            .getAuditMeetings(
                this.filterText,
                0,
                0,
                this.auditProID,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event)
            )
            .subscribe((result) => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    deleteAuditMeeting(id) {
        this.message.confirm("You Want To Delete This Record", this.l("Are you Sure?"),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._meetingServiceProxy.deleteAuditMeeting(id).subscribe((res) => {
                        this.notify.success(this.l("SuccessfullyDeleted"));
                        this.getAllMeetings();
                    });
                }
            });
    }
   
    showMeetingInAuditProject(id) {
        this.tabData[0].currentMeetingId = id;
        this.showTab.emit(this.tabData);
        // this.currentMeetingId = id;
    }

    convertPdf(id) {
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/CustomPdf/AuditPlanReportPDF?Id=' + id;
        window.open(this.uploadUrl, '_blank');
    }
}
