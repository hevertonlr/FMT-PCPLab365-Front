import { TestBed } from '@angular/core/testing';
import { PageTitleStrategy } from './page-title.strategy';

describe('PageTitleStrategy', () => {
  let strategy: PageTitleStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    strategy = TestBed.inject(PageTitleStrategy);
  });

  it('should be created', () => {
    expect(strategy).toBeTruthy();
  });
});
