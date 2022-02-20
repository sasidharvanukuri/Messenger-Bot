
const chai = require('chai');
const { expect } = require('chai');
let request = require('supertest')('http://localhost:9000');

describe('GET /xxxx Invoke', async () => {
    // console.log(response)
    it('shoulg get HTTP 404', async () => {
        let response = await request.get('/xxxx')
        expect(response.statusCode).to.equal(404)
    });
});


describe('GET /webhook Invoke', async () => {
    // console.log(response)
    it('should get HTTP 403', async () => {
        let response = await request.get('/webhook')
        expect(response.statusCode).to.equal(403)
    });
});



describe('POST /webhook Invoke', async () => {
    // console.log(response)
    it('should get HTTP 200 and status as false', async () => {
        let response = await request.post('/webhook').send({"event_name":"message"})
        expect(response.statusCode).to.equal(200)
        expect(response.body.status).to.equal(false)
    });
});