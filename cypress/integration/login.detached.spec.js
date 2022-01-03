/// <reference types="cypress" />
import { response, error } from '../../fixtures/login.json';

context('Login', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('login with incorrect username', () => {
        cy.get('[data-cy=username]').find('input').type('marek-the-best')

        cy.get('[data-cy=password]').find('input').type('my-super-secret-correct-password')

        cy.intercept('POST', 'http://localhost:5000/authentication', { ...error })

        cy.get('[data-cy=login]').click().url().should('not.contain', 'locations')
    })

    it('login with incorrect password', () => {
        cy.get('[data-cy=username]').find('input').type('marek')

        cy.get('[data-cy=password]').find('input').type('my-super-secret-password')
        
        cy.intercept('POST', 'http://localhost:5000/authentication', { ...error })

        cy.get('[data-cy=login]').click().url().should('not.contain', 'locations')
    })

    it('login with correct credentials', () => {
        Cypress.Commands.add('login', (username, password) => {
            cy.get('[data-cy=username]').find('input').type(username)

            cy.get('[data-cy=password]').find('input').type(password)

            cy.get('[data-cy=login]').click()
        })

        cy.intercept('POST', 'http://localhost:5000/authentication', { body: { ...response }, statusCode: 200 })
          .as('login')

        cy.login('marek-the-best', 'your-super-secret-password-love-you-marek')

        cy.wait('@login')

        cy.url().should('contain', 'locations')
    })
})