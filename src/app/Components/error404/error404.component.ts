import { Component, OnInit } from '@angular/core';

declare class Parallax {
  constructor(element: HTMLElement);
}

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.css'],
})
export class Error404Component implements OnInit {
  scene!: HTMLElement | null;

  ngOnInit(): void {
    this.scene = document.getElementById('scene');
    if (this.scene) {
      let parallax: Parallax = new Parallax(this.scene);
    }
  }
}