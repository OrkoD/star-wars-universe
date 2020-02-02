import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { of, Observable, BehaviorSubject, Subject } from 'rxjs';
import { switchMap, scan, tap, map, pluck, distinctUntilChanged, withLatestFrom, takeUntil } from 'rxjs/operators';

// Services
import { PlanetListService } from './services/planet-list.service';

// Models
import { Planet, Pagination } from './models/planets.models';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'star-wars-planet-list',
  templateUrl: './planet-list.component.html',
  styleUrls: ['./planet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanetListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public displayedColumns: string[] = ['name', 'diameter', 'climate', 'population'];
  public dataSource: MatTableDataSource<Planet[]>;
  public pagination: Pagination = this.planetService.pagination;
  private planets: Planet[];
  private onDestroy$: Subject<any> = new Subject<any>();
  public isLoading = true;

  constructor(private planetService: PlanetListService) {}

  ngOnInit(): void {
    this.planetService.planets$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((planets: Planet[]) => {
        this.planets = planets;
        this.dataSource = new MatTableDataSource<any>(planets);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
