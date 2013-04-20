#include <string.h>
#include <hdf/hdf.h>

#define   FILE_NAME        "MOD35_L2.A2004026.0110.004.2004026151504.hdf"
#define   VDATA_NAME       "Latitude"
#define   MAX_FIELDNAME_LIST_LENGTH (1024 * 1024)
#define   RECORD_INDEX     0
#define   N_RECORDS        406
#define   N_VALS_PER_REC   270

int main( )
{
   /************************* Variable declaration **************************/

   intn   status_n;     /* returned status for functions returning an intn  */
   int32  status_32,    /* returned status for functions returning an int32 */
          file_id, vgroup_id, vgroup_ref, vdata_id, vdata_ref,
	  num_of_records, num_of_vals_per_rec, record_pos,
          obj_index,    /* index of an object within a vgroup */
          num_of_pairs, /* number of tag/ref number pairs, i.e., objects */
          obj_tag, obj_ref,     /* tag/ref number of an HDF object */
          vgroup_pos = 0;       /* position of a vgroup in the file */
   float32 databuf[N_RECORDS][N_VALS_PER_REC];
   int16 rec_num;

   /********************** End of variable declaration ***********************/

   char FIELDNAME_LIST[MAX_FIELDNAME_LIST_LENGTH];
   memset(FIELDNAME_LIST, 0x00, MAX_FIELDNAME_LIST_LENGTH);
   int i;
   for (i = 0; i < N_VALS_PER_REC; i++) {
	   char buffer[256];
	   if (i == 0) {
		   sprintf(buffer, "%d", i);
	   } else {
		   sprintf(buffer, " %d", i);
	   }
	   strcat(FIELDNAME_LIST, buffer);
   }
   file_id = Hopen (FILE_NAME, DFACC_READ, 0);

   status_n = Vstart (file_id);

   vgroup_ref = -1;

   vgroup_ref = Vgetid (file_id, vgroup_ref);
   if (vgroup_ref == -1) exit(1);
   vgroup_ref = Vgetid (file_id, vgroup_ref);
   if (vgroup_ref == -1) exit(1);

   vgroup_id = Vattach (file_id, vgroup_ref, "r"); 

   num_of_pairs = Vntagrefs (vgroup_id);

   if (num_of_pairs > 0)
   {
	   printf ("\nVgroup #%d contains:\n", vgroup_pos);
	   for (obj_index = 0; obj_index < num_of_pairs; obj_index++)
	   {
		   status_n = Vgettagref (vgroup_id, obj_index, &obj_tag, &obj_ref);
		   printf ("tag = %d, ref = %d", obj_tag, obj_ref);


		   if (Visvg (vgroup_id, obj_ref))
			   printf ("  <-- is a vgroup\n");
		   else if (Visvs (vgroup_id, obj_ref)) {
			   printf ("  <-- is a vdata\n");
			   vdata_ref = VSfind (file_id, VDATA_NAME);
			   vdata_id = VSattach (file_id, vdata_ref, "r");
			   status_n = VSsetfields (vdata_id, FIELDNAME_LIST);
			   record_pos = VSseek (vdata_id, RECORD_INDEX);
			   num_of_records =
				   VSread (vdata_id, (uint8 *)databuf, N_RECORDS, FULL_INTERLACE);
			   for (rec_num = 0; rec_num < num_of_records; rec_num++)
			   {
				   for (num_of_vals_per_rec = 0; num_of_vals_per_rec < N_VALS_PER_REC; num_of_vals_per_rec++) {
					   printf ("%6.2f\n", databuf[rec_num][num_of_vals_per_rec]);

				   }
			   }
		   }
		   else {
			   printf ("  <-- neither vdata nor vgroup\n");
		   }
	   } /* for */
   } /* if */

   else
	   printf ("Vgroup #%d contains no HDF objects\n", vgroup_pos);

   /*
    * Terminate access to the current vgroup.
    */
   status_32 = Vdetach (vgroup_id);

   /*
    * Move to the next vgroup position.
    */
   vgroup_pos++;

   /*
   * Terminate access to the V interface and close the file.
   */
   status_n = Vend (file_id);
   status_n = Hclose (file_id);
   return 0;
}
