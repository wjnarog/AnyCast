// Imports the index.js file to be tested.
const server = require('../index'); 
//TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });

  // ===========================================================================
  // TO-DO: Part A Login unit test case
  //We are checking POST /add_user API by passing the user info in the correct order. This test case should pass and return a status 200 along with a "Success" message.

  //Positive case Login
  // it('positive : /add_user', done => {
  //   chai
  //     .request(server)
  //     .post('/add_user')
  //     .send({username: 'JDoe', email: 'JohnDoe@gmail.com', password: 'qwerty'})
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.message).to.equals('Success');
  //       done();
  //     });
  // });

  // //Negative Case Login
  // //We are checking POST /add_user API by passing the user info in in incorrect manner (name cannot be an integer). This test case should pass and return a status 200 along with a "Invalid input" message.
  // it('Negative : /add_user. Checking invalid name', done => {
  //   chai
  //     .request(server)
  //     .post('/add_user')
  //     .send({id: '5', name: 10, dob: '2020-02-20'})
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.message).to.equals('Invalid input');
  //       done();
  //     });
  // });

  // Negative test case Register:
  // We are testing that the POST /register API endpoint fails to insert invalid information, in this case all feilds are null.
  it('negative: /register - Missing required fields', (done) => {
    chai
      .request(server)
      .post('/register')
      .send({}) // Missing required fields, should fail registration
      .end((err, res) => {
        expect(res).to.have.status(500); // Expect a 500 status code for missing required fields
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.include('Registration failed'); 
        done();
      });
  });

});

