import { Component, OnInit, Injector } from '@angular/core';
import { TenantDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { DashboardChartBase } from '../dashboard-chart-base';
import { WidgetComponentBase } from '../widget-component-base';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { appModuleAnimation } from '../../../../../../shared/animations/routerTransition';

@Component({
    selector: 'widgets-kanban-interactivity-demo',
    templateUrl: './widgets-kanban-interactivity-demo.component.html',
    styleUrls: ['./widgets-kanban-interactivity-demo.component.css'],
    animations: [appModuleAnimation()]
})
export class WidgetKanbanInteractivityDemoComponent extends WidgetComponentBase implements OnInit {

    todo = [{
        "img":"/assets/metronic/common/images/users/100_1.jpg",
        "name": "Brain",
        "lable": "Backlog",
        
    },
    {
        "img": "/assets/metronic/common/images/users/100_2.jpg",
        "name": "Jane",
        "lable": "Backlog",
        
    },
    {
        "img": "/assets/metronic/common/images/users/100_3.jpg",
        "name": "Tim",
        "lable": "Backlog",
        
        },
    {
        "img": "/assets/metronic/common/images/users/100_4.jpg",
        "name": "Kate",
        "lable": "Backlog",
        
        }
    ];

    done = [
        {
            "img": "/assets/metronic/common/images/users/100_1.jpg",
            "name": "Brain",
            "lable": "To Do",
            
        },
        {
            "img": "/assets/metronic/common/images/users/100_2.jpg",
            "name": "Jane",
            "lable": "To Do",
            
        },
        {
            "img": "/assets/metronic/common/images/users/100_3.jpg",
            "name": "Tim",
            "lable": "To Do",
            
        },
        {
            "img": "/assets/metronic/common/images/users/100_4.jpg",
            "name": "Kate",
            "lable": "To Do",
            
        }
    ];
    WorkINProcess = [
        {
            "img": "/assets/metronic/common/images/users/100_1.jpg",
            "name": "Brain",
            "lable": "Working",
            
        },
        {
            "img": "/assets/metronic/common/images/users/100_2.jpg",
            "name": "Jane",
            "lable": "Working",
            
        },
        {
            "img": "/assets/metronic/common/images/users/100_3.jpg",
            "name": "Tim",
            "lable": "Working",
            
        },
        {
            "img": "/assets/metronic/common/images/users/100_4.jpg",
            "name": "Kate",
            "lable": "Working",
            
        }
    ];
    Longnineteenth = [
        {
            "img": "/assets/metronic/common/images/users/100_1.jpg",
            "name": "Brain",
            "lable": "Deploy"
        },
        {
            "img": "/assets/metronic/common/images/users/100_2.jpg",
            "name": "Jane",
            "lable": "Deploy",
            
        },
        {
            "img": "/assets/metronic/common/images/users/100_3.jpg",
            "name": "Tim",
            "lable": "Deploy",
            
        },
        {
            "img": "/assets/metronic/common/images/users/100_4.jpg",
            "name": "Kate",
            "lable": "Deploy",
            
        }
    ];
    Earlymodern = [
        {
        "img":"/assets/metronic/common/images/users/100_1.jpg",
        "name": "Brain",
            "lable": "New Board",
            
    },
    {
        "img": "/assets/metronic/common/images/users/100_2.jpg",
        "name": "Jane",
        "lable": "New Board",
        
    },
    {
        "img": "/assets/metronic/common/images/users/100_3.jpg",
        "name": "Tim",
        "lable": "New Board",
        
        },
    {
        "img": "/assets/metronic/common/images/users/100_4.jpg",
        "name": "Kate",
        "lable": "New Board",
        
        }
    ];

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }

    constructor(injector: Injector,
        private _tenantdashboardService: TenantDashboardServiceProxy) {
        super(injector);
    }

    ngOnInit() {

    }
    //onTaskDrop(event: CdkDragDrop<Task[]>) {
    //    if (event.previousContainer === event.container) {
    //        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    //    } else {
    //        transferArrayItem(event.previousContainer.data,
    //            event.container.data,
    //            event.previousIndex,
    //            event.currentIndex);
    //    }
    //}
}
