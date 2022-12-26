let requirements = import ./requirements.nix;

in with requirements.pkgs;

mkShell {
  buildInputs = requirements.production_dependencies
    ++ requirements.development_dependencies
    ++ requirements.contributing_dependencies ++ [
      cocoapods
      darwin.apple_sdk.frameworks.CoreServices
    ];
}
