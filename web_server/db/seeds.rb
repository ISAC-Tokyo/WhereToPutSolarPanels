# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
DATA_NUM = 1000
div = DATA_NUM / 20
30.times do |i|
  DATA_NUM.times do |j|
    data = {
      #lat: 20.0 + j/div,
      #lon: 120.0 + j/div,
      location: [20.0 + j/div, 120.0 + j/div],
      date: Date.today.year.to_s + (Date.today-i).month.to_s,
      score: i * 10
    }
    Cloud.create!(data)
  end
end
