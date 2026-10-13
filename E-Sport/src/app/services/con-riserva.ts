import { HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';

export function conRiserva<T>(richiesta: Observable<T>, riserva: () => T): Observable<T> {
  return richiesta.pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 0 && err.status < 500) {
        return throwError(() => err);
      }
      try {
        return of(riserva());
      } catch (errRiserva) {
        return throwError(() => errRiserva);
      }
    })
  );
}
