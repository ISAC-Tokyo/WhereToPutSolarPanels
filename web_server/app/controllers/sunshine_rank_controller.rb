class SunshineRankController < ApplicationController
  DIV_NUM = 400
  RANGE = 1

  def get_rank
    lat = params[:lat].to_f
    lon = params[:lon].to_f

    raw = Cloud.where(:lat.gt => lat-RANGE, :lat.lt => lat+RANGE, :lon.gt => lon-RANGE, :lon.lt => lon+RANGE).to_a

    buf = {}
    sum = 0
    raw.each do |data|
      date = data["date"].to_s
      score = data["score"]
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
    ret["rank"] = calc_rank(sum, raw.size)

    if params.has_key? :callback
      render json: ret.to_json, callback: params[:callback]
    else
      render json: ret.to_json
    end
  end

  # GET /api/v1/rank/range
  def get_range_rank
    if params[:lat_r] && params[:lon_r]
      lat_min, lat_max = params[:lat_r]
      lon_min, lon_max = params[:lon_r]
    elsif params[:lat_s] && params[:lat_e] && params[:lon_s] && params[:lon_e]
      lat_min = params[:lat_s]
      lat_max = params[:lat_e]
      lon_min = params[:lon_s]
      lon_max = params[:lon_e]
    end

    #ret = Cloud.find_range_by_geo(lat_min, lat_max, lon_min, lon_max)
    raw = Cloud.where(
      :lat.gt => lat_min,
      :lat.lt => lat_max,
      :lon.gt => lon_min,
      :lon.lt => lon_max).to_a

    ret = []
    step = raw.length / DIV_NUM
    DIV_NUM.times do |i|
      idx = (step * (i-1)).to_i
      new = {}
      new["lat"] = raw[idx]["lat"]
      new["lon"] = raw[idx]["lon"]
      new["weight"] = raw[idx]["score"]
      ret << new
    end

    if params.has_key? :callback
      render :json => ret.to_json, callback: params[:callback]
    else
      render :json => ret.to_json
    end
  end

  def calc_rank(score, size)
    step = size / 5
    if score <= step * 1
      ret = 0
    elsif score <= step * 2
      ret = 1
    elsif score <= step * 3
      ret = 2
    elsif score <= step * 4
      ret = 3
    elsif score <= step * 5
      ret = 4
    else
      ret = 0
    end
  end
end

