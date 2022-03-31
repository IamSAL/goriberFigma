// @ts-nocheck
/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

describe("User login form", () => {
  it("Should take user to dashboard", () => {
    cy.visit("http://localhost:3002/login");

    cy.get('input[name="email"]').type("sksalmanmiah@gmail.com");
    cy.get('input[name="password"]').type("12345678");
    cy.intercept("GET", "*/user/accounts*").as("login");
    cy.get(".btnStyle.login.me-2").click();

    cy.wait("@login");

    // The new page should contain an h1 with "About page"
    cy.get("div.user_info > h5").contains("Sk Salman");
  });
});
