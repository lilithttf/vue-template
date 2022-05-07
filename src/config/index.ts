const env = process.env.NODE_ENV || "dev"

interface ApiConfig {
  baseApi: string,
  mockApi: string
}

interface ENV_CONFIG {
  [key: string]: ApiConfig,
};

const EnvConfig: ENV_CONFIG = {
  "dev": {
    baseApi: 'http://192.168.250.5:17099/business-server',
    mockApi: 'http://127.0.0.1:4523/mock/763440'
  },
  "test": {
    baseApi: '/',
    mockApi: 'http://127.0.0.1:4523/mock/763440'
  },
  "prod": {
    baseApi: 'http://10.216.12.167:17099/',
    mockApi: ''
  }
}

export default {
  env,
  mock: false,
  namespace: 'social-concern',
  ...EnvConfig[env]
}
