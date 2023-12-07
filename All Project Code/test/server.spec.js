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
  // it('Returns the default welcome message', done => {
  //   chai
  //     .request(server)
  //     .get('/welcome')
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.status).to.equals('success');
  //       assert.strictEqual(res.body.message, 'Welcome!');
  //       done();
  //     });
  //  });

  // ===========================================================================
  // TO-DO: Part A Login unit test case
  //We are checking POST /add_user API by passing the user info in the correct order. This test case should pass and return a status 200 along with a "Success" message.
  
  //Positive case Login
  it('Positive : /login', done => {
    chai
      .request(server)
      .post('/login')
      .send({username: 'JDoe', email:"JohnDoe@gmail.com", password: 'qwerty'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        //assert.strictEqual(res.body.message, 'Successfully Logged In');
        // expect(res.body.message).to.equals('Success');
        done();
      });
      //done();
  });
  
  //Negative Case Login
  //We are checking POST /add_user API by passing the user info in in incorrect manner (name cannot be an integer). This test case should pass and return a status 200 along with a "Invalid input" message.
  //  it('Negative: /login. Checking invalid name', (done) => {
  //    chai
  //      .request(server)
  //      .post('/login')
  //      .send({ username: '10', password: '54321' })
  //      .end((err, res) => {
  //        expect(res).to.have.status(401);
  //        // expect(res.body.message).to.equals('Invalid Username');
  //        // expect(res).to.redirect; // Update this assertion to check for a redirect
  //        // expect(res).to.redirectTo('/register'); // Check for the redirect to the registration page
  //        //done();
  //      });
  //      done();
  //    }); 

     it('Positive: /register', (done) => {
       chai
         .request(server)
         .post('/register')
         .send({ username: 'TestUser', email: 'test@outlook.com', password: 'testpassword' })
         .end((err, res) => {
           expect(res).to.have.status(200);
           //expect(res.body.status).to.equal('success');
           //expect(res.body.message).to.equal('Registration successful'); // Update this based on your response
           done();
         });
         //done();
     });
  
  
//      it('Negative: /register - Invalid input', (done) => {
//        chai
//          .request(server)
//          .post('/register')
//          .send({ username: 'JDoe', password: 'weak' }) // Invalid input, missing required field email
//          .end((err, res) => {
//            expect(res).to.have.status(500); // Assuming a server error status for invalid input
//            //expect(res.body.status).to.equal('error');
//            //expect(res.body.message).to.include('Registration failed'); // Check for a general failure message
//            done();
//          });
//          //done();
//      });
});

