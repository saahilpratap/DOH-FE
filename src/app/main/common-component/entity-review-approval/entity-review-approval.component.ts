import {
  Component,
  Injector,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
  HostListener,
  Output,
  Input,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { IRMRelationDto } from '../../../../shared/service-proxies/service-proxies';
import { createEntityReviewApprovalSignatureModalComponent } from '../entity-review-approval-signature/create-entity-review-approval-signature-modal-component';

@Component({
  selector: 'entity-review-approval',
  templateUrl: './entity-review-approval.component.html',
})
export class EntityReviewApprovalComponent extends AppComponentBase
    implements AfterViewInit {
    @ViewChild('createEntityReviewApprovalSignatureModal', { static: true }) createEntityReviewApprovalSignatureModal: createEntityReviewApprovalSignatureModalComponent;
  @Input('entityUserSignaturePad') entityUserSignaturePad: any;
  @Input('entityReviewers') entityReviewers: [];
  @Input('entityApprovers') entityApprovers: [];
  @Input('primaryReviewerId') primaryReviewerId: number;
    @Input('primaryApproverId') primaryApproverId: number;
    @Input('isEdit') isEdit: boolean;
    @Input('recordId') recordId: any;
    @Input('pageId') pageId: any;
  @Output() selectedEntityReviewers: EventEmitter<any> = new EventEmitter<
    any
  >();
  @Output() selectedEntityApprovers: EventEmitter<any> = new EventEmitter<
    any
  >();
  @Input('irm') irm = new IRMRelationDto();

  entityReviewerArr = [];
  entityApproverArr = [];
  @ViewChild('sigPad') sigPad;
  sigPadElement;
  context;
    isDrawing = false;
  signaturePadOptions: Object = {
    minWidth: 0.1,
    canvasWidth: 275,
    canvasHeight: 80,
    penColor: 'rgb(0, 0, 128)',
  };
    signatureShow: boolean = false;
    approverpermissionShow: boolean = true;
    reviewerPermissionShow: boolean = true;
  constructor(injector: Injector) {
    super(injector);
  }

  ngAfterViewInit() {
    this.entityReviewers.forEach((obj: any) => {
      if (this.irm.entityReviewers != undefined) {
        if (this.irm.entityReviewers.find((u) => u == obj.id)) {
          this.entityReviewerArr.push(obj);
        }
      }
    });

    //if (
    //  this.irm.entityReviewers == undefined ||
    //  this.irm.entityReviewers.length == 0
    //) {
    //  let reviewer = this.entityReviewers.filter(
    //    (a: any) => a.id == this.primaryReviewerId
    //  );
    //  if (reviewer.length > 0) {
    //    this.entityReviewerArr.push(reviewer[0]);
    //  }
    //}

    //if (
    //  this.irm.entityApprovers == undefined ||
    //  this.irm.entityApprovers.length == 0
    //) {
    //  let approver = this.entityApprovers.filter(
    //    (a: any) => a.id == this.primaryApproverId
    //  );
    //  if (approver.length > 0) {
    //    this.entityApproverArr.push(approver[0]);
    //  }
    //}

    this.entityApprovers.forEach((obj: any) => {
      if (this.irm.entityApprovers != undefined) {
        if (this.irm.entityApprovers.find((u) => u == obj.id)) {
          this.entityApproverArr.push(obj);
        }
      }
    });

      this.entityApprovers.forEach((obj: any) => {
          if (this.appSession.userId == obj.id) {
              this.approverpermissionShow = false;
              this.signatureShow = true;
          }
      });

      this.entityReviewers.forEach((obj: any) => {
          if (this.appSession.userId == obj.id) {
              this.reviewerPermissionShow = false;              
          }
      });
  }

    checkEntityReviewer() {
        

    }

  entityReviewerChange() {
    this.irm.entityReviewers = this.entityReviewerArr.map((i) => i.id);
  }

  entityApporverChange() {
    this.irm.entityApprovers = this.entityApproverArr.map((i) => i.id);
    this.isDrawing = this.entityApproverArr.length !== 0 ? true : false;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(e) {
    this.isDrawing = false;
  }

  onMouseDown(e) {
    if (this.entityApproverArr.length !== 0) {
      this.isDrawing = true;
      const coords = this.relativeCoords(e);
      this.context.moveTo(coords.x, coords.y);
      this.irm.signature = this.sigPadElement.toDataURL('image/png');
    }
  }

  onMouseMove(e) {
    if (this.isDrawing) {
      const coords = this.relativeCoords(e);
      this.context.lineTo(coords.x, coords.y);
      this.context.stroke();
      this.irm.signature = this.sigPadElement.toDataURL('image/png');
    }
  }

  private relativeCoords(event) {
    const bounds = event.target.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    return { x: x, y: y };
  }

  clear() {
    this.context.clearRect(
      0,
      0,
      this.sigPadElement.width,
      this.sigPadElement.height
    );
    this.context.beginPath();
    }
    signatureUrl(e) {
        this.irm.signature = e;
    }

    showEntityApproval() {
        this.createEntityReviewApprovalSignatureModal.show(this.recordId, this.pageId,1);
    }
}
