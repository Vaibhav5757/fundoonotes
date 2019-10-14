import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  noteColor = new FormControl('#FFFFFF');
  notesList: Array<any> = [];

  constructor(private noteSvc: NoteService) {

    this.noteSvc.events.addListener('note-saved-in-database', () => {
      //Fetch all notes from database
      this.fetchAllNotes();
    })

    this.noteSvc.events.addListener('note-deleted-in-database', () => {
      //Fetch all notes from database
      this.fetchAllNotes();
    })

    this.noteSvc.events.addListener('note-archived-in-database', () => {
      //Fetch all notes from database
      this.fetchAllNotes();
    })

    this.noteSvc.events.addListener('note-color-changed-in-database', () => {
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

  //Delete a Note
  deleteNote(note) {
    let data = {
      noteIdList: [note.id],
      isDeleted: true
    }
    this.noteSvc.deleteNote(data);  
  }

  //archive a note
  archiveNote(note) {
    let data = {
      noteIdList: [note.id],
      isArchived: true
    }
    this.noteSvc.archiveNote(data);  
  }

  getBackgroundColor(arg) {
    return !arg ? '	#FFFFFF' : arg;
  }

  changeColor(card) {
    let data = {
      noteIdList: [card.id],
      color: this.noteColor.value
    };
    this.noteSvc.changeNoteColor(data);
  }
}
