import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';
import { FormControl } from '@angular/forms';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-deleted-notes',
  templateUrl: './deleted-notes.component.html',
  styleUrls: ['./deleted-notes.component.scss']
})
export class DeletedNotesComponent implements OnInit {

  public defaultColors1: string[] = [
    '#ffffff',
    '#BDD561',
    '#3e6158'
  ];

  public defaultColors2: string[] = [
    '#3f7a89',
    '#96c582',
    '#b7d5c4'
  ];

  public defaultColors3: string[] = [
    '#bcd6e7',
    '#7c90c1',
    '#9d8594'
  ];


  noteColor = new FormControl('#FFFFFF');
  notesList: Array<any> = [];
  notesLayout: boolean = true;

  constructor(private noteSvc: NoteService, private dash: DashboardComponent,
    private titleService: Title,
    private snackBar: MatSnackBar) {

    this.setTitle("Recycle Bin");

    this.dash.events.addListener('note-saved-in-database', () => {
      //Fetch all notes from database
      this.fetchAllNotes();
    })

    this.dash.events.addListener('change-layout', () => {
      //Change Layout of Notes
      this.notesLayout = !this.notesLayout;
    })

    this.dash.events.addListener('searching-forward', () => {
      this.filterNotes(this.dash.search.value);
    })

    this.dash.events.addListener('searching-backward', () => {
      this.fetchAllNotes();
      this.filterNotes(this.dash.search.value);
    })
  }

  //Fetch all the existing notes from database
  ngOnInit() {
    this.fetchAllNotes();
    this.notesLayout = this.dash.getLayout() ? false : true;
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
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

  //restore a Note
  restoreNote(note) {
    let data = {
      noteIdList: [note.id],
      isDeleted: false
    }
    let obs = this.noteSvc.deleteNote(data);
    obs.subscribe(response => {
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
    obs.subscribe(response => {
      this.fetchAllNotes();
      this.snackBar.open("Note Deleted Permanently", '', {
        duration: 1500
      })
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
      this.snackBar.open("Note Archived", '', {
        duration: 1500
      })
    })
  }

  //Change Color of Card
  changeColor(paint, card) {
    let data = {
      noteIdList: [card.id],
      color: paint
    };
    let obs = this.noteSvc.changeNoteColor(data);
    obs.subscribe(response => {
      this.fetchAllNotes();
    })
  }

  getBackgroundColor(arg) {
    return !arg ? '	#FFFFFF' : arg;
  }

  getMargin() {
    return this.notesLayout ? 0 : "25%";
  }

  filterNotes(str) {

    // filter notes
    let tempList = [];
    for (let noteIndex in this.notesList) {
      if (this.notesList[noteIndex].description.includes(str)) {
        tempList.push(this.notesList[noteIndex]);
      }
    }
    this.notesList = tempList;
  }

}
