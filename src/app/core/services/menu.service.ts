import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from '../models/restaurant.model';
import { Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private apiUrl = `${environment.baseApiUrl}/menus`;

  constructor(private http: HttpClient) {}

  getMenus(): Observable<{ menus: Menu[] }> {
    return this.http.get<{ menus: Menu[] }>(this.apiUrl);
  }

  getMenusByRestaurantId(id: string): Observable<{ menus: Menu[] }> {
    return this.http.get<{ menus: Menu[] }>(`${this.apiUrl}/rest/${id}`);
  }
}
