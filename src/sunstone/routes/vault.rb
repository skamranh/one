
require 'HypercxVault'

$vault = HypercxVault.new

get '/hypercx/vault-info' do
    [200, $vault.getAllInfo.to_json]
end

get '/hypercx/vault-backup' do
    [200, $vault.getAllApps.to_json]
end
