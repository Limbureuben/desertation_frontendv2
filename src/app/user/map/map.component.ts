import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Map, config, Marker, Popup } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

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

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  openSpaces = [
    { name: "Consulting Engineering", lng: 39.185784, lat: -6.658270 },
    { name: "Msigan", lng: 39.116709, lat: -6.794852 },
    { name: "KKT Church Boko", lng: 39.144646, lat: -6.624518 },
    { name: "Bunju", lng: 39.144157, lat: -6.622651 },
    { name: "Eco Fasten", lng: 39.230099, lat: -6.774133 },
    { name: "Bora football field", lng: 39.235777, lat: -6.778251 },
    { name: "Masjid", lng: 39.233556, lat: -6.781032 },
    { name: "Mwenge", lng: 39.226800, lat: -6.768383 },
    { name: "Avan garden", lng: 39.222820, lat: -6.770813 },
    { name: "Ardhi football", lng: 39.216423, lat: -6.764396 }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    config.apiKey = '9rtSKNwbDOYAoeEEeW9B';
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: 'https://api.maptiler.com/maps/hybrid/style.json?key=9rtSKNwbDOYAoeEEeW9B',
        center: [39.230099, -6.774133],
        zoom: 14
      });

      // Loop through locations and add markers with popups
      this.openSpaces.forEach(space => {
        const markerElement = document.createElement('img');
        markerElement.src = 'assets/images/openspace.png'; // Ensure the file exists
        markerElement.style.width = '40px';
        markerElement.style.height = '40px';

        const marker = new Marker({ element: markerElement })
          .setLngLat([space.lng, space.lat])
          .addTo(this.map as Map);

        // Create a popup with open space details and a report button
        const popupContent = document.createElement('div');
        popupContent.classList.add('popup-content');
        popupContent.innerHTML = `
          <h3>${space.name}</h3>
          <p>Location: (${space.lat}, ${space.lng})</p>
          <button class="report-problem-btn">Report Problem</button>
        `;

        // Attach the popup to the marker
        const popup = new Popup({ offset: 25 })
          .setDOMContent(popupContent);

        marker.getElement().addEventListener('click', () => {
          console.log(`Marker for ${space.name} clicked.`);
          this.openReportForm(space.name);  // Trigger the form opening
        });

        // Handle the report button click
        popupContent.querySelector('.report-problem-btn')?.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent the click from bubbling up to the marker click event
          this.openReportForm(space.name); // Trigger the form when the button is clicked
        });
      });

      // Add layer switcher
      this.addLayerSwitcher();
    }
  }

  ngOnDestroy() {
    this.map?.remove();
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

  addLayerSwitcher() {
    const layerSwitcher = document.createElement('div');
    layerSwitcher.className = 'layer-switcher';
    layerSwitcher.innerHTML = `
      <button data-style="https://api.maptiler.com/maps/hybrid/style.json?key=9rtSKNwbDOYAoeEEeW9B">Hybrid</button>
      <button data-style="https://api.maptiler.com/maps/streets/style.json?key=9rtSKNwbDOYAoeEEeW9B">Streets</button>
      <button data-style="https://api.maptiler.com/maps/basic/style.json?key=9rtSKNwbDOYAoeEEeW9B">Basic</button>
    `;

    layerSwitcher.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON') {
        const style = target.getAttribute('data-style');
        if (style && this.map) {
          this.map.setStyle(style);
        }
      }
    });

    this.map?.getContainer().appendChild(layerSwitcher);
  }

  openReportForm(locationName: string) {
    const formContainer = document.getElementById('detailsForm') as HTMLElement;
    const mapWrap = document.querySelector('.map-wrap') as HTMLElement;

    // Set the location name in the form
    const locationInput = formContainer.querySelector('#location-name') as HTMLInputElement;
    locationInput.value = locationName;

    // Slide in the form and shrink the map
    formContainer.classList.add('open');
    mapWrap.classList.add('shrink');

    // Close form handler
    formContainer.querySelector('.close-form-btn')?.addEventListener('click', () => {
      formContainer.classList.remove('open');
      mapWrap.classList.remove('shrink');
    });

    // Form submission handler
    formContainer.querySelector('form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const description = (formContainer.querySelector('#problem-description') as HTMLTextAreaElement).value;
      alert(`Problem reported: ${description}`);
      // Here you can add logic to handle the form submission, e.g., send data to the server
      formContainer.classList.remove('open');
      mapWrap.classList.remove('shrink');
    });
  }
}
