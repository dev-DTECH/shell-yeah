import { cosmiconfigSync } from 'cosmiconfig';
import defaultConfig from '../../gateway.config.json';

const moduleName = 'gateway';
// Initialize cosmiconfig with your module name
const explorer = cosmiconfigSync(moduleName, {
    searchPlaces: [
        'gateway.local.config.json',
        'gateway.local.config.js',
        'gateway.development.config.json',
        'gateway.development.config.js',
        'gateway.production.config.json',
        'gateway.production.config.js',
        'gateway.config.json',
        'gateway.config.js',
    ]
});

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        GITHUB_AUTH_TOKEN: string;
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        PWD: string;
      }
    }
  }

type GatewayConfig = {
    port: number;
    rateLimit: number;
    timeout: number;
    services: {
        name: string;
        route: string;
        target: string;
        authorize?: boolean;
    }[];
}

function loadConfig() {
    try {
        // Search for and load the configuration synchronously
        const result = explorer.search();

        if (!result) {
            // No config found, return default config
            return defaultConfig
        }

        console.log(`Config loaded: ${JSON.stringify(result.filepath)}`);

        // Merge found config with defaults
        return {
            ...defaultConfig,
            ...result.config
        };
    } catch (error) {
        console.error('Error loading configuration:', error);
        // Return default config on error
        return defaultConfig
    }
}

const config: GatewayConfig = loadConfig();

export default config;