# -*- coding: utf-8 -*-
class Cloud
  def self.find_by_geo(lat, lan)
    # dummy!
    ret = {
      rank: 5,
      total_score: 3600,
      series: {
        from: "2000-01",
        to: "2010-12",
        data: [100, 105, 100, 30]
      }
    }

    ret
  end

  def self.find_range_by_geo(lat, lan, range)
    # dummy!
    ret = {
      size: 400,
      ranks: [5, 6, 8]
    }

    ret
  end
end
