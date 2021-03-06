import { Component, OnInit, ViewChild } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';
import { FormControl } from '@angular/forms';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { MatSnackBar, MatDialog, MatMenuTrigger } from '@angular/material';
import { EditNoteComponent } from '../edit-note/edit-note.component';
import { Title } from '@angular/platform-browser';
import { AddCollaboratorComponent } from '../add-collaborator/add-collaborator.component';
import { cardFallEffect } from "src/app/scss/animations";
import { trigger, transition, useAnimation } from '@angular/animations';

@Component({
  selector: 'app-archived-notes',
  templateUrl: './archived-notes.component.html',
  styleUrls: ['./archived-notes.component.scss'],
  animations: [
    trigger('card-fall-effect', [
      transition('* => *', [
        useAnimation(cardFallEffect)
      ])
    ])
  ]
})
export class ArchivedNotesComponent implements OnInit {
  @ViewChild('menuTrigger') trigger: MatMenuTrigger;

  notesList: Array<any> = [];
  notesLayout: boolean = true;
  label = new FormControl('');
  existingLabels = [];
  searchWord: any;


  constructor(private titleService: Title, private noteSvc: NoteService, private dash: DashboardComponent,
    private snackBar: MatSnackBar, private dialog: MatDialog) {

    this.setTitle("Archived Notes");

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
    this.fetchAllLabels();
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  //Fetch all notes
  fetchAllNotes() {
    let obs = this.noteSvc.getArchivedNotes();

    obs.subscribe((response:any) => {
      this.notesList = response.data.data;
    }, (error) => {
      console.log(error);
    })
  }

  //Delete a Note
  deleteNote(note) {
    let data = {
      noteIdList: [note.id],
      isDeleted: true
    }
    let obs = this.noteSvc.deleteNote(data);
    obs.subscribe(response => {
      this.fetchAllNotes();
      this.snackBar.open("Note Deleted", '', {
        duration: 1500
      })
    })
  }

  //archive a note
  unarchiveNote(note) {
    let data = {
      noteIdList: [note.id],
      isArchived: false
    }
    let obs = this.noteSvc.archiveNote(data);
    obs.subscribe(response => {
      this.fetchAllNotes();
      this.snackBar.open("Note Unarchived", '', {
        duration: 1500
      })
    })
  }

  getBackgroundColor(arg) {
    return !arg ? '	#FFFFFF' : arg;
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


  openEditor(note) {
    let obs = this.dialog.open(EditNoteComponent, {
      data: note,
      width: "550px",
      panelClass: 'dialogBox'
    });
    obs.afterClosed().subscribe(result => {
      if (result) {
        // Update the note
        let data = {
          noteId: result.id,
          title: result.title,
          description: result.description,
          color: result.color
        }

        let obs = this.noteSvc.updateNote(data);

        obs.subscribe((response) => {
          //fetch All Notes after updating
          this.fetchAllNotes();
        })
      }
    })
  }

  checkListStatus(list) {
    return list.status === "close" ? true : false;
  }

  checkListChange(list) {
    if (list.status === "open") list.status = "close"
    else list.status = "open"
    let obs = this.noteSvc.updateCheckList(list);
    obs.subscribe((response) => {
      this.fetchAllNotes();
    })
  }

  deleteLabel(label, note) {
    let obs = this.noteSvc.deleteLabelFromNote({
      noteId: note.id,
      labelId: label.id
    })

    obs.subscribe(() => {
      this.snackBar.open("Label Deleted", '', {
        duration: 1500
      })
      this.fetchAllNotes();
      this.dash.events.emit('label-modified');
    })
  }

  //Event bubbling
  stopPropagation(event) {
    event.stopPropagation();
  }

  addLabel(note) {
    let data = {
      label: this.label.value,
      isDeleted: false,
      userId: note.userId
    }
    let obs = this.noteSvc.addLabel(note.id, data);
    obs.subscribe(() => {
      this.fetchAllNotes();
      this.dash.events.emit('label-modified');
    })
    this.label.setValue('');
  }

  fetchAllLabels() {
    let obs = this.noteSvc.fetchAllLabel();
    obs.subscribe((response: any) => {
      this.existingLabels = response.data.details;
    })
  }

  addLabelsFromExistingLabels(label, note) {
    let data = {
      lableId: label.id,
      noteId: note.id
    }
    let obs = this.noteSvc.addExistingLabel(data);
    obs.subscribe(() => {
      this.fetchAllNotes();
      this.dash.events.emit('label-modified');
      this.fetchAllLabels();
    })
  }

  isLabelPresent(label, note) {
    for (let noteLabel of note.noteLabels) {
      if (noteLabel.label === label.label) return true;
    }
    return false;
  }

  addCollaborator(note) {
    let obs = this.dialog.open(AddCollaboratorComponent, {
      width: '1100px',
      panelClass: 'dialogBox',
      data: note
    })
    obs.afterClosed().subscribe(() => {
      this.fetchAllNotes();
    })
  }

  removeReminder(note) {
    let obs = this.noteSvc.removeReminder({
      noteIdList: [note.id]
    })
    obs.subscribe((response) => {
      note.reminder = [];
    })
  }

  redirectToQuestionAnswer(noteId) {
    this.dash.redirectToQuestionAnswers(noteId);
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
