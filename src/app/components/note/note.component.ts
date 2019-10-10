import { Component, OnInit, Optional } from '@angular/core';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  titlePresent: Boolean = false;
  contentPresent: Boolean = false;

  title: String;
  content: String;

  constructor(@Optional() private titleVal: String, @Optional() private contentVal: String) {

    if (titleVal == null) {
      this.title = "I am title";
    } else this.title = titleVal;

    if (contentVal == null) {
      this.content = "I am content.\nI am supposed to be the content in next Line";
    } else this.content = contentVal;

    if (this.title !== null) {
      this.titlePresent = true;
    }

    if (this.content !== null) {
      this.contentPresent = true;
    }
  }

  ngOnInit() {

  }

}
