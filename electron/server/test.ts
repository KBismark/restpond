import { MatchRouter } from "./router-claude-optimize";

const router = new MatchRouter();

router.registerRoute('/api', () => {
  console.log('Hello Api');
});

router.registerRoute('/api/:id', ({ id }) => {
  console.log('Hello Api', id);
});

router.registerRoute('/api/:id/:name', ({ id, name }) => {
  console.log('Hello Api', id, name);
});

router.registerRoute('/api/:id/:name/country/:id', ({ id, name }) => {
  console.log('Hello Api', id, name);
});

router.activateRoute('/api', (err) => {
  console.log(`Route: /api - ${err.message}`);
});

router.activateRoute('/api/1', (err) => {
  console.log(`Route: /api/:id - ${err.message}`);
});

router.activateRoute('/api/1/John', (err) => {
  console.log(`Route: /api/:id/:name - ${err.message}`);
});

router.activateRoute('/api/1/John/country/567', (err) => {
  console.log(`Route: /api/:id/:name/country/:id - ${err.message}`);
});

console.log('Deactivating /api/1/John/country/567');

router.deactivateRoute('/api/1/John/country/567');

router.activateRoute('/api/1/John/country/567', (err) => {
  console.log(`Route: /api/:id/:name/country/:id - ${err.message}`);
});
