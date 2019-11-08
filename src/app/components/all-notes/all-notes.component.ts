import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-all-notes',
  templateUrl: './all-notes.component.html',
  styleUrls: ['./all-notes.component.scss']
})
export class AllNotesComponent implements OnInit {
  notesList: Array<any> = [];
  constructor(private noteSvc: NoteService) {
  }

  //Fetch all the existing notes from database
  ngOnInit() {
    this.fetchAllNotes();
  }

  fetchAllNotes() {
    let obs = this.noteSvc.fetchAllNotes();
    obs.subscribe((response => {
      this.notesList = response.data.data;
    }))
  }
}