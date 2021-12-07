import { useEffect, useState } from "react";
import { Observable } from "rxjs";

const useObservable = <T extends any>(source: Observable<T>): T | undefined => {
    const [data, setData] = useState<T | undefined>(undefined);

    useEffect(() => {
        const subscription = source.subscribe({ next: data => setData(data as T) });
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    });

    return data as T;
};

export default useObservable;