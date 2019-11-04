import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-question-answer-of-note',
  templateUrl: './question-answer-of-note.component.html',
  styleUrls: ['./question-answer-of-note.component.scss']
})
export class QuestionAnswerOfNoteComponent implements OnInit {

  noteId = null;
  note = {
    user: {
      firstName: null,
      lastName: null
    },
    title: null,
    description: null,
    noteCheckLists: [],
    questionAndAnswerNotes: [{
      createdDate: "",
      message: ""
    }],
  };

  constructor(private route: ActivatedRoute,
    private noteSvc: NoteService) {

    // Retrieve the note Id from params
    this.route.paramMap.subscribe(params => {
      this.noteId = params.get("noteId");
    })
  }

  ngOnInit() {
    // Fetch the note
    let obs = this.noteSvc.getNotesDetail(this.noteId);
    // Save the note details
    obs.subscribe((response: any) => {
      this.note = response.data.data[0];
    })
  }

  removeHtmlTag(string) {
    string = string.replace('&#39;', "'");
    return string.replace(/<[^>]*>?/gm, '');
  }

  checkListStatus(list) {
    return list.status === "close" ? true : false;
  }

  checkListChange(list) {
    if (list.status === "open") list.status = "close"
    else list.status = "open"
    let obs = this.noteSvc.updateCheckList(list);
    // obs.subscribe((response) => {
    //   this.fetchAllNotes();
    // })
  }

}
