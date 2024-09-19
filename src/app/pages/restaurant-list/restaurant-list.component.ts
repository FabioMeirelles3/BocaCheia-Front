import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Restaurant } from '../../core/models/restaurant.model';
import { RestaurantService } from '../../core/services/restaurant.service';
import {
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  map,
  Subject,
  switchMap,
} from 'rxjs';
import { MenuService } from '../../core/services/menu.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    RouterLink,
  ],
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.css',
})
export class RestaurantListComponent implements OnInit {
  restaurants: Restaurant[] = [];
  searchTerm: string = '';
  private searchTerms = new Subject<string>();

  constructor(
    private restaurantService: RestaurantService,
    private menuService: MenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    forkJoin({
      restaurant: this.restaurantService.getRestaurants(),
      menu: this.menuService.getMenus(),
    }).subscribe({
      next: ({ restaurant, menu }) => {
        this.restaurants = restaurant.restaurants.map((x) => {
          x.menus = menu.menus.filter(
            (menuItem) => menuItem.restaurantId === x.id
          );
          return x;
        });
      },
      error: (error) => {
        console.error('Erro ao buscar dados:', error);
      },
    });

    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) =>
          this.restaurantService
            .getRestaurants()
            .pipe(map((data) => ({ data, term })))
        )
      )
      .subscribe(({ data, term }) => {
        this.restaurants = this.filterRestaurants(data.restaurants, term);
      });
  }

  filterRestaurants(restaurants: Restaurant[], term: string): Restaurant[] {
    const normalizedTerm = this.normalizeString(term);

    return restaurants.filter(
      (restaurant) =>
        this.normalizeString(restaurant.name).includes(normalizedTerm) ||
        this.normalizeString(restaurant.description).includes(normalizedTerm) ||
        restaurant.menus.some(
          (menu) =>
            this.normalizeString(menu.name).includes(normalizedTerm) ||
            this.normalizeString(menu.description).includes(normalizedTerm)
        )
    );
  }

  onSearch(term: string): void {
    this.searchTerms.next(term);
  }

  viewDetails(id: string): void {
    this.router.navigate(['/restaurants', id]);
  }

  normalizeString(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
