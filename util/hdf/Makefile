all:	longitude latitude cloud_mask
longitude:	MOD35_L2.A2004026.0110.004.2004026151504.hdf
	hdp dumpsds -d -n Longitude $? > $<.$@
latitude:	MOD35_L2.A2004026.0110.004.2004026151504.hdf
	hdp dumpsds -d -n Latitude $? > $<.$@
cloud_mask:	MOD35_L2.A2004026.0110.004.2004026151504.hdf
	hdp dumpsds -d -n Cloud_Mask $? > $<.$@

