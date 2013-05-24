$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "modeljs/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "modeljs"
  s.version     = Modeljs::VERSION
  s.authors     = ["William Barry"]
  s.email       = ["william@nine.is"]
  s.homepage    = "http://github.com/williambarry007/modeljs"
  s.summary     = "A javascript model framework."
  s.description = "A javascript model framework."

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.md"]
  #s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 3.2.13"
  s.add_dependency "jquery-rails"
  s.add_dependency "activesupport"
    
  #s.add_development_dependency "mysql2"
end
