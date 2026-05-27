import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinarianList } from './veterinarian-list';

describe('VeterinarianList', () => {
  let component: VeterinarianList;
  let fixture: ComponentFixture<VeterinarianList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinarianList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeterinarianList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
