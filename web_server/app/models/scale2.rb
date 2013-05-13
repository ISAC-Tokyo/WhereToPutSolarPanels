class Scale2
  include Mongoid::Document
  store_in collection: "alldate_scale2", database: "wtps20xx", session: "wtpsdb0"

  field :value, type: Hash 

  index({ "value.loc" => "2d" })
end

