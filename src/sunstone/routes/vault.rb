
require 'HypercxVault'

$vault = HypercxVault.new

get '/hypercx' do
    [200, $vault.getAllApps.to_json]
end