import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  notesList: Array<any> = [];
  token: String;

  constructor(private noteSvc: NoteService) {
    
    this.noteSvc.events.addListener('note-saved-in-database', () => {
      //Fetch all notes from database
      this.fetchAllNotes();
    })
    
  }

  //Fetch all notes
  fetchAllNotes() {
    let obs = this.noteSvc.fetchAllNotes();

    obs.subscribe((response) => {
      this.notesList = response.data.data;
    }, (error) => {
      console.log(error);
    })
  }

  //Fetch all the existing notes from database
  ngOnInit() {
    this.fetchAllNotes();
  }
}
