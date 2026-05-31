# Metrop : MIT License
# This script is used to analyses the boundary.json file
puts "Metrop analysing tool..."
package require json

# Get the .json file :
set fp [open "../../country/boundary.json" r]
set json_string [read $fp]
close $fp
set d [::json::json2dict $json_string]


set continent_nb 0
set country_nb 0

dict for {key value} $d {
    incr continent_nb
    puts "$key"
}

puts "\nThere are $continent_nb continents."