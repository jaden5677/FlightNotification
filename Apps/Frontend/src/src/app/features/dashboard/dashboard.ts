import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

// No Figma spec was provided for this screen - placeholder only so the
// "Dashboard" nav link in the shell has somewhere to land.
@Component({
    selector: 'app-dashboard',
    imports: [MatCardModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
})
export class Dashboard {}
