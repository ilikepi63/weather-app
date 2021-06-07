import { of, range, timer, zip } from "rxjs";
import { map, mergeMap, retryWhen } from "rxjs/operators";

export function backoff(maxTries: number, delay: number) {

    return retryWhen(attempts =>

        zip(range(1, maxTries + 1), attempts)

            .pipe(

                mergeMap(([i, err]) => of(i)),

                map(i => Math.pow(2, i)),

                mergeMap(v => timer(v * delay)),

            ),
    );
}