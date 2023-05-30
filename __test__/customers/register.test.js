const app = require('../../app')
const request = require('supertest');
const { sequelize } = require("../../models");

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete('Customers', null, {
    truncate: true, restartIdentity: true, cascade: true
  });
})

describe('Customer Register', () => {
  it('should create an customer account and return 201', async () => {
    const custObj = { email: 'customer@test.com', password: 'customer' }
    const response = await request(app)
      .post('/api/register')
      .send(custObj)

    expect(response.status).toBe(201)
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Success registered user');
    expect(response.body.data).toHaveProperty('id', expect.any(Number));
    expect(response.body.data).toHaveProperty('email', expect.any(String));
  });

  it('should not create account when email is empty/null and return 400', async () => {
    const custObj = { email: undefined, password: 'customer' }
    const response = await request(app)
      .post('/api/register')
      .send(custObj)

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });

  it('should not create account when password is empty/null and return 400', async () => {
    const custObj = { email: 'customer@test.com', password: undefined }
    const response = await request(app)
      .post('/api/register')
      .send(custObj)

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Password is required');
  });

  it('should not create account when email is empty string and return 400', async () => {
    const custObj = { email: '', password: 'customer' }
    const response = await request(app)
      .post('/api/register')
      .send(custObj)

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });

  it('should not create account when password is empty string and return 400', async () => {
    const custObj = { email: 'customer@test.com', password: '' }
    const response = await request(app)
      .post('/api/register')
      .send(custObj)

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Password is required');
  });

  it('should not create account when email is already register and return 409', async () => {
    const custObj = { email: 'customer@test.com', password: 'customer' }
    await request(app)
      .post('/api/register')
      .send(custObj)

    const response = await request(app)
      .post('/api/register')
      .send(custObj)

    expect(response.status).toBe(409);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email is already registered!');
  });

  it('should not create account when email format not correct and return 400', async () => {
    const custObj = { email: 'customer', password: 'customer' }
    const response = await request(app)
      .post('/api/register')
      .send(custObj)

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Email is not valid');
  });

});