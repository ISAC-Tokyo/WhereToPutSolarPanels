#!/usr/bin/env ruby
# author: takano32 <tak@no32.tk>
#

require 'uri'
require 'drb/drb'
require 'thread'

class QueueServer
	def self.get_instance(host = 'localhost', port = 12345)
		drb = nil
		begin
			drb = DRbObject.new_with_uri("druby://#{host}:12345")
			drb.ping
		rescue DRb::DRbConnError => e
			p e
			return nil
			# system("sudo -u admin ssh #{host} echo hoge")
		end
		return drb
	end
	
	def initialize
		@queue = []
		initialize_queue
		@queue_mutex = Mutex.new
		puts 'QueueServer::initialize'
	end

	def initialize_queue
		# urls = URI.extract DATA.read, 'ftp'
		ARGF.read.each_line do |url|
			url = url.chomp
			next unless url =~ %r!\.hdf$!
			@queue << url
		end
	end


	def push(e)
		puts "Queue#push: #{e.to_s}"
		@queue_mutex.synchronize do
			@queue.push(e)
		end
	end

	def pop
		e = nil
		@queue_mutex.synchronize do
			e = @queue.pop
		end
		puts "Queue#pop: #{e.to_s}"
		e
	end

	def reboot
		puts 'QueueServer::reboot'
		exec('/usr/bin/ruby', __FILE__)
	end
end


if __FILE__ == $0 then
	DRb.start_service('druby://0.0.0.0:12345', QueueServer.new)
	puts DRb.uri
	sleep
end

