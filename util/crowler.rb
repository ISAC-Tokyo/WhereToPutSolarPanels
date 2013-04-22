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


module HDF
	module NASA
	end
end

class HDF::NASA::Crowler
	def initialize
		@agent = Mechanize.new
	end

	def search(from, to)
		response = @agent.get 'http://ladsweb.nascom.nasa.gov/data/search.html'
		form = response.forms.first
		form['endTime']   = to  .strftime '%m/%d/%Y 23:59:59'
		form['startTime'] = from.strftime '%m/%d/%Y 00:00:00'
		form['si'] = 'Terra MODIS'
		form['group'] = 'Terra Atmosphere Level 2 Products'
		form['products'] = 'MOD35_L2'
		form['coordinate_system'] = 'LAT_LON'
		form['bboxType'] = 'NWES'
		form['bb_top'] = form['north'] = '50'
		form['bb_left'] = form['west'] = '120'
		form['bb_right'] = form['east'] = '150'
		form['bb_bottom'] = form['south'] = '20'
		form['coverageOptions'] = 'D'
		form['startClearPct250m'] = '0.0'
		form['endClearPct250m'] = '100.0'
		form['filterClearPct250m'] = 'No'
		form['startCloudCoverPct250m'] = '0.0'
		form['endCloudCoverPct250m'] = '100.0'
		form['filterCloudCoverPct250m'] = 'No'
		form['filterPGEVersion'] = 'No'
		form['PGEVersion'] = ''
		form['startQAPercentMissingData'] = '0.0'
		form['endQAPercentMissingData'] = '100.0'
		form['filterQAPercentMissingData'] = 'No'
		form['startSuccessfulRetrievalPct'] = '0.0'
		form['endSuccessfulRetrievalPct'] = '100.0'
		form['filterSuccessfulRetrievalPct'] = 'No'

		form['metaRequired'] = '1'
		form['temporal_type'] = 'RANGE'
		form['archiveSet'] = '5'
		button = form.buttons.last
		response = @agent.submit form, button
		form = response.forms.first
		form.buttons.each do |b|
			response = @agent.submit form, b if b.value == 'View All'
		end
		URI.extract response.body, 'ftp'
	end
end

def print_urls
	client = HDF::NASA::Crowler.new
	files = []
	2000.upto 2012 do |year|
		begin
			$stderr.puts year
			$stderr.puts 1
			files += client.search Date.new(year, 1, 1), Date.new(year, 3, 31)
			$stderr.puts 4
			files += client.search Date.new(year, 4, 1), Date.new(year, 5, 31)
			$stderr.puts 6
			files += client.search Date.new(year, 6, 1), Date.new(year, 8, 31)
			$stderr.puts 9
			files += client.search Date.new(year, 9, 1), Date.new(year, 10, 31)
			$stderr.puts 11
			files += client.search Date.new(year, 11, 1), Date.new(year, 12, 31)
		rescue Timeout::Error
			retry
		end
	end
	files.flatten.each do |file|
		puts file
	end
end

if __FILE__ == $0 then
	# print_urls
	client = HDF::NASA::Crowler.new
	urls = client.search Date.new(2012, 3, 1), Date.new(2012, 3, 31)
	puts urls
	puts "size: #{urls.size}"
end

