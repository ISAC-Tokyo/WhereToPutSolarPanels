class SunshineRankController < ApplicationController
  def get_ranks
    lat = params[:lat]
    lan = params[:lan]

    ret = Cloud.find_by_geo(lat, lan)
    render :json => ret.to_json
  end
end
