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
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data[0]).toHaveProperty('id', expect.any(Number));
    expect(response.body.data[0]).toHaveProperty('title', expect.any(String));
    expect(response.body.data[0]).toHaveProperty('content', expect.any(String));
    expect(response.body.data[0]).toHaveProperty('imgUrl', expect.any(String));
    expect(response.body.data[0]).toHaveProperty('authorId', expect.any(Number));
    expect(response.body.data[0]).toHaveProperty('categoryId', expect.any(Number));
    expect(response.body.data[0]).toHaveProperty('status', expect.any(String));
  });
});
