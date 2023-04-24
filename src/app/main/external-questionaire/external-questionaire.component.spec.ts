import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalQuestionaireComponent } from './external-questionaire.component';

describe('ExternalQuestionaireComponent', () => {
  let component: ExternalQuestionaireComponent;
  let fixture: ComponentFixture<ExternalQuestionaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalQuestionaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalQuestionaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
