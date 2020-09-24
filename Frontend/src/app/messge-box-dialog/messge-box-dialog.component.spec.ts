import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessgeBoxDialogComponent } from './messge-box-dialog.component';

describe('MessgeBoxDialogComponent', () => {
  let component: MessgeBoxDialogComponent;
  let fixture: ComponentFixture<MessgeBoxDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessgeBoxDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessgeBoxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
