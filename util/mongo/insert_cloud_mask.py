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

file_name = 'MOD35_L2.A2004026.0110.004.2004026151504.h5'
# > ruby -rdate -e 'p Date.new(2004, 1, 1) + 26'
# <Date: 2004-01-27 ((2453032j,0s,0n),+0s,2299161j)>
f = h5py.File(file_name, 'r')


cloud_masks = f['mod35']['Data Fields']['Cloud_Mask']
latitude = f['mod35']['Geolocation Fields']['Latitude']
longitude = f['mod35']['Geolocation Fields']['Longitude']

CLOUDY          = int('00000000', 2)
UNCERTAIN       = int('00000010', 2)
PROBABLY_CLEAR  = int('00000100', 2)
CONFIDENT_CLEAR = int('00000110', 2)

db = pymongo.Connection('127.0.0.1', 27017).test
mongo = db.cloud_mask

for z in range(0, len(cloud_masks)):
	for y in range(0, len(cloud_masks[z]) - 10):
		for x in range(0, len(cloud_masks[z][y]) - 10):
			if z == 1: break
			print "x, y, z = %s, %s, %s" % (x, y, z)
			cm = cloud_masks[z][y][x]
			lat = latitude[math.ceil(y/5)][math.ceil(x/5)]
			lon = longitude[math.ceil(y/5)][math.ceil(x/5)]
			print "Latitude: %s" % lat
			print "Longitude: %s" % lon
			print "Cloud Mask: %s" % cm
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
				'date': datetime.datetime(2004, 1, 27),
				'latitude': float(lat),
				'longitude': float(lon),
				'quority': str(quority),
			})
			print "----"
print "done"



