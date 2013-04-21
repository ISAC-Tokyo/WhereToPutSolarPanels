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

    raw = Cloud.where(:latitude.gt => lat-RANGE, :latitude.lt => lat+RANGE, :longitude.gt => lon-RANGE, :longitude.lt => lon+RANGE)

    ret = {}
    raw.each do |data|
      date = data["date"]
      score = SCORES[data["quority"]]
      if ret[date]
        ret[date] += score
      else
        ret[date] = score
      end
    end

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

  private

  def get_summary(raw)
    sum = 0
    raw.each do |data|
      date = data["date"]
      score = SCORES[data["quority"]]
      sum += score
    end
    sum
  end
end
