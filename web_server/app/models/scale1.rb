class Scale1
  include Mongoid::Document
  store_in collection: "alldate_scale1"

  field :value, type: Hash 

  index({ "value.loc" => "2d" })
end
