
require 'HypercxVault'

$vault = HypercxVault.new

get '/hypercx/vault' do
    [200, $vault.getAllApps.to_json]
end
