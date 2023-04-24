import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessEntityDetailsComponent } from './business-entity-details.component';

describe('BusinessEntityDetailsComponent', () => {
  let component: BusinessEntityDetailsComponent;
  let fixture: ComponentFixture<BusinessEntityDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessEntityDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessEntityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
