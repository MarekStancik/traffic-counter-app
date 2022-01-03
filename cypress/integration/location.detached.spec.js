/// <reference types="cypress" />
import { request, response } from '../../fixtures/login.json';

describe('Locations', () => {
    before(() => {
        cy.visit('/')

        cy.intercept('POST', 'http://localhost:5000/authentication', { body: { ...response }, statusCode: 200 })

        cy.get('[data-cy=username]').find('input').type(request.username)

        cy.get('[data-cy=password]').find('input').type(request.password)

        cy.get('[data-cy=login]').click().wait(3000)
    })

    it('change theme should change background color from black to white', () => {
        cy.get('body').should('have.css', 'background-color').and('equal', 'rgb(18, 18, 18)')

        cy.get('[data-cy=theme]').click()

        cy.get('body').should('have.css', 'background-color').and('equal', 'rgb(255, 255, 255)')
    })

    it('click on a location should load a location detail page', () => {
        cy.get('div a').contains('Esbjerg').click().then(() => {
            cy.url().should('match', /locations\/[0-9]/)
        })
    })

    it('logout return to login page', () => {
        cy.intercept('DELETE', 'http://localhost:5000/authentication', { body: null })

        cy.get('[data-cy=logout]').click()
        
        cy.wait(3000).then(() => {
            cy.get('[data-cy=login]').should('exist')
        })
    })
})