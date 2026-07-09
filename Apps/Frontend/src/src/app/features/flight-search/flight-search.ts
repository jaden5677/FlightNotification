import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FlightService } from '../../core/flights/flight.service';
import { FlightDto } from '../../core/models/flight.model';

@Component({
    selector: 'app-flight-search',
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        MatButtonModule,
    ],
    templateUrl: './flight-search.html',
    styleUrl: './flight-search.scss',
})
export class FlightSearch implements OnInit {
    private readonly flightService = inject(FlightService);
    private readonly router = inject(Router);

    readonly flights = signal<FlightDto[]>([]);
    readonly selectedDate = signal<Date | null>(null);
    readonly selectedFlightNumber = signal<string | null>(null);
    readonly searching = signal(false);

    ngOnInit(): void {
        // Populate the flight-number dropdown with every known flight up front,
        // matching the Figma "Select Flight Number" list.
        this.flightService.search(null, null).subscribe((flights) => this.flights.set(flights));
    }

    search(): void {
        const flightNumber = this.selectedFlightNumber();
        if (!flightNumber) {
            return;
        }
        this.searching.set(true);
        this.flightService.search(this.selectedDate(), flightNumber).subscribe({
            next: (results) => {
                this.searching.set(false);
                if (results.length > 0) {
                    this.router.navigate(['/flight-search', flightNumber, 'passengers']);
                }
            },
            error: () => this.searching.set(false),
        });
    }
}
