# AnyCast

## Description
AnyCast is a new and exciting way to explore the weather brought to you by the members of group 08 in recitation 12. Many preexisting weather apps allow the user to check the weather either at their current location or by searching for a town or locality near them. AnyCast boldly breaks from this tradition by limiting user input and reducing decision anxiety. The two novel ways of interacting with AnyCast are either a randomizer button that transports the user to some spot on the Earth’s surface or by entering the latitude and longitude of their desired location. This allows the user to interact with and get a taste of weather all around the globe in places they would not necessarily think or be able to visit. To keep the user comfortable in their weather exploration, we have also implemented a selection of 5 hand crafted avatars (buffalo, iguana, macaw, ferret, and koala) that any user with an account can choose from.

## Contributors
  - Walker Narog (wjnarog)
  - Colin Carlson (ralsh182)
  - Layne Hunt (laynehunt)
  - Calvin Kim (caki9282)
  - Regan Wilson (rewi5739)

## Technology Stack
  - Vscode (IDE)
  - Github (VCS and Project Tracker)
  - PostgreSQL (Database)
  - Azure (Deployment Environment)
  - Geoapify (External API)
  - Weather api (External API)
  - Docker (Local Container)
  - NodeJS (Application Server)
  - Mocha (Endpoint testing)
  - Chai (Endpoint testing)
  - HTML, CSS, JS (UI Tools)

## Prerequisites to run the application
 - Docker containers need to be running before the application
 - Browser to access the internet

## Instructions on how to run the application locally
1. Navigate to the 'All Project Code' folder:
``` sh
cd /.../AnyCast/All\ Project\ Code
```
2. Start the Docker container:
``` sh
docker compose up
```
3. Wait until the terminal says 'Database connection successful'

4. Open your preferred web browser, and p+aste the following into your search bar:
``` sh
http://localhost:3000/
```

## How to run the tests
1. Navigate to the 'All Project Code' file

2. Then on the 'docker-compose.yaml' file, change line 24 from:
``` sh
command: 'npm run start'
```
to:
``` sh
command: 'npm run testandrun'
```

3. Then, you navigate to the terminal and run:
``` sh
docker compose up
```
4. Lastly you wait until the test cases have finished running.

## Link to the deployed application

http://recitation-12-team-08.eastus.cloudapp.azure.com:3000/
