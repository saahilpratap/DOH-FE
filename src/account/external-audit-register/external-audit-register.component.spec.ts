import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAuditRegisterComponent } from './external-audit-register.component';

describe('ExternalAuditRegisterComponent', () => {
  let component: ExternalAuditRegisterComponent;
  let fixture: ComponentFixture<ExternalAuditRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalAuditRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAuditRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
