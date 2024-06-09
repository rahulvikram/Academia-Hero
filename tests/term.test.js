const getEnrollmentTerm = require('./term'); // importing function from file

describe('getEnrollmentTerm', () => {
  // TEST CASE: Valid term (spring 2024)
  test('Returns valid term ID based on json object for valid datestrings', () => {
    const today = "5/4/2024"; // manually define value for this test case
    const expectedTerm = 7031; // we expect this ID to be returned
    const term = getEnrollmentTerm(today); // pass value into function

    expect(term).toBe(expectedTerm); // testing implementation  
    });

  // TEST CASE: Invalid term (summer 2026)
  test('Returns 0 because summer term is not included.', () => {
    const today = "7/4/2026"; // manually define value for this test case
    const expectedTerm = 0; // we expect this ID to be returned
    const term = getEnrollmentTerm(today); // pass value into function

    expect(term).toBe(expectedTerm); // testing implementation  
    });
});