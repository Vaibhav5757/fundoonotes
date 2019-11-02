import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAnswerOfNoteComponent } from './question-answer-of-note.component';

describe('QuestionAnswerOfNoteComponent', () => {
  let component: QuestionAnswerOfNoteComponent;
  let fixture: ComponentFixture<QuestionAnswerOfNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAnswerOfNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnswerOfNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
