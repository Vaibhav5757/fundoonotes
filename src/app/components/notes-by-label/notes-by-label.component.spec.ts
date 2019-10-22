import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesByLabelComponent } from './notes-by-label.component';

describe('NotesByLabelComponent', () => {
  let component: NotesByLabelComponent;
  let fixture: ComponentFixture<NotesByLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesByLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesByLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
