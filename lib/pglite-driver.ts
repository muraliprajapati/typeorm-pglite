import { PGliteOptions, types as PGliteTypes } from "@electric-sql/pglite";
import { PGlitePool } from "./pglite-pool";
import { PGliteInstance } from "./pglite-instance";

export class PGliteDriver {
  constructor(options?: PGliteOptions) {
    const boolSerializer = (val: any) => {
      if (val === true || val === "true" || val === 1) return "TRUE";
      if (val === false || val === "false" || val === 0) return "FALSE";
      return val;
    };

    const mergedOptions: PGliteOptions = {
      ...options,
      serializers: {
        [PGliteTypes.BOOL]: boolSerializer,
        ...(options?.serializers ?? {}),
      },
    };

    PGliteInstance.setOptions(mergedOptions);
  }

  public get driver() {
    return class {
      static Pool = PGlitePool;
    };
  }
}
