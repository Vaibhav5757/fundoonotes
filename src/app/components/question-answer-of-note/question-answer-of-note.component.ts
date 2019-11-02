import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-question-answer-of-note',
  templateUrl: './question-answer-of-note.component.html',
  styleUrls: ['./question-answer-of-note.component.scss']
})
export class QuestionAnswerOfNoteComponent implements OnInit {

  noteId;
  note;

  constructor(private route: ActivatedRoute,
    private noteSvc: NoteService) { }

  ngOnInit() {

    // Retrieve the note Id
    this.route.paramMap.subscribe(params => {
      this.noteId = params.get("noteId");
    })

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

}
