import {
    Component,
    ViewChild,
    Injector,
    Output,
    EventEmitter,
    OnInit,
    HostListener
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/common/app-component-base";
import * as moment from "moment";
import { AppSessionService } from "@shared/common/session/app-session.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ExternalAssessmentsServiceProxy, AuthoritativeDocumentsServiceProxy, BusinessEntitiesServiceProxy, ExternalAssessmentAuditWorkPaperDto, AttachmentWithTitleDto } from "../../../../../shared/service-proxies/service-proxies";
import { StorageServiceProxy } from "../../../../../shared/service-proxies/services/storage.service";
import { FileDownloadService } from "../../../../../shared/utils/file-download.service";

@Component({
    selector: "addExternalAssessmentWorkModals",
    templateUrl: "./add-externalAssessment-work-paper-modal.component.html",
    styleUrls: ["./add-externalAssessment-work-paper-modal.component.css"]
})
export class ExternalAssessmentWorkPaperModalComponent
    extends AppComponentBase
    implements OnInit {
    @ViewChild("addExternalAssessmentWorkModal", { static: true }) modal: ModalDirective;
    @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

    workPaperData = new ExternalAssessmentAuditWorkPaperDto();
    active = false;
    saving = false;
    model = [];
    @ViewChild('sigPad') sigPad;
    sigPadElement;
    context;
    isDrawing = false;
    img;
    meetingAgenda = new AttachmentWithTitleDto();
    mgmtChecklist = new AttachmentWithTitleDto();
    generalAttachment = new AttachmentWithTitleDto();
    attachedFileCodes = [];
    externalAssessmentId = 0;
    signImg: any;
    constructor(
        injector: Injector,
        private _externalAssessmentService: ExternalAssessmentsServiceProxy,
        private _storageService: StorageServiceProxy, private _fileDownloadService: FileDownloadService,
    ) {
        super(injector);
    }

    ngOnInit(): void {

    }

    addNew(externalAssessmentId?: number): void {
        this.active = true;
        this.externalAssessmentId = externalAssessmentId;
        this.modal.show();
        setTimeout(() => {
            this.sigPadElement = this.sigPad.nativeElement;
            this.sigPadElement.style.border = "solid";
            this.context = this.sigPadElement.getContext('2d');
            this.context.strokeStyle = '#000000';
        }, 1000);
    }

    editWorkLoadPaper(workPaper) {
        this.active = true;
        this.workPaperData = workPaper;
        this.externalAssessmentId = workPaper.externalAssessmentId;
        this.meetingAgenda.title = workPaper.meetingAgenda;
        this.meetingAgenda.code = workPaper.meetingAgendaCode;
        this.mgmtChecklist.title = workPaper.mgmtChecklist;
        this.mgmtChecklist.code = workPaper.mgmtChecklistCode;
        this.generalAttachment.title = workPaper.generalAttachment;
        this.generalAttachment.code = workPaper.generalAttachmentCode;
        this.signImg = workPaper.signature;
        if (workPaper.signature == null) {
            setTimeout(() => {
                this.sigPadElement = this.sigPad.nativeElement;
                this.sigPadElement.style.border = "solid";
                this.context = this.sigPadElement.getContext('2d');
                this.context.strokeStyle = '#000000';
            }, 1000);
        }

        this.modal.show();
    }
    signatureUrl(e) {
        this.workPaperData.signature = e;
    }
    save(): void {
        //this.workPaperData.signature = this.sigPadElement.toDataURL("image/png");
        this.workPaperData.meetingAgenda = this.meetingAgenda.title;
        this.workPaperData.mgmtChecklist = this.mgmtChecklist.title;
        this.workPaperData.generalAttachment = this.generalAttachment.title;
        this.workPaperData.externalAssessmentId = this.externalAssessmentId;
        this.workPaperData.tenantId = this.appSession.tenantId;
        this.spinnerService.show();
        this._externalAssessmentService.addExternalAssessmentWorkPaper(this.workPaperData).subscribe(result => {
            this.spinnerService.hide();
            this.notify.success(this.l('SuccessfullySaved'));
            this.closeModal.emit(this.workPaperData);
            this.close();
        });
    }

    close(): void {
        this.workPaperData = new ExternalAssessmentAuditWorkPaperDto();
        this.meetingAgenda = new AttachmentWithTitleDto();
        this.mgmtChecklist = new AttachmentWithTitleDto();
        this.generalAttachment = new AttachmentWithTitleDto();
        this.modal.hide();
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(e) {
        this.isDrawing = false;
    }

    onMouseDown(e) {
        this.isDrawing = true;
        const coords = this.relativeCoords(e);
        this.context.moveTo(coords.x, coords.y);
    }

    onMouseMove(e) {
        if (this.isDrawing) {
            const coords = this.relativeCoords(e);
            this.context.lineTo(coords.x, coords.y);
            this.context.stroke();
        }
    }

    private relativeCoords(event) {
        const bounds = event.target.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        return { x: x, y: y };
    }

    clear() {
        this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
        this.context.beginPath();
    }

    newSign() {
        this.signImg = undefined;
        setTimeout(() => {
            this.sigPadElement = this.sigPad.nativeElement;
            this.sigPadElement.style.border = "solid";
            this.context = this.sigPadElement.getContext('2d');
            this.context.strokeStyle = '#000000';
        }, 1000);
    }

    downloadAttachment(code: string) {
        const self = this;
        self._fileDownloadService.downloadAttachment(code);
    }

    deleteAttachmentInput(input, type) {
        const self = this;
        self._fileDownloadService.removeAttachment(input.code).subscribe(res => {
            switch (type) {
                case 1:
                    this.meetingAgenda = new AttachmentWithTitleDto();
                    this.workPaperData.meetingAgendaCode = "";
                    this.workPaperData.meetingAgenda = "";
                    break;
                case 2:
                    this.mgmtChecklist = new AttachmentWithTitleDto();
                    this.workPaperData.mgmtChecklistCode = "";
                    this.workPaperData.mgmtChecklist = "";
                    break;
                case 3:
                    this.generalAttachment = new AttachmentWithTitleDto();
                    this.workPaperData.generalAttachmentCode = "";
                    this.workPaperData.generalAttachment = "";
                    break;
                default:
            }
            this.notify.success("File removed Successfully");
        });
    }

    uploadAttachment(event: any, attachment: AttachmentWithTitleDto, type) {
        var file = event.target.files[0];
        let formData: FormData = new FormData();
        formData.append("file", file, file.name);
        formData.append("title", attachment.title);

        this.spinnerService.show();
        this._storageService.AddAttachment(formData).subscribe(
            res => {
                this.spinnerService.hide();
                attachment.code = res.result.code;
                switch (type) {
                    case 1: this.workPaperData.meetingAgendaCode = attachment.code;
                        break;
                    case 2: this.workPaperData.mgmtChecklistCode = attachment.code;
                        break;
                    case 3: this.workPaperData.generalAttachmentCode = attachment.code;
                        break;
                    default:
                }
                event.target.value = "";
            },
            error => {
                console.log(error);
                this.spinnerService.hide();
                this.message.error(
                    "Couldn't upload file at this time, try later :)!"
                );
            }
        );
    }
}
