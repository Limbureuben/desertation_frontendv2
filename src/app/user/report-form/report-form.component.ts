import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../../service/services/report.service';

@Component({
  selector: 'app-report-form',
  standalone: false,
  templateUrl: './report-form.component.html',
  styleUrl: './report-form.component.scss'
})
export class ReportFormComponent {

  reportForm!: FormGroup;

  constructor(private fb: FormBuilder, private reportService: ReportService) {}

  ngOnInit() {
    this.reportForm = this.fb.group({
      description: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      district: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.reportForm.valid) {
      console.log(this.reportForm.value); // Handle the form submission
    }
  }

  closeForm(): void {
    this.reportService.closeReportForm();
  }


}
