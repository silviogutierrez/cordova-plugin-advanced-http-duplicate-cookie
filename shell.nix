let requirements = import ./requirements.nix;

in with requirements.pkgs;

mkShell {
  buildInputs = requirements.production_dependencies
    ++ requirements.development_dependencies
    ++ requirements.contributing_dependencies ++ [
      gradle
      cocoapods
      darwin.apple_sdk.frameworks.CoreServices
    ];
  shellHook = ''
    export JAVA_HOME="/Applications/Android Studio.app/Contents/jre/Contents/Home"
    export ANDROID_HOME=~/Library/Android/sdk;
    export PATH=$PATH:$ANDROID_HOME/tools;
    export PATH=$PATH:$ANDROID_HOME/platform-tools;
    export ANDROID_SDK_ROOT=~/Library/Android/sdk
  '';
}
