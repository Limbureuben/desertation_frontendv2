import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  ChangeLang(lang: any) {
    const selectedLanguage = lang.target.value;

    localStorage.setItem('lang', selectedLanguage);
  }


  }

