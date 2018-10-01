process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../dist/app');
let should = chai.should();


chai.use(chaiHttp);
let token = '';
let response;
const user = '3KLES\\WHM3';
const password = '3Kles123';
let fromlocation = {};
let tolocation = {};
const trqt = 1;
const initdata = {
	WHLO: '001',
	ITNO: 'AMB001'
}

describe('M3 API', () => {

	describe('M3 Authentication', () => {
		it('it should get a token', (done) => {
			chai.request(server)
				.post('/authenticate')
				.set('user', user)
				.set('password', password)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.type('form')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(1);
					// res.body.should.have.property('token');
					res.header.should.have.property('token');
					token = res.header.token;
					response = res.body;
					done();
				});

		});

		describe('List locations', () => {
			it('it should list location of warehouse 001 and item AMB001', (done) => {
				chai.request(server)
					.post('/listlocation')
					.set('token', token)
					.set('user', user)
					.set('password', password)
					.set('Content-Type', 'application/x-www-form-urlencoded')
					.type('form')
					.send(initdata)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
						res.body.length.should.be.above(1);
						response = res.body;
						fromlocation = getRandomLocation(response);
						tolocation = getRandomLocation(response);
						response = [fromlocation, tolocation];
						done();
					});
			});
		});

		describe('Update Location', () => {
			it('it should update location from to another location with quantity=' + trqt, (done) => {
				let data = {
					WHLO: fromlocation['WHLO'],
					ITNO: fromlocation['ITNO'],
					WHSL: fromlocation['WHSL'],
					TWSL: tolocation['WHSL'],
					TRQT: trqt,
				}
				chai.request(server)
					.post('/updatelocation')
					.set('token', token)
					.set('user', user)
					.set('password', password)
					.set('Content-Type', 'application/x-www-form-urlencoded')
					.type('form')
					.send(data)
					.end((err, res) => {
						res.should.have.status(200);
						response = res.body;
						done();
					});
			});
		});

		describe('Get Location', () => {
			it('it should get location from random location and check change', (done) => {
				let data = {
					WHLO: fromlocation.WHLO,
					ITNO: fromlocation.ITNO,
					WHSL: fromlocation.WHSL,
				}
				chai.request(server)
					.post('/getlocation')
					.set('token', token)
					.set('user', user)
					.set('password', password)
					.set('Content-Type', 'application/x-www-form-urlencoded')
					.type('form')
					.send(data)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
						res.body.length.should.be.eql(1);
						response = res.body;
						done();
					});
			});
		});

		afterEach(() => {
			console.log("######################");
			console.log('Token is:' + token);
			console.log('Response:' + JSON.stringify(response));
			console.log("######################");
		})
	});
});

var checkStock = (record) => {
	const stqt = Number(record['STQT']);
	if (stqt > 0) { return true; }
	return false;
}

var getRandomLocation = (response) => {
	const count = response.length;
	const index = getRandomInt(count);
	if (checkStock(response[index])) {
		return response[index];
	}
	return getRandomLocation(response);
}

var getRandomInt = (max) => {
	return Math.floor(Math.random() * Math.floor(max));
}
