import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Map, config, Marker, Popup } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { OpenspaceService } from '../../service/openspace.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { response } from 'express';
import { switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;
  searchQuery: string = '';
  suggestions: any[] = [];
  locationName: string = '';
  selectedSpace: any = null;
  openSpaces: any[] = [];
  emailWarning: boolean = false;


  message: string = '';

  reportForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  submitting = false;
  success = false;
  errorMessage = '';
  reportId: string = '';

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private openSpaceService: OpenspaceService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authservice: AuthService,
) {
  this.reportForm = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(20)]],
    email: ['', [Validators.email]],
  });
}


  ngOnInit(): void {
    config.apiKey = '9rtSKNwbDOYAoeEEeW9B';

    this.reportForm.valueChanges.subscribe(() => {
      const email = this.reportForm.get('email')?.value;
      this.emailWarning = !email; // Show warning if email is empty
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMap();
      this.fetchOpenSpaces();

      // Add event listener to close form button
      document.getElementById('closeFormBtn')?.addEventListener('click', () => {
        this.closeForm();
      });
    }
  }

  initializeMap(): void {
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=9rtSKNwbDOYAoeEEeW9B',
      center: [39.230099, -6.774133],
      zoom: 14
    });
  }

  fetchOpenSpaces(): void {
    this.openSpaceService.getAllOpenSpacesUser().subscribe(
      (data) => {
        this.openSpaces = data;
        this.addMarkersToMap();
      },
      (error) => {
        console.error('Error fetching open spaces:', error);
      }
    );
  }

  addMarkersToMap(): void {
    this.openSpaces.forEach(space => {
      const markerElement = document.createElement('img');
      markerElement.src = 'assets/images/location.png';
      markerElement.style.width = '25px';
      markerElement.style.height = '25px';
      markerElement.style.cursor = 'pointer'; // Ensure cursor is set

      const marker = new Marker({ element: markerElement })
        .setLngLat([space.longitude, space.latitude])
        .addTo(this.map as Map);

      // Create popup with a report button
      const popupContent = document.createElement('div');
      popupContent.classList.add('popup-content');
      popupContent.innerHTML = `
        <h3>${space.name}</h3>
        <p>Location: (${space.latitude}, ${space.longitude})</p>
        <button class="report-problem-btn">Report Problem</button>
      `;

      const popup = new Popup({ offset: 25 })
        .setDOMContent(popupContent);

      marker.setPopup(popup);

      // Open form when button inside popup is clicked
      popupContent.querySelector('.report-problem-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Report button clicked for:', space.name);
        this.openReportForm(space);
      });

      // Open form when marker is clicked
      marker.getElement().addEventListener('click', () => {
        console.log('Marker clicked for:', space.name);
        this.openReportForm(space);
      });
    });
  }


  ngOnDestroy() {
    this.map?.remove();
  }

  openReportForm(space: any) {
    this.selectedSpace = space;
    const formContainer = document.getElementById('detailsForm') as HTMLElement;
    const locationName = document.getElementById('location-name') as HTMLElement;

    if (locationName) {
      locationName.textContent = space.name; // Bind location name
    } else {
      console.error('Location or region element not found');
    }

    if (formContainer) {
      console.log('Opening form for:', space.name);
      formContainer.style.display = 'flex';

      // Small delay before adding "open" for smooth pop-up animation
      setTimeout(() => {
        formContainer.classList.add('open');
      }, 20);
    } else {
      console.error('Form container not found');
    }
  }

  closeForm() {
    const formContainer = document.getElementById('detailsForm') as HTMLElement;

    if (formContainer) {
      formContainer.classList.add('closing');

      // Wait for animation to complete before hiding
      setTimeout(() => {
        formContainer.classList.remove('open', 'closing');
        formContainer.style.display = 'none';
      }, 300); // Matches CSS transition duration
    }
  }

triggerFileInput() {
  document.getElementById('file-upload')?.click();
}


  fetchSuggestions() {
    if (!this.searchQuery) {
      this.suggestions = [];
      return;
    }

    fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=9rtSKNwbDOYAoeEEeW9B&country=TZ`)
      .then(res => res.json())
      .then(data => {
        this.suggestions = data.features.map((feature: any) => ({
          name: feature.place_name,
          center: feature.center
        }));
      })
      .catch(err => console.error("Error fetching suggestions:", err));
  }

  searchLocation() {
    if (!this.searchQuery) return;

    fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=9rtSKNwbDOYAoeEEeW9B&country=TZ`)
      .then(res => res.json())
      .then(data => {
        if (data.features.length > 0) {
          const { center } = data.features[0];
          this.map?.flyTo({ center, zoom: 14 });
        }
      })
      .catch(err => console.error("Error fetching location:", err));
  }

  selectSuggestion(suggestion: any) {
    this.searchQuery = suggestion.name;
    this.map?.flyTo({ center: suggestion.center, zoom: 14 });
    this.suggestions = [];
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    } else {
      this.selectedFile = null;
      this.selectedFileName = '';
    }
  }


  submitReport(): void {
    const userId = localStorage.getItem('user_id');

    if (this.reportForm.invalid) {
      Object.keys(this.reportForm.controls).forEach(key => {
        const control = this.reportForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.success = false;
    this.errorMessage = '';

    // Upload file if there is one, then create the report
    this.openSpaceService.uploadFile(this.selectedFile)
      .pipe(
        switchMap(response => {
          const reportData = {
            description: this.reportForm.get('description')?.value,
            email: this.reportForm.get('email')?.value || null,
            filePath: response.file_path || null,
            spaceName: this.selectedSpace.name,
            latitude: this.selectedSpace.latitude,
            longitude: this.selectedSpace.longitude,
            userId: userId || null
          };

          console.log('Submitting report with data:', reportData);

          return this.openSpaceService.createReport(
            reportData.description,
            reportData.email,
            reportData.filePath,
            reportData.spaceName,
            reportData.latitude,
            reportData.longitude,
            reportData.userId
          );
        })
      )
      .subscribe({
        next: (response) => {
          this.submitting = false;
          this.success = true;
          this.reportId = response.createReport.report.reportId;

          Swal.fire({
            title: `Report of ID ${this.reportId} has been submitted successfully!`,
            icon: "success",
            draggable: true,
            customClass: {
              title: 'custom-title',
              popup: 'custom-popup'
            }
          });


          setTimeout(() => {
            this.resetForm();
            this.closeForm();
          }, 3000);
        },
        error: (error) => {
          this.submitting = false;
          this.errorMessage = 'Failed to submit report. Please try again.';
          console.error('Error submitting report:', error);

          this.toastr.error('Error submitting report', 'Error', {
            positionClass: 'toast-top-right',
          });
        }
      });
}


  private resetForm(): void {
    this.reportForm.reset();
    this.selectedFile = null;
    this.selectedFileName = '';
    this.selectedSpace = null;
  }

}




//swal
// Swal.fire({
//   title: "Drag me!",
//   icon: "success",
//   draggable: true
// });


// Swal.fire({
//   title: "Do you want to save the changes?",
//   showDenyButton: true,
//   showCancelButton: true,
//   confirmButtonText: "Save",
//   denyButtonText: `Don't save`
// }).then((result) => {
//   /* Read more about isConfirmed, isDenied below */
//   if (result.isConfirmed) {
//     Swal.fire("Saved!", "", "success");
//   } else if (result.isDenied) {
//     Swal.fire("Changes are not saved", "", "info");
//   }
// });
