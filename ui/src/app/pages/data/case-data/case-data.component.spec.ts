import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDataComponent } from './case-data.component';

describe('CaseDataComponent', () => {
  let component: CaseDataComponent;
  let fixture: ComponentFixture<CaseDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
