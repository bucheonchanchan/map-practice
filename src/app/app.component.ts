import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";



interface Address {
  point: {
    x : string,
    y : string
  },
  address : {
    bldnm     : string,
    bldnmdc   : string,
    category  : string,
    parcel    : string,
    road      : string,
    zipcode   : string
  }
}

@Component({
  selector: 'app-root',
  template: `
    <ul>
      <li *ngFor="let item of result">
        <p>x: {{item.point.x}}</p>
        <p>y: {{item.point.y}}</p>
        <p>parcel: {{item.address.parcel}}</p>
        <p>road: {{item.address.road}}</p>
        <p>zipcode: {{item.address.zipcode}}</p>
      </li>
    </ul>
    <button type="button" (click)="trigger(37.485232349, 126.771956907)">버튼</button>

    <app-map [coordinate]="coordinate">
  `
})
export class AppComponent {
  coordinate: {lng: number, lat: number} = {lng: 0, lat: 0};

  result: any;

  constructor(
    private http: HttpClient
  ){}

  ngOnInit(){
    this.setAddress("PARCEL", "충청남도 공주시 우성면 대성리 277-15");
    this.coordinate = {lng: 127.062597507411, lat: 36.4620725475477};
  }

  ngAfterViewInit(){
  }

  trigger(lat: number = 0, lng: number = 0){
    this.coordinate = {lng, lat};
  }

  async setAddress(category: string | null = null, query: string | null = null): Promise<void> {
    this.result = await this.searchAddress(category, query);
    console.log("2. result: ", this.result);
  }

  searchAddress(category: string | null = null, query: string | null = null): Promise<Address[]> | string {
    if(this.isAddress(category, query)) return "정확한 주소정보를 입력해 주세요.";

    const base = 'https://api.vworld.kr/req/search?';
    const baseParams = {
      key: 'D840CF34-1C7B-37A6-B68B-81E7137D7CF0',
      page : '1',
      size : '1000',
      request : 'search',
      category, // PARCEL, ROAD
      type : 'address',
      query // 주소정보
    }
    const reqParam = JSON.stringify(baseParams).replace(/["{}]/g, "").replace(/:/g, "=").replace(/,/g, "&");
    const url = `${base}${reqParam}`;

    return new Promise<Address[]>((resolve, reject) => {
      this.http.jsonp(url, 'callback').subscribe((res: any) => {
        resolve(res.response.result.items);
      });
    });
  }

  isAddress(category: string | null = null, query: string | null = null): boolean {
    return (!category || !query) || (category !== 'PARCEL' && category !== 'ROAD') ? true : false;
  }
}
