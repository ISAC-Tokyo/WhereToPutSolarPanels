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
end
