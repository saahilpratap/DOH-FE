import {
  Component,
  Injector,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
  HostListener,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { SignaturePad } from "angular2-signaturepad/signature-pad";
import { IRMRelationDto } from "../../../../shared/service-proxies/service-proxies";
import { createEntityReviewApprovalSignatureModalComponent } from "../entity-review-approval-signature/create-entity-review-approval-signature-modal-component";

@Component({
  selector: "authority-review-approval",
  templateUrl: "./authority-review-approval.component.html",
})
export class AuthorityReviewApprovalComponent extends AppComponentBase
  implements AfterViewInit {
    @ViewChild(SignaturePad) signaturePad: SignaturePad;
    @ViewChild('createEntityReviewApprovalSignatureModal', { static: true }) createEntityReviewApprovalSignatureModal: createEntityReviewApprovalSignatureModalComponent;
  @Input("authorityUserSignaturePad") authorityUserSignaturePad: any;
  @Input("authorityReviewers") authorityReviewers: [];
    @Input("authorityApprovers") authorityApprovers: [];
    @Input('isEdit') isEdit: boolean;
    @Input('recordId') recordId: any;
    @Input('pageId') pageId: any;
  @Output() selectedAuthorityReviewers: EventEmitter<any> = new EventEmitter<
    any
  >();
  @Output() selectedAuthorityApprovers: EventEmitter<any> = new EventEmitter<
    any
  >();
  @Input("irm") irm = new IRMRelationDto();
  authorityReviewerArr = [];
  authorityApproverArr = [];
  @ViewChild("sigPad") sigPad;
  sigPadElement;
  context;
  isDrawing = false;

  signaturePadOptions: Object = {
    minWidth: 0.1,
    canvasWidth: 275,
    canvasHeight: 80,
    penColor: "rgb(0, 0, 128)",
    };
    signaturePadShow: boolean = false;
    authapproverpermissionShow: boolean = true;
    authreviewerPermissionShow: boolean = true;
  constructor(injector: Injector) {
    super(injector);
  }

    ngAfterViewInit() {
    this.authorityReviewers.forEach((obj: any) => {
      if (this.irm.authorityReviewers != undefined) {
        if (this.irm.authorityReviewers.find((u) => u == obj.id)) {
            this.authorityReviewerArr.push(obj);            
        }
      }
    });

    this.authorityApprovers.forEach((obj: any) => {
      if (this.irm.authorityApprovers != undefined) {
        if (this.irm.authorityApprovers.find((u) => u == obj.id)) {
          this.authorityApproverArr.push(obj);
        }
      }
    });


        this.authorityApprovers.forEach((obj: any) => {
            if (this.appSession.userId == obj.id) {
                this.authapproverpermissionShow = false;
                this.signaturePadShow = true;
            }
        });


        this.authorityReviewers.forEach((obj: any) => {
            if (this.appSession.userId == obj.id) {
                this.authreviewerPermissionShow = false;
            }
        });
  }

  authorityReviewerChange() {
    this.irm.authorityReviewers = this.authorityReviewerArr.map((i) => i.id);
  }

  authorityApporverChange() {
    this.irm.authorityApprovers = this.authorityApproverArr.map((i) => i.id);
    this.isDrawing = this.authorityApproverArr.length !== 0 ? true : false;
  }


    signatureUrl(e) {
        this.irm.signature = e; 
    }
    showEntityApproval() {
        this.createEntityReviewApprovalSignatureModal.show(this.recordId, this.pageId, 2);
    }
}
