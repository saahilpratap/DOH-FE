import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GridsterConfig, GridsterItem, GridsterItemComponent, GridType, GridsterPush, CompactType } from 'angular-gridster2';
import { DashboardCustomizationConst } from '@app/shared/common/customizable-dashboard/DashboardCustomizationConsts';

@Component({
    templateUrl: './dashboard-test.component.html',
    styleUrls: ['./dashboard-test.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class DashboardTestComponent extends AppComponentBase {
    dashboardName = DashboardCustomizationConst.dashboardNames.defaultTenantDashboard;
    options: GridsterConfig;
    dashboard: Array<GridsterItem>;
    editModeEnabled = false;   
    itemToPush: GridsterItemComponent;

    static itemChange(item, itemComponent) {
        console.info('itemChanged', item, itemComponent);
    }

    static itemResize(item, itemComponent) {
        console.info('itemResized', item, itemComponent);
    }


    constructor(
        injector: Injector) {
        super(injector);
    }


    ngOnInit() {
        this.options = {
            gridType: GridType.Fit,
            compactType: CompactType.None,
            pushItems: true,
            draggable: {
                enabled: true
            },
            resizable: {
                enabled: true
            }
        };

        this.dashboard = [
            { cols: 12, rows: 3, y: 0, x: 0, initCallback: this.initItem.bind(this) },
            { cols: 6, rows: 5, y: 0, x: 2 },
            { cols: 6, rows: 5, y: 0, x: 4 },
            { cols: 6, rows: 5, y: 1, x: 4 },
            { cols: 6, rows: 5, y: 4, x: 5 },
            { cols: 12, rows: 3, y: 6, x: 6,}
        ];
    }

    changedOptions() {
        if (this.options.api && this.options.api.optionsChanged) {
            this.options.api.optionsChanged();
        }
    }

    removeItem($event, item) {
        $event.preventDefault();
        $event.stopPropagation();
        this.dashboard.splice(this.dashboard.indexOf(item), 1);
    }

    addItem() {
        this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1 });
    }

    initItem(item: GridsterItem, itemComponent: GridsterItemComponent) {
        this.itemToPush = itemComponent;
    }

    pushItem() {
        const push = new GridsterPush(this.itemToPush); // init the service
        this.itemToPush.$item.rows += 4; // move/resize your item
        if (push.pushItems(push.fromNorth)) { // push items from a direction
            push.checkPushBack(); // check for items can restore to original position
            push.setPushedItems(); // save the items pushed
            this.itemToPush.setSize();
            this.itemToPush.checkItemChanges(this.itemToPush.$item, this.itemToPush.item);
        } else {
            this.itemToPush.$item.rows -= 4;
            push.restoreItems(); // restore to initial state the pushed items
        }
        push.destroy(); // destroy push instance
        // similar for GridsterPushResize and GridsterSwap
    }
    moreThanOnePage(){
        //return this.userDashboard && this.userDashboard.pages && this.userDashboard.pages.length > 1;
    }
}
