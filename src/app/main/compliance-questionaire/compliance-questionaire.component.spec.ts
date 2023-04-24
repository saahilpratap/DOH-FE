import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceQuestionaireComponent } from './compliance-questionaire.component';

describe('ComplianceQuestionaireComponent', () => {
  let component: ComplianceQuestionaireComponent;
  let fixture: ComponentFixture<ComplianceQuestionaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplianceQuestionaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceQuestionaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
