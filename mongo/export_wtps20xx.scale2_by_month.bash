#!/bin/bash
# 

for i in `seq 2001 2012`; do
	CMD="mongoexport -h 210.129.195.213 -d wtps$i -c scale2_by_month -o wtps$i.scale2_by_month.json"
	echo $CMD
	$CMD
done


