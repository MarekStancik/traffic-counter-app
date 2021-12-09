import { BehaviorSubject, Observable } from "rxjs";

export interface NavbarLink {
    href: string;
    title: string;
    icon?: React.ReactNode;
    active?: boolean;
}

class UiService {

    private links: BehaviorSubject<NavbarLink[]> = new BehaviorSubject([] as NavbarLink[]);

    public get links$(): Observable<NavbarLink[]> {
        return this.links.pipe();
    }

    public setLinks(links: NavbarLink[]) {
        this.links.next(links);
    }

    private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public get isLoading$(): Observable<boolean> {
        return this.isLoading.pipe();
    }

    public setIsLoading(loading: boolean) {
        this.isLoading.next(loading);
    }
}

const uiService = new UiService();
export default uiService;