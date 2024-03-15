/// <reference types="cypress" />
// ***********************************************
// This example commands.tsx shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
// @ts-nocheck
import { faker } from "@faker-js/faker";

Cypress.Commands.add("isNotInViewport", element => {
    cy.get(element).then($el => {
        const bottom = Cypress.$(cy.state("window")).height();
        const rect = $el[0].getBoundingClientRect();

        expect(rect.top).to.be.greaterThan(bottom);
        expect(rect.bottom).to.be.greaterThan(bottom);
        expect(rect.top).to.be.greaterThan(bottom);
        expect(rect.bottom).to.be.greaterThan(bottom);
    });
});

Cypress.Commands.add("isInViewport", element => {
    cy.get(element).then($el => {
        const bottom = Cypress.$(cy.state("window")).height();
        const rect = $el[0].getBoundingClientRect();

        expect(rect.top).not.to.be.greaterThan(bottom);
        expect(rect.bottom).not.to.be.greaterThan(bottom);
        expect(rect.top).not.to.be.greaterThan(bottom);
        expect(rect.bottom).not.to.be.greaterThan(bottom);
    });
});

Cypress.Commands.add("checkAlignment", (target, vertical, width, num1, height, num2) => {
    let rect = target.getBoundingClientRect();
    let centerX = Math.round(rect.x + rect.width / 2);
    expect(centerX).to.equal(Math.round(window.innerWidth / 2));
    if (vertical) {
        const centerY = Math.round(target.offsetTop + rect.height / 2);
        expect(centerY).to.closeTo(Math.round(window.innerHeight / 2), 2);
    }
    if (width && num1) {
        expect(rect.width).to.equal(num1);
    }
    if (height && num2) {
        expect(rect.height).to.equal(num2);
    }
});

/**
 * random props 생성
 */
Cypress.Commands.add("makeProps", () => {
    return {
        title: faker.datatype.string(10),
        name: faker.datatype.string(10),
        placeholder: faker.datatype.string(10),
        helperText: faker.lorem.lines(1),
        autoFocus: true,
    };
});

/**
 * 기본 props 테스트
 */
Cypress.Commands.add("checkProps", (target, type, name, placeholder, required) => {
    cy.get(target).then($el => {
        if (placeholder) {
            expect($el[0].placeholder).to.equal(placeholder);
        }
        if (name) {
            expect($el[0].id).to.equal(`${type}-${name}`);
        }
        if (!required || required) {
            expect($el[0].required).to.equal(required);
        }
    });
});

/**
 * 랜덤 데이터, 랜덤 디폴트 데이터 생성
 */
Cypress.Commands.add("makeRandomOption", count => {
    const dataLength = faker.datatype.number({ min: 2, max: 9 });
    let randomClick = [];
    const testData = new Map();
    let data;
    let testDataArray = [];
    for (let i = 0; i < dataLength; i += 1) {
        data = faker.name.jobType();
        if (testData.has(data)) {
            i -= 1;
            continue;
        }
        testData.set(data, data);
        testDataArray.push(data);
        randomClick.push(i);
    }
    const randomClickIndex = faker.helpers.arrayElements(randomClick, count);
    const randomArray = faker.helpers.arrayElements(testDataArray, count);
    return { testData, randomArray, testDataArray, randomClickIndex };
});
