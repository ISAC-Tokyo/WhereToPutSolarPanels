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
logger.info lat
logger.info lon

    raw = Cloud.where(:latitude.gt => lat-RANGE, :latitude.lt => lat+RANGE, :longitude.gt => lon-RANGE, :longitude.lt => lon+RANGE).to_a
logger.info raw

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
logger.info dates

    ret = {}
    ret["total_score"] = sum
    ret["series"] = {}
    ret["series"]["from"] = dates.first
    ret["series"]["to"] = dates.last
    ret["series"]["data"] = buf.sort.map{|s| s[1]}
    ret["rank"] = 5
logger.info ret


    if params.has_key? :callback
      render json: ret.to_json, callback: params[:callback]
    else
      render json: ret.to_json
    end
  end

  # GET /api/v1/rank/range
  def get_range_rank
    lat_min, lat_max = params[:lat_r]
    lon_min, lon_max = params[:lon_r]

    raw = Cloud.where(
      :latitude.gt => lat_min,
      :latitude.lt => lat_max,
      :longitude.gt => lon_min,
      :longitude.lt => lon_max).to_a

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

    if params.has_key? :callback
      render :json => ret.to_json, callback: params[:callback]
    else
      render :json => ret.to_json
    end

  end

end

