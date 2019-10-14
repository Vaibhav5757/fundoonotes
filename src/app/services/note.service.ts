import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';


@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpServiceService) { }

  fetchAllNotes(): any {
    return this.http.get('notes/getNotesList');
  }

  saveNote(data) {
    return this.http.post("notes/addNotes", data);
  }

  deleteNote(data) {
    return this.http.post("notes/trashNotes", data);
  }

  changeNoteColor(data) {
    return this.http.post("notes/changesColorNotes", data);
  }

  archiveNote(data) {
    return this.http.post("notes/archiveNotes", data);
  }
}
