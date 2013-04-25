class Scale1
  include Mongoid::Document
  store_in collection: "scale1", database: "gi", session: "dai2"

  field :loc, type: Hash 
  field :score, :type => Integer
  field :totalScore, :type => Integer
  field :totalLow, :type => Integer
  field :count, :type => Integer

  index({ loc: "2d" })
end
