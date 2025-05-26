import { config as readEnv } from "dotenv";
import { join } from "path";

export class Configuration {
  static env: any = null;

  static database() {
    Configuration.readEnv();

    return {
      dialect: "sqlite" as any,
      host: Configuration.env.DB_HOST,
      logging: Configuration.env.DB_LOGGING === "true",
    };
  }

  static readEnv() {
    if (Configuration.env) {
      return;
    }

    const { parsed } = readEnv({
      path: join(
        __dirname,
        `../../../environments/.environment.${process.env.NODE_ENV}`
      ),
    });

    Configuration.env = {
      ...parsed,
      ...process.env,
    };
  }
}
