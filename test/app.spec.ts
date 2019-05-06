import * as request from 'supertest';
import server from '../src/server';

let http: request.SuperTest<request.Test>;

before(() => {
  http = request(server);
});

describe('Testing app.', () => {

  it('should return 404', (done) => {
      http.get('/non-existing-page')
        .expect(404, done);
  });

  it('should return right body', (done) => {
    http.get('/')
      .expect(200, 'Hello world');

    http.get('/api')
      .expect(200, { message: 'Hello world' }, done);
  });
});

after(() => {
  server.close();
});
