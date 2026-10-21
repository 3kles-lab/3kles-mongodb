import express from 'express';
import { MongoDBApp } from '../src/mongodb.app';

function configured(settings: Record<string, unknown>) {
    // Avoid opening a network connection from GenericApp's constructor.
    const instance = Object.create(MongoDBApp.prototype) as MongoDBApp;
    (instance as any).app = express();
    for (const [key, value] of Object.entries(settings)) instance.getApp().set(key, value);
    return instance;
}

test('uses SCRAM credentials with verified client TLS and a replica-set seed list', () => {
    const app = configured({ DB_PROTOCOL: 'mongodb', DB_OPTIONS: 'replicaSet=rs0&authSource=milo2',
        DB_CAFILE: '/certs/ca.crt', DB_KEY_CERT: '/certs/tls-combined.pem' });
    const uri = app.createMongoURL('mongo-0:27017,mongo-1:27017,mongo-2:27017', 0, 'milo2', 'user@lab', 'p:/@');
    expect(uri).toBe('mongodb://user%40lab:p%3A%2F%40@mongo-0:27017,mongo-1:27017,mongo-2:27017/milo2?replicaSet=rs0&authSource=milo2');
    app.initOption();
    expect((app as any).connectOptions).toEqual({ tls: true, tlsCAFile: '/certs/ca.crt', tlsCertificateKeyFile: '/certs/tls-combined.pem' });
});

test('supports CA-only TLS without selecting X.509 authentication', () => {
    const app = configured({ DB_CAFILE: '/certs/ca.crt' });
    app.initOption();
    expect((app as any).connectOptions).toEqual({ tls: true, tlsCAFile: '/certs/ca.crt' });
});

test('normalizes DB_PORT=0 from environment for seed lists', () => {
    const old = process.env.DB_PORT;
    try {
        process.env.DB_PORT = '0';
        const app = configured({});
        app.initAppVariable();
        expect(app.getApp().get('DB_PORT')).toBe(0);
    } finally {
        if (old === undefined) delete process.env.DB_PORT;
        else process.env.DB_PORT = old;
    }
});
