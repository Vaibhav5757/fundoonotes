import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinnedUnPinnedComponent } from './pinned-un-pinned.component';

describe('PinnedUnPinnedComponent', () => {
  let component: PinnedUnPinnedComponent;
  let fixture: ComponentFixture<PinnedUnPinnedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinnedUnPinnedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinnedUnPinnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
