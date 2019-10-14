import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';
import { FormControl } from '@angular/forms';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';

@Component({
  selector: 'app-archived-notes',
  templateUrl: './archived-notes.component.html',
  styleUrls: ['./archived-notes.component.scss']
})
export class ArchivedNotesComponent implements OnInit {


  noteColor = new FormControl('#FFFFFF');
  notesList: Array<any> = [];

  constructor(private noteSvc: NoteService, private dash: DashboardComponent) {

    this.dash.events.addListener('note-saved-in-database', () => {
      //Fetch all notes from database
      this.fetchAllNotes();
    })
  }

  //Fetch all the existing notes from database
  ngOnInit() {
    this.fetchAllNotes();
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

  //Delete a Note
  deleteNote(note) {
    let data = {
      noteIdList: [note.id],
      isDeleted: true
    }
    let obs = this.noteSvc.deleteNote(data);
    obs.subscribe(response => {
      this.fetchAllNotes();
    })
  }

  //archive a note
  unarchiveNote(note) {
    let data = {
      noteIdList: [note.id],
      isArchived: false
    }
    let obs = this.noteSvc.archiveNote(data);
    obs.subscribe(response => {
      this.fetchAllNotes();
    })
  }

  //Change Color of Card
  changeColor(card) {
    let data = {
      noteIdList: [card.id],
      color: this.noteColor.value
    };
    let obs = this.noteSvc.changeNoteColor(data);
    obs.subscribe(response => {
      this.fetchAllNotes();
    })
  }

  getBackgroundColor(arg) {
    return !arg ? '	#FFFFFF' : arg;
  }

}
