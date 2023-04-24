import { Component, OnInit, Injector, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { MeetingTemplateServiceProxy, MeetingTemplateDto  } from '../../../../shared/service-proxies/service-proxies';
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { SummernoteTextEditorComponent } from '../../../shared/common/summernote-text-editor/summernote-text-editor.component';
import { SummernoteTextEditorService } from '../../../shared/common/summernote-text-editor/summernote-text-editor.service';
declare var $;

@Component({
    selector: 'MeetingTemplateModals',
    templateUrl: './meeting-template-modal.component.html',
    styleUrls: ['./meeting-template-modal.component.css']
})
export class MeetingTemplateModalComponent extends AppComponentBase {
    active = false;
    saving = false;
    @ViewChild('MeetingTemplateModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(SummernoteTextEditorComponent) summerNote: SummernoteTextEditorComponent;
    meetingInput: MeetingTemplateDto = new MeetingTemplateDto();
    meetingTemplateId: number = 0;  

    constructor(_injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _meetingTemplateServiceProxy: MeetingTemplateServiceProxy,
        private summernoteTextEditorService: SummernoteTextEditorService,
    ) {
        super(_injector);
    }

    show(Id: number) {
        this.meetingTemplateId = Id;
        if (Id == 0) {
            this.active = true;
            this.modal.show();
        }
        else {
            this.getAllMeetingTemplates(this.meetingTemplateId);
        }
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    getAllMeetingTemplates(val: number) {
        this._meetingTemplateServiceProxy.getMeetingTemplateById(val).subscribe(res => {
            this.meetingInput = res;
            //this.summerNote.getData(res.templateJson);
            this.summernoteTextEditorService.setData(res.templateJson);
            this.active = true;
            this.modal.show();
            
        })
    }

    save() {
        this._meetingTemplateServiceProxy.createOrUpdateMeetingTemplate(this.meetingInput).subscribe(res => {
            this.close();
            this.modalSave.emit(null);
        })
    }
    setSummerNoteData(e) {
        this.meetingInput.templateJson = e;
    }
}
