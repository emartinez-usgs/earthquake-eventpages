import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockComponent } from 'ng2-mock-component';

import { ContributorService } from '@core/contributor.service';
import { EventService } from '@core/event.service';
import { ProductPageComponent } from './product-page.component';

describe('ProductPageComponent', () => {
  let component: ProductPageComponent;
  let fixture: ComponentFixture<ProductPageComponent>;

  beforeEach(async(() => {
    const contributorServiceStub = {
      getContributors: jasmine.createSpy('contributorService::getContributors')
    };

    const eventServiceStub = {
      getEvent: jasmine.createSpy('eventService::getEvent'),
      getProduct: jasmine.createSpy('eventService::getProduct')
    };

    TestBed.configureTestingModule({
      declarations: [
        ProductPageComponent,

        MockComponent({
          inputs: ['event', 'product'],
          selector: 'product-page-footer'
        }),
        MockComponent({
          inputs: [
            'contributors',
            'event',
            'product',
            'productType',
            'showVersion',
            'showAllProducts'
          ],
          selector: 'product-page-header'
        })
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: ContributorService, useValue: contributorServiceStub },
        { provide: EventService, useValue: eventServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
