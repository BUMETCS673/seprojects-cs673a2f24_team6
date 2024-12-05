describe('Exercise API Tests', () => {
  let adminToken = '';
  let userToken = '';
  let exerciseId;
  const testUser = {
    name: `test_${Date.now()}`,
    password: 'password',
    email: `test_${Date.now()}@test.com`
  };

  const adminUser = {
    name: 'admin',
    password: 'admin'
  };

  const testExercise = {
    name: 'Test Push-ups',
    description: 'Basic push-up exercise',
    equipment: 'bodyweight',
    type: 'strength',
    url: 'https://example.com/pushup'
  };

  before(() => {
    // Login as admin first
    cy.request({
      method: 'GET',
      url: '/api/account',
      qs: {
        name: adminUser.name,      
        password: adminUser.password
      }
    }).then((adminLoginResponse) => {
      expect(adminLoginResponse.status).to.eq(200);
      adminToken = adminLoginResponse.body.token;
      
      // Create and login regular test user
      return cy.request({
        method: 'POST',
        url: '/api/account',
        body: testUser,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }).then((response) => {
      expect(response.status).to.eq(200);
      
      return cy.request({
        method: 'GET',
        url: '/api/account',
        qs: {
          name: testUser.name,      
          password: testUser.password
        }
      });
    }).then((userLoginResponse) => {
      expect(userLoginResponse.status).to.eq(200);
      userToken = userLoginResponse.body.token;
    });
  });

  describe('Public Exercise Endpoints', () => {
    it('should get list of exercise types', () => {
      cy.request({
        method: 'GET',
        url: '/api/exercise/typelist'
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });

    it('should get list of exercise equipment', () => {
      cy.request({
        method: 'GET',
        url: '/api/exercise/equipmentlist'
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });
  });

  describe('Admin Exercise Operations', () => {
    it('should allow admin to create new exercise', () => {
      cy.request({
        method: 'POST',
        url: '/api/exercise',
        headers: {
          'x-user-id': adminToken,
        },
        body: testExercise
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('massage', 'exercise create successfully');
        
        return cy.request({
          method: 'GET',
          url: '/api/exercise'
        });
      }).then((getResponse) => {
        const exercise = getResponse.body.find(e => 
          e.name === testExercise.name && 
          e.type === testExercise.type
        );
        expect(exercise).to.exist;
        exerciseId = exercise.exercise_id;
      });
    });

    it('should allow admin to delete exercise', () => {
      cy.request({
        method: 'DELETE',
        url: '/api/exercise',
        headers: {
          'x-user-id': adminToken
        },
        body: {
          exercise_id: exerciseId
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('massage', 'exercise delete successfully');
      });
    });
  });

  describe('Public Exercise Queries', () => {
    before(() => {
      // Create a test exercise as admin for querying
      cy.request({
        method: 'POST',
        url: '/api/exercise',
        headers: {
          'x-user-id': adminToken
        },
        body: testExercise
      }).then((response) => {
        expect(response.status).to.eq(200);
        return cy.request({
          method: 'GET',
          url: '/api/exercise'
        });
      }).then((getResponse) => {
        const exercise = getResponse.body.find(e => 
          e.name === testExercise.name
        );
        exerciseId = exercise.exercise_id;
      });
    });

    it('should get all exercises', () => {
      cy.request({
        method: 'GET',
        url: '/api/exercise'
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        const exercise = response.body.find(e => e.exercise_id === exerciseId);
        expect(exercise).to.deep.include(testExercise);
      });
    });

    it('should get exercises by type', () => {
      cy.request({
        method: 'GET',
        url: '/api/exercise/type',
        qs: {
          type: testExercise.type
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        const exercise = response.body.find(e => e.exercise_id === exerciseId);
        expect(exercise).to.exist;
      });
    });

    it('should get exercises by equipment', () => {
      cy.request({
        method: 'GET',
        url: '/api/exercise/equipment',
        qs: {
          equipment: testExercise.equipment
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        const exercise = response.body.find(e => e.exercise_id === exerciseId);
        expect(exercise).to.exist;
      });
    });

    it('should get exercise by id', () => {
      cy.request({
        method: 'GET',
        url: '/api/exercise/id',
        qs: {
          exercise_id: exerciseId
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body[0]).to.deep.include(testExercise);
      });
    });
  });
});