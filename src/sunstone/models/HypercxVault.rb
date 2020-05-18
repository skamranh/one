LOG_FILE_PATH = "/var/log/one/hypercx-vault.log"
CONFIG_FILE_PATH = "/etc/hypercx-vault/vault.conf.yaml"

include OpenNebula

class HypercxVault
    def initialize
        @client = Client.new
        @read_lines = 0
        @apps = Array.new
    end

    def getAllInfo
        return Array.new unless File.exist?(CONFIG_FILE_PATH)
        conf = YAML::load_file(CONFIG_FILE_PATH)
        return Array[
                        Hash[
                            "NAME" => "Service running?" , 
                            "DESC" => "RUNNING"
                        ], 
                        Hash[
                            "NAME" => "Backup TAG Name" , 
                            "DESC" => conf["backups_tag_name"]
                        ], 
                        Hash[
                            "NAME" => "Notify Zabbix Server" ,
                            "DESC" => conf["notify_zabbix_server"]
                        ], 
                        Hash[
                            "NAME" => "Notify Zabbix Proxy" , 
                            "DESC" => conf["notify_zabbix_proxy"]
                        ], 
                        Hash[
                            "NAME" => "Backup Limit(Count)" , 
                            "DESC" => conf["backup_count_limit"]
                        ], 
                        Hash[
                            "NAME" => "Backup Rotation Period(Days)" , 
                            "DESC" => conf["rotation_period"]
                            ]
                    ]
    end

    def getAllApps
        self.refresh
        self.backups_sort
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
                            @apps.push(Hash["NAME" => self.get_vm_name(val.split("!")[2].split(" ")[1].split("_")[0]) , 'STATUS' => 'FAILED', 'DISK' => val.split("!")[2].split(" ")[1].split("_")[1], 'MPID'=>  "-",'DATE' => val.split("!")[2].split(" ")[1].split("_").last, "VMID" => val.split("!")[2].split(" ")[1].split("_")[0]])
                        end
                    end
                end
                @read_lines = current_read unless current_read == 0
            rescue Exception => e

            end
        end
        @apps.delete_if{|x| x["STATUS"] == "SUCCESS"}
        
        @client = Client.new
        mpapppool = MarketPlaceAppPool.new(@client, -1)
        rc = mpapppool.info
        if !(OpenNebula.is_error?(rc)) && File.exist?(CONFIG_FILE_PATH)
            mp_id = YAML::load_file(CONFIG_FILE_PATH)['marketplace']['id']
            mpapppool.each do |mpapp|
                if mpapp.to_hash && mpapp.to_hash['MARKETPLACEAPP']['MARKETPLACE_ID'].to_i == mp_id
                    @apps.push(Hash["NAME" => self.get_vm_name(mpapp.to_hash['MARKETPLACEAPP']["TEMPLATE"]['IMPORT_ID']) , 'STATUS' => 'SUCCESS', 'DISK' => mpapp.to_hash['MARKETPLACEAPP']["TEMPLATE"]['IMPORT_ID'].split("_")[1], 'MPID'=>  mpapp.to_hash['MARKETPLACEAPP']["ID"],'DATE' => mpapp.to_hash['MARKETPLACEAPP']["REGTIME"],"VMID" => mpapp.to_hash['MARKETPLACEAPP']["TEMPLATE"]['IMPORT_ID'].split("_")[0]])            
                end
            end
        end
    end

    def backups_sort()
        return @apps if @apps.size <= 1
        swap = true
          while swap
            swap = false
            (@apps.length - 1).times do |x|
              if @apps[x]['DATE'].to_i < @apps[x+1]['DATE'].to_i
                @apps[x], @apps[x+1] = @apps[x+1], @apps[x]
                swap = true
              end
            end
          end
        @apps
      end
end
