class Cloud
  include Mongoid::Document
  field :location, :type => Array
  field :date, :type => Integer
  field :score, :type => Integer

  index({location: Mongo::GEO2D}, {min: 0, max: 200})
  
  def self.find_by_geo(lat, lan)
    # 10 years dummy!
    ret = {
      rank: 5,
      total_score: 3600,
      series: {
        from: "2003-01",
        to: "2012-12",
        data: [79, 112, 94, 103, 83, 75, 75, 80, 112, 115, 126, 108, 117, 82, 95, 88, 103, 74, 93, 116, 100, 84, 96, 129, 124, 72, 96, 124, 79, 75, 109, 102, 105, 89, 93, 93, 85, 93, 112, 85, 111, 95, 102, 75, 82, 73, 73, 104, 78, 104, 82, 76, 86, 86, 74, 91, 97, 89, 86, 111, 100, 77, 73, 128, 72, 109, 103, 125, 101, 119, 90, 75, 120, 116, 90, 84, 75, 127, 101, 91, 72, 105, 72, 107, 80, 81, 128, 73, 85, 85, 100, 92, 79, 126, 96, 86, 120, 90, 80, 106, 107, 113, 80, 101, 109, 75, 87, 79, 93, 102, 71, 71, 126, 119, 107, 81, 126, 101, 119, 78]
      }
    }

    ret
  end

  def self.find_range_by_geo(lat, lan, range)
    # dummy!
    ret = {
      size: 400,
      ranks: [8, 6, 7, 5, 9, 5, 8, 7, 7, 9, 5, 6, 9, 7, 8, 7, 8, 6, 9, 8, 8, 6, 6, 8, 8, 6, 9, 9, 7, 9, 8, 5, 5, 6, 6, 9, 8, 8, 8, 5, 9, 5, 7, 9, 6, 8, 8, 9, 7, 8, 7, 9, 5, 8, 8, 5, 6, 8, 6, 9, 6, 7, 5, 9, 8, 5, 9, 6, 8, 6, 7, 7, 5, 5, 6, 8, 7, 9, 7, 7, 8, 8, 8, 8, 7, 5, 6, 6, 7, 5, 5, 8, 5, 9, 7, 9, 8, 7, 9, 9, 7, 7, 5, 9, 8, 9, 7, 5, 7, 8, 5, 5, 7, 7, 7, 8, 9, 9, 5, 9, 5, 5, 9, 9, 5, 5, 8, 6, 5, 9, 5, 5, 6, 9, 6, 8, 8, 5, 6, 5, 9, 7, 6, 5, 8, 7, 5, 6, 8, 5, 5, 5, 9, 5, 7, 5, 9, 8, 6, 7, 5, 5, 7, 8, 7, 8, 7, 5, 6, 8, 6, 6, 5, 7, 9, 9, 9, 7, 7, 9, 5, 8, 5, 6, 7, 5, 9, 5, 9, 8, 5, 8, 6, 7, 7, 5, 5, 6, 8, 9, 6, 8, 5, 5, 9, 7, 8, 5, 7, 6, 9, 6, 7, 6, 7, 8, 6, 8, 5, 5, 8, 6, 8, 9, 7, 5, 8, 9, 5, 5, 5, 5, 6, 7, 8, 5, 7, 6, 7, 9, 8, 8, 6, 5, 5, 6, 8, 8, 6, 5, 5, 8, 9, 8, 6, 8, 5, 6, 7, 5, 5, 6, 7, 5, 5, 7, 8, 7, 8, 9, 6, 9, 8, 7, 8, 6, 7, 7, 6, 6, 5, 5, 9, 6, 9, 7, 5, 6, 8, 8, 6, 9, 5, 5, 7, 9, 7, 6, 5, 9, 7, 8, 9, 7, 9, 9, 6, 6, 5, 7, 5, 5, 6, 8, 5, 6, 7, 7, 6, 5, 8, 7, 6, 6, 5, 9, 6, 9, 9, 5, 8, 9, 9, 8, 9, 8, 5, 6, 8, 9, 6, 6, 6, 9, 5, 9, 5, 7, 9, 8, 7, 7, 8, 6, 6, 7, 6, 5, 8, 5, 6, 6, 6, 9, 6, 6, 9, 8, 6, 8, 5, 7, 6, 5, 9, 5, 7, 6, 7, 6, 9, 6, 5, 9, 5, 9, 5, 5, 8, 6, 6, 9, 9, 9, 9, 7, 7, 6, 7, 9]
    }

    ret
  end
end