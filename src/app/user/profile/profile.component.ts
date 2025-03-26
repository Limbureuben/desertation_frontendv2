import { Component, OnInit } from '@angular/core';
import { error } from 'console';
import { AuthService } from '../../service/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
 profile: any
 loading = true
 errorMessage: string = '';

 constructor(
  private authservice: AuthService,
  public dialogRef: MatDialogRef<ProfileComponent>,

 ) {}

 ngOnInit(): void {
     this.authservice.getUserProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
        this.errorMessage = 'Failed to load profile. Please try again.';
        this.loading = false;
      }
     });
 }

 closeProfileDialog() {
  this.dialogRef.close();
}

}
