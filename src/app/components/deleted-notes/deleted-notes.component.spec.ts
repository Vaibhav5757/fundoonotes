import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedNotesComponent } from './deleted-notes.component';

describe('DeletedNotesComponent', () => {
  let component: DeletedNotesComponent;
  let fixture: ComponentFixture<DeletedNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletedNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
