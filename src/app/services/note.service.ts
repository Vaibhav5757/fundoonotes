import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';
import { EventEmitter } from 'events';


@Injectable({
  providedIn: 'root'
})
export class NoteService {

  events = new EventEmitter();

  constructor(private http: HttpServiceService) { }

  fetchAllNotes(): any {
    return this.http.get('notes/getNotesList');
  }

  saveNote(data) {
    let obs = this.http.post("notes/addNotes", data);
    obs.subscribe(response => {
      // Note was saved successfully
      this.events.emit('note-saved-in-database');
    }, error => {
      // Some error came in saving notes
    })
  }


  deleteNote(data) {
    let obs = this.http.post("notes/trashNotes", data);
    obs.subscribe(response => {
      //Note Deleted Successfully
      this.events.emit('note-deleted-in-database');
    }, error => {
      //Some error in deleting Note
    })
  }

  changeNoteColor(data) {
    let obs = this.http.post("notes/changesColorNotes", data);
    obs.subscribe(response => {
      //Color of note changed
      this.events.emit('note-color-changed-in-database');
    }, error => {
      //Some error in changing color of note
    })
  }

  archiveNote(data) {
    let obs = this.http.post("notes/archiveNotes", data);
    obs.subscribe(response => {
      //Note Archived
      this.events.emit('note-archived-in-database');
    }, error => {
      //Some error in archiving note
    })
  }
}
