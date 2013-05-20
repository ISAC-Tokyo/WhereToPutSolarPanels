class Scale2
  include Mongoid::Document
  store_in collection: "alldate_scale2"

  field :value, type: Hash 

  index({ "value.loc" => "2d" })
end

