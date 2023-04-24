import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExternalFindingAssessmentModalComponent } from './add-external-finding-assessment-modal.component';

describe('AddExternalFindingAssessmentModalComponent', () => {
  let component: AddExternalFindingAssessmentModalComponent;
  let fixture: ComponentFixture<AddExternalFindingAssessmentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExternalFindingAssessmentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExternalFindingAssessmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
