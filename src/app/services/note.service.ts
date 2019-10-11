import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';


@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpServiceService) { }

  fetchAllNotes(): any {
    let obs = this.http.fetchAllNotes();
    return obs;
  }

  saveNote(data){
    let obs = this.http.saveNote(data);
    obs.subscribe(response => {
      // Note was saved successfully
    }, error => {
      // Some error came in saving notes
    })
  }

  
}
