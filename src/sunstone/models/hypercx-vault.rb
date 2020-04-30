
LOG_FILE_PATH = "/var/log/one/hypercx-vault.log"

class Hypercx_Vault
    def initialize
        @read_lines = 0
        @apps = Hash.new
    end

    def getAllApps
        self.refresh
        return @apps
    end

    def refresh
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
        @read_lines = current_read
    end
end