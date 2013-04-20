#! /usr/bin/env ruby
# -*- coding: utf-8 -*-
# vim: set noet sts=4 sw=4 ts=4 fdm=marker :
#
# Crowler for http://ladsweb.nascom.nasa.gov/data/search.html
# author: takano32 <tak@no32 dot tk>
#

require 'rubygems'
require 'mechanize'
require 'open-uri'

class HDF::NASA::Crowler
	def initialize
		@agent = Mechanize.new
	end
end


if __FILE__ == $0 then

end


