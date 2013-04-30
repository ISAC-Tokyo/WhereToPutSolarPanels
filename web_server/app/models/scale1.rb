class Scale1
  include Mongoid::Document
  store_in collection: "alldate_scale1", database: "wtps12_8", session: "dai3"

  field :value, type: Hash 

  index({ "value.loc" => "2d" })
end
