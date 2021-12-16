import { useEffect } from "react";
import { Observable, tap } from "rxjs";
import uiService from "./../services/ui.service";

const useLoading = <T extends any>(source: Observable<T>): Observable<T> => {
    useEffect(() => {
        uiService.setIsLoading(true);
        return () => uiService.setIsLoading(false);
    }, []);
    return source.pipe(tap(_ => uiService.setIsLoading(false)));
}

export default useLoading;