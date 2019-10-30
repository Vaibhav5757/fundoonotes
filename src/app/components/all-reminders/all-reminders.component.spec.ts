import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRemindersComponent } from './all-reminders.component';

describe('AllRemindersComponent', () => {
  let component: AllRemindersComponent;
  let fixture: ComponentFixture<AllRemindersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllRemindersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRemindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
