import { Component, OnInit, ViewChild } from '@angular/core';
import { UserServiceService } from 'src/app/services/user-service.service';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatSnackBar, MatDialog, MatMenuTrigger } from '@angular/material';
import { NoteService } from 'src/app/services/note.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { EditNoteComponent } from '../edit-note/edit-note.component';
import { AddCollaboratorComponent } from '../add-collaborator/add-collaborator.component';

@Component({
  selector: 'app-notes-by-label',
  templateUrl: './notes-by-label.component.html',
  styleUrls: ['./notes-by-label.component.scss']
})
export class NotesByLabelComponent implements OnInit {

  notesList: Array<any> = [];
  labelName: string;

  constructor(private noteSvc: NoteService,
    private titleService: Title, private route: ActivatedRoute, ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.labelName = params.get("labelName");
      this.setTitle(this.labelName);
      this.fetchAllNotes();
    })
  }

  //Fetch all notes
  fetchAllNotes() {
    let obs = this.noteSvc.getNotesOfLabel({
      labelName: this.labelName
    });

    obs.subscribe((response: any) => {
      this.notesList = response.data.data;
    }, (error) => {
      console.log(error);
    })
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
