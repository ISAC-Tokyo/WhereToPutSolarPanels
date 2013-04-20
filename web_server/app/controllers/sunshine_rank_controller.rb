class SunshineRankController < ApplicationController
  SCORES = {
    "CLOUDY" => 0,
    "UNCERTAIN" => 1,
    "PROBABLY_CLEAR" => 2,
    "CONFIDENT_CLEAR" => 3
  }
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
    lat = params[:lat]
    lon = params[:lon]
    scale = params[:scale]
    range = culc_range(scale)

    ret = Cloud.find_range_by_geo(lat, lon, range)
    render :json => ret.to_json
  end

  private

  def culc_range(scale)
    # dummy
    ret = [35.713382, 139.762376]
    ret
  end
end
