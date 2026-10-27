import express, { RequestHandler } from 'express';
import request from 'supertest';
import { GenericApp, GenericController, IGenericService } from '@3kles/3kles-corebe';
import { MongoDBRouter } from '../src/mongodb.router';
import { MongoDBSecureRouter } from '../src/mongodb.secure.router';
import { MongoDBController } from '../src/mongodb.controller';

function controller(): MongoDBController {
    // Exercise real controller execution without opening a database connection.
    const result = new GenericController({
        getServiceParams: () => undefined,
        execute: async (operation, req) => ({ type: 'json', data: { operation, body: req.body, params: req.params } }),
    } as IGenericService) as MongoDBController;
    result.getParameters = () => ({ modelname: 'models', model: 'models' });
    return result;
}

function genericApplication(limit?: number) {
    return new GenericApp('api', undefined, { limit, metricRegister: {
        register: {}, metrics: async () => '', addMetric: () => undefined,
        collect: () => (_req, _res, next) => next(),
    } });
}

function application(router: express.Router) {
    const app = genericApplication();
    app.addRoute(router);
    return app.getApp();
}

describe('MongoDB compatibility with native Express routers', () => {
    let errors: jest.SpyInstance;
    beforeEach(() => { errors = jest.spyOn(console, 'error').mockImplementation(() => undefined); });
    afterEach(() => errors.mockRestore());
    it('parses default CRUD bodies and keeps read/delete routing', async () => {
        const app = application(new MongoDBRouter(controller()).router);
        const body = { empty: {}, value: false, zero: 0 };
        for (const [method, path, operation] of [
            ['post', '/api/models', 'add'], ['put', '/api/models/id', 'update'], ['patch', '/api/models/id', 'update'],
        ] as const) {
            const response = await request(app)[method](path).send(body).expect(200);
            expect(response.body.body).toEqual(body);
            expect(response.body.operation).toBe(operation);
        }
        expect((await request(app).get('/api/models').expect(200)).body.operation).toBe('list');
        expect((await request(app).get('/api/models/id').expect(200)).body.operation).toBe('get');
        expect((await request(app).delete('/api/models/id').expect(200)).body.operation).toBe('delete');
        await request(app).post('/api/models').type('json').send('{broken').expect(400);
    });

    it('parses before validators added by an inherited router, including nested CRUD handlers', async () => {
        const validated: unknown[] = [];
        const validate: RequestHandler = (req, _res, next) => { validated.push(req.body); next(); };
        class TemplateRouter extends MongoDBRouter {
            override addController(c: MongoDBController): void {
                this.router.route('/models').post(validate);
                this.router.route('/models/:id').all(validate).put(validate);
                super.addController(c);
            }
        }
        const app = application(new TemplateRouter(controller()).router);
        const body = { value: false };
        for (const method of ['post', 'put'] as const) {
            const result = await request(app)[method](method === 'post' ? '/api/models' : '/api/models/id').send(body).expect(200);
            expect(result.body.body).toEqual(body);
        }
        expect(validated).toEqual([body, body, body]);
    });

    it('keeps existing CRUD routes unchanged alongside a dedicated raw upload router', async () => {
        const generic = genericApplication(32);
        generic.addRoute(new MongoDBRouter(controller()).router);
        const files = express.Router();
        files.post('/files', async (req, res) => {
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(Buffer.from(chunk));
            res.json({ content: Buffer.concat(chunks).toString('base64') });
        });
        generic.addRoute(files);
        const app = generic.getApp();
        const content = 'invalid JSON file' + 'x'.repeat(150000);
        expect((await request(app).post('/api/files').type('json').send(content).expect(200)).body.content)
            .toBe(Buffer.from(content).toString('base64'));
        await request(app).post('/api/models').send({ value: 'x'.repeat(100) }).expect(413);
        expect((await request(app).post('/api/models').send({ value: 0 }).expect(200)).body.body).toEqual({ value: 0 });
    });

    it('inherits default parsing for secure CRUD routes after authentication middleware', async () => {
        const auth = {
            authenticate: jest.fn(async (req, res) => { res.json(req.body); }),
            checkAuth: jest.fn((_req, _res, next) => next()),
            revokeAuth: jest.fn((_req, res) => res.end()),
            refreshToken: jest.fn(async (_req, res) => { res.end(); }),
        };
        const app = application(new MongoDBSecureRouter(auth, controller()).router);
        expect((await request(app).post('/api/authenticate').send({ user: 'Alice' }).expect(200)).body).toEqual({ user: 'Alice' });
        expect((await request(app).post('/api/models').send({ value: false }).expect(200)).body.body).toEqual({ value: false });
        expect(auth.checkAuth).toHaveBeenCalledTimes(1);
    });
    it('applies a custom parser once before inherited validation', async () => {
        const parse = express.text({ type: 'application/xml' });
        const selected: RequestHandler = jest.fn((req, res, next) => parse(req, res, next));
        class CustomRouter extends MongoDBRouter {
            override addController(c: MongoDBController): void {
                this.router.post('/models', (req, _res, next) => {
                    expect(req.body).toBe('<file/>'); next();
                });
                super.addController(c);
            }
        }
        const app = application(new CustomRouter(controller(), { parser: selected }).router);
        expect((await request(app).post('/api/models').type('application/xml').send('<file/>').expect(200)).body.body).toBe('<file/>');
        expect(selected).toHaveBeenCalledTimes(1);
    });

    it('supports adding CRUD controllers after secure router construction', async () => {
        const auth = {
            authenticate: (_req, res) => res.end(), checkAuth: (_req, _res, next) => next(),
            revokeAuth: (_req, res) => res.end(), refreshToken: (_req, res) => res.end(),
        };
        const router = new MongoDBSecureRouter(auth);
        router.addController(controller());
        expect((await request(application(router.router)).post('/api/models').send({ value: 0 }).expect(200)).body.body).toEqual({ value: 0 });
    });

});
