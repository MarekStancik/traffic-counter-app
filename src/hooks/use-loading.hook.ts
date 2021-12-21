import { finalize, Observable, of, switchMap, tap } from "rxjs";
import uiService from "./../services/ui.service";

const useLoading = <T extends any>(source: Observable<T>): Observable<T> => {
    return of(null).pipe(
        tap(_ => uiService.setIsLoading(true)),
        switchMap(_ => source.pipe(tap(_ => uiService.setIsLoading(false)),finalize(() => uiService.setIsLoading(false))))
    );
}

export default useLoading;