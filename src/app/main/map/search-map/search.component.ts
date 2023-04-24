import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
} from "@angular/core";
// import { MapService } from "./map.service";
import { loadModules } from "esri-loader";
import { OnChange } from "ngx-bootstrap";
declare var $: any;
import esri = __esri;
@Component({
  selector: "esri-search",
  template: ` <div #esriSearchField></div>`,
  //   inputs: ["options"],
})
export class SearchComponent {
  @ViewChild("esriSearchField", { static: true }) private mapViewEl: ElementRef;
  @Output() addressChange = new EventEmitter<any>();
  @Input() oldAddress: string;
  //   constructor(private elRef: ElementRef, private _mapService: MapService) {}
  _selectedResult: any;
  _view: esri.MapView = null;
  searchWidget: any;
  _keyword: any;
  constructor() {}

  search: any;
  options: Object;

  // create the search dijit
  ngOnInit() {
    this._keyword = null;
    // this.search = this._mapService.createSearch(
    //   this.options,
    //   this.elRef.nativeElement.firstChild
    // );
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (changes.oldAddress.currentValue !== undefined) {
      console.log(changes.oldAddress.currentValue.name);
      this._keyword = changes.oldAddress.currentValue.name;
      this._view = changes.oldAddress.currentValue.geometry;
      this._selectedResult = changes.oldAddress.currentValue.searchResult;
      //   this.getMap();
    }
  }

  // start up once the DOM is ready
  ngAfterViewInit() {
    // this.search.startup();
  }

  // bind search dijit to map
  //   setMap(map) {
  //     this.search.set("map", map);
  //   }

  // destroy search dijit
  ngOnDestroy() {
    // if (this.search) {
    //   this.search.destroy();
    // }
  }

  async initializeMap() {
    const _this = this;
    try {
      const [Search, FeatureLayer] = await loadModules([
        "esri/widgets/Search",
        "esri/layers/FeatureLayer",
      ]);
      let searchWidget = new Search({}, this.mapViewEl.nativeElement);
      if (_this._keyword !== null && _this._selectedResult !== undefined) {
        // var infoTemplate = new InfoTemplate(name, _this._keyword);
        var featureLayer = new FeatureLayer(
          "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Petroleum/KGS_OilGasFields_Kansas/MapServer/0",
          {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
          }
        );

        searchWidget.result = _this._selectedResult.searchResult;
        searchWidget.sources.push({
          layer: featureLayer,
          searchFields: [_this._keyword],
          displayField: _this._keyword,
          exactMatch: false,
          outFields: [_this._keyword, _this._keyword],
          resultGraphicEnabled: true,
          name: _this._keyword,
          placeholder: "Enter address",
        });
      }
      //Set the sources above to the search widget
      //   s.startup();
      searchWidget.startup();
      searchWidget.on("select-result", function (event) {
        console.log("The selected search result: ", event);
        _this._selectedResult = {
          latitude: event.result.feature.geometry.latitude,
          longitude: event.result.feature.geometry.longitude,
          name: event.result.name,
          key: event.result.key,
          sourceIndex: event.result.sourceIndex,
          geometry: event.result.feature.geometry,
          extent: event.result.extent,
          searchResult: event.result,
        };
        _this._onSelect(_this._selectedResult);
      });
      console.log("The selected search result 2: ", _this._selectedResult);
      return _this._selectedResult;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  _onSelect(data) {
    this.addressChange.emit(data);
  }

//   async getMap() {
//     try {
//       
//       const _this = this;
//       const [EsriSearch] = await loadModules(["esri/widgets/Search"]);
//       _this.searchWidget = new EsriSearch({
//         view: _this._view,
//       });
//       _this._view.on("load", function (evt) {
//        
//         _this.searchWidget.clear();
//         _this._view.popup.clear();
//         if (_this.searchWidget.activeSource) {
//           let geocoder = _this.searchWidget.activeSource.locator; // World geocode service
//           let params = {
//             location: evt.mapPoint,
//           };
//           geocoder.locationToAddress(params).then(
//             function (response) {
//               // Show the address found
//               let address = response.address;
//               _this.showPopup(address, evt.mapPoint);
//             },
//             function (err) {
//               // Show no address found
//               _this.showPopup("No address found.", evt.mapPoint);
//             }
//           );
//         }
//       });
//     } catch (error) {
//       console.log("EsriLoader: ", error);
//     }
//   }

  showPopup(address, pt) {
    const _this = this;
    _this._view.popup.open({
      title:
        +Math.round(pt.longitude * 100000) / 100000 +
        "," +
        Math.round(pt.latitude * 100000) / 100000,
      content: address,
      location: pt,
    });
  }
}
