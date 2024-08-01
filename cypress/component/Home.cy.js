import React from "react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/contexts/AuthContext";
import Home from "../../src/pages/home";

describe("Testing the Weather Application", () => {
  beforeEach(() => {
    cy.mount(
      <AuthProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthProvider>
    );
  });

  it("Should display the Home page", () => {
    cy.get('[data-cy="main-div"]').should("exist");
  });

  
});
