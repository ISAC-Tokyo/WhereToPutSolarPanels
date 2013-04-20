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

  def get_range_rank
    lat = params[:lat]
    lon = params[:lon]
    scale = params[:scale]
    range = culc_range(scale)

    ret = Cloud.find_range_by_geo(lat, lon, range)
    if params.has_key? :callback
      render :json => ret.to_json, callback: params[:callback]
    else
      render :json => ret.to_json
    end
  end

  private

  def culc_range(scale)
    # dummy
    ret = [35.713382, 139.762376]
    ret
  end
end
