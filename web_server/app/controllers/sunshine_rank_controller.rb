class SunshineRankController < ApplicationController
  def get_rank
    lat = params[:lat]
    lan = params[:lan]

    ret = Cloud.find_by_geo(lat, lan)
    render :json => ret.to_json
  end

  def get_range_rank
    lat = params[:lat]
    lan = params[:lan]
    scale = params[:scale]
    range = culc_range(scale)

    ret = Cloud.find_range_by_geo(lat, lan, range)
    render :json => ret.to_json
  end

  private

  def culc_range(scale)
    # dummy
    ret = [35.713382, 139.762376]
    ret
  end
end
