import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { loadModules } from "esri-loader";
import esri = __esri;

@Component({
  selector: "app-esri-map",
  templateUrl: "./esri-map.component.html",
  styleUrls: ["./esri-map.component.scss"],
})
export class EsriMapComponent implements OnInit, OnDestroy {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

  private _zoom = 10;
  private _center: Array<number> = [0.1278, 51.5074];
  private _basemap = "streets";
  private _loaded = false;
  private _view: esri.MapView = null;

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  constructor() {}

  async initializeMap() {
    try {
      const [EsriMap, EsriMapView, EsriSearch] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/widgets/Search",
      ]);
      var map = new EsriMap({
        basemap: this._basemap,
        ground: "world-elevation",
      });

      this._view = new EsriMapView({
        scale: 123456789,
        container: this.mapViewEl.nativeElement,
        map: map,
      });

      const searchWidget = new EsriSearch({
        view: this._view,
      });

      // Add the search widget to the top right corner of the view
      this._view.ui.add(searchWidget, {
        position: "top-right",
      });

      //   const mapProperties: esri.MapProperties = {
      //     basemap: this._basemap,
      //   };

      //   const map: esri.Map = new EsriMap(mapProperties);

      //   const mapViewProperties: esri.MapViewProperties = {
      //     container: this.mapViewEl.nativeElement,
      //     center: this._center,
      //     zoom: this._zoom,
      //     map: map,
      //   };

      //   this._view = new EsriMapView(mapViewProperties);
      //   await this._view.when();
      //   return this._view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  ngOnInit() {
    this.initializeMap().then((mapView) => {
      console.log("mapView ready: ", this._view.ready);
      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);
    });
  }

  ngOnDestroy() {
    if (this._view) {
      this._view.container = null;
    }
  }
}
