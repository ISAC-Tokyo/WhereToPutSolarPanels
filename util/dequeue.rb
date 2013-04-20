#!/usr/bin/env ruby
# author: takano32

require 'uri'
require 'open-uri'
require 'drb/drb'


queue = DRbObject.new_with_uri('druby://localhost:12345')

while url = queue.pop do
	system "wget #{url}"
end

