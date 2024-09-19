import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Restaurant } from '../../core/models/restaurant.model';
import { RestaurantService } from '../../core/services/restaurant.service';
import { MenuService } from '../../core/services/menu.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.css',
})
export class RestaurantDetailComponent implements OnInit {
  restaurant: Restaurant | undefined;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    forkJoin({
      restaurant: this.restaurantService.getRestaurantById(id!),
      menu: this.menuService.getMenusByRestaurantId(id!),
    }).subscribe({
      next: ({ restaurant, menu }) => {
        console.log(restaurant);

        restaurant.menus = menu.menus;
        this.restaurant = restaurant;
      },
      error: (error) => {
        console.error('Erro ao buscar dados:', error);
      },
    });
  }
}
