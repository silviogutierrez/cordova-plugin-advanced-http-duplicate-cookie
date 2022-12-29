Clone the repository.

# Capacitor

Run `npm install` and `npx cap sync` to get both platforms working.

Run `npm run build && node server.js` to start the local server.

Run `npx cap open android` and run the emulator, observe failing test and duplicate header count. Look at the output of the server as well with the duplicate headers.

# Cordova
Do all the above, and have the server running!

cd into myApp and run `npx cordova prepare` then `npx cordova build android`

Now run the project however you usually do it, maybe with Android Studio.

Verify the test is passing here.

Note: this uses plaintext on Android so HTTPS / certs are not tested.
