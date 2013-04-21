class SunshineRankController < ApplicationController

  def get_rank
    lat = params[:lat]
    lon = params[:lon]

    ret = Cloud.find_by_geo(lat, lon)

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

    ret = Cloud.find_range_by_geo(lat_min, lat_max, lon_min, lon_max)

    if params.has_key? :callback
      render :json => ret.to_json, callback: params[:callback]
    else
      render :json => ret.to_json
    end
  end

end

