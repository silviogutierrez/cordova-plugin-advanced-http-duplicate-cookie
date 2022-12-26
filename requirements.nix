let
  pkgs = import
    (fetchTarball "https://github.com/NixOS/nixpkgs/archive/65fae659e31.tar.gz")
    { };
  unstable = import
    (fetchTarball "https://github.com/NixOS/nixpkgs/archive/65fae659e31.tar.gz")
    { };

in with pkgs; {
  inherit pkgs;
  inherit unstable;

  production_dependencies = [
    pkgs.nodejs-16_x
  ];
  development_dependencies = [
  ];
  contributing_dependencies =
    [ pkgs.gitAndTools.gh pkgs.ripgrep pkgs.cacert pkgs.bash ];

}
