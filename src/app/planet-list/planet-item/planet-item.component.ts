import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Services
import { PlanetListService } from '../services/planet-list.service';

// Models
import { Planet, DetailesList } from '../models/planets.models';
import { getRandomImg } from '../helpers/img.helper';

@Component({
  selector: 'star-wars-planet-item',
  templateUrl: './planet-item.component.html',
  styleUrls: ['./planet-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanetItemComponent {
  public planet$: Observable<Planet> = this.route.paramMap.pipe(
    switchMap(params => this.planetService.getPlanet$(params.get('id')))
  );

  public list: DetailesList[] = [
    { name: `Rotation period`, property: 'rotation_period' },
    { name: `Orbital period`, property: 'orbital_period' },
    { name: `Diameter`, property: 'diameter' },
    { name: `Climate`, property: 'climate' },
    { name: `Gravity`, property: 'gravity' },
    { name: `Terrain`, property: 'terrain' },
    { name: `Surface water`, property: 'surface_water' },
    { name: `Population`, property: 'population' },
  ];

  public imgUrl: string = getRandomImg();

  constructor(private route: ActivatedRoute,
              private planetService: PlanetListService) { }

}
