import { Injectable } from '@angular/core';
import { BehaviorSubject, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private loadingCount = 0;

  show() {
    this.loadingCount++;
    this.emitLoadingState(true);
  }

  hide() {

    if(this.loadingCount === 0 ){
      return;
    }

    this.loadingCount--;

    if (this.loadingCount === 0){
      this.emitLoadingState(false);
    }
  }

  private emitLoadingState(isLoading: boolean) {
    Promise.resolve().then(() => {
      this.loadingSubject.next(isLoading);
    });
  }
}
