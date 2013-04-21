class SunshineRankController < ApplicationController
  SCORES = {
    "CLOUDY" => 0,
    "UNCERTAIN" => 1,
    "PROBABLY_CLEAR" => 2,
    "CONFIDENT_CLEAR" => 3
  }
  DIV_NUM = 400
  RANGE = 1

  def get_rank
    lat = params[:lat].to_f
    lon = params[:lon].to_f

    raw = Cloud.where(:latitude.gt => lat-RANGE, :latitude.lt => lat+RANGE, :longitude.gt => lon-RANGE, :longitude.lt => lon+RANGE).to_a

    buf = {}
    sum = 0
    raw.each do |data|
      date = data["date"]
      score = SCORES[data["quority"]]
      sum += score
      if buf[date]
        buf[date] += score
      else
        buf[date] = score
      end
    end
    dates = buf.keys.sort

    ret = {}
    ret["total_score"] = sum
    ret["series"] = {}
    ret["series"]["from"] = dates.first
    ret["series"]["to"] = dates.last
    ret["series"]["data"] = buf.sort.map{|s| s[1]}
    ret["rank"] = 5

    render :json => ret.to_json
  end

  def get_range_rank
    lat_s = params[:lat_s]
    lat_e = params[:lat_e]
    lon_s = params[:lon_s]
    lon_e = params[:lon_e]

    raw = Cloud.where(:latitude.gt => lat_s, :latitude.lt => lat_e, :longitude.gt => lon_s, :longitude.lt => lon_e).to_a

    ret = []
    step = raw.length / DIV_NUM
    DIV_NUM.times do |i|
      idx = (step * (i-1)).to_i
      new = {}
      new["lat"] = raw[idx]["latitude"]
      new["lon"] = raw[idx]["longitude"]
      new["weight"] = SCORES[raw[idx]["quority"]]
      ret << new
    end

    render :json => ret.to_json
  end
end
