import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';
import { FormControl } from '@angular/forms';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';


@Component({
  selector: 'app-deleted-notes',
  templateUrl: './deleted-notes.component.html',
  styleUrls: ['./deleted-notes.component.scss']
})
export class DeletedNotesComponent implements OnInit {

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
  restoreNote(note) {
    let data = {
      noteIdList: [note.id],
      isDeleted: false
    }
    let obs = this.noteSvc.deleteNote(data);
    obs.subscribe(response => {
      this.fetchAllNotes();
    })
  }

  //archive a note
  archiveNote(note) {
    let data = {
      noteIdList: [note.id],
      isArchived: true
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
