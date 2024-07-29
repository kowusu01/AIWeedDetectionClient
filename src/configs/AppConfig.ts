// AppConfig.ts

class AppConfig {

  constructor() {
  }

  getAppConfigString(key: string) : string {
   return import.meta.env[key];
}
}

export default AppConfig;