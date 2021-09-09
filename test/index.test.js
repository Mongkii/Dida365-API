const Dida365API = require('../dist/index').default;

const username = '';
const password = '';

test('able to get tasks', async () => {
  const api = await Dida365API.init(username, password);
  expect(api.getAllTasks().length).toBeGreaterThan(0);
});
