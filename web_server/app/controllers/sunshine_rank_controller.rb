class SunshineRankController < ApplicationController
  SIDE_RANGE = 20 # SIDE_RANGE*SIDE_RANGE data will return on get_rank_range
  SCALE_THRESHOLD = 30000 # This number will allow to get data from mongo

  def get_rank
    lat = params[:lat].to_f
    lon = params[:lon].to_f

    s = Time.now
    raw = Cloud.near(loc:[lat, lon]).to_a
    e = Time.now
    logger.info("mongo(/rank/): #{e-s}second #{raw.size}data")

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
    ret["series"]["data"] = buf.sort.map{|d| d[1]}
    ret["rank"] = calc_rank(sum, raw.size)

    if params.has_key? :callback
      render json: ret.to_json, callback: params[:callback]
    else
      render json: ret.to_json
    end

  rescue => e
    logger.info("INFO: #{e}")
    if params.has_key? :callback
      render :json => [].to_json, callback: params[:callback]
    else
      render :json => [].to_json
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
    else
      raise 'not match parameters'
    end
    lat_min = lat_min.to_f
    lat_max = lat_max.to_f
    lon_min = lon_min.to_f
    lon_max = lon_max.to_f

    s = Time.now
    raw = Cloud.within_box(loc: [[lat_min, lon_min], [lat_max, lon_max]]).to_a
    raise 'no data error' if raw.length == 0
    e = Time.now
    logger.info("mongo(/rank/range/): #{e-s}second #{raw.size}data")

    res = []
    temp = []
    SIDE_RANGE.times{temp << {sum: 0, count: 0}}
    SIDE_RANGE.times{res << temp}
    lat_step = (lat_max-lat_min) / SIDE_RANGE
    lon_step = (lon_max-lon_min) / SIDE_RANGE
    raw.each do |data|
      x = ((data["loc"]["lat"] - lat_min) / lat_step).to_i
      y = ((data["loc"]["lon"] - lon_min) / lon_step).to_i
      next if x >= SIDE_RANGE || y >= SIDE_RANGE
      res[x][y][:sum] += data["score"]
      res[x][y][:count] += 1
    end

    ret = []
    SIDE_RANGE.times do |i|
      SIDE_RANGE.times do |j|
        next unless res[i] && res[i][j]
        new = {}
        new["lat"] = lat_min + (lat_step * i) + (lat_step / 2)
        new["lon"] = lon_min + (lon_step * j) + (lon_step / 2)
        new["weight"] = res[i][j][:sum].to_f / res[i][j][:count]
        ret << new
      end
    end

    if params.has_key? :callback
      render :json => ret.to_json, callback: params[:callback]
    else
      render :json => ret.to_json
    end

  rescue => e
    logger.info("INFO: #{e}")
    if params.has_key? :callback
      render :json => [].to_json, callback: params[:callback]
    else
      render :json => [].to_json
    end
  end

  # GET /api/v1/rank/range/scale
  def get_scale_rank
    if params[:lat_r] && params[:lon_r]
      lat_min, lat_max = params[:lat_r]
      lon_min, lon_max = params[:lon_r]
    elsif params[:lat_s] && params[:lat_e] && params[:lon_s] && params[:lon_e]
      lat_min = params[:lat_s]
      lat_max = params[:lat_e]
      lon_min = params[:lon_s]
      lon_max = params[:lon_e]
    else
      raise 'not match parameters'
    end
    lat_min = lat_min.to_f
    lat_max = lat_max.to_f
    lon_min = lon_min.to_f
    lon_max = lon_max.to_f

    db = get_scale_db_class(lat_min, lat_max, lon_min, lon_max)

    s = Time.now
    raw = db.within_box("value.loc" => [[lat_min, lon_min], [lat_max, lon_max]]).to_a
    e = Time.now
    logger.info("mongo(/rank/range/[scale]): #{e-s}second #{raw.size}data")
    raise 'no data error' if raw.length == 0

    ret = []
    max = 0
    min = 1
    raw.each do |data|
      new = {}
      new["lat"] = data["value"]["loc"]["lat"]
      new["lon"] = data["value"]["loc"]["lon"]
      new["weight"] = data["value"]["score"]
      ret << new

      max = new["weight"] if max < new["weight"]
      min = new["weight"] if min > new["weight"]
    end

    # normalization
    diff = max - min
    ret.length.times do | i|
      ret[i]["weight"] = (ret[i]["weight"] - min) / diff
    end

    if params.has_key? :callback
      render :json => ret.to_json, callback: params[:callback]
    else
      render :json => ret.to_json
    end
  rescue => e
    logger.info("INFO: #{e}")
    if params.has_key? :callback
      render :json => [].to_json, callback: params[:callback]
    else
      render :json => [].to_json
    end
  end

  private
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

  # Retrun suit scale db class
  def get_scale_db_class(lat_min, lat_max, lon_min, lon_max)
    lat_diff = lat_max - lat_min
    lon_diff = lon_max - lon_min
    area_size = lat_diff * lon_diff

    # Select suit scale db
    if (area_size * 10000) < SCALE_THRESHOLD
      return Scale2
    else
      return Scale1 # Scale1 will return area_size * 100 data
    end
  end
end

