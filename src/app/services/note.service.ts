import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';


@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpServiceService) { }

  fetchAllNotes(token): any {
    let obs = this.http.fetchAllNotes(token);
    obs.subscribe((response) => {
      return response
    }, (error) => {
      console.log(error);
    })
  }

}
