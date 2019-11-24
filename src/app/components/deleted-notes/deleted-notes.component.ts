import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-deleted-notes',
  templateUrl: './deleted-notes.component.html',
  styleUrls: ['./deleted-notes.component.scss']
})
export class DeletedNotesComponent implements OnInit {
 
  notesList: Array<any> = [];
  notesLayout: boolean = true;
  searchWord: any;
  hideProgressBar: Boolean = false;

  constructor(private noteSvc: NoteService, private dash: DashboardComponent,
    private titleService: Title,
    private snackBar: MatSnackBar) {

    this.setTitle("Recycle Bin");

    this.hideProgressBar = false;

    this.dash.events.addListener('note-saved-in-database', () => {
      //Fetch all notes from database
      this.fetchAllNotes();
    })

    this.dash.events.addListener('change-layout', () => {
      //Change Layout of Notes
      this.notesLayout = !this.notesLayout;
    })

    this.dash.events.addListener('searching-forward', () => {
      this.searchWord = this.dash.search.value;
    })

    this.dash.events.addListener('searching-backward', () => {
      this.searchWord = this.dash.search.value;
    })
  }

  //Fetch all the existing notes from database
  ngOnInit() {
    this.fetchAllNotes();
    this.notesLayout = this.dash.getLayout() ? false : true;
    setInterval(() => this.hideProgressBar = true, 3000);
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  //Fetch all notes
  fetchAllNotes() {
    let obs = this.noteSvc.getDeletedNotes();

    obs.subscribe((response: any) => {
      this.notesList = response.data.data;
    }, (error) => {
      console.log(error);
    })
  }

  //restore a Note
  restoreNote(note) {
    let data = {
      noteIdList: [note.id],
      isDeleted: false
    }
    let obs = this.noteSvc.deleteNote(data);
    obs.subscribe(() => {
      this.fetchAllNotes();
      this.snackBar.open("Note Restored", '', {
        duration: 1500
      })
    })
  }

  //delete a note forever
  deleteForever(note) {
    let data = {
      noteIdList: [note.id],
    }
    let obs = this.noteSvc.deleteForever(data);
    obs.subscribe(() => {
      this.fetchAllNotes();
      this.snackBar.open("Note Deleted Permanently", '', {
        duration: 1500
      })
    })
  }

  getBackgroundColor(arg) {
    return !arg ? '	#FFFFFF' : arg;
  }

  checkListChange() {
    this.snackBar.open("Editing Notes not possible in Bin", '', {
      duration: 1500
    })
  }

  checkListStatus(list) {
    return list.status === "close" ? true : false;
  }

  removeReminder() {
    this.snackBar.open("Removing Reminder not supported in Bin");
  }

  checkReminder(note) {
    let today = new Date();
    let givenDate = new Date(note.reminder);

    let dateWithNoTimezone = new Date(
      givenDate.getUTCFullYear(),
      givenDate.getUTCMonth(),
      givenDate.getUTCDate(),
      givenDate.getUTCHours(),
      givenDate.getUTCMinutes(),
      givenDate.getUTCSeconds()
    );
    return (today > dateWithNoTimezone);
  }
}
