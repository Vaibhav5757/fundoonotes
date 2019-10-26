import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCollaboratorInNewNoteComponent } from './add-collaborator-in-new-note.component';

describe('AddCollaboratorInNewNoteComponent', () => {
  let component: AddCollaboratorInNewNoteComponent;
  let fixture: ComponentFixture<AddCollaboratorInNewNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCollaboratorInNewNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCollaboratorInNewNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
