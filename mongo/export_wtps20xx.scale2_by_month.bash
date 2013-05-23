#!/bin/bash
# 

for i in `seq 2001 2012`; do
	CMD="mongoexport -h 10.1.1.35 -d wtps$i -c scale2_by_month -o wtps$i.scale2_by_month.json"
	echo $CMD
	$CMD
done


