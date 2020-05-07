LOG_FILE_PATH = "/var/log/one/hypercx-vault.log"
CONFIG_FILE_PATH = "/etc/hypercx-vault/vault.conf.yaml"

include OpenNebula

class HypercxVault
    def initialize
        @client = Client.new
        @read_lines = 0
        @apps = Array.new
    end

    def getAllApps
        self.refresh
        return @apps
    end

    def get_vm_name(import_id)
        vm = VirtualMachine.new_with_id(import_id.split("_")[0].to_i,@client)
        rc = vm.info
        if OpenNebula.is_error?(rc) 
            return import_id.split("_")[2]
        else
            return vm.to_hash["VM"]["NAME"]
        end

    end
    def refresh
        if File.exist?(LOG_FILE_PATH)
            begin
                file = File.open(LOG_FILE_PATH)
                current_read = 0
                while(val= file.gets)
                    if(++current_read >= @read_lines)
                        current_read += 1
                        if val.split("!")[2].kind_of?(String) && val.split("!")[2].split(" ")[0] == 'IOEOB'
                            @apps[val.split("!")[2].split(" ")[1].split("_").last] = val.split("!")[2].split(" ")[1].split("_")[-2]  
                        end
                    end
                end
                @read_lines = current_read unless current_read == 0
            rescue Exception => e

            end
        end
        @apps.each do |x, app|
            if app["STATUS"] == "SUCCESS"
                @app.pop(x)
            end
        end
        @client = Client.new
        mpapppool = MarketPlaceAppPool.new(@client, -1)
        rc = mpapppool.info
        unless OpenNebula.is_error?(rc) && File.exist?(CONFIG_FILE_PATH)
            mp_id = YAML::load_file(CONFIG_FILE_PATH)['marketplace']['id']
            mpapppool.each do |mpapp|
                if mpapp.to_hash && mpapp.to_hash['MARKETPLACEAPP']['MARKETPLACE_ID'].to_i == mp_id
                    @apps.push(Hash["NAME" => self.get_vm_name(mpapp.to_hash['MARKETPLACEAPP']["TEMPLATE"]['IMPORT_ID']) , 'STATUS' => 'SUCCESS', 'DISK' => mpapp.to_hash['MARKETPLACEAPP']["TEMPLATE"]['IMPORT_ID'].split("_")[1], 'MPID'=>  mpapp.to_hash['MARKETPLACEAPP']["ID"],'DATE' => DateTime.strptime(mpapp.to_hash['MARKETPLACEAPP']["REGTIME"], "%s").strftime("%e/%_m/%Y %H:%M:%S"),"VMID" => mpapp.to_hash['MARKETPLACEAPP']["TEMPLATE"]['IMPORT_ID'].split("_")[0]])            
                end
            end
        end
    end
end