import { Component, OnInit, ViewChild } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';
import { FormControl } from '@angular/forms';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { MatSnackBar, MatDialog, MatMenuTrigger } from '@angular/material';
import { EditNoteComponent } from '../edit-note/edit-note.component';
import { Title } from '@angular/platform-browser';
import { AddCollaboratorComponent } from '../add-collaborator/add-collaborator.component';


@Component({
  selector: 'app-all-notes',
  templateUrl: './all-notes.component.html',
  styleUrls: ['./all-notes.component.scss']
})
export class AllNotesComponent implements OnInit {
  @ViewChild('menuTrigger') trigger: MatMenuTrigger;

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
  label = new FormControl('');
  notesList: Array<any> = [];
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
    private snackBar: MatSnackBar, private dialog: MatDialog) {

    this.setTitle("Notes");

    this.dash.events.addListener('note-saved-in-database', () => {
      //Fetch all notes from database
      this.fetchAllNotes();
    })

    this.dash.events.addListener('change-layout', () => {
      //Change Layout of Notes
      this.notesLayout = !this.notesLayout;
    })

    this.dash.events.addListener('user-is-basic', () => {
      //Change type of User
      this.basicUser = true;
    })

    this.dash.events.addListener('label-modified', () => {
      this.fetchAllNotes();
      this.fetchAllLabels();
    });

    this.dash.events.addListener('searching-forward', () => {
      // this.filterNotes(this.dash.search.value);
      this.searchWord = this.dash.search.value;
    })

    this.dash.events.addListener('searching-backward', () => {
      // this.fetchAllNotes();
      // this.filterNotes(this.dash.search.value);
      this.searchWord = this.dash.search.value;
    })

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
            this.fetchAllNotes();
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
            this.fetchAllNotes();
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
              this.fetchAllNotes();
            })
          }
        })
      })
      this.dash.inputLabels = [];
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
    let obs = this.noteSvc.fetchAllNotes();

    obs.subscribe((response) => {

      this.pinnedNotesList = this.getPinnedNotes(response.data.data);
      this.unPinnedNotesList = this.getUnpinnedNotes(response.data.data);

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

  getLatestNote() {
    return this.noteSvc.fetchAllNotes();
    // obs.subscribe(response => {
    //   this.latestNote = response.data.data[response.data.data.length - 1];
    // })
  }

  //Delete a Note
  deleteNote(note) {
    let data = {
      noteIdList: [note.id],
      isDeleted: true
    }

    let obs = this.noteSvc.deleteNote(data);
    obs.subscribe(() => {
      this.fetchAllNotes();
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
    obs.subscribe(() => {
      this.fetchAllNotes();
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
      this.fetchAllNotes();
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
        if (result.message == 'update-notes') {
          this.fetchAllNotes();
        } else {
          // Update the note
          let data = {
            noteId: result.id,
            title: result.title,
            description: result.description,
            color: result.color
          }

          let updateObserver = this.noteSvc.updateNote(data);

          updateObserver.subscribe(() => {

            // If color was updated
            this.changeColor(result.color, note);
            //  fetch All Notes after updating
            this.fetchAllNotes();

          })
        }
      }
    })
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
      this.fetchAllNotes();
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
      this.fetchAllNotes();
      this.dash.events.emit('label-modified');
    })
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

  openReminderMenu() {
    // console.log(this.trigger);
    // this.trigger.closeMenu();
    // this.trigger.openMenu();
  }

  checkListChange(list) {
    if (list.status === "open") list.status = "close"
    else list.status = "open"
    let obs = this.noteSvc.updateCheckList(list);
    obs.subscribe((response) => {
      this.fetchAllNotes();
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
}