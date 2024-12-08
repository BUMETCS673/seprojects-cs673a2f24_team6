describe('SQL Injection Protection Tests', () => {
    let token = '';
    let adminToken = '';
    let exerciseId;
  
    const testUser = {
      name: `test_${Date.now()}`,
      password: 'password',
      email: `test_${Date.now()}@test.com`
    };
  
    const sqlInjectionStrings = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM user_account; --",
      "' OR 'x'='x",
      "admin'--",
      "1; DELETE FROM user_account WHERE user_id = 1",
      `" OR ""="`,
      `' OR ''='`,
      "1' OR '1' = '1",
      "1 OR 1=1",
      "1' OR '1'='1'--",
      "' OR user_id IS NOT NULL OR user_id = '",
      "1'; TRUNCATE TABLE user_account; --"
    ];
  
    before(() => {
      // Setup: Create admin token and test user token
      cy.request({
        method: 'GET',
        url: '/api/account',
        qs: {
          name: 'admin',
          password: 'admin'
        }
      }).then((adminLoginResponse) => {
        adminToken = adminLoginResponse.body.token;
        
        return cy.request({
          method: 'POST',
          url: '/api/account',
          body: testUser
        });
      }).then(() => {
        return cy.request({
          method: 'GET',
          url: '/api/account',
          qs: {
            name: testUser.name,
            password: testUser.password
          }
        });
      }).then((loginResponse) => {
        token = loginResponse.body.token;
      });
    });
  
    describe('Account Endpoints Protection', () => {
      sqlInjectionStrings.forEach((injectionString) => {
        it(`should protect login against injection: ${injectionString.slice(0, 20)}...`, () => {
          cy.request({
            method: 'GET',
            url: '/api/account',
            qs: {
              name: injectionString,
              password: injectionString
            },
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body).to.have.property('err', 'no such user');
          });
        });
      });
    });
  
    describe('Exercise Endpoints Protection', () => {
      sqlInjectionStrings.forEach((injectionString) => {
        it(`should protect exercise type query against injection: ${injectionString.slice(0, 20)}...`, () => {
          cy.request({
            method: 'GET',
            url: '/api/exercise/type',
            qs: {
              type: injectionString
            },
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.eq(0);
          });
        });
  
        it(`should protect exercise equipment query against injection: ${injectionString.slice(0, 20)}...`, () => {
          cy.request({
            method: 'GET',
            url: '/api/exercise/equipment',
            qs: {
              equipment: injectionString
            },
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.eq(0);
          });
        });
  
        it(`should protect exercise creation against injection: ${injectionString.slice(0, 20)}...`, () => {
          cy.request({
            method: 'POST',
            url: '/api/exercise',
            headers: {
              'Authorization': `Bearer ${adminToken}`,
            },
            body: {
              name: injectionString,
              type: injectionString,
              description: injectionString,
              equipment: injectionString,
              url: injectionString
            },
            failOnStatusCode: false
          }).then((response) => {
            expect([200, 400]).to.include(response.status);
            if (response.status === 200) {
              expect(response.body).to.have.property('massage', 'exercise create successfully');
            }
          });
        });
      });
    });
  
    describe('Workout Plan Endpoints Protection', () => {
      sqlInjectionStrings.forEach((injectionString) => {
        it(`should protect plan creation against injection: ${injectionString.slice(0, 20)}...`, () => {
          cy.request({
            method: 'POST',
            url: '/api/plan',
            headers: {
              'x-user-id': token,
            },
            body: {
              title: injectionString,
              description: injectionString,
              frequency_type: 'daily', // Must be valid ENUM
              status: true, // Required boolean
              days_of_week: injectionString
            },
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.eq(400);
          });
        });
  
        it(`should protect plan update against injection: ${injectionString.slice(0, 20)}...`, () => {
          cy.request({
            method: 'PUT',
            url: '/api/plan',
            headers: {
              'x-user-id': token,
            },
            body: {
              plan_id: injectionString,
              title: injectionString,
              status: true
            },
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.eq(400);
          });
        });
      });
    });
  
    describe('Workout Record Endpoints Protection', () => {
      sqlInjectionStrings.forEach((injectionString) => {
        it(`should protect record creation against injection: ${injectionString.slice(0, 20)}...`, () => {
          cy.request({
            method: 'POST',
            url: '/api/record',
            headers: {
              'x-user-id': token,
            },
            body: {
              exercise_id: injectionString,
              description: injectionString,
              number_of_set: injectionString,
              status: injectionString,
              priority: injectionString,
              start_time: injectionString,
              end_time: injectionString,
              total_time: injectionString
            },
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.eq(400);
          });
        });
  
        it(`should protect record update against injection: ${injectionString.slice(0, 20)}...`, () => {
          cy.request({
            method: 'PUT',
            url: '/api/record',
            headers: {
              'x-user-id': token,
            },
            body: {
              record_id: injectionString,
              description: injectionString,
              status: injectionString
            },
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.eq(400);
          });
        });
  
        it(`should protect record deletion against injection: ${injectionString.slice(0, 20)}...`, () => {
          cy.request({
            method: 'DELETE',
            url: '/api/record',
            headers: {
              'x-user-id': token,
            },
            qs: {
              record_id: injectionString
            },
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.eq(400);
          });
        });
      });
    });
  
    after(() => {
      // Cleanup test user
      if (token) {
        cy.request({
          method: 'DELETE',
          url: '/api/account',
          headers: {
            'x-user-id': token,
          },
          body: {
            password: testUser.password
          },
          failOnStatusCode: false
        });
      }
    });
  });