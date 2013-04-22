class Cloud
  include Mongoid::Document
  store_in collection: "cloud_mask"

  field :lat, :type => Float
  field :lon, :type => Float
  field :date, :type => Date
  field :score, :type => Integer
  field :low, :type => Integer

  index({lat: 1, lon:1})
  
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

  def self.find_range_by_geo(lat_min, lat_max, lon_min, lon_max)
    sample = []
    minl, maxl, minL, maxL = lat_min.to_f, lat_max.to_f, lon_min.to_f, lon_max.to_f
    incLat = (maxl - minl) / 20.0
    incLon = (maxL - minL) / 20.0
    idx = 0
    while true
      lon = minL + incLon * (idx % 20)
      if lon == minL
        lat ||= minl + incLat
        lat += incLat
      end
      break unless lat < maxl
      sample.push({
        lon: lon,
        lat: lat,
        weight: rand(365).to_f,
      })
      idx += 1
    end
    sample
  end
end
