import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';
import { PublicComponent } from './public.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { TableTopExerciseComponent } from './table-top-exercise/table-top-exercise.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PublicComponent,
                children: [
                    { path: '', redirectTo: 'table-top-exercise' },                   
                    { path: 'feedback', component: FeedbackComponent },
                    { path: 'table-top-exercise', component: TableTopExerciseComponent },
                    { path: '**', redirectTo: 'table-top-exercise' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class PublicRoutingModule {
    constructor(
        private router: Router,
        private _uiCustomizationService: AppUiCustomizationService
    ) {
        router.events.subscribe((event: NavigationEnd) => {
           
        });
    }
}
