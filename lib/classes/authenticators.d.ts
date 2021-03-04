import { AuthenticatorFunc } from '../type-defs';
export declare class Authenticators {
    private authenticators;
    private _locked;
    get locked(): boolean;
    lock(): void;
    add(authTokenName: string, authenticator: AuthenticatorFunc): void;
    validateAuthenticators(authTokenNames: string[]): string[];
    get(authTokenName: string): AuthenticatorFunc;
}
//# sourceMappingURL=authenticators.d.ts.map