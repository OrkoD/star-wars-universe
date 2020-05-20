import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, forkJoin, BehaviorSubject } from 'rxjs';
import { catchError, tap, map, switchMap, shareReplay } from 'rxjs/operators';

// Models
import { Planet, Response, Pagination, DefaultPagination } from '../models/planets.models';

const mockData = '../../../assets/mock-data/mock-data.json';

@Injectable({
  providedIn: 'root'
})
export class PlanetListService {
  public baseUrl = 'https://swapi.co/api/planets';
  public isCashedData = false;
  public counter = 0;
  private cashedPlanets$: BehaviorSubject<Planet[]> = new BehaviorSubject<Planet[]>([]);

  private paginationSubject: BehaviorSubject<Pagination> = new BehaviorSubject<Pagination>(DefaultPagination);
  public pagination$: Observable<Pagination> = this.paginationSubject.asObservable();

  public set pagination(pagination: Pagination) {
    this.paginationSubject.next({ ...this.pagination, ...pagination });
  }

  public get pagination() {
    return this.paginationSubject.getValue();
  }

  public planets$: Observable<Planet[]> = this.cashedPlanets$.pipe(
    switchMap((planets: Planet[]) => planets.length ? of(planets) : this.fetchAllPlanets$),
    shareReplay()
  );

  private fetchAllPlanets$: Observable<Planet[]> = this.fetchPlanetsByPage$(1).pipe(
    switchMap((data: Response) => {
      const { count: total, results } = data;
      const pageSize = 10;  // According to API documentation
      const numberOfPages: number = Math.ceil(total / pageSize);
      let sourse: Observable<Planet[]>[] = [ of(results) ];

      for (let i = 2; i <= numberOfPages; i++) {
        sourse = [ ...sourse, this.fetchPlanetsByPage$(i).pipe(map(res => res.results)) ];
      }

      return forkJoin(sourse);
    }),
    map((data: Planet[][]) => data.reduce((arr, el) => [ ...arr, ...el ])),
    map((planets: Planet[]) => planets.map(planet => ({ ...planet, id: this.getId(planet.url) }))), // Attaching id
    tap((planets: Planet[]) => this.cashedPlanets$.next(planets)),
    catchError((error: HttpErrorResponse) => {
      console.log(`Oops, something went wrong while fetching planets. But don't worry we will take care of it.`);

      // return mocked data when error occurs
      return this.http.get<Planet[]>(mockData);
    })
  );

  constructor(private http: HttpClient) { }

  public getPlanet$(id: string): Observable<Planet> {
    return this.cashedPlanets$.pipe(
      switchMap(planets => {
        const planet: Planet = planets.find(p => p.id === id);

        return planet ? of(planet) : this.fetchPlanetById$(id);
      })
    );
  }

  public fetchPlanetsByPage$(page: number): Observable<Response> {
    const query = `?page=${page}`;
    const url = `${this.baseUrl}/${query}`;

    return this.http.get<Response>(url);
  }

  public fetchPlanetById$(id: string | number): Observable<Planet> {
    const url = `${this.baseUrl}/${id}`;

    return this.http.get<Planet>(url).pipe(
      catchError(error => {
        console.log(`Oops, something went wrong while fetching planet. But don't worry we will take care of it.`);

        // return mocked data when error occurs
        return this.http.get<Planet[]>(mockData).pipe(
          map(planets => planets.find(p => p.id === id))
        );
      })
    );
  }

  public getId(url: string): any { // leave as any because of compiler complaining
    return url.split('/').filter(str => str.length).pop();
  }

  public toggleCashedData() {
    this.isCashedData = !this.isCashedData;
  }

  public upCounter() {
    this.counter++;
  }
}
