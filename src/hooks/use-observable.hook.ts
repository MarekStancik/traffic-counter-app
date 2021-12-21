import { useEffect, useState } from "react";
import { Observable } from "rxjs";

const useObservable = <T extends any>(source: Observable<T>, ...deps: any): T | undefined => {
    const [data, setData] = useState<T | undefined>(undefined);

    useEffect(() => {
        const subscription = source.subscribe({next: data => setData((Array.isArray(data) ? [...data] : typeof data === "object" ? Object.assign({}, data) : data) as T)});
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps

    return data as T;
};

export default useObservable;