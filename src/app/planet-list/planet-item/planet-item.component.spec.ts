import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { PlanetItemComponent } from './planet-item.component';

import { PlanetListService } from '../services/planet-list.service';

describe('PlanetItemComponent', () => {
  let component: PlanetItemComponent;
  let fixture: ComponentFixture<PlanetItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatListModule,
        MatProgressSpinnerModule,
        RouterModule.forRoot([]),
        HttpClientModule
      ],
      declarations: [ PlanetItemComponent ],
      providers: [ PlanetListService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
