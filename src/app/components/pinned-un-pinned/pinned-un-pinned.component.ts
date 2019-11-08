import { Component, ViewChild, Output, Input, OnChanges, EventEmitter } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';
import { FormControl } from '@angular/forms';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { MatSnackBar, MatDialog, MatMenuTrigger } from '@angular/material';
import { EditNoteComponent } from '../edit-note/edit-note.component';
import { Title } from '@angular/platform-browser';
import { AddCollaboratorComponent } from '../add-collaborator/add-collaborator.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-pinned-un-pinned',
  templateUrl: './pinned-un-pinned.component.html',
  styleUrls: ['./pinned-un-pinned.component.scss']
})
export class PinnedUnPinnedComponent implements OnChanges {

  @Input('notes') notesList;
  @Input('label') labelName;
  @Output() fetchNotes = new EventEmitter();
  @ViewChild('menuTrigger') trigger: MatMenuTrigger;

  noteColor = new FormControl('#FFFFFF');
  label = new FormControl('');
  pinnedNotesList: Array<any> = [];
  unPinnedNotesList: Array<any> = [];
  basicUser: Boolean;
  pinUnpinExists: Boolean;
  existingLabels = [];
  latestNote: any;

  notesLayout: Boolean = true;//true for row layout, false for column Layout
  reminderMenu = false;
  searchWord: any;

  constructor(private titleService: Title, private noteSvc: NoteService, private dash: DashboardComponent,
    private snackBar: MatSnackBar, private dialog: MatDialog, private router: Router) {

    this.setTitle("Notes");

    this.dash.events.addListener('user-is-basic', () => {
      this.basicUser = true;
    })

    this.dash.events.addListener('note-saved-in-database', () => {
      //Fetch all notes from database
      this.fetchNotes.emit()
    })

    this.dash.events.addListener('change-layout', () => {
      //Change Layout of Notes
      this.notesLayout = !this.notesLayout;
    })

    this.dash.events.addListener('label-modified', () => {
      this.fetchNotes.emit()
      this.fetchAllLabels();
    });


    this.dash.events.addListener("checklist-present-in-note", () => {
      let checklist = this.dash.checkList;

      checklist.forEach((element) => {
        let obsIntermediate = this.getLatestNote();
        obsIntermediate.subscribe(response => {
          this.latestNote = response.data.data[response.data.data.length - 1];
          let obsFinal = this.noteSvc.addCheckList(this.latestNote, {
            itemName: element,
            status: "open"
          })
          obsFinal.subscribe((response) => {
            this.fetchNotes.emit()
          })
        })
      })
      this.dash.checkList = [];
    })

    this.dash.events.addListener("Collaborators-exist-in-new-note", () => {
      let collaboratorsList = this.dash.user.collaborators;

      collaboratorsList.forEach((element) => {
        let obsIntermediate = this.getLatestNote();
        obsIntermediate.subscribe(response => {
          this.latestNote = response.data.data[response.data.data.length - 1];
          let obsFinal = this.noteSvc.addCollaborator(this.latestNote.id, element);
          obsFinal.subscribe((response) => {
            this.fetchNotes.emit()
          })
        })
      })
      this.dash.user.collaborators = [];
    })

    this.dash.events.addListener("label-exist-in-note", () => {
      let labelsList = this.dash.inputLabels;

      labelsList.forEach((element) => {
        let obsIntermediate = this.getLatestNote();
        obsIntermediate.subscribe((response) => {
          this.latestNote = response.data.data[response.data.data.length - 1];
          if (this.checkIfLabelPresent(element)) {
            this.addLabelsFromExistingLabels(element, this.latestNote);
          } else { //add a new label
            let obsFinal = this.noteSvc.addLabel(this.latestNote.id, {
              label: element,
              isDeleted: false,
              userId: this.latestNote.userId
            })
            obsFinal.subscribe((response) => {
              this.fetchNotes.emit()
            })
          }
        })
      })
      this.dash.inputLabels = [];
    })

    this.dash.events.addListener('reminder-exist-in-note', () => {
      let obsIntermediate = this.getLatestNote();
      obsIntermediate.subscribe((response) => {
        this.latestNote = response.data.data[response.data.data.length - 1];
        this.addReminder(this.latestNote, this.dash.reminder);
        this.dash.reminder = null;
        this.fetchNotes.emit
      });
    })
  }

  //Fetch all the existing notes from database
  ngOnChanges() {
    this.getPinnedUnPinnedNotes();
    this.fetchAllLabels();
  }

  // get Pinned and UnPinned Notes
  getPinnedUnPinnedNotes(event?) {
    let obs = this.noteSvc.fetchAllNotes();

    obs.subscribe((response) => {

      this.pinnedNotesList = this.getPinnedNotes(this.notesList);
      this.unPinnedNotesList = this.getUnpinnedNotes(this.notesList);

      if (this.pinnedNotesList.length === 0) {
        this.pinUnpinExists = false;
      }//No Pinned Notes
      else {
        this.pinUnpinExists = true;
      }

      this.fetchAllLabels();
    }, (error) => {
      console.log(error);
    })
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  getLatestNote() {
    return this.noteSvc.fetchAllNotes();
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

  //Event bubbling
  stopPropagation(event) {
    event.stopPropagation();
  }

  getPinnedNotes(array) {
    let result = [];
    array.forEach(element => {
      if (element.isPined && !element.isDeleted) {
        result.push(element);
      }
    });

    //Notes are reversed because they need to be shown on basis of time created - the newer one comes first
    return result.reverse();
  }

  getUnpinnedNotes(array) {
    let result = [];
    array.forEach(element => {
      if (!element.isPined) {
        result.push(element);
      }
    });

    //Notes are reversed because they need to be shown on basis of time created - the newer one comes first
    return result.reverse();
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
      this.fetchNotes.emit()
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
