import yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

const logger = new Logger('Config');

export class Config {
    debugLogging = 'debug';
    'server.port' = '8080';
    'app.clientApp.name' = 'todo';
    'app.registry.password' = 'admin';
    'app.security.authentication.jwt.base64-secret' = '';
    'app.security.authentication.jwt.token-validity-in-seconds' = 86400;
    'app.security.authentication.jwt.token-validity-in-seconds-for-remember-me' = 2592000;
    'app.security.authentication.jwt.hash-salt-or-rounds' = 10;
    'app.mail.base-url' = 'http://127.0.0.1:${server.port}';
    'app.mail.from' = 'todo@localhost';
    'app.swagger.default-include-pattern' = '/*';
    'app.swagger.title' = 'todo API';
    'app.swagger.description' = 'todo API documentation';
    'app.swagger.version' = '0.0.1';
    'app.swagger.path' = '/api-docs';

    constructor(properties) {
        this.addAll(properties);
    }

    public get(key: string): any {
        return this[key];
    }

    public addAll(properties): any {
        properties = objectToArray(properties);
        for (const property in properties) {
            if (properties.hasOwnProperty(property)) {
                this[property] = properties[property];
            }
        }
        this.postProcess();
    }

    public postProcess(): any {
        const variables = { ...this, ...process.env };
        for (const property in this) {
            if (this.hasOwnProperty(property)) {
                const value = this[property];
                const processedValue = this.processTemplate(value, variables);
                this[property] = processedValue;
            }
        }
    }

    private processTemplate(template, variables): any {
        // console.log(template);
        if (typeof template === 'string') {
            return template.replace(
                new RegExp('\\${[^{]+}', 'g'),
                name => variables[name.substring(2, name.length - 1)],
            );
        }
        return template;
    }
}

const yamlConfigPath = path.join(__dirname, 'config', 'application.yml');
const envYamlConfigPath = path.join(__dirname, 'config', `application-${process.env.BACKEND_ENV}.yml`);
const yamlConfig = yaml.load(fs.readFileSync(yamlConfigPath, 'utf8'));
const envYamlConfig = yaml.load(fs.readFileSync(envYamlConfigPath, 'utf8'));
const config = new Config({ ...objectToArray(yamlConfig), ...objectToArray(envYamlConfig), ipAddress: ipAddress() });

export { config };

function objectToArray(source, currentKey?, target?): any {
    target = target || {};
    for (const property in source) {
        if (source.hasOwnProperty(property)) {
            const newKey = currentKey ? currentKey + '.' + property : property;
            const newVal = source[property];

            if (typeof newVal === 'object') {
                objectToArray(newVal, newKey, target);
            } else {
                target[newKey] = newVal;
            }
        }
    }
    return target;
}

function ipAddress(): any {
    const interfaces = require('os').networkInterfaces();
    for (const dev in interfaces) {
        if (interfaces.hasOwnProperty(dev)) {
            const iface = interfaces[dev];
            for (const alias of iface) {
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    }

    return null;
}
