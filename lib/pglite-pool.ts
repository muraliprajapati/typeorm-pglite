import { EventEmitter } from "events";
import { PGliteInstance } from "./pglite-instance";
import { Results } from "@electric-sql/pglite";

type ConnectCallback = (
  error: unknown,
  client: PGlitePool | null,
  done: Function
) => void;
type QueryCallback = (error: unknown, results: Results<unknown> | null) => void;

export class PGlitePool extends EventEmitter {
  constructor() {
    super();
  }

  private doneCallback() {}

  async connect(callback: ConnectCallback) {
    try {
      await PGliteInstance.getInstance();
      callback(null, this, this.doneCallback);
    } catch (error) {
      callback(error, null, this.doneCallback);
    }
  }

  async query(
    sqlQuery: string,
    queryParameters?: any[],
    callback?: QueryCallback
  ) {
    const pgliteInstance = await PGliteInstance.getInstance();
    let cb = callback;
    let params = queryParameters;

    if (typeof queryParameters === "function") {
      cb = queryParameters;
      params = undefined;
    }

    const hasParams =
      params !== undefined && Array.isArray(params) && params.length > 0;

    const queryPromise = hasParams
      ? pgliteInstance.query(sqlQuery, params)
      : // exec returns an array of results (one item per statement). TypeORM
        // expects the last result in the case of multi-statement strings,
        // so mirror the behaviour of the previous implementation by returning
        // the last element or an empty placeholder.
        pgliteInstance.exec(sqlQuery).then((results) =>
          results[results.length - 1] || { rows: [] }
        );

    return queryPromise
      .then((results) => {
        if (cb) {
          cb(null, results);
        }
        return results;
      })
      .catch((error) => {
        if (cb) {
          cb(error, null);
        }
        throw error;
      });
  }

  end(errorCallback: Function) {
    PGliteInstance.close()
      .then(() => errorCallback(null))
      .catch((error) => errorCallback(error));
  }
}
