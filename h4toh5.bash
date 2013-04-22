#!/bin/bash


for FILE in *.hdf; do
	CMD="h4toh5 $FILE ${FILE%%.hdf}.h5"
	echo $CMD
	$CMD
done


