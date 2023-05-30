const app = require('../../app')
const request = require('supertest');
const { sequelize } = require("../../models");
const { hashPassword } = require("../../helpers/helper");

beforeAll(async () => {
  await sequelize.queryInterface.bulkInsert('Customers', [{ email: 'customer@test.com', password: hashPassword('customer'), role: 'Customer', createdAt: new Date(), updatedAt: new Date() }])
})

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete('Customers', null, {
    truncate: true, restartIdentity: true, cascade: true
  });
})

describe('Customer Login', () => {
  it('should sign in customer and return 200', async () => {
    const custObj = { email: 'customer@test.com', password: 'customer' }
    const response = await request(app)
      .post('/api/login')
      .send(custObj)

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Success to login');
    expect(response.body).toHaveProperty('access_token', expect.any(String));
    expect(response.body).toHaveProperty('id', expect.any(Number));
  });

  it('should not sign in customer when password is not correct and return 401', async () => {
    const custObj = { email: 'customer@test.com', password: 'customerzzz' }
    const response = await request(app)
      .post('/api/login')
      .send(custObj)

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email / password is incorrect');
  });

  it('should not sign in customer when email is not register and return 401', async () => {
    const custObj = { email: 'customerwrong@test.com', password: 'customer' }
    const response = await request(app)
      .post('/api/login')
      .send(custObj)

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email / password is incorrect');
  });
});