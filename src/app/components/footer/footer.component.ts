import { Component, OnInit } from '@angular/core';
import { Organization } from 'src/app/interfaces/organization';
import { FooterService } from 'src/app/service/footer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  org!: Organization;

  constructor(private footerService: FooterService) {}

  ngOnInit(): void {
    this.getOrg();
  }

  getOrg() {
    this.footerService.getData().subscribe((data: Organization) => {
      this.org = data;
    });
  }
}
