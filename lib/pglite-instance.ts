import { PGlite, PGliteOptions } from "@electric-sql/pglite";

export class PGliteInstance {
  private static instance: PGlite | null = null;
  private static options: PGliteOptions | undefined;

  static async getInstance(): Promise<PGlite> {
    if (!PGliteInstance.instance) {
      if (!PGliteInstance.options) {
        console.warn(
          "PGlite constructor options are not provided. Creating instance with default options."
        );
      }
      PGliteInstance.instance = await PGlite.create(PGliteInstance.options);
    }

    return PGliteInstance.instance;
  }

  static setOptions(options: PGliteOptions): void {
    PGliteInstance.options = options;
  }

  static async close(): Promise<void> {
    if (PGliteInstance.instance) {
      await PGliteInstance.instance.close();
      PGliteInstance.instance = null;
    }
  }
}

export async function getPGliteInstance() {
  return PGliteInstance.getInstance();
}
