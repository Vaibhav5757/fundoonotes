import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';
import { Title } from '@angular/platform-browser';



@Component({
  selector: 'app-all-reminders',
  templateUrl: './all-reminders.component.html',
  styleUrls: ['./all-reminders.component.scss']
})
export class AllRemindersComponent implements OnInit {
  notesList: Array<any> = [];
  constructor(private noteSvc: NoteService, private titleService: Title, ) {
    this.setTitle("Reminders");
  }

  //Fetch all the existing notes from database
  ngOnInit() {
    this.fetchAllNotes();
  }

  fetchAllNotes() {
    let obs = this.noteSvc.fetchAllReminderNotes();
    obs.subscribe((response: any) => {
      this.notesList = response.data.data;
    })
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}