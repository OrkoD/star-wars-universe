import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PlanetListService } from './planet-list.service';
import { Planet, Response, Pagination } from '../models/planets.models';

const dummyPlanets: Planet[] = [
  {
    name: 'Tatooine',
    rotation_period: '23',
    orbital_period: '304',
    diameter: '10465',
    climate: 'arid',
    gravity: '1 standard',
    terrain: 'desert',
    surface_water: '1',
    population: '200000',
    residents: [ 'https://swapi.co/api/people/1/' ],
    films: [ 'https://swapi.co/api/films/5/', 'https://swapi.co/api/films/4/' ],
    created: '2014-12-09T13:50:49.641000Z',
    edited: '2014-12-21T20:48:04.175778Z',
    url: 'https://swapi.co/api/planets/1/',
    id: '1'
  },
  {
    name: 'Tatooine - 2',
    rotation_period: '23',
    orbital_period: '304',
    diameter: '10465',
    climate: 'arid',
    gravity: '1 standard',
    terrain: 'desert',
    surface_water: '1',
    population: '200000',
    residents: [ 'https://swapi.co/api/people/1/' ],
    films: [ 'https://swapi.co/api/films/5/', 'https://swapi.co/api/films/4/' ],
    created: '2014-12-09T13:50:49.641000Z',
    edited: '2014-12-21T20:48:04.175778Z',
    url: 'https://swapi.co/api/planets/1/',
    id: '2'
  }
];

describe('PlanetListService', () => {
  let service: PlanetListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ PlanetListService ]
    });

    service = TestBed.get(PlanetListService); // an ingected version of planet service
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure that there is no request outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have right base url', () => {
    expect(service.baseUrl).toBe('https://swapi.co/api/planets');
  });

  it('should retrieve planets from the API via GET', () => {
    const page = 1;

    service.fetchPlanetsByPage$(page).subscribe((response: Response) => {
      expect(response.results.length).toBe(1);
      expect(response.results).toEqual(dummyPlanets);
    });

    const request = httpMock.expectOne(`${service.baseUrl}/?page=${page}`); // should be expected url

    expect(request.request.method).toBe('GET');
    request.flush(dummyPlanets); // it alowes to use our dummy data and to fire Http request
  });

  it('should retrieve one planet from the API via GET', () => {
    const id = 5;
    const dummyPlanet = dummyPlanets[0];

    service.fetchPlanetById$(id).subscribe(planet => {
      expect(planet).toEqual(dummyPlanet);
    });

    const request = httpMock.expectOne(`${service.baseUrl}/${id}`);

    expect(request.request.method).toBe('GET');
    request.flush(dummyPlanet);
  });

  it('should generate right id', () => {
    expect(service.getId('some/preaty/string/here/1')).toBe('1');
  });

  it('should update correctly pagination subject', () => {
    const newPagination: Pagination = {
      previousPageIndex: 0,
      pageIndex: 1,
      pageSize: 101,
      length: 15,
      pageSizeOptions: [5, 10, 15]
    };

    service.pagination = newPagination;
    service.pagination$.subscribe(pagination => {
      expect(pagination).toEqual(newPagination);
    });
  });

  it('should toggle the cached data', () => {
    expect(service.isCashedData).toBeFalsy();
    service.toggleCashedData();
    expect(service.isCashedData).toBeTruthy();
  });

  it('should increase conuter', () => {
    service.upCounter();
    expect(service.counter).toBe(1);
  });
});
