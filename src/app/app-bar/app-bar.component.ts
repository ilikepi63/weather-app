import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.css']
})
export class AppBarComponent implements OnInit {

  @Input() toggleTemp!: () => void
  @Input() refresh!: () => void

  constructor() {
  }

  ngOnInit(): void {
  }

}
