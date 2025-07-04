// jest.setup.ts
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
});
