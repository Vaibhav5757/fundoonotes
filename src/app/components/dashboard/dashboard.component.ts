import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-components/dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  hide = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
    
  constructor(private titleService: Title,private breakpointObserver: BreakpointObserver,) {
    this.setTitle('Dashboard');
  }

  changeHide(){
    this.hide = !this.hide;
  }
  
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  }
