/// <reference types="cypress" />

context('Login', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('login with incorrect username', () => {
        cy.get('[data-cy=username]')
          .find('input')
          .type('marek-the-best')
          .should('eq', 'marek-the-best')

        cy.get('[data-cy=password]')
          .find('input')
          .type('my-super-secret-correct-password')
          .should('eq', 'my-super-secret-correct-password')

        cy.get('[data-cy=login]').click().url().should('not.contain', 'locations')
    })

    it('login with incorrect password', () => {
        cy.get('[data-cy=username]').find('input').type('marek').should('eq', 'marek')

        cy.get('[data-cy=password]').find('input').type('my-super-secret-password').should('eq', 'my-super-secret-password')

        cy.contains('Login').click().url().should('not.contain', 'locations')
    })

    it('login with correct credentials', () => {
        Cypress.Commands.add('login', (username, password) => {
            cy.get('[data-cy=username]').find('input').type(username)

            cy.get('[data-cy=password]').find('input').type(password)

            cy.get('[data-cy=login]').click()
        })

        cy.login('marek', 'my-super-secret-correct-password')

        cy.wait(2000)

        cy.url().should('contain', 'locations')
    })
})