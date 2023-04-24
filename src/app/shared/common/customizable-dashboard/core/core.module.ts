// Anglar
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Layout Directives
import { ContentAnimateDirective, HeaderDirective, MenuDirective, StickyDirective } from './_base/layout';
// Metronic Pipes
// Metornic Services
import { FirstLetterPipe, GetObjectPipe, JoinPipe, OffcanvasDirective, SafePipe, ScrollTopDirective, SparklineChartDirective, TabClickEventDirective, TimeElapsedPipe, ToggleDirective } from './_base/metronic';
import { AuthService } from './auth/_services/auth.service';
import { from } from 'rxjs';
import { CounterDirective } from './_base/layout/directives/counter.directive';
@NgModule({
	imports: [CommonModule],
	declarations: [
		// directives
		ScrollTopDirective,
		HeaderDirective,
		OffcanvasDirective,
		ToggleDirective,
		MenuDirective,
		TabClickEventDirective,
		SparklineChartDirective,
		ContentAnimateDirective,
        StickyDirective,
        CounterDirective,
		// pipes
		TimeElapsedPipe,
		JoinPipe,
		GetObjectPipe,
		SafePipe,
		FirstLetterPipe,
	],
	exports: [
		// directives
		ScrollTopDirective,
		HeaderDirective,
		OffcanvasDirective,
		ToggleDirective,
		MenuDirective,
		TabClickEventDirective,
		SparklineChartDirective,
		ContentAnimateDirective,
        StickyDirective,
        CounterDirective,
		// pipes
		TimeElapsedPipe,
		JoinPipe,
		GetObjectPipe,
		SafePipe,
		FirstLetterPipe,
	],
	providers: [AuthService]
})
export class CoreModule {
}
