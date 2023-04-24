import {
    Injectable,
    Component,
    ViewChild,
    Output,
    EventEmitter,
    Injector,
    OnInit,
    HostListener
} from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { ModalDirective } from "ngx-bootstrap";
import { EntityApplicationSettingServiceProxy, AssessmentAgreementResponseInput, AssessmentServiceProxy, AssessmentWithBusinessEntityNameDto, MultipleAssessmentAgreementResponseInputDto } from '@shared/service-proxies/service-proxies';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: "app-assessment-agreement-modal",
    templateUrl: "./assessment-agreement-modal.component.html",
    styleUrls: ["./assessment-agreement-modal.component.css"]
})
export class AssessmentAgreementModalComponent extends AppComponentBase
    implements OnInit {
    @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    signature: string = "";
    hasAccepted: boolean = false;
    sigPadElement;
    context;
    isDrawing = false;
    img;
    textMessage: any;
    flag: boolean = false;
    assessmentId: number = 0;
    selectedCopyToChildBusinessEntity: AssessmentWithBusinessEntityNameDto[] = [];
    isSelfAssessment: boolean = false;
    constructor(injector: Injector, private _entityApplicationSettingService: EntityApplicationSettingServiceProxy, private _assessmentServiceProxy: AssessmentServiceProxy) {
        super(injector);
    }

    ngOnInit() {
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(e) {
        this.isDrawing = false;
    }

    editorConfig: AngularEditorConfig = {
        editable: false,
        spellcheck: false,
        height: 'auto',
        minHeight: '0',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: false,
        showToolbar: false,
        placeholder: '',
        defaultParagraphSeparator: '',
        defaultFontName: '',
        defaultFontSize: '',

        fonts: [
            { class: 'arial', name: 'Arial' },
            { class: 'times-new-roman', name: 'Times New Roman' },
            { class: 'calibri', name: 'Calibri' },
            { class: 'comic-sans-ms', name: 'Comic Sans MS' }
        ],
        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
        uploadUrl: 'v1/image',
        uploadWithCredentials: false,
        sanitize: false,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            ['bold', 'italic'],
            ['fontSize']
        ]

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

    saveSign() {
        this.img = this.sigPadElement.toDataURL("image/png");
        console.log(this.img);
    }

    hasAcceptedAgreement(): boolean {
        return (
            this.hasAccepted && this.signature != null && this.signature != ""
        );
    }
    show(isInternal: boolean, val: boolean, id: number, val2: AssessmentWithBusinessEntityNameDto[]) {
        this.flag = val;
        this.assessmentId = id;
        this.isSelfAssessment = isInternal;
        this.selectedCopyToChildBusinessEntity = val2;
        this.active = true;
        this.hasAccepted = false;
        this.signature = "";
        this.getappSetting();
        this.modal.show();
    }
    getappSetting() {
        this._entityApplicationSettingService.getApplicationSettings().subscribe(res => {
            this.textMessage = res.agreementAcceptanceMsg;
        });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
    signatureUrl(e) {
        this.signature = e;
    }
    save(): void {
        if (this.isSelfAssessment) {
            this.tryPublish();
        }
        else {
            this.saving = true;
            this.notify.info(this.l("SavedSuccessfully"));
            this.modalSave.emit(null);
            this.close();
        }
    }

    tryPublish() {
        if (this.hasAcceptedAgreement()) {
            if (this.selectedCopyToChildBusinessEntity == null) {
                let input = new AssessmentAgreementResponseInput();
                input.signature = this.signature;
                input.hasAccepted = true;
                input.assessmentId = this.assessmentId;
                this._assessmentServiceProxy
                    .acceptAgreementTerms(input)
                    .subscribe(() => {
                        this.message.info("Agreement acceptance saved succesfully!");
                        this.saving = true;
                        this.notify.info(this.l("SavedSuccessfully"));
                        this.modalSave.emit(null);
                        this.close();
                    });
            }
            else {
                let input = new MultipleAssessmentAgreementResponseInputDto();
                input.assessmentAgreementResponseInput = new AssessmentAgreementResponseInput();
                input.assessmentAgreementResponseInput.signature = this.signature;
                input.assessmentAgreementResponseInput.hasAccepted = true;
                input.assessmentAgreementResponseInput.assessmentId = this.assessmentId;
                input.assessmentWithBusinessEntity = this.selectedCopyToChildBusinessEntity;
                this._assessmentServiceProxy
                    .acceptMultipleAgreementTerms(input)
                    .subscribe(() => {
                        this.message.info("Agreement acceptance saved succesfully!");
                        this.saving = true;
                        this.notify.info(this.l("SavedSuccessfully"));
                        this.modalSave.emit(null);
                        this.close();
                    });
            }
        } else {
            this.message.error(
                "Before assessment submission - Please agree to terms of agreement!"
            );
        }

    }

}
