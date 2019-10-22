import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/services/user-service.service';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatSnackBar, MatDialog } from '@angular/material';
import { NoteService } from 'src/app/services/note.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { EditNoteComponent } from '../edit-note/edit-note.component';

@Component({
  selector: 'app-notes-by-label',
  templateUrl: './notes-by-label.component.html',
  styleUrls: ['./notes-by-label.component.scss']
})
export class NotesByLabelComponent implements OnInit {

  labelName: string;

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

  notesLayout: Boolean = true;//true for row layout, false for column Layout

  constructor(private snackBar: MatSnackBar, private noteSvc: NoteService,
    private titleService: Title, private route: ActivatedRoute, private dash: DashboardComponent, private dialog: MatDialog) {
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
      // this.fetchAllLabels();
      this.fetchAllNotes();
    });

  }

  ngOnInit() {
    this.notesLayout = this.dash.getLayout() ? false : true;
    this.route.paramMap.subscribe(params => {
      this.labelName = params.get("labelName");
      this.setTitle(this.labelName);
      this.fetchAllNotes();
    })
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  //Fetch all notes
  fetchAllNotes() {
    let obs = this.noteSvc.getNotesOfLabel({
      labelName: this.labelName
    });

    obs.subscribe((response: any) => {

      this.pinnedNotesList = this.getPinnedNotes(response.data.data);
      this.unPinnedNotesList = this.getUnpinnedNotes(response.data.data);

      if (this.pinnedNotesList.length === 0) {
        this.pinUnpinExists = false;
      }//No Pinned Notes
      else {
        this.pinUnpinExists = true;
      }

      // this.fetchAllLabels();
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

  //Pin Notes
  pinUnpin(card) {
    let data = {
      noteIdList: [card.id],
      isPined: !card.isPined
    };
    let obs = this.noteSvc.pinUnpinNotes(data);
    obs.subscribe(response => {
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

          updateObserver.subscribe((response) => {
            //fetch All Notes after updating
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

}
