#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim: noet sts=4:ts=4:sw=4
#
# author: takano32 <tak@no32 dot tk>
#

import h5py
import math

file_name = 'MOD35_L2.A2004026.0110.004.2004026151504.h5'
f = h5py.File(file_name, 'r')

cloud_masks = f['mod35']['Data Fields']['Cloud_Mask']
latitude = f['mod35']['Geolocation Fields']['Latitude']
longitude = f['mod35']['Geolocation Fields']['Longitude']

'''
for y in range(0, len(latitude)):
	for x in range(0, len(latitude[y])):
		print "x, y = %d, %d" % (x, y)
		print "latitude: %s" % latitude[y][x]
'''

class CloudMask():
	def __init__(self, latitude, longitude, cloud_mask):
		self.latitude = latitude
		self.longitude = longitude
		self.cloud_mask = cloud_mask

CLOUDY          = int('00000000', 2)
UNCERTAIN       = int('00000010', 2)
PROBABLY_CLEAR  = int('00000100', 2)
CONFIDENT_CLEAR = int('00000110', 2)

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
			if cm & CLOUDY == CLOUDY:
				print "CLOUDY"
			elif cm & UNCERTAIN == UNCERTAIN:
				print "UNCERTAIN"
			elif cm & PROBABLY_CLEAR == PROBABLY_CLEAR:
				print "PROBABLY_CLEAR"
			elif cm & CONFIDENT_CLEAR == CONFIDENT_CLEAR:
				print "CONFIDENT_CLEAR"
			print "----"
print "done"



