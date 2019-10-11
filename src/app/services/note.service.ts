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
    let obs = this.http.fetchAllNotes();
    return obs;
  }

  saveNote(data){
    let obs = this.http.saveNote(data);
    obs.subscribe(response => {
      console.log(response);
      // Note was saved successfully
      this.events.emit('note-saved-in-database');
    }, error => {
      // Some error came in saving notes
    })
  }

  
}
