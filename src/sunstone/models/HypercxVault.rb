LOG_FILE_PATH = "/var/log/one/hypercx-vault.log"
CONFIG_FILE_PATH = "/etc/hypercx-vault/vault.conf.yaml"

include OpenNebula

class HypercxVault
    def initialize
        @client = Client.new
        @apps = Array.new
    end

    def getcurrbackups
        _currbackup = ""
        _previousbackup = ""
        _inprogress = false
        begin
            if File.exist?(LOG_FILE_PATH)
              file = File.open(LOG_FILE_PATH)
              current_read = 0
              while(val= file.gets)
                if val.split("!")[2].kind_of?(String) && val.split("!")[2].split(" ")[0] == 'IOSOB'
                    _currbackup = self.get_vm_name(val.split("!")[2].split(" ")[1].split("_")[0])
                    _inprogress = true
                elsif val.split("!")[2].kind_of?(String) && val.split("!")[2].split(" ")[0] == 'IOPOB'
                    _currbackup = self.get_vm_name(val.split("!")[2].split(" ")[1].split("_")[0])
                    _inprogress = true
                elsif val.split("!")[2].kind_of?(String) && val.split("!")[2].split(" ")[0] == 'IOTOB'
                    _currbackup = ""
                    _inprogress = false
                elsif val.split("!")[2].kind_of?(String) && val.split("!")[2].split(" ")[0] == 'IOEOS'
                    _currbackup = ""
                    _inprogress = false
                end
              end
            end
        rescue SystemCallError => e
            puts "Rescued: #{e.inspect}"
        end


        _dat = Array.new
        _dat.push(Hash[
            "NAME" => "In Progress?",
            "DESC" => "Yes"
                ]) if _inprogress
        _dat.push(Hash[
            "NAME" => "In Progress?",
            "DESC" => "No"
                ]) if !_inprogress
        _dat.push(Hash[
            "NAME" => "Backup in progress of",
            "DESC" => _currbackup
                ]) unless _currbackup == ""
        _dat.push(Hash[
            "NAME" => "Previously backed up",
            "DESC" => _previousbackup
                ]) unless _previousbackup == ""
        
        return _dat
    end

    def get_backup_schedule
        _schedule_arr = Array.new
        conf = YAML::load_file(CONFIG_FILE_PATH)
        conf['day_of_week'].each do |week|
            _day = ""
            case week
            when 0
                _day = "Sunday"
            when 1
                _day = "Monday"
            when 2
                _day = "Tueday"
            when 3
                _day = "Wednesday"
            when 4
                _day = "Thursday"
            when 5
                _day = "Friday"
            when 6
                _day = "Saturday"
            else
                _day = "(ERROR)"
            end
            conf['time'].each do |time|
                _schedule_arr.push(Hash[
                    "DAY" => _day,
                    "TIME" => time
                ])
            end
        end
        return _schedule_arr
    end

    def checkservice
        rc = system("systemctl is-active --quiet hypercx-vault")
        if (rc)
            return true
        end
        return false
    end

    def getAllInfo
        return Array.new unless(File.exist?(CONFIG_FILE_PATH) || File.exist?(LOG_FILE_PATH))

        conf = YAML::load_file(CONFIG_FILE_PATH)

        return Hash[
                    "info" => Array[
                        Hash[
                            "NAME" => "Service running?" , 
                            "DESC" => checkservice
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
                    ],
                    "BACKUPS_IN_PROGRESS" => self.getcurrbackups,
                    "BACKUPS_SCHEDULE" => get_backup_schedule
                ]
    end

    def getAllApps
        @apps = Array.new
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
        begin
            if File.exist?(LOG_FILE_PATH)
              file = File.open(LOG_FILE_PATH)
              current_read = 0
              while(val= file.gets)
                  if val.split("!")[2].kind_of?(String) && val.split("!")[2].split(" ")[0] == 'IOEOB'
                      @apps.push(Hash["NAME" => self.get_vm_name(val.split("!")[2].split(" ")[1].split("_")[0]) , 'STATUS' => 'FAILED', 'DISK' => val.split("!")[2].split(" ")[1].split("_")[1], 'MPID'=>  "-",'DATE' => val.split("!")[2].split(" ")[1].split("_").last, "VMID" => val.split("!")[2].split(" ")[1].split("_")[0]])
                  end
              end
              for i in 0..3
                if File.exist?(LOG_FILE_PATH + ".#{i}")
                  file = File.open(LOG_FILE_PATH + ".#{i}")
                  current_read = 0
                  while(val= file.gets)
                      if val.split("!")[2].kind_of?(String) && val.split("!")[2].split(" ")[0] == 'IOEOB'
                          @apps.push(Hash["NAME" => self.get_vm_name(val.split("!")[2].split(" ")[1].split("_")[0]) , 'STATUS' => 'FAILED', 'DISK' => val.split("!")[2].split(" ")[1].split("_")[1], 'MPID'=>  "-",'DATE' => val.split("!")[2].split(" ")[1].split("_").last, "VMID" => val.split("!")[2].split(" ")[1].split("_")[0]])
                      end
                  end
                end
              end
            end
        rescue SystemCallError => e
            puts "Rescued: #{e.inspect}"
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