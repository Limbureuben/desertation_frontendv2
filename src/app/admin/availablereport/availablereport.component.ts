import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ViewReportComponent } from '../view-report/view-report.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-availablereport',
  standalone: false,
  templateUrl: './availablereport.component.html',
  styleUrl: './availablereport.component.scss',
  animations: [
    // Slide table from right when opening
    trigger('tableEnterAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    // Animate row additions & deletions
    trigger('rowAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class AvailablereportComponent implements OnInit{
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private openSpaceService: OpenspaceService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}


  ngOnInit(): void {
      this.loadReport()
  }

  loadReport() {
    this.openSpaceService.getAllReports().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // confirmReport(reportId: string): void {
  //   this.openSpaceService.confirmReport(reportId).subscribe(response => {
  //     if (response.data.confirmReport.success) {
  //       this.toastr.success(response.data.confirmReport.message, 'Success', {
  //         positionClass: 'toast-top-right',
  //       });

  //       this.loadReport();
  //     } else {
  //       this.toastr.error('Failed to confirm report', 'Error', {
  //         positionClass: 'toast-top-right',
  //       });
  //     }
  //   }, error => {
  //     this.toastr.error('Error confirming report', 'Error');
  //   }
  // )
  // }

  confirmReport(reportId: string): void {
    const swalWithCustomButtons = Swal.mixin({
      customClass: {
        confirmButton: "swal2-confirm", // Uses custom styles
        cancelButton: "swal2-cancel" // Uses custom styles
      },
      buttonsStyling: false // Prevent SweetAlert2 from overriding custom styles
    });

    swalWithCustomButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.openSpaceService.confirmReport(reportId).subscribe(response => {
          if (response.data.confirmReport.success) {
            swalWithCustomButtons.fire({
              title: "Confirmed!",
              text: "The report has been confirmed.",
              icon: "success",
              showConfirmButton: false,
              timer: 2000
            });
            this.loadReport();
          } else {
            swalWithCustomButtons.fire({
              title: "Failed!",
              text: "The report could not be confirmed.",
              icon: "error"
            });
          }
        }, error => {
          swalWithCustomButtons.fire({
            title: "Error!",
            text: "There was an error confirming the report.",
            icon: "error"
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithCustomButtons.fire({
          title: "Cancelled",
          text: "The report has not been confirmed.",
          icon: "error"
        });
      }
    });
  }



  markAsPending(reportId: string): void {
    console.log('Deleting Report:', reportId);
  }

  viewReport(report: any): void {
    this.dialog.open(ViewReportComponent, {
      data: report,
    });
}
}
