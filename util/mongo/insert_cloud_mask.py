#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim: noet sts=4:ts=4:sw=4
#
# author: takano32 <tak@no32 dot tk>
#

import h5py
import math
import pymongo
import datetime

#file_name = 'MOD35_L2.A2004026.0110.004.2004026151504.h5'
# > ruby -rdate -e 'p Date.new(2004, 1, 1) + 26'
# <Date: 2004-01-27 ((2453032j,0s,0n),+0s,2299161j)>

file_name = 'MOD35_L2.A2004274.1140.005.2010148215256.h5'
#> ruby -rdate -e 'p Date.new(2004, 1, 1) + 274'
#<Date: 2004-10-01 ((2453280j,0s,0n),+0s,2299161j)>
f = h5py.File(file_name, 'r')


cloud_masks = f['mod35']['Data Fields']['Cloud_Mask']
latitude = f['mod35']['Geolocation Fields']['Latitude']
longitude = f['mod35']['Geolocation Fields']['Longitude']

CLOUDY          = int('00000000', 2)
UNCERTAIN       = int('00000010', 2)
PROBABLY_CLEAR  = int('00000100', 2)
CONFIDENT_CLEAR = int('00000110', 2)

LAND_OR_WATER = int('11000000', 2)
WATER         = int('00000000', 2)

db = pymongo.Connection('127.0.0.1', 27017).foo
mongo = db.cloud_mask

for z in range(0, 1):
	for y in range(0, len(latitude)):
		for x in range(0, len(latitude[0])):
			print "x, y, z = %s, %s, %s" % (x, y, z)
			cm = cloud_masks[z][y * 5][x * 5]
			lat = latitude[y][x]
			lon = longitude[y][x]
			print "Latitude: %s" % lat
			print "Longitude: %s" % lon
			# print "Cloud Mask: %s" % cm
			if cm & LAND_OR_WATER == WATER: continue
			quority = ""
			if cm & CLOUDY == CLOUDY:
				quority = "CLOUDY"
			elif cm & UNCERTAIN == UNCERTAIN:
				quority = "UNCERTAIN"
			elif cm & PROBABLY_CLEAR == PROBABLY_CLEAR:
				quority = "PROBABLY_CLEAR"
			elif cm & CONFIDENT_CLEAR == CONFIDENT_CLEAR:
				quority = "CONFIDENT_CLEAR"
			pass
			mongo.insert({
				'date': datetime.datetime(2004, 10, 1),
				'latitude': float(lat),
				'longitude': float(lon),
				'quority': str(quority),
			})
			#print "----"
print "done"



