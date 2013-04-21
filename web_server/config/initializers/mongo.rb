#MongoMapper.connection = Mongo::Connection.new('localhost', 27017)
MongoMapper.connection = Mongo::Connection.new('10.1.1.82', 27017)
#MongoMapper.database = "cloud-#{Rails.env}"
MongoMapper.database = "test"
