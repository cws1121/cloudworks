import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseHeatmapComponent } from './case-heatmap.component';

describe('CaseHeatmapComponent', () => {
  let component: CaseHeatmapComponent;
  let fixture: ComponentFixture<CaseHeatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseHeatmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
