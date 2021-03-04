import { ControlerFunc, RestMethods } from '../type-defs';
export declare class Controllers {
    private controllers;
    private _locked;
    get locked(): boolean;
    lock(): void;
    add(routeName: string, method: RestMethods, controller: ControlerFunc): void;
    validateControllers(routes: Array<{
        routeName: string;
        methods: string[];
    }>): string[];
    get(routeName: string, method: RestMethods): ControlerFunc;
}
//# sourceMappingURL=controllers.d.ts.map