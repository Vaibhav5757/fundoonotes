import { Component, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { MatMenuTrigger, MatSnackBar, MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { NoteService } from 'src/app/services/note.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Router } from '@angular/router';
import { EditNoteComponent } from '../edit-note/edit-note.component';
import { AddCollaboratorComponent } from '../add-collaborator/add-collaborator.component';
import { trigger, animate, style, transition, state } from '@angular/animations';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  animations: [
    trigger('fade', [

      state('void', style({
        opacity: 0
      })),

      transition('void <=> *', [
        animate(1000)
      ])
    ])
  ]
})
export class NoteComponent implements OnChanges {

  @Input('notes') notesList;
  @Input('label') labelName;
  @Input('labels') existingLabels;
  @Output() fetchNotes = new EventEmitter();
  @ViewChild('menuTrigger') trigger: MatMenuTrigger;

  noteColor = new FormControl('#FFFFFF');
  label = new FormControl('');
  pinnedNotesList: Array<any> = [];
  unPinnedNotesList: Array<any> = [];
  basicUser: Boolean;
  pinUnpinExists: Boolean;
  latestNote: any;

  notesLayout: Boolean = true;//true for row layout, false for column Layout
  reminderMenu = false;
  searchWord: any;

  constructor(private noteSvc: NoteService, private dash: DashboardComponent,
    private snackBar: MatSnackBar, private dialog: MatDialog, private router: Router) {
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
  ngOnChanges() {
    this.notesLayout = this.dash.getLayout() ? false : true;
  }

  getLatestNote() {
    return this.noteSvc.fetchAllNotes();
  }

  //Delete a Note
  deleteNote(note) {
    let data = {
      noteIdList: [note.id],
      isDeleted: true
    }

    let obs = this.noteSvc.deleteNote(data);
    obs.subscribe(() => {
      this.fetchNotes.emit()
      this.snackBar.open("Note Deleted", '', {
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
    obs.subscribe(() => {
      this.fetchNotes.emit()
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
    obs.subscribe(() => {
      this.fetchNotes.emit()
    })
  }

  //Pin Notes
  pinUnpin(card) {
    let data = {
      noteIdList: [card.id],
      isPined: !card.isPined
    };
    let obs = this.noteSvc.pinUnpinNotes(data);
    obs.subscribe(() => {
      this.fetchNotes.emit()
    })
  }

  getBackgroundColor(arg) {
    return !arg ? '	#FFFFFF' : arg;
  }

  openEditor(note) {
    let obs = this.dialog.open(EditNoteComponent, {
      data: note,
      width: "550px",
      panelClass: 'dialogBox'
    });
    obs.afterClosed().subscribe(result => {
      if (result) {
        if (result.message === 'update-notes') {
          this.fetchNotes.emit()
        } else {
          // Update the note
          let data = {
            noteId: result.id,
            title: result.title,
            description: result.description,
          }

          let updateObserver = this.noteSvc.updateNote(data);

          updateObserver.subscribe(() => {
            //  fetch All Notes after updating
            this.fetchNotes.emit()

          })
        }
      }
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
      this.fetchNotes.emit()
      this.dash.events.emit('label-modified');
    })
    this.label.setValue('');
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
      this.fetchNotes.emit()
      this.dash.events.emit('label-modified');
    })
  }

  addLabelsFromExistingLabels(label, note) {
    let data = {
      lableId: label.id,
      noteId: note.id
    }
    let obs = this.noteSvc.addExistingLabel(data);
    obs.subscribe(() => {
      this.fetchNotes.emit()
      this.dash.events.emit('label-modified');
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
      this.fetchNotes.emit()
    })
  }

  filterNotes(str) {

    // filter pinned notes
    let tempPinList = [];
    for (let noteIndex in this.pinnedNotesList) {
      if (this.pinnedNotesList[noteIndex].description.includes(str)) {
        tempPinList.push(this.pinnedNotesList[noteIndex]);
      }
    }
    this.pinnedNotesList = tempPinList;

    // filter unpinned notes
    let tempUnpinList = [];
    for (let noteIndex in this.unPinnedNotesList) {
      if (this.unPinnedNotesList[noteIndex].description.includes(str)) {
        tempUnpinList.push(this.unPinnedNotesList[noteIndex]);
      }
    }
    this.unPinnedNotesList = tempUnpinList;
  }

  checkListChange(list) {
    if (list.status === "open") list.status = "close"
    else list.status = "open"
    let obs = this.noteSvc.updateCheckList(list);
    obs.subscribe((response) => {
      this.fetchNotes.emit()
    })
  }

  checkListStatus(list) {
    return list.status === "close" ? true : false;
  }

  checkIfLabelPresent(label) {
    let returnValue = false;
    this.existingLabels.forEach(element => {
      if (element.id === label.id) returnValue = true;
    })
    return returnValue;
  }

  removeReminder(note) {
    let obs = this.noteSvc.removeReminder({
      noteIdList: [note.id]
    })
    obs.subscribe((response) => {
      note.reminder = [];
    })
  }

  addReminder(note, reminder) {
    let obs = this.noteSvc.addReminder({
      noteIdList: [note.id],
      reminder: reminder
    })
    obs.subscribe((response) => {
      this.fetchNotes.emit()
    })
  }

  removeHtmlTag(string) {
    string = string.replace('&#39;', "'");
    return string.replace(/<[^>]*>?/gm, '');
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

  informToParent() {
    this.fetchNotes.emit();
  }

}
