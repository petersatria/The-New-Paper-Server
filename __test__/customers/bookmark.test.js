const app = require('../../app')
const request = require('supertest');
const { sequelize } = require("../../models");
const { signToken } = require("../../helpers/helper")
const { Customer } = require('../../models')

let token
beforeAll(async () => {
  const customer = await Customer.create({ email: 'customer@test.com', password: 'customer', role: 'Customer' })
  token = signToken({ id: customer.id }, true)

  const users = require('../../data/users.json')
  users.forEach(e => {
    e.createdAt = e.updatedAt = new Date()
  })
  await sequelize.queryInterface.bulkInsert('Users', users);

  const categories = require('../../data/categories.json')
  categories.forEach(e => {
    e.createdAt = e.updatedAt = new Date()
  })
  await sequelize.queryInterface.bulkInsert('Categories', categories);

  const data = require('../../data/articles.json')
  data.forEach(e => {
    e.createdAt = e.updatedAt = new Date()
    e.status = 'Active'
  })
  await sequelize.queryInterface.bulkInsert('Articles', data)
})

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete('Users', null, {
    truncate: true, restartIdentity: true, cascade: true
  });
  await sequelize.queryInterface.bulkDelete('Categories', null, {
    truncate: true, restartIdentity: true, cascade: true
  });
  await sequelize.queryInterface.bulkDelete('Articles', null, {
    truncate: true, restartIdentity: true, cascade: true
  });
  await sequelize.queryInterface.bulkDelete('Customers', null, {
    truncate: true, restartIdentity: true, cascade: true
  });
  await sequelize.queryInterface.bulkDelete('Bookmarks', null, {
    truncate: true, restartIdentity: true, cascade: true
  });
})

describe('Customer Bookmark Article', () => {
  it('should get list bookmark and return 200', async () => {
    const response = await request(app).get('/api/bookmarks').set('access_token', token)

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Success get data');
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBeGreaterThanOrEqual(0);
  });

  it('should add article to bookmarks and return 201', async () => {
    const response = await request(app).post('/api/bookmarks/1').set('access_token', token)

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Success added article to bookmarks');
    expect(response.body.data).toBeInstanceOf(Object);
  });

  it('should not add article to bookmarks when article id is not in database and return 404', async () => {
    const response = await request(app).post('/api/bookmarks/100').set('access_token', token)

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Data is not found');
  });

  it('should not add article to bookmarks when customer is not login and return 401', async () => {
    const response = await request(app).post('/api/bookmarks/1')

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Unauthenticated');
  });

  it('should not add article to bookmarks when token is not valid and return 401', async () => {
    const response = await request(app).post('/api/bookmarks/1').set('access_token', 'faketoken')

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Unauthenticated');
  });
});