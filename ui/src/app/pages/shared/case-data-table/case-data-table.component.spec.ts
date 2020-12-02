import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDataTableComponent } from './case-data-table.component';

describe('CaseDataTableComponent', () => {
  let component: CaseDataTableComponent;
  let fixture: ComponentFixture<CaseDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
