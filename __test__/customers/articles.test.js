const app = require('../../app')
const request = require('supertest');
const { sequelize } = require("../../models");

beforeAll(async () => {
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
  data.map(e => data.push(e))
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
})

describe('Customer Articles', () => {
  it('should read all data and return 200', async () => {
    const response = await request(app).get('/api/articles')

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Success get data');
    expect(response.body).toHaveProperty('totalItems', expect.any(Number));
    expect(response.body).toHaveProperty('totalPages', expect.any(Number));
    expect(response.body).toHaveProperty('currentPage', expect.any(Number));
    expect(response.body.data).toBeInstanceOf(Object);
    expect(response.body.data.rows).toBeInstanceOf(Array);
    expect(response.body.data.rows.length).toBeGreaterThanOrEqual(0);
    expect(response.body.data.rows[0]).toHaveProperty('id', expect.any(Number));
    expect(response.body.data.rows[0]).toHaveProperty('title', expect.any(String));
    expect(response.body.data.rows[0]).toHaveProperty('content', expect.any(String));
    expect(response.body.data.rows[0]).toHaveProperty('imgUrl', expect.any(String));
    expect(response.body.data.rows[0]).toHaveProperty('authorId', expect.any(Number));
    expect(response.body.data.rows[0]).toHaveProperty('categoryId', expect.any(Number));
    expect(response.body.data.rows[0]).toHaveProperty('status', expect.any(String));
  });

  it('should read data with one query filter and return 200', async () => {
    const response = await request(app).get('/api/articles?filter[category]=10')

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Success get data');
    expect(response.body).toHaveProperty('totalItems', expect.any(Number));
    expect(response.body).toHaveProperty('totalPages', expect.any(Number));
    expect(response.body).toHaveProperty('currentPage', expect.any(Number));
    expect(response.body.data).toBeInstanceOf(Object);
    expect(response.body.data.rows).toBeInstanceOf(Array);
    expect(response.body.data.rows.length).toBeGreaterThanOrEqual(0);
    expect(response.body.data.rows[0]).toHaveProperty('id', expect.any(Number));
    expect(response.body.data.rows[0]).toHaveProperty('title', expect.any(String));
    expect(response.body.data.rows[0]).toHaveProperty('content', expect.any(String));
    expect(response.body.data.rows[0]).toHaveProperty('imgUrl', expect.any(String));
    expect(response.body.data.rows[0]).toHaveProperty('authorId', expect.any(Number));
    expect(response.body.data.rows[0]).toHaveProperty('categoryId', expect.any(Number));
    expect(response.body.data.rows[0]).toHaveProperty('status', expect.any(String));
  });

  it('should read data with pagination and return 200', async () => {
    const response = await request(app).get('/api/articles?page[size]=8&page[number]=1')

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Success get data');
    expect(response.body).toHaveProperty('totalItems', expect.any(Number));
    expect(response.body).toHaveProperty('totalPages', expect.any(Number));
    expect(response.body).toHaveProperty('currentPage', expect.any(Number));
    expect(response.body.data).toBeInstanceOf(Object);
    expect(response.body.data.rows).toBeInstanceOf(Array);
    expect(response.body.data.rows.length).toBeGreaterThanOrEqual(0);
    expect(response.body.data.rows[0]).toHaveProperty('id', expect.any(Number));
    expect(response.body.data.rows[0]).toHaveProperty('title', expect.any(String));
    expect(response.body.data.rows[0]).toHaveProperty('content', expect.any(String));
    expect(response.body.data.rows[0]).toHaveProperty('imgUrl', expect.any(String));
    expect(response.body.data.rows[0]).toHaveProperty('authorId', expect.any(Number));
    expect(response.body.data.rows[0]).toHaveProperty('categoryId', expect.any(Number));
    expect(response.body.data.rows[0]).toHaveProperty('status', expect.any(String));
  });

  it('should read one data with params id and return 200', async () => {
    const response = await request(app).get('/api/articles/1')

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Success get data');
    expect(response.body.data).toBeInstanceOf(Object);
    expect(response.body.data).toHaveProperty('id', expect.any(Number));
    expect(response.body.data).toHaveProperty('title', expect.any(String));
    expect(response.body.data).toHaveProperty('content', expect.any(String));
    expect(response.body.data).toHaveProperty('imgUrl', expect.any(String));
    expect(response.body.data).toHaveProperty('authorId', expect.any(Number));
    expect(response.body.data).toHaveProperty('categoryId', expect.any(Number));
    expect(response.body.data).toHaveProperty('status', expect.any(String));
  });

  it('should failed to read data with false params id and return 200', async () => {
    const response = await request(app).get('/api/articles/100')

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('message', 'Data is not found');
  });
});
